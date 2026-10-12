import React, { useState } from 'react';
import {
  FileText,
  Download,
  FileSpreadsheet,
  Building2,
  Calendar,
  CheckCircle2,
  Users,
  Layers,
  TrendingUp,
  Printer
} from 'lucide-react';
import { Batch, Student } from '../../types';
import { api } from '../../services/api';

interface ReportsPageProps {
  batches: Batch[];
  students: Student[];
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  batches,
  students,
}) => {
  const [selectedBatchId, setSelectedBatchId] = useState<number>(batches[0]?.id || 1);
  const [selectedStudentId, setSelectedStudentId] = useState<number>(students[0]?.id || 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Executive Reports & Institutional Exports
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Generate printable PDF diagnostic dossiers and CSV audit datasets for coordinators and management
        </p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Student Diagnostic Dossier */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Student Diagnostic Learning Dossier
              </h3>
              <p className="text-xs text-slate-500">
                Comprehensive subject-topic mastery, improvement focus, and coordinator sign-off
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">
              Select Student:
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(Number(e.target.value))}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name} ({s.student_uid} • {s.batch_name})
                </option>
              ))}
            </select>
          </div>

          <a
            href={api.getStudentPdfUrl(selectedStudentId)}
            target="_blank"
            rel="noreferrer"
            download
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Official Student PDF</span>
          </a>
        </div>

        {/* 2. Batch Performance & Topic Gap Audit */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Batch Performance & Topic Gap Audit
              </h3>
              <p className="text-xs text-slate-500">
                Aggregated cohort diagnostic for faculty review and coordinator planning
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">
              Select Batch:
            </label>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(Number(e.target.value))}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.program})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={api.getBatchPdfUrl(selectedBatchId)}
              target="_blank"
              rel="noreferrer"
              download
              className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Batch Audit PDF</span>
            </a>
            <a
              href={api.getBatchCsvUrl(selectedBatchId)}
              target="_blank"
              rel="noreferrer"
              download
              className="py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-colors shadow-2xs flex items-center justify-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Marks CSV</span>
            </a>
          </div>
        </div>

        {/* 3. Intervention Efficacy Audit CSV */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Intervention Efficacy Master Export
              </h3>
              <p className="text-xs text-slate-500">
                Complete pre/post evaluation data with baseline, follow-up, and observed deltas
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
            Export every teacher action, paired baseline score, reassessment score, and outcome categorization for institutional accreditation and parent updates.
          </p>

          <a
            href={api.getInterventionsCsvUrl()}
            target="_blank"
            rel="noreferrer"
            download
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Interventions CSV</span>
          </a>
        </div>

        {/* 4. Official Sample Import Template */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                OMR / Test Import Template
              </h3>
              <p className="text-xs text-slate-500">
                Standard format conforming to EduPulse validation schema
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
            Distribute this CSV format to exam coordinators and data entry operators to ensure error-free batch imports without column mismatch errors.
          </p>

          <a
            href="/edupulse_sample_test_results.csv"
            download="edupulse_sample_test_results.csv"
            className="w-full py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-bold transition-colors shadow-2xs flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Template CSV</span>
          </a>
        </div>
      </div>
    </div>
  );
};
