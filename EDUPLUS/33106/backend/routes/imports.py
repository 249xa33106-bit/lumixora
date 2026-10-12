import io
import os
import csv
import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Response
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from database import get_db
import models, schemas

router = APIRouter(prefix="/api/imports", tags=["Data Import & Validation"])

EXPECTED_COLUMNS = ["student_id", "batch", "test_id", "subject", "topic", "score", "maximum_score", "test_date"]

@router.get("/sample-csv")
def download_sample_csv():
    """Download the official EduPulse CSV import template."""
    csv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "edupulse_sample_test_results.csv")
    if not os.path.exists(csv_path):
        raise HTTPException(status_code=404, detail="Sample template not found")
    return FileResponse(
        path=csv_path,
        media_type="text/csv",
        filename="edupulse_sample_test_results.csv"
    )

@router.post("/preview", response_model=schemas.CSVValidationPreviewOut)
async def preview_csv_import(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Validates uploaded CSV file without saving:
    - Checks required header columns
    - Validates score numeric types & 0 <= score <= max_score
    - Detects duplicates within file and against existing database
    - Returns sample preview with row-by-row error logs
    """
    if not file.filename.endswith(('.csv', '.txt')):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a CSV file.")

    contents = await file.read()
    try:
        text_content = contents.decode("utf-8-sig")
    except UnicodeDecodeError:
        text_content = contents.decode("latin-1")

    reader = csv.DictReader(io.StringIO(text_content))
    fieldnames = [f.strip().lower() for f in (reader.fieldnames or [])]

    # Validate headers
    missing_cols = [c for c in EXPECTED_COLUMNS if c not in fieldnames]
    if missing_cols:
        raise HTTPException(
            status_code=422,
            detail=f"Missing required columns in CSV header: {', '.join(missing_cols)}. Expected columns: {', '.join(EXPECTED_COLUMNS)}"
        )

    # Existing keys in DB to detect duplicates: (student_uid, test_code)
    existing_records = set(
        db.query(models.Student.student_uid, models.Assessment.test_code)
        .join(models.TestResult, models.Student.id == models.TestResult.student_id)
        .join(models.Assessment, models.TestResult.assessment_id == models.Assessment.id)
        .all()
    )

    seen_in_file = set()
    preview_rows = []
    unique_batches = set()
    unique_subjects = set()
    unique_topics = set()
    valid_count = 0
    invalid_count = 0
    duplicate_count = 0

    row_num = 1
    for row in reader:
        row_num += 1
        clean_row = {k.strip().lower(): (v.strip() if v else "") for k, v in row.items()}
        errors = []
        is_duplicate = False

        stu_id = clean_row.get("student_id", "")
        batch = clean_row.get("batch", "")
        test_id = clean_row.get("test_id", "")
        subject = clean_row.get("subject", "")
        topic = clean_row.get("topic", "")
        score_raw = clean_row.get("score", "")
        max_score_raw = clean_row.get("maximum_score", "")
        test_date_raw = clean_row.get("test_date", "")

        if not stu_id:
            errors.append("Missing student_id")
        if not batch:
            errors.append("Missing batch")
        if not test_id:
            errors.append("Missing test_id")
        if not subject:
            errors.append("Missing subject")
        if not topic:
            errors.append("Missing topic")

        score = 0.0
        max_score = 100.0

        try:
            score = float(score_raw)
        except ValueError:
            errors.append(f"Invalid score value '{score_raw}': must be numeric")

        try:
            max_score = float(max_score_raw)
            if max_score <= 0:
                errors.append(f"Maximum score must be greater than zero")
        except ValueError:
            errors.append(f"Invalid maximum_score '{max_score_raw}': must be numeric")

        if not errors and score > max_score:
            errors.append(f"Score ({score}) cannot exceed maximum score ({max_score})")

        if not errors and score < 0:
            errors.append(f"Score ({score}) cannot be negative")

        # Duplicate check
        key = (stu_id, test_id)
        if key in seen_in_file:
            is_duplicate = True
            errors.append(f"Duplicate entry within this file for student {stu_id} on test {test_id}")
        elif key in existing_records:
            is_duplicate = True
            errors.append(f"Record already exists in database for student {stu_id} on test {test_id} (will not overwrite)")

        seen_in_file.add(key)

        is_valid = len(errors) == 0

        if is_duplicate:
            duplicate_count += 1
        if is_valid:
            valid_count += 1
        else:
            invalid_count += 1

        if batch:
            unique_batches.add(batch)
        if subject:
            unique_subjects.add(subject)
        if topic:
            unique_topics.add(topic)

        # Store preview (first 100 rows)
        if len(preview_rows) < 100:
            preview_rows.append(schemas.CSVRowValidation(
                row_number=row_num,
                student_id=stu_id,
                batch=batch,
                test_id=test_id,
                subject=subject,
                topic=topic,
                score=score if isinstance(score, float) else 0.0,
                maximum_score=max_score if isinstance(max_score, float) else 100.0,
                test_date=test_date_raw or str(datetime.date.today()),
                is_valid=is_valid,
                is_duplicate=is_duplicate,
                errors=errors
            ))

    total_rows = valid_count + invalid_count

    return schemas.CSVValidationPreviewOut(
        total_rows=total_rows,
        valid_rows_count=valid_count,
        invalid_rows_count=invalid_count,
        duplicate_rows_count=duplicate_count,
        sample_preview=preview_rows,
        unique_batches=sorted(list(unique_batches)),
        unique_subjects=sorted(list(unique_subjects)),
        unique_topics=sorted(list(unique_topics)),
        can_commit=(valid_count > 0)
    )

@router.post("/commit")
async def commit_csv_import(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Saves validated rows into database with non-destructive duplicate skipping:
    - Auto-creates batches, subjects, topics if not present
    - Auto-creates students or matches by student_uid
    - Creates assessments & test results
    - Logs import event in ImportLog
    """
    contents = await file.read()
    try:
        text_content = contents.decode("utf-8-sig")
    except UnicodeDecodeError:
        text_content = contents.decode("latin-1")

    reader = csv.DictReader(io.StringIO(text_content))
    fieldnames = [f.strip().lower() for f in (reader.fieldnames or [])]

    missing_cols = [c for c in EXPECTED_COLUMNS if c not in fieldnames]
    if missing_cols:
        raise HTTPException(status_code=422, detail="Invalid CSV format.")

    # Cache existing references
    batches_map = {b.name.lower(): b for b in db.query(models.Batch).all()}
    subjects_map = {s.name.lower(): s for s in db.query(models.Subject).all()}
    topics_map = {(t.subject_id, t.name.lower()): t for t in db.query(models.Topic).all()}
    students_map = {s.student_uid.lower(): s for s in db.query(models.Student).all()}
    assessments_map = {a.test_code.lower(): a for a in db.query(models.Assessment).all()}

    existing_results = set(
        db.query(models.TestResult.student_id, models.TestResult.assessment_id).all()
    )

    imported_count = 0
    skipped_count = 0

    for row in reader:
        clean_row = {k.strip().lower(): (v.strip() if v else "") for k, v in row.items()}
        stu_id = clean_row.get("student_id", "")
        batch_name = clean_row.get("batch", "")
        test_code = clean_row.get("test_id", "")
        subject_name = clean_row.get("subject", "")
        topic_name = clean_row.get("topic", "")
        score_raw = clean_row.get("score", "0")
        max_score_raw = clean_row.get("maximum_score", "100")
        test_date_raw = clean_row.get("test_date", "")

        try:
            score = float(score_raw)
            max_score = float(max_score_raw)
            if score < 0 or score > max_score or max_score <= 0:
                skipped_count += 1
                continue
        except ValueError:
            skipped_count += 1
            continue

        try:
            test_date = datetime.datetime.strptime(test_date_raw, "%Y-%m-%d")
        except Exception:
            test_date = datetime.datetime.utcnow()

        # Batch resolution
        b_key = batch_name.lower()
        if b_key not in batches_map:
            new_batch = models.Batch(
                institution_id=1,
                name=batch_name,
                program="Competitive Batch",
                target_year=2026
            )
            db.add(new_batch)
            db.flush()
            batches_map[b_key] = new_batch
        batch_obj = batches_map[b_key]

        # Subject resolution
        s_key = subject_name.lower()
        if s_key not in subjects_map:
            new_subj = models.Subject(
                institution_id=1,
                name=subject_name,
                code=subject_name[:3].upper()
            )
            db.add(new_subj)
            db.flush()
            subjects_map[s_key] = new_subj
        subj_obj = subjects_map[s_key]

        # Topic resolution
        t_key = (subj_obj.id, topic_name.lower())
        if t_key not in topics_map:
            new_top = models.Topic(
                subject_id=subj_obj.id,
                name=topic_name,
                description=f"Curriculum topic in {subject_name}"
            )
            db.add(new_top)
            db.flush()
            topics_map[t_key] = new_top
        top_obj = topics_map[t_key]

        # Student resolution
        stu_key = stu_id.lower()
        if stu_key not in students_map:
            new_stu = models.Student(
                student_uid=stu_id,
                institution_id=1,
                batch_id=batch_obj.id,
                full_name=f"Student {stu_id}",
                roll_number=f"ROLL-{stu_id}"
            )
            db.add(new_stu)
            db.flush()
            students_map[stu_key] = new_stu
        stu_obj = students_map[stu_key]

        # Assessment resolution
        asm_key = test_code.lower()
        if asm_key not in assessments_map:
            new_asm = models.Assessment(
                institution_id=1,
                batch_id=batch_obj.id,
                subject_id=subj_obj.id,
                topic_id=top_obj.id,
                test_code=test_code,
                title=f"{subject_name}: {topic_name} Assessment ({test_code})",
                maximum_score=max_score,
                test_date=test_date,
                test_type="regular"
            )
            db.add(new_asm)
            db.flush()
            assessments_map[asm_key] = new_asm
        asm_obj = assessments_map[asm_key]

        # Duplicate check before insert
        if (stu_obj.id, asm_obj.id) in existing_results:
            skipped_count += 1
            continue

        pct = round((score / max_score) * 100.0, 1)
        new_result = models.TestResult(
            assessment_id=asm_obj.id,
            student_id=stu_obj.id,
            score=score,
            maximum_score=max_score,
            percentage=pct,
            test_date=test_date,
            imported_batch_name=batch_name,
            subject_name=subject_name,
            topic_name=topic_name
        )
        db.add(new_result)
        existing_results.add((stu_obj.id, asm_obj.id))
        imported_count += 1

    # Log the import
    log = models.ImportLog(
        institution_id=1,
        filename=file.filename or "uploaded_test_results.csv",
        total_records=imported_count + skipped_count,
        valid_records=imported_count,
        invalid_records=skipped_count,
        duplicate_records=skipped_count,
        status="completed",
        summary=f"Successfully imported {imported_count} records. Skipped {skipped_count} invalid/duplicate records."
    )
    db.add(log)
    db.commit()

    return {
        "message": f"Import completed successfully. {imported_count} records saved.",
        "imported_records": imported_count,
        "skipped_records": skipped_count
    }

@router.get("/history")
def get_import_history(db: Session = Depends(get_db)):
    logs = db.query(models.ImportLog).order_by(models.ImportLog.imported_at.desc()).all()
    return logs
