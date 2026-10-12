from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models, schemas, analytics

router = APIRouter(prefix="/api/students", tags=["Students & Profiles"])

@router.get("", response_model=List[schemas.StudentOut])
def get_students(
    batch_id: Optional[int] = None,
    q: Optional[str] = None,
    support_status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Student)
    if batch_id:
        query = query.filter(models.Student.batch_id == batch_id)

    students = query.all()
    config = analytics.get_rule_config(db)
    threshold = config.flag_threshold_pct

    results = []
    for s in students:
        # Match search query if provided
        if q:
            match_name = q.lower() in s.full_name.lower()
            match_uid = q.lower() in s.student_uid.lower()
            match_roll = q.lower() in s.roll_number.lower()
            if not (match_name or match_uid or match_roll):
                continue

        # Get summary scores
        scores = [tr.percentage for tr in s.test_results]
        tests_taken = len(scores)
        avg_score = round(sum(scores) / tests_taken, 1) if tests_taken > 0 else 0.0

        # Topic needs practice count
        # Group student's results by topic to find any with avg < threshold
        topic_scores = {}
        for tr in s.test_results:
            top_id = tr.assessment.topic_id if tr.assessment else None
            if top_id:
                topic_scores.setdefault(top_id, []).append(tr.percentage)
        
        flagged_count = sum(1 for t_scores in topic_scores.values() if (sum(t_scores)/len(t_scores)) < threshold)

        if tests_taken == 0:
            status = "insufficient_data"
        elif avg_score >= 75:
            status = "mastering"
        elif avg_score >= threshold:
            status = "on_track"
        elif flagged_count >= 2:
            status = "needs_practice"
        else:
            status = "opportunity"

        if support_status and support_status != "all" and status != support_status:
            continue

        results.append({
            "id": s.id,
            "student_uid": s.student_uid,
            "full_name": s.full_name,
            "roll_number": s.roll_number,
            "batch_id": s.batch_id,
            "batch_name": s.batch.name if s.batch else "",
            "support_status": status,
            "avg_score_pct": avg_score,
            "tests_taken": tests_taken,
            "flagged_topics_count": flagged_count
        })

    return results

@router.get("/{student_id}", response_model=schemas.StudentDetailOut)
def get_student_detail(student_id: int, db: Session = Depends(get_db)):
    detail = analytics.get_student_analytics(db, student_id)
    if not detail:
        raise HTTPException(status_code=404, detail="Student not found")
    return detail
