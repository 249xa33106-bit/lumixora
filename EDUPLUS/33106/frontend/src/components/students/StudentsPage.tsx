import React, { useState } from 'react';
import {
  Search,
  Filter,
  Users,
  Eye,
  Download,
  AlertCircle,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { Student } from '../../types';
import { api } from '../../services/api';
import { StudentProfileModal } from './StudentProfileModal';

interface StudentsPageProps {
  students: Student[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
}

export const StudentsPage: React.FC<StudentsPageProps> = ({
  students,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'mastering':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Mastering Concepts
          </span>
        );
      case 'on_track':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
            On Track
          </span>
        );
      case 'needs_practice':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            Needs Additional Practice
          </span>
        );
      case 'opportunity':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            Improvement Opportunity
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
            Student Performance Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Objective performance intelligence across enrolled Kurnool coaching cohorts
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student, UID, roll..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 w-64 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs">
        <span className="text-slate-400 font-medium px-2">Filter Status:</span>
        {[
          { id: 'all', label: 'All Students' },
          { id: 'needs_practice', label: 'Needs Additional Practice' },
          { id: 'opportunity', label: 'Improvement Opportunity' },
          { id: 'on_track', label: 'On Track' },
          { id: 'mastering', label: 'Mastering' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              statusFilter === tab.id
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="p-3.5">Student UID</th>
              <th className="p-3.5">Full Name</th>
              <th className="p-3.5">Batch</th>
              <th className="p-3.5">Avg Score</th>
              <th className="p-3.5">Tests Taken</th>
              <th className="p-3.5">Focus Topics</th>
              <th className="p-3.5">Support Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.length > 0 ? (
              students.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 font-mono font-semibold text-slate-700">
                    {s.student_uid}
                  </td>
                  <td className="p-3.5 font-bold text-slate-900">
                    {s.full_name}
                    <span className="block text-[10px] text-slate-400 font-normal">
                      Roll: {s.roll_number}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600 font-medium">
                    {s.batch_name}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`font-black text-sm ${
                        s.avg_score_pct >= 65
                          ? 'text-teal-700'
                          : s.avg_score_pct >= 50
                          ? 'text-blue-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {s.avg_score_pct}%
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600">
                    {s.tests_taken}
                  </td>
                  <td className="p-3.5">
                    {s.flagged_topics_count > 0 ? (
                      <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {s.flagged_topics_count} topic(s)
                      </span>
                    ) : (
                      <span className="text-slate-400">None flagged</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    {getStatusBadge(s.support_status)}
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedStudentId(s.id)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs"
                        title="View Full Profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={api.getStudentPdfUrl(s.id)}
                        target="_blank"
                        rel="noreferrer"
                        download
                        className="p-1.5 rounded-lg border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-800 transition-colors shadow-2xs"
                        title="Download Diagnostic PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-400">
                  <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm font-semibold">No students match current filter criteria.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedStudentId && (
        <StudentProfileModal
          studentId={selectedStudentId}
          onClose={() => setSelectedStudentId(null)}
        />
      )}
    </div>
  );
};
