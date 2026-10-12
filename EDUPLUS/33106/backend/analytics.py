import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
import models

def get_rule_config(db: Session, institution_id: int = 1) -> models.RuleConfig:
    config = db.query(models.RuleConfig).filter(models.RuleConfig.institution_id == institution_id).first()
    if not config:
        config = models.RuleConfig(
            institution_id=institution_id,
            flag_threshold_pct=50.0,
            min_tests_required=2,
            consecutive_drop_count=2,
            cohort_alert_ratio=0.40
        )
        db.add(config)
        db.commit()
        db.refresh(config)
    return config

def analyze_topic_gaps(db: Session, batch_id: Optional[int] = None) -> List[Dict[str, Any]]:
    """
    Transparent Rules Engine for Topic Gap Detection:
    - Calculates mathematically correct scores & percentages
    - Detects consistently low performance on a topic
    - Distinguishes single poor result from recurring pattern
    - Flags insufficient data rather than generating unsupported claims
    - Explains why a topic or student group was flagged
    """
    config = get_rule_config(db)
    threshold = config.flag_threshold_pct
    min_tests = config.min_tests_required
    cohort_alert_ratio = config.cohort_alert_ratio

    # Query all test results with joins
    query = (
        db.query(
            models.TestResult.id.label("result_id"),
            models.TestResult.student_id,
            models.Student.student_uid,
            models.Student.full_name.label("student_name"),
            models.Student.batch_id,
            models.Batch.name.label("batch_name"),
            models.Assessment.id.label("assessment_id"),
            models.Assessment.test_code,
            models.Assessment.test_date,
            models.Assessment.subject_id,
            models.Subject.name.label("subject_name"),
            models.Assessment.topic_id,
            models.Topic.name.label("topic_name"),
            models.TestResult.score,
            models.TestResult.maximum_score,
            models.TestResult.percentage
        )
        .join(models.Student, models.TestResult.student_id == models.Student.id)
        .join(models.Batch, models.Student.batch_id == models.Batch.id)
        .join(models.Assessment, models.TestResult.assessment_id == models.Assessment.id)
        .join(models.Subject, models.Assessment.subject_id == models.Subject.id)
        .join(models.Topic, models.Assessment.topic_id == models.Topic.id)
    )

    if batch_id:
        query = query.filter(models.Student.batch_id == batch_id)

    records = [r._asdict() for r in query.all()]
    if not records:
        return []

    df = pd.DataFrame(records)

    results = []

    # Group by batch, subject, topic
    grouped = df.groupby(["batch_id", "batch_name", "subject_id", "subject_name", "topic_id", "topic_name"])

    for (b_id, b_name, s_id, s_name, t_id, t_name), group in grouped:
        total_students_in_batch = db.query(models.Student).filter(models.Student.batch_id == b_id).count()
        tests_count = group["assessment_id"].nunique()
        avg_score = round(group["percentage"].mean(), 1)

        # Student-level topic averages within this batch
        student_topic_summary = group.groupby("student_id").agg(
            student_uid=("student_uid", "first"),
            student_name=("student_name", "first"),
            avg_pct=("percentage", "mean"),
            tests_taken=("assessment_id", "nunique")
        ).reset_index()

        students_needing_practice = student_topic_summary[
            student_topic_summary["avg_pct"] < threshold
        ]
        impacted_count = len(students_needing_practice)
        impact_ratio = (impacted_count / total_students_in_batch) if total_students_in_batch > 0 else 0

        # Check conditions
        is_recurring = (tests_count >= min_tests) and (avg_score < threshold)
        is_cohort_wide = impact_ratio >= cohort_alert_ratio
        
        # Determine confidence level
        if tests_count >= min_tests + 1:
            confidence = "High"
        elif tests_count >= min_tests:
            confidence = "Moderate"
        else:
            confidence = "Preliminary (Single Assessment)"

        # Formulate transparent, supportive reason
        if tests_count < min_tests:
            reason = (
                f"Preliminary Observation: Only {tests_count} test conducted for '{t_name}'. "
                f"Batch average is {avg_score}%. Further assessment data required before confirming recurring pattern."
            )
            rec_action = "micro_reassessment"
        elif is_cohort_wide:
            reason = (
                f"Batch-Wide Need: {impacted_count} of {total_students_in_batch} students ({round(impact_ratio*100)}%) "
                f"scored below {threshold}% across {tests_count} assessments (Batch Topic Avg: {avg_score}%). "
                f"Indicates foundational concept clarity opportunity for the entire batch."
            )
            rec_action = "doubt_clinic" if avg_score > 40 else "concept_relecture"
        elif is_recurring:
            reason = (
                f"Recurring Focus Area: Batch average is {avg_score}% across {tests_count} tests. "
                f"{impacted_count} students showed sustained opportunity for additional practice."
            )
            rec_action = "targeted_practice"
        else:
            reason = (
                f"Topic is generally on track (Batch Avg: {avg_score}%). "
                f"{impacted_count} student(s) could benefit from personalized practice sheets."
            )
            rec_action = "targeted_practice"

        # Only surface as an actionable gap if batch average is low OR significant student subset needs help
        if avg_score < threshold or impacted_count > 0:
            results.append({
                "topic_id": int(t_id),
                "topic_name": str(t_name),
                "subject_id": int(s_id),
                "subject_name": str(s_name),
                "batch_id": int(b_id),
                "batch_name": str(b_name),
                "avg_score_pct": float(avg_score),
                "tests_conducted": int(tests_count),
                "students_impacted": int(impacted_count),
                "total_batch_students": int(total_students_in_batch),
                "impact_percentage": round(impact_ratio * 100, 1),
                "is_recurring": bool(is_recurring),
                "confidence_level": confidence,
                "reason": reason,
                "recommended_action_type": rec_action,
                "impacted_student_ids": students_needing_practice["student_id"].tolist()
            })

    # Sort so most urgent recurring batch gaps appear first
    results.sort(key=lambda x: (x["is_recurring"], x["impact_percentage"]), reverse=True)
    return results

