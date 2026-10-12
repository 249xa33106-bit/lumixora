import React, { useState } from 'react';
import {
  Sparkles,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Calendar,
  Users,
  ArrowRight,
  Edit2,
  Trash2,
  Check,
  BookOpen,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { TeacherAction, Batch, User as UserModel, TopicGap } from '../../types';
import { ActionModal } from './ActionModal';

interface ActionCentrePageProps {
  actions: TeacherAction[];
  batches: Batch[];
  users: UserModel[];
  currentUser: UserModel | null;
  onRefresh: () => void;
  onCreateAction: (data: any) => Promise<void>;
  onUpdateAction: (id: number, data: any) => Promise<void>;
  onDeleteAction: (id: number) => Promise<void>;
  onNavigateTab: (tab: string) => void;
}

export const ActionCentrePage: React.FC<ActionCentrePageProps> = ({
  actions,
  batches,
  users,
  currentUser,
  onRefresh,
  onCreateAction,
  onUpdateAction,
  onDeleteAction,
  onNavigateTab,
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [editingAction, setEditingAction] = useState<TeacherAction | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const filteredActions = actions.filter((a) => {
    if (activeTab === 'all') return true;
    return a.status === activeTab;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
            Completed
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-blue-100 text-blue-800 border border-blue-200">
            In Progress
          </span>
        );
      case 'assigned':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-indigo-100 text-indigo-800 border border-indigo-200">
            Assigned
          </span>
        );
      case 'recommended':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200">
            System Recommended
          </span>
        );
    }
  };

  const handleAcceptRecommendation = async (action: TeacherAction) => {
    const teacherIdToAssign = currentUser?.id || users[1]?.id;
    await onUpdateAction(action.id, {
      status: 'assigned',
      teacher_id: teacherIdToAssign,
    });
  };

  const handleStartAction = async (action: TeacherAction) => {
    await onUpdateAction(action.id, {
      status: 'in_progress',
    });
  };

  const handleCompleteAction = async (action: TeacherAction) => {
    const notes = prompt('Enter brief completion notes (e.g. Problems covered, attendance):', action.teacher_notes || '');
    if (notes === null) return;
    await onUpdateAction(action.id, {
      status: 'completed',
      teacher_notes: notes,
      completed_date: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-6 rounded-2xl text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-400/20 text-teal-300 text-xs font-bold mb-2 border border-teal-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EduPulse Core Differentiator</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Teacher Action Centre
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Where assessment scores transform into teacher assignments. Accept AI-recommended remedial actions, 
            assign faculty mentors, and verify subsequent student score improvement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-md shadow-teal-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Action</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'all', label: `All Interventions (${actions.length})` },
            { id: 'recommended', label: `Recommended (${actions.filter((a) => a.status === 'recommended').length})` },
            { id: 'assigned', label: `Assigned (${actions.filter((a) => a.status === 'assigned').length})` },
            { id: 'in_progress', label: `In Progress (${actions.filter((a) => a.status === 'in_progress').length})` },
            { id: 'completed', label: `Completed (${actions.filter((a) => a.status === 'completed').length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => onNavigateTab('interventions')}
          className="text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1"
        >
          <span>Intervention Effectiveness Matrix</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredActions.map((action) => (
          <div
            key={action.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Card Top */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {action.action_type.replace('_', ' ')}
                    </span>
                    {getStatusBadge(action.status)}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-2">
                    {action.title}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {action.subject_name} • {action.topic_name} • Batch: <span className="font-semibold text-slate-700">{action.batch_name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingAction(action)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    title="Edit Intervention"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this intervention?')) {
                        onDeleteAction(action.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete / Reject"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Assessment Evidence Quote */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 my-3 text-xs">
                <span className="font-bold text-slate-700 block mb-1">
                  Assessment Evidence:
                </span>
                <p className="text-slate-600 leading-relaxed italic">
                  “{action.evidence_reason}”
                </p>
              </div>

              {/* Metadata details */}
              <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                <div className="flex items-center gap-2 text-slate-600">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Faculty Mentor</span>
                    <span className="font-semibold text-slate-900">
                      {action.teacher_name || 'Unassigned'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Target Due Date</span>
                    <span className="font-semibold text-slate-900">
                      {action.due_date ? new Date(action.due_date).toLocaleDateString() : 'Flexible'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Impacted student cohort preview */}
              {action.target_students && action.target_students.length > 0 && (
                <div className="mb-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                    Target Student Cohort ({action.target_students.length} students):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {action.target_students.slice(0, 6).map((s) => (
                      <span
                        key={s.id}
                        className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                      >
                        {s.name}
                      </span>
                    ))}
                    {action.target_students.length > 6 && (
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-medium">
                        +{action.target_students.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Teacher Notes if any */}
              {action.teacher_notes && (
                <div className="p-2.5 bg-teal-50/50 rounded-lg border border-teal-100 text-xs mb-3 text-teal-900">
                  <span className="font-bold block mb-0.5">Faculty Execution Notes:</span>
                  <p className="text-teal-800 leading-relaxed">{action.teacher_notes}</p>
                </div>
              )}
            </div>

            {/* Workflow Action Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              {action.status === 'recommended' && (
                <div className="flex items-center gap-2 w-full">
                  <button
                    onClick={() => handleAcceptRecommendation(action)}
                    className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept & Assign to Faculty</span>
                  </button>
                  <button
                    onClick={() => onDeleteAction(action.id)}
                    className="px-3 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold"
                  >
                    Reject
                  </button>
                </div>
              )}

              {action.status === 'assigned' && (
                <button
                  onClick={() => handleStartAction(action)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs text-center"
                >
                  Mark In Progress / Start Session
                </button>
              )}

              {action.status === 'in_progress' && (
                <button
                  onClick={() => handleCompleteAction(action)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs text-center flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Completed & Record Notes</span>
                </button>
              )}

              {action.status === 'completed' && (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Completed {action.completed_date ? `on ${new Date(action.completed_date).toLocaleDateString()}` : ''}</span>
                  </div>
                  <button
                    onClick={() => onNavigateTab('interventions')}
                    className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                  >
                    <span>Inspect Follow-up Delta</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for creating/editing actions */}
      {(showCreateModal || editingAction) && (
        <ActionModal
          initialData={editingAction}
          batches={batches}
          users={users}
          onClose={() => {
            setShowCreateModal(false);
            setEditingAction(null);
          }}
          onSave={async (data) => {
            if (editingAction) {
              await onUpdateAction(editingAction.id, data);
            } else {
              await onCreateAction(data);
            }
          }}
        />
      )}
    </div>
  );
};
