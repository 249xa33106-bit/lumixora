import React from 'react';
import {
  Building2,
  Filter,
  UserCheck,
  PlusCircle,
  Upload,
  CheckCircle2,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { Batch, User } from '../../types';

interface TopNavProps {
  batches: Batch[];
  selectedBatchId: number | null;
  onSelectBatch: (id: number | null) => void;
  users: User[];
  currentUser: User | null;
  onSwitchUser: (user: User) => void;
  onQuickImport: () => void;
  onQuickAction: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  batches,
  selectedBatchId,
  onSelectBatch,
  users,
  currentUser,
  onSwitchUser,
  onQuickImport,
  onQuickAction,
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10 shadow-xs">
      {/* Left: Institution Context & Batch Selector */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2.5 text-slate-800">
          <div className="p-1.5 bg-slate-100 rounded-lg text-slate-700">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-900 leading-tight">
              Apex Academy of Sciences
            </div>
            <div className="text-[11px] text-slate-500">
              Kurnool Centre • AP
            </div>
          </div>
        </div>

        <div className="h-5 w-[1px] bg-slate-200" />

        {/* Batch Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-medium text-slate-500">Cohort:</span>
          <select
            value={selectedBatchId === null ? 'all' : selectedBatchId}
            onChange={(e) => {
              const val = e.target.value;
              onSelectBatch(val === 'all' ? null : Number(val));
            }}
            className="text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 cursor-pointer transition-colors"
          >
            <option value="all">All Batches (32 Students)</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.program})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: Actions & Role Switcher */}
      <div className="flex items-center gap-3">
        {/* Quick Action Buttons */}
        <button
          onClick={onQuickImport}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs"
        >
          <Upload className="w-3.5 h-3.5 text-slate-500" />
          <span>Import CSV</span>
        </button>

        <button
          onClick={onQuickAction}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition-colors shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Intervention</span>
        </button>

        <div className="h-5 w-[1px] bg-slate-200 mx-1" />

        {/* Role Switcher */}
        <div className="relative flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
          <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
            {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900 leading-none">
                {currentUser?.name || 'Academic Coordinator'}
              </span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-teal-100 text-teal-800">
                {currentUser?.role || 'Coordinator'}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 leading-tight">
              {currentUser?.subject_specialization || 'Academic Administration'}
            </div>
          </div>

          <div className="ml-2 pl-2 border-l border-slate-200">
            <select
              value={currentUser?.id || 1}
              onChange={(e) => {
                const targetId = Number(e.target.value);
                const found = users.find((u) => u.id === targetId);
                if (found) onSwitchUser(found);
              }}
              className="text-xs text-slate-600 bg-transparent font-medium focus:outline-hidden cursor-pointer"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  Switch to: {u.name} ({u.role.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
