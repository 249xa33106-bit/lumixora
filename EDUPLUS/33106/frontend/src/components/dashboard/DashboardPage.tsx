import React from 'react';
import {
  Users,
  FileCheck2,
  TrendingUp,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  ShieldAlert,
  Award
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Cell
} from 'recharts';
import { DashboardSummary, TopicGap } from '../../types';

interface DashboardPageProps {
  summary: DashboardSummary | null;
  topicGaps: TopicGap[];
  onNavigateTab: (tab: string) => void;
  selectedBatchName?: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  summary,
  topicGaps,
  onNavigateTab,
  selectedBatchName,
}) => {
  if (!summary) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-slate-500">
          <div className="animate-spin w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sm">Loading EduPulse Dashboard Intelligence...</p>
        </div>
      </div>
    );
  }

  const kpis = [
    {
      title: 'Enrolled Students',
      value: summary.total_students,
      suffix: '',
      subtitle: selectedBatchName ? `In ${selectedBatchName}` : 'Across 3 Coaching Batches',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
    },
    {
      title: 'Tests Conducted',
      value: summary.total_tests_conducted,
      suffix: '',
      subtitle: 'Baseline, Weekly & Reassessments',
      icon: FileCheck2,
      color: 'text-slate-700',
      bgColor: 'bg-slate-100',
      borderColor: 'border-slate-200',
    },
    {
      title: 'Average Cohort Score',
      value: `${summary.overall_avg_score}%`,
      suffix: '',
      subtitle: 'Benchmark Passing: 50.0%',
      icon: Award,
      color: 'text-teal-700',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
    },
    {
      title: 'Topics Needing Attention',
      value: summary.topics_needing_attention,
      suffix: '',
      subtitle: `${topicGaps.filter((g) => g.is_recurring).length} Recurring Patterns`,
      icon: AlertTriangle,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      onClick: () => onNavigateTab('topics'),
    },
    {
      title: 'Pending Interventions',
      value: summary.pending_teacher_actions,
      suffix: '',
      subtitle: `${summary.completed_interventions} Interventions Completed`,
      icon: Clock,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      onClick: () => onNavigateTab('actions'),
    },
    {
      title: 'Post-Intervention Delta',
      value: `+${summary.avg_observed_improvement}%`,
      suffix: '',
      subtitle: 'Observed Average Score Gain',
      icon: TrendingUp,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      highlight: true,
      onClick: () => onNavigateTab('interventions'),
    },
  ];

  // Batch chart data
  const batchChartData = summary.batch_performance.map((b) => ({
    name: b.batch_name.replace('-2026', ''),
    avgScore: b.avg_score_pct,
    students: b.student_count,
  }));

  // Improvement outcome breakdown data
  const outcomeData = [
    { name: 'Marked (>15%)', count: summary.improvement_breakdown.marked_improvement, color: '#059669' },
    { name: 'Moderate (5-15%)', count: summary.improvement_breakdown.moderate_improvement, color: '#10B981' },
    { name: 'Stable (±5%)', count: summary.improvement_breakdown.stable, color: '#64748B' },
    { name: 'Needs Review (<-5%)', count: summary.improvement_breakdown.needs_review, color: '#E11D48' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Platform Philosophy */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-navy p-6 rounded-2xl text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-2 border border-teal-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Test-to-Action Operational Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Apex Academy Assessment Intelligence
          </h1>
          <p className="text-slate-300 text-xs mt-1 max-w-2xl leading-relaxed">
            Every test should lead to a better next step. Automatically bridge the gap between exam marks
            and targeted teacher actions in Kurnool classrooms.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('actions')}
            className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-md shadow-teal-500/20"
          >
            <span>Open Action Centre</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={kpi.onClick}
              className={`bg-white p-4 rounded-xl border ${kpi.borderColor} shadow-2xs transition-all ${
                kpi.onClick ? 'cursor-pointer hover:shadow-md hover:border-teal-400' : ''
              } ${kpi.highlight ? 'ring-2 ring-emerald-500/30' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  {kpi.title}
                </span>
                <div className={`p-1.5 rounded-lg ${kpi.bgColor} ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {kpi.value}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 truncate">
                {kpi.subtitle}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Charts & Gap Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Performance by Batch & Intervention Impact */}
        <div className="lg:col-span-2 space-y-6">
          {/* Batch Performance Chart */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Cohort Average Mastery Benchmark
                </h3>
                <p className="text-xs text-slate-500">
                  Comparison across JEE, NEET, and EAPCET program batches
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">
                Threshold: 50%
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={batchChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#FFF', fontSize: '12px' }}
                    formatter={(val: any) => [`${val}%`, 'Cohort Average']}
                  />
                  <Bar dataKey="avgScore" radius={[6, 6, 0, 0]}>
                    {batchChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.avgScore >= 60 ? '#0D9488' : entry.avgScore >= 50 ? '#3B82F6' : '#F59E0B'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Intervention Outcomes Distribution */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Intervention Evaluation Distribution
                </h3>
                <p className="text-xs text-slate-500">
                  Observed student score progression following completed teacher actions
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('interventions')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                <span>View All Evaluations</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {outcomeData.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                  <div className="text-xs text-slate-500 font-medium mb-1 truncate">
                    {item.name}
                  </div>
                  <div className="text-xl font-bold" style={{ color: item.color }}>
                    {item.count}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Students</div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 italic mt-3 bg-slate-50/80 p-2 rounded border border-slate-100">
              * Note: Improvement represents observed score change on subsequent assessments, not guaranteed causation.
            </p>
          </div>
        </div>

        {/* Right Col: Priority Learning Gap Alerts & Recent Activity */}
        <div className="space-y-6">
          {/* Urgent Topic Gaps */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Actionable Topic Alerts
                </h3>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                {topicGaps.length} Found
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Topics with recurring low scores detected by rules engine:
            </p>

            <div className="space-y-3">
              {topicGaps.slice(0, 4).map((gap, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-100/70 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">
                          {gap.topic_name}
                        </span>
                        {gap.is_recurring && (
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-rose-100 text-rose-700">
                            Recurring
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {gap.subject_name} • {gap.batch_name}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-rose-600">
                        {gap.avg_score_pct}%
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {gap.students_impacted} students
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 mt-2 line-clamp-2 leading-relaxed bg-white p-1.5 rounded border border-slate-200/60">
                    {gap.reason}
                  </p>

                  <div className="mt-2 flex items-center justify-between pt-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">
                      Next Step: {gap.recommended_action_type.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => onNavigateTab('actions')}
                      className="text-[11px] font-bold text-teal-700 hover:text-teal-900 flex items-center gap-0.5"
                    >
                      <span>Assign</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigateTab('topics')}
              className="w-full mt-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-center"
            >
              Explore Full Topic Matrix
            </button>
          </div>

          {/* Recent Platform Activity */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Recent Institutional Activity
            </h3>
            <div className="space-y-3">
              {summary.recent_activity.map((act) => (
                <div key={act.id} className="flex items-start gap-2.5 text-xs">
                  <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800 leading-tight">
                      {act.title}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{act.batch}</span>
                      <span>•</span>
                      <span>{act.time}</span>
                      {act.delta && (
                        <span className="font-bold text-emerald-600 bg-emerald-50 px-1 rounded">
                          {act.delta}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
