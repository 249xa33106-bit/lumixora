import React, { useState, useEffect } from 'react';
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { CSVValidationPreview } from '../../types';
import { api } from '../../services/api';

interface TestImportPageProps {
  onImportSuccess: () => void;
}

export const TestImportPage: React.FC<TestImportPageProps> = ({
  onImportSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<CSVValidationPreview | null>(null);
  const [validating, setValidating] = useState<boolean>(false);
  const [committing, setCommitting] = useState<boolean>(false);
  const [importHistory, setImportHistory] = useState<any[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    api.getImportHistory()
      .then((data) => setImportHistory(data))
      .catch((err) => console.error(err));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setSuccessMessage(null);
    setValidating(true);
    try {
      const preview = await api.previewCsv(file);
      setPreviewData(preview);
    } catch (err: any) {
      alert(`Validation error: ${err.message || 'Failed to parse file'}`);
      setSelectedFile(null);
      setPreviewData(null);
    } finally {
      setValidating(false);
    }
  };

  const handleCommit = async () => {
    if (!selectedFile) return;
    setCommitting(true);
    try {
      const res = await api.commitCsv(selectedFile);
      setSuccessMessage(res.message);
      setSelectedFile(null);
      setPreviewData(null);
      loadHistory();
      onImportSuccess();
    } catch (err: any) {
      alert(`Import failed: ${err.message}`);
    } finally {
      setCommitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Assessment Results Import & Validation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Safely ingest student exam marks with schema verification, duplicate prevention, and preview
          </p>
        </div>

        <a
          href="/edupulse_sample_test_results.csv"
          download="edupulse_sample_test_results.csv"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Download Sample CSV Template</span>
        </a>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-bold">{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-xs text-emerald-700 font-semibold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* CSV Specification Info */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700">
        <span className="font-bold text-slate-900 block mb-1">
          Required CSV Schema Headers:
        </span>
        <code className="text-xs text-teal-800 bg-white px-2.5 py-1 rounded border border-slate-200 font-mono block overflow-x-auto">
          student_id, batch, test_id, subject, topic, score, maximum_score, test_date
        </code>
        <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
          * Safety Guarantee: Existing assessment scores are never silently overwritten. Invalid rows are flagged for review prior to saving.
        </p>
      </div>

      {/* File Dropzone */}
      <div className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl p-8 text-center bg-white transition-colors cursor-pointer relative">
        <input
          type="file"
          accept=".csv,.txt"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="max-w-md mx-auto space-y-2">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-2">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            {selectedFile ? selectedFile.name : 'Click or drag assessment CSV to upload'}
          </h3>
          <p className="text-xs text-slate-500">
            Supports CSV exports from OMR scanners, spreadsheets, and coaching test portals
          </p>
          {validating && (
            <p className="text-xs text-teal-700 font-semibold flex items-center justify-center gap-1 pt-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Validating schema, numeric ranges, and duplicates...</span>
            </p>
          )}
        </div>
      </div>

      {/* Validation Preview Table */}
      {previewData && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Pre-Import Data Validation Summary
              </h3>
              <p className="text-xs text-slate-500">
                Review verified records and detected anomalies before committing to database
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-md font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {previewData.valid_rows_count} Valid
              </span>
              {previewData.invalid_rows_count > 0 && (
                <span className="text-xs px-2.5 py-1 rounded-md font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  {previewData.invalid_rows_count} Invalid
                </span>
              )}
              {previewData.duplicate_rows_count > 0 && (
                <span className="text-xs px-2.5 py-1 rounded-md font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  {previewData.duplicate_rows_count} Duplicate
                </span>
              )}
            </div>
          </div>

          {/* Preview rows table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden max-h-72 overflow-y-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="p-2.5">Row</th>
                  <th className="p-2.5">Student</th>
                  <th className="p-2.5">Batch</th>
                  <th className="p-2.5">Test Code</th>
                  <th className="p-2.5">Subject / Topic</th>
                  <th className="p-2.5">Score</th>
                  <th className="p-2.5">Validation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {previewData.sample_preview.map((row) => (
                  <tr key={row.row_number} className={row.is_valid ? 'hover:bg-slate-50' : 'bg-rose-50/30'}>
                    <td className="p-2.5 font-mono text-slate-500">{row.row_number}</td>
                    <td className="p-2.5 font-bold text-slate-900">{row.student_id}</td>
                    <td className="p-2.5 text-slate-600">{row.batch}</td>
                    <td className="p-2.5 font-mono text-slate-700">{row.test_id}</td>
                    <td className="p-2.5">
                      <span className="font-semibold text-slate-800 block">{row.topic}</span>
                      <span className="text-[10px] text-slate-400">{row.subject}</span>
                    </td>
                    <td className="p-2.5 font-bold text-slate-800">
                      {row.score} / {row.maximum_score}
                    </td>
                    <td className="p-2.5">
                      {row.is_valid ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Ready</span>
                        </span>
                      ) : (
                        <span className="text-rose-700 font-semibold block">
                          {row.errors.join(', ')}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Confirm Action Bar */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                setSelectedFile(null);
                setPreviewData(null);
              }}
              className="text-xs text-slate-500 hover:text-slate-700 font-semibold"
            >
              Cancel Upload
            </button>

            <button
              onClick={handleCommit}
              disabled={committing || !previewData.can_commit}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors shadow-xs flex items-center gap-2"
            >
              {committing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Importing Records...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm & Save {previewData.valid_rows_count} Valid Records</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Historical Upload Log */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">
          Recent Import Audit Trail
        </h3>
        <div className="divide-y divide-slate-100">
          {importHistory.map((item) => (
            <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-4 h-4 text-teal-600" />
                <div>
                  <span className="font-semibold text-slate-800 block">{item.filename}</span>
                  <span className="text-[10px] text-slate-400">
                    Imported on {new Date(item.imported_at).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-700">
                  {item.valid_records} records processed
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
