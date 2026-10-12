import React, { useState, useEffect } from 'react';
import {
  Settings,
  Sliders,
  Shield,
  Building2,
  Users,
  Save,
  CheckCircle2,
  Lock,
  Layers,
  Info
} from 'lucide-react';
import { Batch, User, RuleConfig, Institution } from '../../types';
import { api } from '../../services/api';

interface SettingsPageProps {
  batches: Batch[];
  users: User[];
  institution: Institution | null;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  batches,
  users,
  institution,
}) => {
  const [rules, setRules] = useState<RuleConfig | null>(null);
  const [flagThreshold, setFlagThreshold] = useState<number>(50);
  const [minTests, setMinTests] = useState<number>(2);
  const [cohortRatio, setCohortRatio] = useState<number>(40);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    api.getRules()
      .then((r) => {
        setRules(r);
        setFlagThreshold(r.flag_threshold_pct);
        setMinTests(r.min_tests_required);
        setCohortRatio(Math.round(r.cohort_alert_ratio * 100));
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSaveRules = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      const updated = await api.updateRules({
        flag_threshold_pct: flagThreshold,
        min_tests_required: minTests,
        cohort_alert_ratio: cohortRatio / 100.0,
      });
      setRules(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert('Failed to update rules configuration');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Institution Configuration & Rules Engine
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Tune algorithmic sensitivity thresholds, review faculty permissions, and inspect privacy safeguards
        </p>
      </div>

      {/* Rules Engine Sensitivity Tuning Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="p-2 bg-teal-50 text-teal-700 rounded-lg">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Topic Gap Detection Sensitivity (Rules Engine)
            </h2>
            <p className="text-xs text-slate-500">
              Define the mathematical criteria for identifying learning gaps and recurring weaknesses
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Rules engine configuration updated successfully! Changes apply to all new evaluations.</span>
          </div>
        )}

        <form onSubmit={handleSaveRules} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <label className="font-bold text-slate-800 block mb-1">
                Benchmark Cut-Off Threshold (%):
              </label>
              <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
                Scores below this value are flagged as needing additional practice.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="30"
                  max="70"
                  step="5"
                  value={flagThreshold}
                  onChange={(e) => setFlagThreshold(Number(e.target.value))}
                  className="flex-1 accent-teal-600"
                />
                <span className="font-black text-sm text-teal-800 w-12 text-right">
                  {flagThreshold}%
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <label className="font-bold text-slate-800 block mb-1">
                Minimum Tests Before "Recurring" Flag:
              </label>
              <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
                Requires repeated evidence to avoid diagnosing based on a single bad day.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={minTests}
                  onChange={(e) => setMinTests(Number(e.target.value))}
                  className="w-20 p-2 rounded-lg border border-slate-300 font-bold text-slate-800"
                />
                <span className="text-slate-500">Assessments</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <label className="font-bold text-slate-800 block mb-1">
                Batch-Wide Alert Ratio (%):
              </label>
              <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
                If this percentage of the cohort struggles, whole-class workshop is triggered.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="20"
                  max="70"
                  step="5"
                  value={cohortRatio}
                  onChange={(e) => setCohortRatio(Number(e.target.value))}
                  className="flex-1 accent-teal-600"
                />
                <span className="font-black text-sm text-teal-800 w-12 text-right">
                  {cohortRatio}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs transition-colors shadow-xs flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Configuration Parameters'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Cohort Batches & Faculty Roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Batches */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Active Institutional Batches
            </h3>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {batches.map((b) => (
              <div key={b.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">{b.name}</span>
                  <span className="text-[10px] text-slate-400 block">{b.program} • Target {b.target_year}</span>
                </div>
                <span className="font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded">
                  {b.student_count || 0} Students
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Faculty Users */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Authorized Faculty & Coordinators
            </h3>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {users.map((u) => (
              <div key={u.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">{u.name}</span>
                  <span className="text-[10px] text-slate-400 block">{u.email}</span>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-50 text-teal-800">
                    {u.role}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {u.subject_specialization}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security & Data Privacy Statement */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-teal-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Data Privacy & Student Information Governance
          </h3>
        </div>
        <div className="text-xs text-slate-600 space-y-2 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p>
            • <b>Fictionalized Demo Data</b>: All student profiles, names, and test scores in this instance are strictly synthetic demonstration data for competitive coaching centres in Kurnool, AP.
          </p>
          <p>
            • <b>Zero Public Exposure</b>: Student records are never exposed via public URLs or unauthenticated search engines. Report downloads are restricted to authenticated institution users.
          </p>
          <p>
            • <b>Data Separation</b>: Institutional records are strictly scoped per coaching institution with audit logging for all assessment imports.
          </p>
        </div>
      </div>
    </div>
  );
};
