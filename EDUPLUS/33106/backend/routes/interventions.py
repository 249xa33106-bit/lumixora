from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
from database import get_db
import analytics

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
