import io
import csv
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from database import get_db
import models, analytics, pdf_generator

router = APIRouter(prefix="/api/reports", tags=["Reports & Exports"])

@router.get("/student/{student_id}/pdf")
def export_student_pdf(student_id: int, db: Session = Depends(get_db)):
    student_data = analytics.get_student_analytics(db, student_id)
    if not student_data:
        raise HTTPException(status_code=404, detail="Student not found")

    inst = db.query(models.Institution).first()
    inst_name = inst.name if inst else "Apex Academy of Sciences, Kurnool (AP)"

    pdf_bytes = pdf_generator.build_student_pdf(student_data, institution_name=inst_name)
    filename = f"EduPulse_Diagnostic_{student_data.get('student_uid', student_id)}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/batch/{batch_id}/pdf")
def export_batch_pdf(batch_id: int, db: Session = Depends(get_db)):
    batch = db.query(models.Batch).filter(models.Batch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    gaps = analytics.analyze_topic_gaps(db, batch_id)
    students = db.query(models.Student).filter(models.Student.batch_id == batch_id).all()
    tests = db.query(models.Assessment).filter(models.Assessment.batch_id == batch_id).all()
    
    # Calculate batch avg
    scores = (
        db.query(models.TestResult.percentage)
        .join(models.Student, models.TestResult.student_id == models.Student.id)
        .filter(models.Student.batch_id == batch_id)
        .all()
    )
    batch_avg = round(sum(s[0] for s in scores) / len(scores), 1) if scores else 0.0

    stats = {
        "total_students": len(students),
        "total_tests": len(tests),
        "batch_avg": batch_avg
    }

    inst = db.query(models.Institution).first()
    inst_name = inst.name if inst else "Apex Academy of Sciences, Kurnool (AP)"

    pdf_bytes = pdf_generator.build_batch_audit_pdf(batch.name, gaps, stats, institution_name=inst_name)
    filename = f"EduPulse_BatchAudit_{batch.name.replace(' ', '_')}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/batch/{batch_id}/csv")
def export_batch_csv(batch_id: int, db: Session = Depends(get_db)):
    batch = db.query(models.Batch).filter(models.Batch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    results = (
        db.query(
            models.Student.student_uid,
            models.Student.full_name,
            models.Assessment.test_code,
            models.Assessment.title,
            models.Subject.name.label("subject"),
            models.Topic.name.label("topic"),
            models.TestResult.score,
            models.TestResult.maximum_score,
            models.TestResult.percentage,
            models.TestResult.test_date
        )
        .join(models.Student, models.TestResult.student_id == models.Student.id)
        .join(models.Assessment, models.TestResult.assessment_id == models.Assessment.id)
        .join(models.Subject, models.Assessment.subject_id == models.Subject.id)
        .join(models.Topic, models.Assessment.topic_id == models.Topic.id)
        .filter(models.Student.batch_id == batch_id)
        .all()
    )

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Student ID", "Student Name", "Test Code", "Test Title", "Subject",
        "Topic", "Score", "Max Score", "Percentage", "Test Date"
    ])
    for r in results:
        writer.writerow([
            r.student_uid, r.full_name, r.test_code, r.title, r.subject,
            r.topic, r.score, r.maximum_score, r.percentage, r.test_date.strftime("%Y-%m-%d")
        ])

    output.seek(0)
    filename = f"EduPulse_Results_{batch.name.replace(' ', '_')}.csv"
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/interventions/csv")
def export_interventions_csv(db: Session = Depends(get_db)):
    evals = db.query(models.InterventionEvaluation).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Evaluation ID", "Intervention Title", "Action Type", "Student UID",
        "Student Name", "Batch", "Topic", "Baseline Score %",
        "Follow-up Score %", "Observed Score Delta %", "Outcome Status", "Evaluation Date"
    ])
    for e in evals:
        writer.writerow([
            e.id,
            e.intervention.title if e.intervention else "N/A",
            e.intervention.action_type if e.intervention else "N/A",
            e.student.student_uid if e.student else "N/A",
            e.student.full_name if e.student else "N/A",
            e.student.batch.name if e.student and e.student.batch else "N/A",
            e.intervention.topic.name if e.intervention and e.intervention.topic else "N/A",
            e.baseline_score_pct,
            e.follow_up_score_pct if e.follow_up_score_pct is not None else "Pending",
            e.delta_pct if e.delta_pct is not None else "Pending",
            e.outcome_status,
            e.eval_date.strftime("%Y-%m-%d")
        ])

    output.seek(0)
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=EduPulse_Interventions_Report.csv"}
    )
