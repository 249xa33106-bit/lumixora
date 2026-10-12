from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from database import get_db
import models, schemas, analytics

router = APIRouter(prefix="/api/topics", tags=["Topic Gap Analysis"])

@router.get("/gaps", response_model=List[schemas.TopicGapOut])
def get_topic_gaps(batch_id: Optional[int] = None, db: Session = Depends(get_db)):
    return analytics.analyze_topic_gaps(db, batch_id)

@router.get("/summary")
def get_topic_summary(batch_id: Optional[int] = None, db: Session = Depends(get_db)):
    gaps = analytics.analyze_topic_gaps(db, batch_id)
    recurring_count = sum(1 for g in gaps if g["is_recurring"])
    preliminary_count = sum(1 for g in gaps if not g["is_recurring"])
    subjects_impacted = list(set(g["subject_name"] for g in gaps))
    return {
        "total_gaps": len(gaps),
        "recurring_gaps": recurring_count,
        "preliminary_gaps": preliminary_count,
        "subjects_impacted": subjects_impacted,
        "gaps": gaps
    }
