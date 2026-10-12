import datetime
from sqlalchemy import (
    Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean, JSON
)
from sqlalchemy.orm import relationship
from database import Base

class Institution(Base):
    __tablename__ = "institutions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    tagline = Column(String(255), default="Every test should lead to a better next step.")
    location = Column(String(255), default="Kurnool, Andhra Pradesh, India")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    batches = relationship("Batch", back_populates="institution", cascade="all, delete-orphan")
    users = relationship("User", back_populates="institution", cascade="all, delete-orphan")
    students = relationship("Student", back_populates="institution", cascade="all, delete-orphan")
    rule_configs = relationship("RuleConfig", back_populates="institution", cascade="all, delete-orphan")

class Batch(Base):
    __tablename__ = "batches"

    id = Column(Integer, primary_key=True, index=True)
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=False)
    name = Column(String(100), nullable=False) # e.g., 'JEE-2026 Alpha'
    program = Column(String(100), nullable=False) # 'IIT-JEE', 'NEET', 'EAPCET'
    target_year = Column(Integer, default=2026)

    institution = relationship("Institution", back_populates="batches")
    students = relationship("Student", back_populates="batch", cascade="all, delete-orphan")
    assessments = relationship("Assessment", back_populates="batch")
    actions = relationship("TeacherAction", back_populates="batch")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=False)
    name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    role = Column(String(50), nullable=False) # 'admin', 'teacher', 'coordinator'
    subject_specialization = Column(String(100), nullable=True) # e.g. 'Physics'
    is_active = Column(Boolean, default=True)

    institution = relationship("Institution", back_populates="users")
    actions = relationship("TeacherAction", back_populates="teacher")

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=False)
    name = Column(String(100), nullable=False) # 'Physics', 'Chemistry', 'Mathematics', 'Biology'
    code = Column(String(20), nullable=False)

    topics = relationship("Topic", back_populates="subject", cascade="all, delete-orphan")
    assessments = relationship("Assessment", back_populates="subject")

class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    name = Column(String(150), nullable=False) # 'Rotational Dynamics', 'Ionic Equilibrium', etc.
    description = Column(String(255), nullable=True)

    subject = relationship("Subject", back_populates="topics")
    assessments = relationship("Assessment", back_populates="topic")
    actions = relationship("TeacherAction", back_populates="topic")

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    student_uid = Column(String(50), unique=True, index=True, nullable=False) # e.g. 'STU-1001'
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=False)
    batch_id = Column(Integer, ForeignKey("batches.id"), nullable=False)
    full_name = Column(String(150), nullable=False)
    roll_number = Column(String(50), nullable=False)
    guardian_contact = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    institution = relationship("Institution", back_populates="students")
    batch = relationship("Batch", back_populates="students")
    test_results = relationship("TestResult", back_populates="student", cascade="all, delete-orphan")
    evaluations = relationship("InterventionEvaluation", back_populates="student")

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=False)
    batch_id = Column(Integer, ForeignKey("batches.id"), nullable=False)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False)
    test_code = Column(String(50), index=True, nullable=False) # e.g. 'TEST-PHY-01'
    title = Column(String(200), nullable=False)
    maximum_score = Column(Float, nullable=False, default=100.0)
    test_date = Column(DateTime, nullable=False)
    test_type = Column(String(50), default="regular") # 'regular', 'baseline', 'follow_up'

    batch = relationship("Batch", back_populates="assessments")
    subject = relationship("Subject", back_populates="assessments")
    topic = relationship("Topic", back_populates="assessments")
    results = relationship("TestResult", back_populates="assessment", cascade="all, delete-orphan")

class TestResult(Base):
    __tablename__ = "test_results"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    score = Column(Float, nullable=False)
    maximum_score = Column(Float, nullable=False)
    percentage = Column(Float, nullable=False)
    test_date = Column(DateTime, nullable=False)
    imported_batch_name = Column(String(100), nullable=True)
    subject_name = Column(String(100), nullable=True)
    topic_name = Column(String(150), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    assessment = relationship("Assessment", back_populates="results")
    student = relationship("Student", back_populates="test_results")

class TeacherAction(Base):
    __tablename__ = "teacher_actions"

    id = Column(Integer, primary_key=True, index=True)
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=False)
    batch_id = Column(Integer, ForeignKey("batches.id"), nullable=False)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    title = Column(String(255), nullable=False)
    action_type = Column(String(100), nullable=False) # 'targeted_practice', 'doubt_clinic', '1on1_clinic', 'reassessment', 'concept_relecture'
    status = Column(String(50), default="recommended") # 'recommended', 'assigned', 'in_progress', 'completed', 'reviewed'
    priority = Column(String(20), default="medium") # 'high', 'medium', 'low'
    
    evidence_reason = Column(Text, nullable=False) # Transparent reason why this was generated
    target_student_ids = Column(JSON, default=list) # List of student IDs
    due_date = Column(DateTime, nullable=True)
    completed_date = Column(DateTime, nullable=True)
    teacher_notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    batch = relationship("Batch", back_populates="actions")
    topic = relationship("Topic", back_populates="actions")
    teacher = relationship("User", back_populates="actions")
    evaluations = relationship("InterventionEvaluation", back_populates="intervention", cascade="all, delete-orphan")

class InterventionEvaluation(Base):
    __tablename__ = "intervention_evaluations"

    id = Column(Integer, primary_key=True, index=True)
    intervention_id = Column(Integer, ForeignKey("teacher_actions.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    baseline_score_pct = Column(Float, nullable=False)
    follow_up_assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=True)
    follow_up_score_pct = Column(Float, nullable=True)
    delta_pct = Column(Float, nullable=True) # follow_up - baseline
    outcome_status = Column(String(50), default="insufficient_data") 
    # 'marked_improvement' (>15%), 'moderate_improvement' (5-15%), 'stable' (-5% to +5%), 'needs_review' (<-5%), 'insufficient_data'
    eval_date = Column(DateTime, default=datetime.datetime.utcnow)
    notes = Column(Text, nullable=True)

    intervention = relationship("TeacherAction", back_populates="evaluations")
    student = relationship("Student", back_populates="evaluations")

class RuleConfig(Base):
    __tablename__ = "rule_configs"

    id = Column(Integer, primary_key=True, index=True)
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=False)
    flag_threshold_pct = Column(Float, default=50.0) # Score below which topic or student is flagged
    min_tests_required = Column(Integer, default=2) # Tests required before marking as "recurring"
    consecutive_drop_count = Column(Integer, default=2)
    cohort_alert_ratio = Column(Float, default=0.40) # If > 40% of batch needs support, trigger whole-class revision

    institution = relationship("Institution", back_populates="rule_configs")

class ImportLog(Base):
    __tablename__ = "import_logs"

    id = Column(Integer, primary_key=True, index=True)
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    total_records = Column(Integer, default=0)
    valid_records = Column(Integer, default=0)
    invalid_records = Column(Integer, default=0)
    duplicate_records = Column(Integer, default=0)
    imported_at = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String(50), default="completed")
    summary = Column(Text, nullable=True)
