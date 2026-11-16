import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Clock, 
  Activity, 
  Search, 
  RefreshCw, 
  Download, 
  FileSpreadsheet, 
  Laptop, 
  Smartphone, 
  CheckCircle2, 
  Building2, 
  Filter,
  GraduationCap,
  Award,
  Calendar,
  ExternalLink
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { 
  fetchAllLoginLogs, 
  formatTimeAgo, 
  formatDuration, 
  deriveUserRoleMeta 
} from '../services/userActivityLogService';
import { useToast } from '../context/ToastContext';

export default function FounderLoginAuditManager() {
  const { addToast } = useToast();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'student' | 'tpo' | 'faculty' | 'active'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPortal, setSelectedPortal] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all'); // 'all' | 'today' | '7days'

  // Load audit logs on mount
  const loadLogs = async (showToast = false) => {
    setIsRefreshing(true);
    try {
      const data = await fetchAllLoginLogs();
      setLogs(data);
      if (showToast) {
        addToast({ message: `Synchronized ${data.length} live user & officer login sessions.`, type: 'success' });
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
      if (showToast) {
        addToast({ message: 'Failed to synchronize live logs.', type: 'error' });
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadLogs(false);
    // Poll every 30 seconds for live session telemetry updates
    const interval = setInterval(() => {
      loadLogs(false);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filtered logs computation
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // 1. Category Tab Filter
      if (activeCategory === 'student' && log.role !== 'student') return false;
      if (activeCategory === 'tpo' && log.role !== 'tpo') return false;
      if (activeCategory === 'faculty' && log.role !== 'faculty') return false;
      if (activeCategory === 'active') {
        const isRecentlyActive = (Date.now() - (log.lastActiveAt || log.loginTimestamp)) < 15 * 60 * 1000;
        if (!isRecentlyActive && log.status !== 'active') return false;
      }

      // 2. Portal Filter
      if (selectedPortal !== 'all' && log.portal !== selectedPortal) return false;

      // 3. Time Filter
      if (timeFilter === 'today') {
        const today = new Date().toDateString();
        const logDate = new Date(log.loginTimestamp).toDateString();
        if (today !== logDate) return false;
      } else if (timeFilter === '7days') {
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        if (log.loginTimestamp < sevenDaysAgo) return false;
      }

      // 4. Search Filter (Name, Email, Roll Number, Department)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = log.name?.toLowerCase().includes(q);
        const matchEmail = log.email?.toLowerCase().includes(q);
        const matchRoll = log.rollNumber?.toLowerCase().includes(q);
        const matchDept = log.department?.toLowerCase().includes(q);
        const matchPortal = log.portal?.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchRoll && !matchDept && !matchPortal) return false;
      }

      return true;
    });
  }, [logs, activeCategory, selectedPortal, timeFilter, searchQuery]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const total = logs.length;
    const now = Date.now();
    const active = logs.filter(l => (now - (l.lastActiveAt || l.loginTimestamp)) < 15 * 60 * 1000 || l.status === 'active').length;
    const tpo = logs.filter(l => l.role === 'tpo').length;
    const faculty = logs.filter(l => l.role === 'faculty').length;
    const students = logs.filter(l => l.role === 'student').length;
    
    // Average session duration
    const durSum = logs.reduce((acc, curr) => acc + (curr.durationSeconds || 0), 0);
    const avgSec = total > 0 ? Math.round(durSum / total) : 0;

    return { total, active, tpo, faculty, students, avgSec };
  }, [logs]);

  // Export to Excel
  const handleExportExcel = () => {
    try {
      const exportRows = filteredLogs.map(l => ({
        'Session ID': l.sessionId || l.id,
        'Name': l.name,
        'Email': l.email,
        'Role': l.roleTitle || l.role,
        'College': l.college,
        'Department': l.department,
        'Roll Number / Designation': l.rollNumber || 'N/A',
        'Portal Accessed': l.portal,
        'Login Time': l.loginTimeFormatted,
        'Time Ago': formatTimeAgo(l.loginTimestamp),
        'Session Duration (Sec)': l.durationSeconds || 0,
        'Session Duration (Formatted)': formatDuration(l.durationSeconds, l.status === 'active'),
        'Device Type': l.deviceType,
        'Status': l.status === 'active' ? 'Active Now' : 'Session Completed'
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportRows);
      XLSX.utils.book_append_sheet(wb, ws, 'Login_Audit_Logs');
      XLSX.writeFile(wb, `Lumixora_Login_Audit_Logs_${new Date().toISOString().slice(0, 10)}.xlsx`);
      addToast({ message: 'Audit logs exported to Excel (.xlsx) successfully.', type: 'success' });
    } catch (e) {
      addToast({ message: 'Failed to export Excel report.', type: 'error' });
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    try {
      const headers = ['Session ID,Name,Email,Role,College,Department,Roll Number,Portal,Login Time,Duration,Device,Status'];
      const rows = filteredLogs.map(l => [
        `"${l.sessionId || l.id}"`,
        `"${(l.name || '').replace(/"/g, '""')}"`,
        `"${l.email}"`,
        `"${l.roleTitle || l.role}"`,
        `"${l.college || ''}"`,
        `"${l.department || ''}"`,
        `"${l.rollNumber || ''}"`,
        `"${l.portal || ''}"`,
        `"${l.loginTimeFormatted || ''}"`,
        `"${formatDuration(l.durationSeconds, l.status === 'active')}"`,
        `"${l.deviceType || ''}"`,
        `"${l.status || ''}"`
      ].join(','));

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Lumixora_Login_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addToast({ message: 'Audit logs exported to CSV successfully.', type: 'success' });
    } catch (e) {
      addToast({ message: 'Failed to export CSV report.', type: 'error' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-white pb-12">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0B132B] via-[#111C44] to-[#0B132B] border border-[#C5A059]/40 shadow-xl shadow-black/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="p-2.5 rounded-xl bg-[#C5A059]/15 border border-[#C5A059]/35 text-[#C5A059] shadow-inner">
              <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
            </div>
            <h2 className="text-xl font-black text-white font-sora tracking-tight">
              Login Activity & Time Log Audit Center
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Live Tracking
            </span>
          </div>
          <p className="text-xs text-slate-200 max-w-2xl leading-relaxed font-normal">
            Real-time multi-tenant telemetry tracking logins, session durations, and timestamps for all Scholars, TPO Placement Officers, and Faculty across GPREC & Lumixora.
          </p>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => loadLogs(true)}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-semibold text-slate-100 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
            title="Refresh live activity feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#C5A059]' : 'text-slate-300'}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Live'}</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-xs font-bold text-emerald-300 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            title="Export all logs to Excel spreadsheet"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel (.xlsx)</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-[#C5A059]/20 hover:bg-[#C5A059]/30 border border-[#C5A059]/40 text-xs font-bold text-[#E5C158] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            title="Export to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Real-time Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-xl bg-[#0B132B] border border-white/10 hover:border-[#C5A059]/40 transition-all flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Logins</span>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-white">{metrics.total}</div>
          <div className="text-[11px] text-slate-400 mt-1">Recorded audit events</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0B132B] border border-emerald-500/30 hover:border-emerald-500/50 transition-all flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-semibold">Active Right Now</span>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          </div>
          <div className="text-2xl font-black text-emerald-400">{metrics.active}</div>
          <div className="text-[11px] text-emerald-400/80 mt-1">Live active sessions</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0B132B] border border-blue-500/30 hover:border-blue-500/50 transition-all flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-blue-400 mb-2">
            <span className="text-xs font-semibold">TPO Officers</span>
            <Building2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-300">{metrics.tpo}</div>
          <div className="text-[11px] text-blue-400/80 mt-1">Dean & Coordinators</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0B132B] border border-purple-500/30 hover:border-purple-500/50 transition-all flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-purple-400 mb-2">
            <span className="text-xs font-semibold">Faculty & Mentors</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300">{metrics.faculty}</div>
          <div className="text-[11px] text-purple-400/80 mt-1">Faculty & Mentorship</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0B132B] border border-[#C5A059]/35 hover:border-[#C5A059]/60 transition-all flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-[#C5A059] mb-2">
            <span className="text-xs font-semibold">Avg Session Time</span>
            <Clock className="w-4 h-4 text-[#C5A059]" />
          </div>
          <div className="text-2xl font-black text-[#E5C158]">{formatDuration(metrics.avgSec)}</div>
          <div className="text-[11px] text-[#C5A059]/80 mt-1">Per active session</div>
        </div>
      </div>

      {/* Role Category Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#C5A059] text-[#0B132B] shadow-md shadow-[#C5A059]/20'
                : 'bg-[#0B132B] text-slate-300 hover:bg-[#111C44] border border-white/10'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>All Sessions</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeCategory === 'all' ? 'bg-[#0B132B]/20 text-[#0B132B] font-black' : 'bg-white/10 text-slate-300'}`}>
              {metrics.total}
            </span>
          </button>

          <button
            onClick={() => setActiveCategory('student')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeCategory === 'student'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-[#0B132B] text-slate-300 hover:bg-[#111C44] border border-white/10'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Scholars / Students</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeCategory === 'student' ? 'bg-slate-950/20 text-slate-950 font-black' : 'bg-white/10 text-slate-300'}`}>
              {metrics.students}
            </span>
          </button>

          <button
            onClick={() => setActiveCategory('tpo')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeCategory === 'tpo'
                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                : 'bg-[#0B132B] text-slate-300 hover:bg-[#111C44] border border-white/10'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>TPO Officers</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeCategory === 'tpo' ? 'bg-black/20 text-white font-black' : 'bg-white/10 text-slate-300'}`}>
              {metrics.tpo}
            </span>
          </button>

          <button
            onClick={() => setActiveCategory('faculty')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeCategory === 'faculty'
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                : 'bg-[#0B132B] text-slate-300 hover:bg-[#111C44] border border-white/10'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Faculty & Mentors</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeCategory === 'faculty' ? 'bg-black/20 text-white font-black' : 'bg-white/10 text-slate-300'}`}>
              {metrics.faculty}
            </span>
          </button>

          <button
            onClick={() => setActiveCategory('active')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeCategory === 'active'
                ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/20'
                : 'bg-[#0B132B] text-slate-300 hover:bg-[#111C44] border border-white/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Active Now</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeCategory === 'active' ? 'bg-slate-950/20 text-slate-950 font-black' : 'bg-white/10 text-slate-300'}`}>
              {metrics.active}
            </span>
          </button>
        </div>

        {/* Portal Filter Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedPortal}
            onChange={(e) => setSelectedPortal(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#0B132B] border border-white/15 text-xs text-slate-200 focus:outline-none focus:border-[#C5A059]"
          >
            <option value="all">All Portals</option>
            <option value="Placement Suite">Placement Suite (gprec.lumixora.in)</option>
            <option value="TPO Admin Portal">TPO Admin Portal (tpo.lumixora.in)</option>
            <option value="TPO Operations Suite">TPO Operations Suite</option>
            <option value="Main Platform">Main Platform (lumixora.in)</option>
            <option value="BoloClass">BoloClass AI Classroom</option>
            <option value="Course Platform">Courses & Diplomas</option>
          </select>

          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#0B132B] border border-white/15 text-xs text-slate-200 focus:outline-none focus:border-[#C5A059]"
          >
            <option value="all">All Time</option>
            <option value="today">Today Only</option>
            <option value="7days">Last 7 Days</option>
          </select>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by student name, roll number, officer email (e.g. dean.placements@gprec.ac.in), branch..."
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0B132B] border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#C5A059] transition-all shadow-sm"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Login History & Time Logs Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0B132B] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111C44] text-slate-200 uppercase tracking-wider text-[10px] font-bold border-b border-white/10">
              <tr>
                <th className="px-5 py-3.5">User Profile & Identity</th>
                <th className="px-5 py-3.5">Role / Institutional Scope</th>
                <th className="px-5 py-3.5">Portal Accessed</th>
                <th className="px-5 py-3.5">Login Time & Timestamp</th>
                <th className="px-5 py-3.5">Session Time Log</th>
                <th className="px-5 py-3.5">Device & Environment</th>
                <th className="px-5 py-3.5">Live Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin text-amber-400 mx-auto mb-2" />
                    <span>Loading real-time login audit telemetry...</span>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-500" />
                    <p className="text-sm font-semibold text-slate-400">No login records found matching criteria.</p>
                    <p className="text-xs text-slate-500 mt-1">Try clearing your search query or switching tabs.</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((item) => {
                  const roleMeta = deriveUserRoleMeta(item);
                  const isRecentlyActive = (Date.now() - (item.lastActiveAt || item.loginTimestamp)) < 15 * 60 * 1000;
                  const isLive = item.status === 'active' || isRecentlyActive;

                  return (
                    <tr 
                      key={item.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      {/* 1. User Identity */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            item.role === 'tpo' 
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                              : item.role === 'faculty' 
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : item.role === 'founder'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {item.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs flex items-center gap-1.5">
                              <span>{item.name}</span>
                              {item.role === 'tpo' && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                  TPO
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                              {item.email}
                            </div>
                            {item.rollNumber && item.rollNumber !== 'GPREC-OFFICER' && (
                              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                Roll: {item.rollNumber}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* 2. Role & Department */}
                      <td className="px-5 py-3.5">
                        <div>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${roleMeta.badgeClass}`}>
                            {item.roleTitle || roleMeta.title}
                          </span>
                          <div className="text-[11px] text-slate-300 font-medium mt-1">
                            {item.department || 'General'}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {item.collegeCode || 'GPREC'}
                          </div>
                        </div>
                      </td>

                      {/* 3. Portal Accessed */}
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-semibold text-slate-300 inline-block">
                          {item.portal || 'Placement Suite'}
                        </span>
                      </td>

                      {/* 4. Login Time */}
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-slate-200">
                          {item.loginTimeFormatted}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{formatTimeAgo(item.loginTimestamp)}</span>
                        </div>
                      </td>

                      {/* 5. Session Time Log */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-mono font-bold text-xs ${isLive ? 'text-emerald-400' : 'text-slate-300'}`}>
                            {formatDuration(item.durationSeconds, isLive)}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {isLive ? 'Heartbeat Active' : 'Session Duration'}
                        </div>
                      </td>

                      {/* 6. Device & Environment */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-slate-300 font-medium text-[11px]">
                          {item.deviceType === 'Mobile' ? (
                            <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                          ) : (
                            <Laptop className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          <span>{item.deviceType || 'Desktop'}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[150px]" title={item.userAgent}>
                          {item.userAgent || 'Chrome / Edge'}
                        </div>
                      </td>

                      {/* 7. Live Status */}
                      <td className="px-5 py-3.5">
                        {isLive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Active Now
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400 border border-white/5">
                            <CheckCircle2 className="w-3 h-3 text-slate-500" />
                            Concluded
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-white/[0.02] border-t border-white/5 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <span>Showing <strong>{filteredLogs.length}</strong> of <strong>{logs.length}</strong> total session records</span>
          <span className="text-[11px] text-slate-500">Auto-synchronized with Firestore & Supabase session telemetry</span>
        </div>
      </div>
    </div>
  );
}
