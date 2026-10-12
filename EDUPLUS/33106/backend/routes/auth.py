from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas

router = APIRouter(prefix="/api/auth", tags=["Authentication & Roles"])

@router.get("/users", response_model=List[schemas.UserOut])
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).filter(models.User.is_active == True).all()

@router.get("/current-user/{user_id}", response_model=schemas.UserOut)
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
