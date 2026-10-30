import React from 'react';
import { Users, Clock, CheckCircle2, Calendar, Award, XCircle } from 'lucide-react';

export default function MetricsCards({ metrics }) {
  if (!metrics) return null;

  const total = metrics.total || 0;
  const statusCounts = metrics.statusCounts || {};

  const cards = [
    {
      label: 'Total Applicants',
      value: total,
      sub: `${metrics.recentCount || 0} this week`,
      icon: Users,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-100'
    },
    {
      label: 'Under Review',
      value: statusCounts['Under Review'] || 0,
      sub: 'Screening in progress',
      icon: Clock,
      color: 'bg-amber-50 text-amber-700 border-amber-100'
    },
    {
      label: 'Shortlisted',
      value: statusCounts['Shortlisted'] || 0,
      sub: 'Passed initial screening',
      icon: CheckCircle2,
      color: 'bg-blue-50 text-blue-700 border-blue-100'
    },
    {
      label: 'Interview Scheduled',
      value: statusCounts['Interview Scheduled'] || 0,
      sub: 'Assessment rounds active',
      icon: Calendar,
      color: 'bg-purple-50 text-purple-700 border-purple-100'
    },
    {
      label: 'Selected',
      value: statusCounts['Selected'] || 0,
      sub: 'Offers extended',
      icon: Award,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-100'
    },
    {
      label: 'Rejected',
      value: statusCounts['Rejected'] || 0,
      sub: 'Archived records',
      icon: XCircle,
      color: 'bg-slate-50 text-slate-600 border-slate-200'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map(card => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                {card.label}
              </span>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${card.color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{card.value}</div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">{card.sub}</div>
          </div>
        );
      })}
    </div>
  );
}
