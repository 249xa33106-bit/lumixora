import React, { useState } from 'react';
import {
  Layers,
  AlertTriangle,
  Info,
  HelpCircle,
  Sparkles,
  ArrowRight,
  TrendingDown,
  CheckCircle,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { TopicGap } from '../../types';

interface TopicAnalysisPageProps {
  topicGaps: TopicGap[];
  onTriggerAction: (gap: TopicGap) => void;
  onNavigateTab: (tab: string) => void;
}

export const TopicAnalysisPage: React.FC<TopicAnalysisPageProps> = ({
  topicGaps,
  onTriggerAction,
  onNavigateTab,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'recurring' | 'preliminary'>('all');

  const filteredGaps = topicGaps.filter((g) => {
    if (filterType === 'recurring') return g.is_recurring;
    if (filterType === 'preliminary') return !g.is_recurring;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Transparent Topic Gap Intelligence
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Rule-based detection distinguishing recurring concept struggles from isolated test variations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('settings')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>Configure Rule Thresholds</span>
          </button>
        </div>
      </div>

      {/* Rules Engine Explanatory Banner */}
      <div className="bg-teal-50/60 border border-teal-200/80 rounded-xl p-4 text-xs text-teal-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold">Transparent Rules Engine Methodology:</span>
          <p className="text-teal-800 leading-relaxed">
            EduPulse evaluates topic performance across multiple consecutive assessments. A topic is flagged as a 
            <b className="font-semibold"> “Recurring Gap”</b> only when student average drops below the institutional threshold (50.0%) across at least 2 distinct tests. 
            Single-test drops are classified as <b className="font-semibold">“Preliminary”</b> to prevent knee-jerk overreactions without sufficient sample size.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
        <span className="text-slate-400 font-medium px-2">Show:</span>
        {[
          { id: 'all', label: `All Flagged Topics (${topicGaps.length})` },
          { id: 'recurring', label: `Recurring Gaps (${topicGaps.filter((g) => g.is_recurring).length})` },
          { id: 'preliminary', label: `Preliminary / Single Test (${topicGaps.filter((g) => !g.is_recurring).length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterType === tab.id
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Topic Gap Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGaps.map((gap, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {gap.topic_name}
                    </h3>
                    {gap.is_recurring ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-100 text-rose-800 border border-rose-200">
                        Recurring Pattern
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200">
                        Preliminary Observation
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {gap.subject_name} • Batch: <span className="font-semibold text-slate-700">{gap.batch_name}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-black text-rose-600">
                    {gap.avg_score_pct}%
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Batch Average
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100 mb-3 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-medium">Tests Conducted</span>
                  <div className="text-xs font-bold text-slate-800">{gap.tests_conducted}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-medium">Students Impacted</span>
                  <div className="text-xs font-bold text-slate-800">
                    {gap.students_impacted} / {gap.total_batch_students} ({gap.impact_percentage}%)
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-medium">Confidence Level</span>
                  <div className="text-xs font-bold text-teal-800">{gap.confidence_level}</div>
                </div>
              </div>

              {/* Transparent Rationale Box */}
              <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-200/70 mb-4">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 mb-1">
                  <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
                  <span>Why was this topic flagged?</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {gap.reason}
                </p>
              </div>
            </div>

            {/* Action Callout */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-medium block">
                  Recommended Learning Intervention:
                </span>
                <span className="text-xs font-bold text-slate-800 capitalize">
                  {gap.recommended_action_type.replace('_', ' ')}
                </span>
              </div>

              <button
                onClick={() => onTriggerAction(gap)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create Action</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
