import {
  Institution,
  Batch,
  User,
  Student,
  StudentDetail,
  TopicGap,
  TeacherAction,
  DashboardSummary,
  CSVValidationPreview,
  RuleConfig,
  InterventionEvaluation
} from '../types';

const API_BASE = '/api';

export const api = {
  // Institution & Config
  getInstitutionProfile: async (): Promise<Institution> => {
    const res = await fetch(`${API_BASE}/institution/profile`);
    if (!res.ok) throw new Error('Failed to fetch institution profile');
    return res.json();
  },

  getBatches: async (): Promise<Batch[]> => {
    const res = await fetch(`${API_BASE}/institution/batches`);
    if (!res.ok) throw new Error('Failed to fetch batches');
    return res.json();
  },

  getUsers: async (): Promise<User[]> => {
    const res = await fetch(`${API_BASE}/auth/users`);
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  getRules: async (): Promise<RuleConfig> => {
    const res = await fetch(`${API_BASE}/institution/rules`);
    if (!res.ok) throw new Error('Failed to fetch rules');
    return res.json();
  },

  updateRules: async (data: Partial<RuleConfig>): Promise<RuleConfig> => {
    const res = await fetch(`${API_BASE}/institution/rules`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update rules');
    return res.json();
  },

  // Dashboard
  getDashboardSummary: async (batchId?: number): Promise<DashboardSummary> => {
    const url = batchId ? `${API_BASE}/analytics/dashboard?batch_id=${batchId}` : `${API_BASE}/analytics/dashboard`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch dashboard summary');
    return res.json();
  },

  // Students
  getStudents: async (batchId?: number, q?: string, status?: string): Promise<Student[]> => {
    const params = new URLSearchParams();
    if (batchId) params.append('batch_id', batchId.toString());
    if (q) params.append('q', q);
    if (status && status !== 'all') params.append('support_status', status);

    const res = await fetch(`${API_BASE}/students?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch students');
    return res.json();
  },

  getStudentDetail: async (id: number): Promise<StudentDetail> => {
    const res = await fetch(`${API_BASE}/students/${id}`);
    if (!res.ok) throw new Error('Failed to fetch student profile');
    return res.json();
  },

  // Topic Gaps
  getTopicGaps: async (batchId?: number): Promise<TopicGap[]> => {
    const url = batchId ? `${API_BASE}/topics/gaps?batch_id=${batchId}` : `${API_BASE}/topics/gaps`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch topic gaps');
    return res.json();
  },

  // Teacher Action Centre
  getActions: async (batchId?: number, status?: string, teacherId?: number): Promise<TeacherAction[]> => {
    const params = new URLSearchParams();
    if (batchId) params.append('batch_id', batchId.toString());
    if (status && status !== 'all') params.append('status', status);
    if (teacherId) params.append('teacher_id', teacherId.toString());

    const res = await fetch(`${API_BASE}/actions?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch actions');
    return res.json();
  },

  createAction: async (data: any): Promise<TeacherAction> => {
    const res = await fetch(`${API_BASE}/actions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create teacher action');
    return res.json();
  },

  updateAction: async (id: number, data: Partial<TeacherAction>): Promise<TeacherAction> => {
    const res = await fetch(`${API_BASE}/actions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update action');
    return res.json();
  },

  deleteAction: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/actions/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete action');
  },

  // Intervention Effectiveness
  getInterventionEffectiveness: async (batchId?: number): Promise<{
    total_evaluations: number;
    average_delta_pct: number;
    status_counts: Record<string, number>;
    evaluations_list: InterventionEvaluation[];
    disclaimer: string;
  }> => {
    const url = batchId ? `${API_BASE}/interventions/summary?batch_id=${batchId}` : `${API_BASE}/interventions/summary`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch intervention summary');
    return res.json();
  },

  // Imports
  previewCsv: async (file: File): Promise<CSVValidationPreview> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/imports/preview`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to preview CSV file');
    }
    return res.json();
  },

  commitCsv: async (file: File): Promise<{ message: string; imported_records: number; skipped_records: number }> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/imports/commit`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to import CSV file');
    return res.json();
  },

  getImportHistory: async (): Promise<any[]> => {
    const res = await fetch(`${API_BASE}/imports/history`);
    if (!res.ok) throw new Error('Failed to fetch import history');
    return res.json();
  },

  // Report URLs
  getStudentPdfUrl: (studentId: number) => `${API_BASE}/reports/student/${studentId}/pdf`,
  getBatchPdfUrl: (batchId: number) => `${API_BASE}/reports/batch/${batchId}/pdf`,
  getBatchCsvUrl: (batchId: number) => `${API_BASE}/reports/batch/${batchId}/csv`,
  getInterventionsCsvUrl: () => `${API_BASE}/reports/interventions/csv`,
  getSampleCsvUrl: () => `${API_BASE}/imports/sample-csv`,
};
