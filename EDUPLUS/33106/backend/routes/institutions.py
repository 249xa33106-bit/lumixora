from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas, analytics

router = APIRouter(prefix="/api/institution", tags=["Institution & Configuration"])

@router.get("/profile", response_model=schemas.InstitutionOut)
def get_institution_profile(db: Session = Depends(get_db)):
    inst = db.query(models.Institution).first()
    if not inst:
        raise HTTPException(status_code=404, detail="Institution not found")
    return inst

@router.get("/batches", response_model=List[schemas.BatchOut])
def get_batches(db: Session = Depends(get_db)):
    batches = db.query(models.Batch).all()
    results = []
    for b in batches:
        cnt = db.query(models.Student).filter(models.Student.batch_id == b.id).count()
        results.append({
            "id": b.id,
            "name": b.name,
            "program": b.program,
            "target_year": b.target_year,
            "student_count": cnt
        })
    return results

@router.get("/subjects", response_model=List[schemas.SubjectOut])
def get_subjects(db: Session = Depends(get_db)):
    return db.query(models.Subject).all()

@router.get("/rules", response_model=schemas.RuleConfigOut)
def get_rules(db: Session = Depends(get_db)):
    return analytics.get_rule_config(db)

@router.put("/rules", response_model=schemas.RuleConfigOut)
def update_rules(update_data: schemas.RuleConfigUpdate, db: Session = Depends(get_db)):
    config = analytics.get_rule_config(db)
    if update_data.flag_threshold_pct is not None:
        config.flag_threshold_pct = update_data.flag_threshold_pct
    if update_data.min_tests_required is not None:
        config.min_tests_required = update_data.min_tests_required
    if update_data.consecutive_drop_count is not None:
        config.consecutive_drop_count = update_data.consecutive_drop_count
    if update_data.cohort_alert_ratio is not None:
        config.cohort_alert_ratio = update_data.cohort_alert_ratio
    db.commit()
    db.refresh(config)
    return config
