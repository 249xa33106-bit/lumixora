from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field
from datetime import datetime

class InstitutionBase(BaseModel):
    name: str
    tagline: str
    location: str

class InstitutionOut(InstitutionBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class BatchOut(BaseModel):
    id: int
    name: str
    program: str
    target_year: int
    student_count: Optional[int] = 0
    class Config:
        from_attributes = True

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    subject_specialization: Optional[str] = None
    is_active: bool
    class Config:
        from_attributes = True

class TopicOut(BaseModel):
    id: int
    subject_id: int
    name: str
    description: Optional[str] = None
    class Config:
        from_attributes = True

class SubjectOut(BaseModel):
    id: int
    name: str
    code: str
    topics: List[TopicOut] = []
    class Config:
        from_attributes = True

class StudentOut(BaseModel):
    id: int
    student_uid: str
    full_name: str
    roll_number: str
    batch_id: int
    batch_name: Optional[str] = None
    support_status: Optional[str] = "on_track" # "needs_practice", "opportunity", "on_track", "mastering"
    avg_score_pct: Optional[float] = 0.0
    tests_taken: Optional[int] = 0
    flagged_topics_count: Optional[int] = 0
    gaps: Optional[List[str]] = []
    class Config:
        from_attributes = True

class TestResultOut(BaseModel):
    id: int
    assessment_id: int
    test_code: Optional[str] = None
    test_title: Optional[str] = None
    subject_name: Optional[str] = None
    topic_name: Optional[str] = None
    score: float
    maximum_score: float
    percentage: float
    test_date: datetime
    class Config:
        from_attributes = True

class StudentDetailOut(BaseModel):
    id: int
    student_uid: str
    full_name: str
    roll_number: str
    batch_id: int
    batch_name: str
    overall_avg_pct: float
    total_tests: int
    support_status: str
    subject_breakdown: List[Dict[str, Any]]
    topic_strengths: List[Dict[str, Any]]
    topic_needs_practice: List[Dict[str, Any]]
    recent_results: List[TestResultOut]
    assigned_actions: List[Dict[str, Any]]
    intervention_outcomes: List[Dict[str, Any]]

class TopicGapOut(BaseModel):
    topic_id: int
    topic_name: str
    subject_name: str
    batch_id: int
    batch_name: str
    avg_score_pct: float
    tests_conducted: int
    students_impacted: int
    total_batch_students: int
    impact_percentage: float
    is_recurring: bool
    confidence_level: str # 'High', 'Moderate', 'Preliminary'
    reason: str
    recommended_action_type: str

class TeacherActionCreate(BaseModel):
    batch_id: int
    subject_id: int
    topic_id: int
    teacher_id: Optional[int] = None
    title: str
    action_type: str
    priority: str = "medium"
    evidence_reason: str
    target_student_ids: List[int] = []
    due_date: Optional[datetime] = None

class TeacherActionUpdate(BaseModel):
    teacher_id: Optional[int] = None
    action_type: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None
    teacher_notes: Optional[str] = None
    completed_date: Optional[datetime] = None

class TeacherActionOut(BaseModel):
    id: int
    batch_id: int
    batch_name: Optional[str] = None
    subject_id: int
    subject_name: Optional[str] = None
    topic_id: int
    topic_name: Optional[str] = None
    teacher_id: Optional[int] = None
    teacher_name: Optional[str] = None
    title: str
    action_type: str
    status: str
    priority: str
    evidence_reason: str
    target_student_ids: List[int]
    target_students: Optional[List[Dict[str, Any]]] = []
    due_date: Optional[datetime] = None
    completed_date: Optional[datetime] = None
    teacher_notes: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True

class InterventionEvaluationOut(BaseModel):
    id: int
    intervention_id: int
    intervention_title: str
    action_type: str
    student_id: int
    student_name: str
    student_uid: str
    batch_name: str
    topic_name: str
    subject_name: str
    baseline_score_pct: float
    follow_up_score_pct: Optional[float] = None
    delta_pct: Optional[float] = None
    outcome_status: str # 'marked_improvement', 'moderate_improvement', 'stable', 'needs_review', 'insufficient_data'
    eval_date: datetime
    notes: Optional[str] = None

class InterventionEvaluationCreate(BaseModel):
    intervention_id: Optional[int] = 1
    student_id: Optional[int] = 1
    baseline_score_pct: float
    follow_up_score_pct: float
    topic_name: Optional[str] = "Core Concept"
    notes: Optional[str] = None

class DashboardSummaryOut(BaseModel):
    total_students: int
    total_tests_conducted: int
    overall_avg_score: float
    batch_performance: List[Dict[str, Any]]
    topics_needing_attention: int
    students_requiring_follow_up: int
    pending_teacher_actions: int
    completed_interventions: int
    avg_observed_improvement: float
    improvement_breakdown: Dict[str, int]
    recent_activity: List[Dict[str, Any]]

class CSVRowValidation(BaseModel):
    row_number: int
    student_id: str
    batch: str
    test_id: str
    subject: str
    topic: str
    score: float
    maximum_score: float
    test_date: str
    is_valid: bool
    is_duplicate: bool
    errors: List[str] = []

class CSVValidationPreviewOut(BaseModel):
    total_rows: int
    valid_rows_count: int
    invalid_rows_count: int
    duplicate_rows_count: int
    sample_preview: List[CSVRowValidation]
    unique_batches: List[str]
    unique_subjects: List[str]
    unique_topics: List[str]
    can_commit: bool

class RuleConfigOut(BaseModel):
    id: int
    flag_threshold_pct: float
    min_tests_required: int
    consecutive_drop_count: int
    cohort_alert_ratio: float
    class Config:
        from_attributes = True

class RuleConfigUpdate(BaseModel):
    flag_threshold_pct: Optional[float] = None
    min_tests_required: Optional[int] = None
    consecutive_drop_count: Optional[int] = None
    cohort_alert_ratio: Optional[float] = None
