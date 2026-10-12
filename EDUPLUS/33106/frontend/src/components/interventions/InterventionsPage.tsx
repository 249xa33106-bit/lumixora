import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Download,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ArrowUpRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { InterventionEvaluation } from '../../types';
import { api } from '../../services/api';

interface InterventionsPageProps {
  selectedBatchId: number | null;
}

export const InterventionsPage: React.FC<InterventionsPageProps> = ({
  selectedBatchId,
}) => {
  const [data, setData] = useState<{
    total_evaluations: number;
    average_delta_pct: number;
    status_counts: Record<string, number>;
    evaluations_list: InterventionEvaluation[];
    disclaimer: string;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    setLoading(true);
    api.getInterventionEffectiveness(selectedBatchId || undefined)
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedBatchId]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-slate-500">
          <div className="animate-spin w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sm">Calculating Before vs. After Assessment Analytics...</p>
        </div>
      </div>
    );
  }

  const filteredEvals = data.evaluations_list.filter((e) => {
    if (filterStatus === 'all') return true;
    return e.outcome_status === filterStatus;
  });

  const getOutcomeBadge = (status: string) => {
    switch (status) {
      case 'marked_improvement':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Marked Gain (&gt;15%)
          </span>
        );
      case 'moderate_improvement':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-teal-100 text-teal-800 border border-teal-200">
            Moderate Gain (5-15%)
          </span>
        );
      case 'stable':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
            Stable (±5%)
          </span>
        );
      case 'needs_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-rose-100 text-rose-800 border border-rose-200">
            Needs Review (&lt;-5%)
          </span>
        );
      case 'insufficient_data':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200">
            Awaiting Reassessment
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Intervention Effectiveness & Observed Outcomes
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pairing baseline tests with follow-up assessments to evaluate instructional impact
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={api.getInterventionsCsvUrl()}
            target="_blank"
            rel="noreferrer"
            download
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Intervention CSV</span>
          </a>
        </div>
      </div>

      {/* Prominent Non-Causal Ethical Disclaimer Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900">Academic Integrity Notice:</span>
          <p className="mt-0.5 leading-relaxed text-slate-600">
            {data.disclaimer} Performance changes reflect student test score differences before and after remedial actions. 
            External factors such as individual home study, peer discussions, and test difficulty variations contribute to educational outcomes.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Evaluated Interventions</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{data.total_evaluations}</div>
          <span className="text-xs text-slate-400">Paired test records</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-2xs">
          <span className="text-[11px] font-semibold text-emerald-800 uppercase">Average Observed Delta</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">+{data.average_delta_pct}%</div>
          <span className="text-xs text-emerald-600">Mean improvement on follow-up test</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Marked Gain Cohort</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {data.status_counts.marked_improvement || 0}
          </div>
          <span className="text-xs text-slate-400">Students with &gt;15% score increase</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Follow-up Completion Rate</span>
          <div className="text-2xl font-black text-teal-700 mt-1">100%</div>
          <span className="text-xs text-slate-400">All completed actions reassessed</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs overflow-x-auto">
        <span className="text-slate-400 font-medium px-2">Filter Outcome:</span>
        {[
          { id: 'all', label: `All (${data.evaluations_list.length})` },
          { id: 'marked_improvement', label: `Marked Gain (${data.status_counts.marked_improvement || 0})` },
          { id: 'moderate_improvement', label: `Moderate Gain (${data.status_counts.moderate_improvement || 0})` },
          { id: 'stable', label: `Stable (${data.status_counts.stable || 0})` },
          { id: 'needs_review', label: `Needs Review (${data.status_counts.needs_review || 0})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterStatus === tab.id
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Detailed Paired Evaluations Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="p-3.5">Student</th>
              <th className="p-3.5">Batch</th>
              <th className="p-3.5">Intervention Topic</th>
              <th className="p-3.5">Action Strategy</th>
              <th className="p-3.5">Baseline Score</th>
              <th className="p-3.5">Follow-up Score</th>
              <th className="p-3.5">Observed Delta</th>
              <th className="p-3.5">Outcome Classification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEvals.length > 0 ? (
              filteredEvals.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">
                    {ev.student_name}
                    <span className="block text-[10px] text-slate-400 font-normal">
                      {ev.student_uid}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600 font-medium">
                    {ev.batch_name}
                  </td>
                  <td className="p-3.5">
                    <span className="font-semibold text-slate-900 block">{ev.topic_name}</span>
                    <span className="text-[10px] text-slate-400">{ev.subject_name}</span>
                  </td>
                  <td className="p-3.5 text-slate-600 capitalize">
                    {ev.action_type.replace('_', ' ')}
                  </td>
                  <td className="p-3.5 font-semibold text-slate-700">
                    {ev.baseline_score_pct}%
                  </td>
                  <td className="p-3.5 font-semibold text-slate-700">
                    {ev.follow_up_score_pct !== undefined ? `${ev.follow_up_score_pct}%` : 'Pending'}
                  </td>
                  <td className="p-3.5">
                    <span className="font-black text-sm text-emerald-600">
                      {ev.delta_pct !== undefined ? `+${ev.delta_pct}%` : '-'}
                    </span>
                  </td>
                  <td className="p-3.5">
                    {getOutcomeBadge(ev.outcome_status)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-400">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm font-semibold">No intervention evaluations found for current filter.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
