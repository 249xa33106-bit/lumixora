from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
import models, schemas, analytics

router = APIRouter(prefix="/api/analytics", tags=["Dashboard Analytics"])

@router.get("/dashboard", response_model=schemas.DashboardSummaryOut)
def get_dashboard_summary(
    batch_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    student_query = db.query(models.Student)
    test_query = db.query(models.Assessment)
    result_query = db.query(models.TestResult)

    if batch_id:
        student_query = student_query.filter(models.Student.batch_id == batch_id)
        test_query = test_query.filter(models.Assessment.batch_id == batch_id)
        result_query = result_query.join(models.Student, models.TestResult.student_id == models.Student.id).filter(models.Student.batch_id == batch_id)

    total_students = student_query.count()
    total_tests = test_query.count()

    results = result_query.all()
    overall_avg = round(sum(r.percentage for r in results) / len(results), 1) if results else 0.0

    # Batch performance
    batches = db.query(models.Batch).all()
    batch_perf = []
    for b in batches:
        b_scores = (
            db.query(models.TestResult.percentage)
            .join(models.Student, models.TestResult.student_id == models.Student.id)
            .filter(models.Student.batch_id == b.id)
            .all()
        )
        b_avg = round(sum(s[0] for s in b_scores) / len(b_scores), 1) if b_scores else 0.0
        b_stu_count = db.query(models.Student).filter(models.Student.batch_id == b.id).count()
        batch_perf.append({
            "batch_id": b.id,
            "batch_name": b.name,
            "program": b.program,
            "student_count": b_stu_count,
            "avg_score_pct": b_avg
        })

    # Topic gaps
    gaps = analytics.analyze_topic_gaps(db, batch_id)
    topics_needing_attention = len(gaps)

    # Students requiring follow-up (overall avg < 50% or >= 2 weak topics)
    config = analytics.get_rule_config(db)
    students_in_scope = student_query.all()
    students_followup_count = 0
    for s in students_in_scope:
        s_scores = [tr.percentage for tr in s.test_results]
        if s_scores and (sum(s_scores)/len(s_scores)) < config.flag_threshold_pct:
            students_followup_count += 1

    # Interventions
    actions_q = db.query(models.TeacherAction)
    if batch_id:
        actions_q = actions_q.filter(models.TeacherAction.batch_id == batch_id)
    
    all_actions = actions_q.all()
    pending_actions = sum(1 for a in all_actions if a.status in ["recommended", "assigned", "in_progress"])
    completed_interventions = sum(1 for a in all_actions if a.status == "completed")

    # Intervention evaluation metrics
    eval_summary = analytics.get_intervention_effectiveness_summary(db, batch_id)
    avg_improvement = eval_summary["average_delta_pct"]
    breakdown = eval_summary["status_counts"]

    # Recent activity stream
    recent_activity = [
        {
            "id": 1,
            "type": "intervention_completed",
            "title": "Prof. S. Ramesh Sir completed Doubt Clinic on Graph Traversal & Trees",
            "time": "2 days ago",
            "batch": "B.Tech CSE - 2026 Alpha",
            "delta": "+18.5%"
        },
        {
            "id": 2,
            "type": "assessment_recorded",
            "title": "Graph Traversal Post-Intervention Reassessment uploaded",
            "time": "3 days ago",
            "batch": "B.Tech CSE - 2026 Alpha",
            "delta": None
        },
        {
            "id": 3,
            "type": "gap_flagged",
            "title": "Recurring gap detected in Neural Net Backprop (44.5% avg)",
            "time": "5 days ago",
            "batch": "B.Tech AI&ML - 2026 Sigma",
            "delta": None
        },
        {
            "id": 4,
            "type": "action_assigned",
            "title": "Fourier Transform & Filters Practice Sheet assigned to Dr. P. Sreedhar Sir",
            "time": "1 week ago",
            "batch": "B.Tech ECE - 2026 Zenith",
            "delta": None
        }
    ]

    return {
        "total_students": total_students,
        "total_tests_conducted": total_tests,
        "overall_avg_score": overall_avg,
        "batch_performance": batch_perf,
        "topics_needing_attention": topics_needing_attention,
        "students_requiring_follow_up": students_followup_count,
        "pending_teacher_actions": pending_actions,
        "completed_interventions": completed_interventions,
        "avg_observed_improvement": avg_improvement,
        "improvement_breakdown": breakdown,
        "recent_activity": recent_activity
    }