def get_student_analytics(db: Session, student_id: int) -> Dict[str, Any]:
    """
    Generates rich, supportive student performance profile:
    - Subject-wise performance
    - Topic-wise strengths & improvement opportunities (never labeled as 'failure')
    - Test-by-test progression
    - Assigned revision tasks and completed interventions
    """
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        return {}

    rule_config = get_rule_config(db)
    threshold = rule_config.flag_threshold_pct

    results_query = (
        db.query(models.TestResult, models.Assessment, models.Subject, models.Topic)
        .join(models.Assessment, models.TestResult.assessment_id == models.Assessment.id)
        .join(models.Subject, models.Assessment.subject_id == models.Subject.id)
        .join(models.Topic, models.Assessment.topic_id == models.Topic.id)
        .filter(models.TestResult.student_id == student_id)
        .order_by(models.Assessment.test_date.desc())
        .all()
    )

    if not results_query:
        return {
            "id": student.id,
            "student_uid": student.student_uid,
            "full_name": student.full_name,
            "roll_number": student.roll_number,
            "batch_id": student.batch_id,
            "batch_name": student.batch.name if student.batch else "",
            "overall_avg_pct": 0.0,
            "total_tests": 0,
            "support_status": "insufficient_data",
            "subject_breakdown": [],
            "topic_strengths": [],
            "topic_needs_practice": [],
            "recent_results": [],
            "assigned_actions": [],
            "intervention_outcomes": []
        }

    records = []
    for tr, asm, subj, top in results_query:
        records.append({
            "result_id": tr.id,
            "assessment_id": asm.id,
            "test_code": asm.test_code,
            "test_title": asm.title,
            "subject_id": subj.id,
            "subject_name": subj.name,
            "topic_id": top.id,
            "topic_name": top.name,
            "score": tr.score,
            "maximum_score": tr.maximum_score,
            "percentage": tr.percentage,
            "test_date": tr.test_date
        })

    df = pd.DataFrame(records)
    overall_avg = round(df["percentage"].mean(), 1)
    total_tests = len(df)

    # Subject breakdown
    subj_grouped = df.groupby(["subject_id", "subject_name"]).agg(
        avg_pct=("percentage", "mean"),
        test_count=("assessment_id", "nunique")
    ).reset_index()

    subject_breakdown = []
    for _, row in subj_grouped.iterrows():
        subject_breakdown.append({
            "subject_id": int(row["subject_id"]),
            "subject_name": str(row["subject_name"]),
            "avg_pct": round(float(row["avg_pct"]), 1),
            "test_count": int(row["test_count"])
        })

    # Topic level
    topic_grouped = df.groupby(["topic_id", "topic_name", "subject_name"]).agg(
        avg_pct=("percentage", "mean"),
        tests_taken=("assessment_id", "count"),
        latest_score=("percentage", "first")
    ).reset_index()

    topic_strengths = []
    topic_needs_practice = []

    for _, row in topic_grouped.iterrows():
        pct = round(float(row["avg_pct"]), 1)
        item = {
            "topic_id": int(row["topic_id"]),
            "topic_name": str(row["topic_name"]),
            "subject_name": str(row["subject_name"]),
            "avg_pct": pct,
            "tests_taken": int(row["tests_taken"]),
            "latest_score": round(float(row["latest_score"]), 1),
            "status": "Demonstrating Mastery" if pct >= 70 else ("Solid Progress" if pct >= threshold else "Needs Additional Practice")
        }
        if pct >= 65:
            topic_strengths.append(item)
        elif pct < threshold:
            topic_needs_practice.append(item)

    # Sort strengths desc, needs practice asc
    topic_strengths.sort(key=lambda x: x["avg_pct"], reverse=True)
    topic_needs_practice.sort(key=lambda x: x["avg_pct"])

    # Determine supportive status
    if overall_avg >= 75:
        support_status = "mastering"
    elif overall_avg >= threshold:
        support_status = "on_track"
    elif len(topic_needs_practice) >= 2:
        support_status = "needs_practice"
    else:
        support_status = "opportunity"

    # Query assigned teacher actions targeting this student
    actions_query = db.query(models.TeacherAction).filter(
        models.TeacherAction.batch_id == student.batch_id
    ).all()

    assigned_actions = []
    for act in actions_query:
        if act.target_student_ids and student.id in act.target_student_ids:
            assigned_actions.append({
                "id": act.id,
                "title": act.title,
                "action_type": act.action_type,
                "topic_name": act.topic.name if act.topic else "",
                "subject_name": act.topic.subject.name if act.topic and act.topic.subject else "",
                "status": act.status,
                "priority": act.priority,
                "due_date": act.due_date.isoformat() if act.due_date else None,
                "teacher_name": act.teacher.name if act.teacher else "Pending Assignment"
            })

    # Query intervention evaluations
    evals = db.query(models.InterventionEvaluation).filter(
        models.InterventionEvaluation.student_id == student.id
    ).all()

    intervention_outcomes = []
    for ev in evals:
        intervention_outcomes.append({
            "id": ev.id,
            "intervention_title": ev.intervention.title if ev.intervention else "Academic Intervention",
            "action_type": ev.intervention.action_type if ev.intervention else "targeted_practice",
            "topic_name": ev.intervention.topic.name if ev.intervention and ev.intervention.topic else "",
            "baseline_score_pct": ev.baseline_score_pct,
            "follow_up_score_pct": ev.follow_up_score_pct,
            "delta_pct": ev.delta_pct,
            "outcome_status": ev.outcome_status,
            "eval_date": ev.eval_date.isoformat() if ev.eval_date else None,
            "notes": ev.notes
        })

    recent_results = []
    for r in records[:10]:
        recent_results.append({
            "id": r["result_id"],
            "assessment_id": r["assessment_id"],
            "test_code": r["test_code"],
            "test_title": r["test_title"],
            "subject_name": r["subject_name"],
            "topic_name": r["topic_name"],
            "score": r["score"],
            "maximum_score": r["maximum_score"],
            "percentage": round(r["percentage"], 1),
            "test_date": r["test_date"].isoformat() if hasattr(r["test_date"], "isoformat") else str(r["test_date"])
        })

    return {
        "id": student.id,
        "student_uid": student.student_uid,
        "full_name": student.full_name,
        "roll_number": student.roll_number,
        "batch_id": student.batch_id,
        "batch_name": student.batch.name if student.batch else "",
        "overall_avg_pct": overall_avg,
        "total_tests": total_tests,
        "support_status": support_status,
        "subject_breakdown": subject_breakdown,
        "topic_strengths": topic_strengths,
        "topic_needs_practice": topic_needs_practice,
        "recent_results": recent_results,
        "assigned_actions": assigned_actions,
        "intervention_outcomes": intervention_outcomes
    }

