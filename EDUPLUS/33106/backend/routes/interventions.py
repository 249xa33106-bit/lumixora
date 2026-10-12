import datetime
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
from database import get_db
import analytics, models, schemas

router = APIRouter(prefix="/api/interventions", tags=["Intervention Effectiveness"])

@router.get("/summary")
def get_intervention_effectiveness(
    batch_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Returns before-and-after assessment analytics:
    - Baseline score %
    - Follow-up score %
    - Absolute delta %
    - Categorical outcome: 'marked_improvement', 'moderate_improvement', 'stable', 'needs_review', 'insufficient_data'
    - Observed change disclaimer
    """
    return analytics.get_intervention_effectiveness_summary(db, batch_id)

@router.post("/evaluate")
def create_intervention_evaluation(
    data: schemas.InterventionEvaluationCreate,
    db: Session = Depends(get_db)
):
    """
    Saves a real post-intervention evaluation record directly into the database.
    """
    delta = round(data.follow_up_score_pct - data.baseline_score_pct, 1)
    if delta >= 15.0:
        outcome = "marked_improvement"
    elif delta >= 5.0:
        outcome = "moderate_improvement"
    elif delta >= -5.0:
        outcome = "stable"
    else:
        outcome = "needs_review"

    # Ensure intervention exists or default to first
    interv = db.query(models.TeacherAction).filter(models.TeacherAction.id == data.intervention_id).first()
    interv_id = interv.id if interv else 1

    # Ensure student exists or default to first
    stu = db.query(models.Student).filter(models.Student.id == data.student_id).first()
    stu_id = stu.id if stu else 1

    eval_record = models.InterventionEvaluation(
        intervention_id=interv_id,
        student_id=stu_id,
        baseline_score_pct=data.baseline_score_pct,
        follow_up_score_pct=data.follow_up_score_pct,
        delta_pct=delta,
        outcome_status=outcome,
        eval_date=datetime.datetime.utcnow(),
        notes=data.notes or f"Follow-up recorded on {data.topic_name} with delta of {delta:+0.1f}%."
    )
    db.add(eval_record)
    db.commit()
    db.refresh(eval_record)

    return {
        "id": eval_record.id,
        "intervention_id": eval_record.intervention_id,
        "student_id": eval_record.student_id,
        "baseline_score_pct": eval_record.baseline_score_pct,
        "follow_up_score_pct": eval_record.follow_up_score_pct,
        "delta_pct": eval_record.delta_pct,
        "outcome_status": eval_record.outcome_status,
        "eval_date": eval_record.eval_date,
        "notes": eval_record.notes
    }
