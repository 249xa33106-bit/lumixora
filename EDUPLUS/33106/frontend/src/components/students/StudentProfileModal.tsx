import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  GraduationCap,
  Calendar,
  FileText,
  TrendingUp,
  Download,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { StudentDetail } from '../../types';
import { api } from '../../services/api';

interface StudentProfileModalProps {
  studentId: number | null;
  onClose: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  studentId,
  onClose,
}) => {
  const [detail, setDetail] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!studentId) return;
    setLoading(true);
    api.getStudentDetail(studentId)
      .then((data) => setDetail(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [studentId]);

  if (!studentId) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {detail ? detail.full_name.charAt(0) : 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  {detail ? detail.full_name : 'Loading Student...'}
                </h2>
                {detail && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                    {detail.student_uid}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Roll No: {detail?.roll_number} • Batch: {detail?.batch_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {detail && (
              <a
                href={api.getStudentPdfUrl(detail.id)}
                target="_blank"
                rel="noreferrer"
                download
                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Diagnostic PDF</span>
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="text-center py-12 text-slate-400">
              <div className="animate-spin w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-xs">Loading performance intelligence...</p>
            </div>
          ) : detail ? (
            <>
              {/* Learning Progress Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Overall Assessment Average
                  </span>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    {detail.overall_avg_pct}%
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Across {detail.total_tests} assessments
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Current Learning Trajectory
                  </span>
                  <div className="text-base font-bold text-slate-900 mt-1 capitalize">
                    {detail.support_status.replace('_', ' ')}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Supportive, objective categorization
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Active Interventions
                  </span>
                  <div className="text-2xl font-black text-teal-700 mt-1">
                    {detail.assigned_actions.length}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Teacher-guided learning actions
                  </p>
                </div>
              </div>

              {/* Subject Breakdown */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-teal-600" />
                  <span>Subject Performance</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {detail.subject_breakdown.map((sb) => (
                    <div key={sb.subject_id} className="p-3 rounded-lg border border-slate-200 bg-white shadow-2xs">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1.5">
                        <span>{sb.subject_name}</span>
                        <span className={sb.avg_pct >= 60 ? 'text-teal-700' : 'text-amber-700'}>
                          {sb.avg_pct}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            sb.avg_pct >= 60 ? 'bg-teal-600' : sb.avg_pct >= 50 ? 'bg-blue-600' : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.min(sb.avg_pct, 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {sb.test_count} tests recorded
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Improvement Opportunities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Topic Strengths */}
                <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/30">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Demonstrated Concept Strengths</span>
                  </div>
                  {detail.topic_strengths.length > 0 ? (
                    <div className="space-y-2">
                      {detail.topic_strengths.map((t, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs bg-white p-2.5 rounded-lg border border-emerald-100 shadow-2xs">
                          <div>
                            <span className="font-semibold text-slate-800">{t.topic_name}</span>
                            <span className="text-[10px] text-slate-400 block">{t.subject_name}</span>
                          </div>
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {t.avg_pct}%
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">Continuous improvement in progress.</p>
                  )}
                </div>

                {/* Focus Opportunities */}
                <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/30">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-xs mb-3">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Targeted Practice Opportunities</span>
                  </div>
                  {detail.topic_needs_practice.length > 0 ? (
                    <div className="space-y-2">
                      {detail.topic_needs_practice.map((t, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs bg-white p-2.5 rounded-lg border border-amber-100 shadow-2xs">
                          <div>
                            <span className="font-semibold text-slate-800">{t.topic_name}</span>
                            <span className="text-[10px] text-slate-400 block">{t.subject_name}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                              {t.avg_pct}%
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Needs Practice</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No persistent topic weaknesses flagged.</p>
                  )}
                </div>
              </div>

              {/* Follow-up Assessment & Observed Deltas */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-teal-600" />
                  <span>Intervention Follow-up & Observed Score Changes</span>
                </h3>
                {detail.intervention_outcomes.length > 0 ? (
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3">Intervention</th>
                          <th className="p-3">Topic</th>
                          <th className="p-3">Baseline</th>
                          <th className="p-3">Follow-up</th>
                          <th className="p-3">Observed Delta</th>
                          <th className="p-3">Result</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {detail.intervention_outcomes.map((ev) => (
                          <tr key={ev.id} className="hover:bg-slate-50/50">
                            <td className="p-3 font-semibold text-slate-900">{ev.intervention_title}</td>
                            <td className="p-3 text-slate-600">{ev.topic_name}</td>
                            <td className="p-3 text-slate-600">{ev.baseline_score_pct}%</td>
                            <td className="p-3 text-slate-600">
                              {ev.follow_up_score_pct !== undefined ? `${ev.follow_up_score_pct}%` : 'Pending'}
                            </td>
                            <td className="p-3 font-bold text-emerald-600">
                              {ev.delta_pct !== undefined ? `+${ev.delta_pct}%` : '-'}
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                                {ev.outcome_status.replace('_', ' ')}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-lg border border-slate-100">
                    No completed interventions evaluated for this student yet.
                  </p>
                )}
              </div>

              {/* Recent Test Results */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Recent Assessment Results</span>
                </h3>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Test Code</th>
                        <th className="p-3">Subject / Topic</th>
                        <th className="p-3">Score</th>
                        <th className="p-3">Percentage</th>
                        <th className="p-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {detail.recent_results.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-mono font-medium text-slate-700">{r.test_code}</td>
                          <td className="p-3">
                            <span className="font-semibold text-slate-900 block">{r.topic_name}</span>
                            <span className="text-[10px] text-slate-400">{r.subject_name}</span>
                          </td>
                          <td className="p-3 font-medium text-slate-700">{r.score} / {r.maximum_score}</td>
                          <td className="p-3">
                            <span className={`font-bold ${r.percentage >= 60 ? 'text-teal-700' : 'text-amber-700'}`}>
                              {r.percentage}%
                            </span>
                          </td>
                          <td className="p-3 text-slate-500">{new Date(r.test_date).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
