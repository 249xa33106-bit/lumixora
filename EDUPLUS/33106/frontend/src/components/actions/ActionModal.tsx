import React, { useState } from 'react';
import { X, Sparkles, User, Calendar, BookOpen, Layers } from 'lucide-react';
import { TeacherAction, Batch, User as UserModel, TopicGap } from '../../types';

interface ActionModalProps {
  initialData?: Partial<TeacherAction> | null;
  batches: Batch[];
  users: UserModel[];
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export const ActionModal: React.FC<ActionModalProps> = ({
  initialData,
  batches,
  users,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [batchId, setBatchId] = useState<number>(initialData?.batch_id || batches[0]?.id || 1);
  const [subjectId, setSubjectId] = useState<number>(initialData?.subject_id || 1);
  const [topicId, setTopicId] = useState<number>(initialData?.topic_id || 1);
  const [teacherId, setTeacherId] = useState<number | undefined>(initialData?.teacher_id || users[1]?.id);
  const [actionType, setActionType] = useState<string>(initialData?.action_type || 'targeted_practice');
  const [priority, setPriority] = useState<string>(initialData?.priority || 'medium');
  const [evidenceReason, setEvidenceReason] = useState<string>(
    initialData?.evidence_reason || 'Identified concept weakness across recent unit assessments.'
  );
  const [dueDate, setDueDate] = useState<string>(
    initialData?.due_date ? initialData.due_date.split('T')[0] : '2026-10-25'
  );
  const [teacherNotes, setTeacherNotes] = useState<string>(initialData?.teacher_notes || '');
  const [saving, setSaving] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        batch_id: batchId,
        subject_id: subjectId,
        topic_id: topicId,
        teacher_id: teacherId,
        title,
        action_type: actionType,
        priority,
        evidence_reason: evidenceReason,
        due_date: new Date(dueDate).toISOString(),
        teacher_notes: teacherNotes || undefined,
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save action');
    } finally {
      setSaving(false);
    }
  };

  const actionTypes = [
    { id: 'doubt_clinic', label: 'Doubt Clearing Workshop' },
    { id: 'targeted_practice', label: 'Targeted Practice Problem Sheet' },
    { id: '1on1_clinic', label: '1-on-1 Concept Clinic' },
    { id: 'concept_relecture', label: 'Foundational Concept Re-lecture' },
    { id: 'reassessment', label: '15-min Diagnostic Reassessment' },
  ];

  const teachers = users.filter((u) => u.role === 'teacher' || u.role === 'coordinator');

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-100 text-teal-800 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {initialData?.id ? 'Edit Learning Intervention' : 'New Teacher Action Intervention'}
              </h2>
              <p className="text-xs text-slate-500">
                Turn assessment evidence into concrete classroom next steps
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Intervention Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Rotational Dynamics - Torque & Moment of Inertia Workshop"
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500/20 text-xs text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Target Batch
              </label>
              <select
                value={batchId}
                onChange={(e) => setBatchId(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white"
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Assign Faculty Mentor
              </label>
              <select
                value={teacherId || ''}
                onChange={(e) => setTeacherId(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full p-2 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white"
              >
                <option value="">Unassigned (Open Pool)</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.subject_specialization})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Intervention Strategy
              </label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white"
              >
                {actionTypes.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Target Completion Due Date
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white"
              >
              </input>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Assessment Evidence & Rationale
            </label>
            <textarea
              rows={3}
              required
              value={evidenceReason}
              onChange={(e) => setEvidenceReason(e.target.value)}
              placeholder="State the objective test marks rationale..."
              className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Teacher Execution Notes / Instructional Plan
            </label>
            <textarea
              rows={2}
              value={teacherNotes}
              onChange={(e) => setTeacherNotes(e.target.value)}
              placeholder="e.g. Problems selected from HC Verma Chapter 10, 15 guided exercises..."
              className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold transition-colors shadow-xs"
            >
              {saving ? 'Saving...' : initialData?.id ? 'Update Intervention' : 'Schedule Action'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
