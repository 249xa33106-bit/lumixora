import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models, schemas

router = APIRouter(prefix="/api/actions", tags=["Teacher Action Centre"])

@router.get("", response_model=List[schemas.TeacherActionOut])
def get_actions(
    batch_id: Optional[int] = None,
    status: Optional[str] = None,
    teacher_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.TeacherAction)
    if batch_id:
        query = query.filter(models.TeacherAction.batch_id == batch_id)
    if status and status != "all":
        query = query.filter(models.TeacherAction.status == status)
    if teacher_id:
        query = query.filter(models.TeacherAction.teacher_id == teacher_id)

    actions = query.order_by(models.TeacherAction.created_at.desc()).all()
    results = []
    for a in actions:
        target_students = []
        if a.target_student_ids:
            stus = db.query(models.Student).filter(models.Student.id.in_(a.target_student_ids)).all()
            target_students = [{"id": s.id, "name": s.full_name, "uid": s.student_uid} for s in stus]

        results.append({
            "id": a.id,
            "batch_id": a.batch_id,
            "batch_name": a.batch.name if a.batch else "",
            "subject_id": a.subject_id,
            "subject_name": a.topic.subject.name if a.topic and a.topic.subject else "",
            "topic_id": a.topic_id,
            "topic_name": a.topic.name if a.topic else "",
            "teacher_id": a.teacher_id,
            "teacher_name": a.teacher.name if a.teacher else "Unassigned",
            "title": a.title,
            "action_type": a.action_type,
            "status": a.status,
            "priority": a.priority,
            "evidence_reason": a.evidence_reason,
            "target_student_ids": a.target_student_ids or [],
            "target_students": target_students,
            "due_date": a.due_date,
            "completed_date": a.completed_date,
            "teacher_notes": a.teacher_notes,
            "created_at": a.created_at
        })
    return results

@router.post("", response_model=schemas.TeacherActionOut)
def create_action(action_in: schemas.TeacherActionCreate, db: Session = Depends(get_db)):
    action = models.TeacherAction(
        institution_id=1,
        batch_id=action_in.batch_id,
        subject_id=action_in.subject_id,
        topic_id=action_in.topic_id,
        teacher_id=action_in.teacher_id,
        title=action_in.title,
        action_type=action_in.action_type,
        status="assigned" if action_in.teacher_id else "recommended",
        priority=action_in.priority,
        evidence_reason=action_in.evidence_reason,
        target_student_ids=action_in.target_student_ids,
        due_date=action_in.due_date or (datetime.datetime.utcnow() + datetime.timedelta(days=7))
    )
    db.add(action)
    db.commit()
    db.refresh(action)

    stus = db.query(models.Student).filter(models.Student.id.in_(action.target_student_ids or [])).all()
    target_students = [{"id": s.id, "name": s.full_name, "uid": s.student_uid} for s in stus]

    return {
        "id": action.id,
        "batch_id": action.batch_id,
        "batch_name": action.batch.name if action.batch else "",
        "subject_id": action.subject_id,
        "subject_name": action.topic.subject.name if action.topic and action.topic.subject else "",
        "topic_id": action.topic_id,
        "topic_name": action.topic.name if action.topic else "",
        "teacher_id": action.teacher_id,
        "teacher_name": action.teacher.name if action.teacher else "Unassigned",
        "title": action.title,
        "action_type": action.action_type,
        "status": action.status,
        "priority": action.priority,
        "evidence_reason": action.evidence_reason,
        "target_student_ids": action.target_student_ids or [],
        "target_students": target_students,
        "due_date": action.due_date,
        "completed_date": action.completed_date,
        "teacher_notes": action.teacher_notes,
        "created_at": action.created_at
    }

@router.patch("/{action_id}", response_model=schemas.TeacherActionOut)
def update_action(action_id: int, update_in: schemas.TeacherActionUpdate, db: Session = Depends(get_db)):
    action = db.query(models.TeacherAction).filter(models.TeacherAction.id == action_id).first()
    if not action:
        raise HTTPException(status_code=404, detail="Action not found")

    if update_in.teacher_id is not None:
        action.teacher_id = update_in.teacher_id
        if action.status == "recommended":
            action.status = "assigned"
    if update_in.action_type is not None:
        action.action_type = update_in.action_type
    if update_in.status is not None:
        action.status = update_in.status
        if update_in.status == "completed" and not action.completed_date:
            action.completed_date = datetime.datetime.utcnow()
    if update_in.priority is not None:
        action.priority = update_in.priority
    if update_in.due_date is not None:
        action.due_date = update_in.due_date
    if update_in.teacher_notes is not None:
        action.teacher_notes = update_in.teacher_notes
    if update_in.completed_date is not None:
        action.completed_date = update_in.completed_date

    db.commit()
    db.refresh(action)

    stus = db.query(models.Student).filter(models.Student.id.in_(action.target_student_ids or [])).all()
    target_students = [{"id": s.id, "name": s.full_name, "uid": s.student_uid} for s in stus]

    return {
        "id": action.id,
        "batch_id": action.batch_id,
        "batch_name": action.batch.name if action.batch else "",
        "subject_id": action.subject_id,
        "subject_name": action.topic.subject.name if action.topic and action.topic.subject else "",
        "topic_id": action.topic_id,
        "topic_name": action.topic.name if action.topic else "",
        "teacher_id": action.teacher_id,
        "teacher_name": action.teacher.name if action.teacher else "Unassigned",
        "title": action.title,
        "action_type": action.action_type,
        "status": action.status,
        "priority": action.priority,
        "evidence_reason": action.evidence_reason,
        "target_student_ids": action.target_student_ids or [],
        "target_students": target_students,
        "due_date": action.due_date,
        "completed_date": action.completed_date,
        "teacher_notes": action.teacher_notes,
        "created_at": action.created_at
    }

@router.delete("/{action_id}")
def delete_action(action_id: int, db: Session = Depends(get_db)):
    action = db.query(models.TeacherAction).filter(models.TeacherAction.id == action_id).first()
    if not action:
        raise HTTPException(status_code=404, detail="Action not found")
    db.delete(action)
    db.commit()
    return {"message": "Action deleted successfully"}