def get_intervention_effectiveness_summary(db: Session, batch_id: Optional[int] = None) -> Dict[str, Any]:
    """
    Evaluates before-and-after assessment comparison:
    - Baseline score %
    - Intervention date & type
    - Follow-up score %
    - Absolute score change
    - Categorical outcome: 'marked_improvement', 'moderate_improvement', 'stable', 'needs_review', 'insufficient_data'
    - Non-causal disclaimer: 'Observed change reflects score progression; not guaranteed causation.'
    """
    query = db.query(models.InterventionEvaluation).join(models.Student, models.InterventionEvaluation.student_id == models.Student.id)
    if batch_id:
        query = query.filter(models.Student.batch_id == batch_id)

    evals = query.all()
    if not evals:
        return {
            "total_evaluations": 0,
            "average_delta_pct": 0.0,
            "status_counts": {
                "marked_improvement": 0,
                "moderate_improvement": 0,
                "stable": 0,
                "needs_review": 0,
                "insufficient_data": 0
            },
            "evaluations_list": [],
            "disclaimer": "Observed change represents assessment score progression following intervention; does not infer strict unobserved causation."
        }

    valid_deltas = [e.delta_pct for e in evals if e.delta_pct is not None]
    avg_delta = round(float(np.mean(valid_deltas)), 1) if valid_deltas else 0.0

    status_counts = {
        "marked_improvement": 0,
        "moderate_improvement": 0,
        "stable": 0,
        "needs_review": 0,
        "insufficient_data": 0
    }

    eval_list = []
    for e in evals:
        status = e.outcome_status or "insufficient_data"
        if status in status_counts:
            status_counts[status] += 1

        eval_list.append({
            "id": e.id,
            "intervention_id": e.intervention_id,
            "intervention_title": e.intervention.title if e.intervention else "Intervention",
            "action_type": e.intervention.action_type if e.intervention else "targeted_practice",
            "student_id": e.student_id,
            "student_name": e.student.full_name if e.student else "Student",
            "student_uid": e.student.student_uid if e.student else "",
            "batch_name": e.student.batch.name if e.student and e.student.batch else "",
            "topic_name": e.intervention.topic.name if e.intervention and e.intervention.topic else "",
            "subject_name": e.intervention.topic.subject.name if e.intervention and e.intervention.topic and e.intervention.topic.subject else "",
            "baseline_score_pct": round(e.baseline_score_pct, 1),
            "follow_up_score_pct": round(e.follow_up_score_pct, 1) if e.follow_up_score_pct is not None else None,
            "delta_pct": round(e.delta_pct, 1) if e.delta_pct is not None else None,
            "outcome_status": status,
            "eval_date": e.eval_date.isoformat() if e.eval_date else None,
            "notes": e.notes
        })

    return {
        "total_evaluations": len(evals),
        "average_delta_pct": avg_delta,
        "status_counts": status_counts,
        "evaluations_list": eval_list,
        "disclaimer": "Observed change represents assessment score progression following intervention; does not infer strict unobserved causation."
    }
