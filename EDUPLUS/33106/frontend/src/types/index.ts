export interface Institution {
  id: number;
  name: string;
  tagline: string;
  location: string;
  created_at: string;
}

export interface Batch {
  id: number;
  name: string;
  program: string;
  target_year: number;
  student_count?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'coordinator';
  subject_specialization?: string;
  is_active: boolean;
}

export interface Topic {
  id: number;
  subject_id: number;
  name: string;
  description?: string;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  topics: Topic[];
}

export interface Student {
  id: number;
  student_uid: string;
  full_name: string;
  roll_number: string;
  batch_id: number;
  batch_name?: string;
  support_status: 'needs_practice' | 'opportunity' | 'on_track' | 'mastering' | 'insufficient_data';
  avg_score_pct: number;
  tests_taken: number;
  flagged_topics_count: number;
}

export interface TestResultItem {
  id: number;
  assessment_id: number;
  test_code?: string;
  test_title?: string;
  subject_name?: string;
  topic_name?: string;
  score: number;
  maximum_score: number;
  percentage: number;
  test_date: string;
}

export interface StudentDetail {
  id: number;
  student_uid: string;
  full_name: string;
  roll_number: string;
  batch_id: number;
  batch_name: string;
  overall_avg_pct: number;
  total_tests: number;
  support_status: string;
  subject_breakdown: Array<{
    subject_id: number;
    subject_name: string;
    avg_pct: number;
    test_count: number;
  }>;
  topic_strengths: Array<{
    topic_id: number;
    topic_name: string;
    subject_name: string;
    avg_pct: number;
    tests_taken: number;
    latest_score: number;
    status: string;
  }>;
  topic_needs_practice: Array<{
    topic_id: number;
    topic_name: string;
    subject_name: string;
    avg_pct: number;
    tests_taken: number;
    latest_score: number;
    status: string;
  }>;
  recent_results: TestResultItem[];
  assigned_actions: Array<{
    id: number;
    title: string;
    action_type: string;
    topic_name: string;
    subject_name: string;
    status: string;
    priority: string;
    due_date?: string;
    teacher_name?: string;
  }>;
  intervention_outcomes: Array<{
    id: number;
    intervention_title: string;
    action_type: string;
    topic_name: string;
    baseline_score_pct: number;
    follow_up_score_pct?: number;
    delta_pct?: number;
    outcome_status: string;
    eval_date?: string;
    notes?: string;
  }>;
}

export interface TopicGap {
  topic_id: number;
  topic_name: string;
  subject_id: number;
  subject_name: string;
  batch_id: number;
  batch_name: string;
  avg_score_pct: number;
  tests_conducted: number;
  students_impacted: number;
  total_batch_students: number;
  impact_percentage: number;
  is_recurring: boolean;
  confidence_level: string;
  reason: string;
  recommended_action_type: string;
  impacted_student_ids?: number[];
}

export interface TeacherAction {
  id: number;
  batch_id: number;
  batch_name?: string;
  subject_id: number;
  subject_name?: string;
  topic_id: number;
  topic_name?: string;
  teacher_id?: number;
  teacher_name?: string;
  title: string;
  action_type: 'doubt_clinic' | 'targeted_practice' | '1on1_clinic' | 'reassessment' | 'concept_relecture';
  status: 'recommended' | 'assigned' | 'in_progress' | 'completed' | 'reviewed';
  priority: 'high' | 'medium' | 'low';
  evidence_reason: string;
  target_student_ids: number[];
  target_students?: Array<{ id: number; name: string; uid: string }>;
  due_date?: string;
  completed_date?: string;
  teacher_notes?: string;
  created_at: string;
}

export interface InterventionEvaluation {
  id: number;
  intervention_id: number;
  intervention_title: string;
  action_type: string;
  student_id: number;
  student_name: string;
  student_uid: string;
  batch_name: string;
  topic_name: string;
  subject_name: string;
  baseline_score_pct: number;
  follow_up_score_pct?: number;
  delta_pct?: number;
  outcome_status: 'marked_improvement' | 'moderate_improvement' | 'stable' | 'needs_review' | 'insufficient_data';
  eval_date: string;
  notes?: string;
}

export interface DashboardSummary {
  total_students: number;
  total_tests_conducted: number;
  overall_avg_score: number;
  batch_performance: Array<{
    batch_id: number;
    batch_name: string;
    program: string;
    student_count: number;
    avg_score_pct: number;
  }>;
  topics_needing_attention: number;
  students_requiring_follow_up: number;
  pending_teacher_actions: number;
  completed_interventions: number;
  avg_observed_improvement: number;
  improvement_breakdown: {
    marked_improvement: number;
    moderate_improvement: number;
    stable: number;
    needs_review: number;
    insufficient_data: number;
  };
  recent_activity: Array<{
    id: number;
    type: string;
    title: string;
    time: string;
    batch: string;
    delta?: string | null;
  }>;
}

export interface CSVRowValidation {
  row_number: number;
  student_id: string;
  batch: string;
  test_id: string;
  subject: string;
  topic: string;
  score: number;
  maximum_score: number;
  test_date: string;
  is_valid: boolean;
  is_duplicate: boolean;
  errors: string[];
}

export interface CSVValidationPreview {
  total_rows: number;
  valid_rows_count: number;
  invalid_rows_count: number;
  duplicate_rows_count: number;
  sample_preview: CSVRowValidation[];
  unique_batches: string[];
  unique_subjects: string[];
  unique_topics: string[];
  can_commit: boolean;
}

export interface RuleConfig {
  id: number;
  flag_threshold_pct: number;
  min_tests_required: number;
  consecutive_drop_count: number;
  cohort_alert_ratio: number;
}
