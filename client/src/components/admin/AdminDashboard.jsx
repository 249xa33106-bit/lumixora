import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, RefreshCw, LogOut, Eye, FileText, CheckCircle2, AlertCircle, ChevronDown, Sparkles } from 'lucide-react';
import MetricsCards from './MetricsCards';
import ApplicantDetailModal from './ApplicantDetailModal';
import { DOMAINS, DEGREES, GRADUATION_YEARS } from '../../constants/domains';

const STATUS_COLORS = {
  'Submitted': 'bg-blue-50 text-blue-700 border-blue-200',
  'Under Review': 'bg-amber-50 text-amber-700 border-amber-200',
  'Shortlisted': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Interview Scheduled': 'bg-purple-50 text-purple-700 border-purple-200',
  'Selected': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Rejected': 'bg-slate-100 text-slate-600 border-slate-200'
};

const ALL_STATUSES = [
  'Submitted',
  'Under Review',
  'Shortlisted',
  'Interview Scheduled',
  'Selected',
  'Rejected'
];

export default function AdminDashboard({ token, user, onLogout }) {
  const [applicants, setApplicants] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDegree, setSelectedDegree] = useState('All');
  const [selectedGradYear, setSelectedGradYear] = useState('All');

  // Selected applicant for full modal
  const [activeApplicant, setActiveApplicant] = useState(null);

  const fetchApplicants = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.set('search', search);
      if (selectedDomain !== 'All') queryParams.set('domain', selectedDomain);
      if (selectedStatus !== 'All') queryParams.set('status', selectedStatus);
      if (selectedDegree !== 'All') queryParams.set('degree', selectedDegree);
      if (selectedGradYear !== 'All') queryParams.set('graduationYear', selectedGradYear);

      const [resApps, resMetrics] = await Promise.all([
        fetch(`/api/admin/applicants?${queryParams.toString()}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/metrics', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (resApps.status === 401 || resMetrics.status === 401) {
        onLogout();
        return;
      }

      const dataApps = await resApps.json();
      const dataMetrics = await resMetrics.json();

      if (!resApps.ok) throw new Error(dataApps.message || 'Failed to fetch applicants');

      setApplicants(dataApps.applicants || []);
      setMetrics(dataMetrics.metrics || null);
    } catch (err) {
      setError(err.message || 'Error communicating with recruitment API.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [selectedDomain, selectedStatus, selectedDegree, selectedGradYear]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchApplicants();
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const handleExportCsv = () => {
    const queryParams = new URLSearchParams();
    if (selectedDomain !== 'All') queryParams.set('domain', selectedDomain);
    if (selectedStatus !== 'All') queryParams.set('status', selectedStatus);
    if (search) queryParams.set('search', search);

    window.open(`/api/admin/export-csv?${queryParams.toString()}&token=${token}`, '_blank');
  };

  const handleStatusChangeInline = async (appId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/applicants/${appId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setApplicants(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
        // Refresh metrics
        fetch('/api/admin/metrics', {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json()).then(d => { if (d.metrics) setMetrics(d.metrics); });
      }
    } catch (e) {
      alert('Failed to update status');
    }
  };

  const handleStatusUpdatedInModal = (appId, newStatus) => {
    setApplicants(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    fetch('/api/admin/metrics', {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json()).then(d => { if (d.metrics) setMetrics(d.metrics); });
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Admin Header Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Recruitment Administration
            </h1>
            <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full border border-emerald-100">
              Live Console
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as <strong className="text-slate-700">{user?.name || 'Recruiter'}</strong> ({user?.email}) • Lumixora Cohort 2026
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={fetchApplicants}
            title="Refresh candidate data"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export to CSV</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <MetricsCards metrics={metrics} />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Query */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, ID..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Domain Filter */}
          <div>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Domains (8)</option>
              {DOMAINS.map(d => (
                <option key={d.id} value={d.id}>{d.title}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Statuses (6)</option>
              {ALL_STATUSES.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Degree Filter */}
          <div>
            <select
              value={selectedDegree}
              onChange={(e) => setSelectedDegree(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Degrees</option>
              {DEGREES.map(deg => (
                <option key={deg} value={deg}>{deg}</option>
              ))}
            </select>
          </div>

          {/* Graduation Year */}
          <div>
            <select
              value={selectedGradYear}
              onChange={(e) => setSelectedGradYear(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Grad Years</option>
              {GRADUATION_YEARS.map(yr => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Applicants Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-900 text-sm">Applicant Records</span>
            <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
              {applicants.length} Total
            </span>
          </div>
          <span className="text-xs text-slate-400">Click any applicant to view full portfolio & notes</span>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Applied Domain</th>
                <th className="py-3 px-4">College & Degree</th>
                <th className="py-3 px-4">Arrangement</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applicants.length > 0 ? (
                applicants.map((app) => {
                  const photoFilename = app.personal?.photo?.filename;
                  const photoUrl = photoFilename
                    ? `/api/admin/files/photo/${photoFilename}?token=${token}`
                    : null;

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors group">
                      {/* Candidate Column */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          {photoUrl ? (
                            <img
                              src={photoUrl}
                              alt={app.personal?.fullName}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                              {app.personal?.fullName?.charAt(0) || 'A'}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {app.personal?.fullName}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {app.id} • {app.personal?.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Domain Column */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800 block">
                          {app.preferences?.preferredDomain}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {app.preferences?.duration}
                        </span>
                      </td>

                      {/* College Column */}
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <span className="font-medium text-slate-800 block truncate" title={app.education?.collegeName}>
                          {app.education?.collegeName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {app.education?.degree} • Grad {app.education?.graduationYear}
                        </span>
                      </td>

                      {/* Arrangement */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {app.preferences?.workingArrangement}
                        </span>
                      </td>

                      {/* Status & Inline changer */}
                      <td className="py-3.5 px-4">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChangeInline(app.id, e.target.value)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${
                            STATUS_COLORS[app.status] || 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {ALL_STATUSES.map(st => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setActiveApplicant(app)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Full Profile</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    No applicant records match the selected filters or search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Applicant Detail Modal */}
      {activeApplicant && (
        <ApplicantDetailModal
          applicant={activeApplicant}
          token={token}
          onClose={() => setActiveApplicant(null)}
          onStatusUpdated={handleStatusUpdatedInModal}
        />
      )}
    </div>
  );
}
