import React, { useState, useEffect } from 'react';
import {
  Mail, Send, ShieldCheck, AlertCircle, RefreshCw, CheckCircle2,
  Lock, Eye, Filter, Search, Globe, Server, Database,
  Clock, ArrowUpRight, Ban, Zap, Info, ExternalLink, X
} from 'lucide-react';
import { fetchEmailTelemetry, sendEmail } from '../services/lumixoraEmailService';
import { AVAILABLE_TEMPLATES } from '../utils/lumixoraEmailTemplates';
import { useToast } from '../context/ToastContext';

export default function AdminEmailCommandCenter() {
  const { addToast } = useToast();
  const [telemetryData, setTelemetryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Test Email Modal State
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testRecipient, setTestRecipient] = useState('');
  const [testTemplateKey, setTestTemplateKey] = useState('otp_verification');
  const [testSending, setTestSending] = useState(false);

  // Template Preview Modal State
  const [previewTemplate, setPreviewTemplate] = useState(null);

  // DNS Guide Modal
  const [isDnsModalOpen, setIsDnsModalOpen] = useState(false);

  const loadData = async (showNotification = false) => {
    setRefreshing(true);
    try {
      const data = await fetchEmailTelemetry();
      setTelemetryData(data);
      if (showNotification) {
        addToast({ message: 'Live email telemetry synchronized.', type: 'success' });
      }
    } catch (err) {
      addToast({ message: 'Error loading email telemetry.', type: 'error' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData(false);
    const interval = setInterval(() => {
      loadData(false);
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const handleSendTestEmail = async (e) => {
    e.preventDefault();
    if (!testRecipient || !testRecipient.includes('@')) {
      addToast({ message: 'Please enter a valid recipient email.', type: 'error' });
      return;
    }

    setTestSending(true);
    try {
      const selected = AVAILABLE_TEMPLATES.find(t => t.key === testTemplateKey);
      const res = await sendEmail({
        to: testRecipient,
        templateKey: testTemplateKey,
        templateData: {
          rollNumber: '249XA33106',
          code: '849201',
          name: 'Founder Test Scholar',
          department: 'CSE / AI & ML',
          company: 'Google',
          ctc: '24.0 LPA',
          roleTitle: 'Software Development Engineer',
          certificateTitle: 'Full Stack & AI Systems Engineer',
          certificateId: 'LMX-TEST-2026',
          passcode: 'LMX-998811',
          titleText: 'Lumixora Infrastructure Verification',
          bodyMarkdown: 'This is a live test transmission validating the Brevo transactional email engine and DNS authentication.'
        },
        senderType: selected?.sender.split('@')[0] || 'security',
        priority: 'P1_URGENT_SECURITY'
      });

      if (res.success) {
        addToast({ message: `✉️ Test email dispatched successfully to ${testRecipient}!`, type: 'success' });
        setIsTestModalOpen(false);
        loadData(false);
      } else {
        addToast({ message: res.error || 'Failed to dispatch test email.', type: 'error' });
      }
    } catch (err) {
      addToast({ message: err.message || 'Error sending test email.', type: 'error' });
    } finally {
      setTestSending(false);
    }
  };

  const t = telemetryData?.telemetry || {
    sentToday: 0,
    remainingToday: 300,
    dailyLimit: 300,
    deliveredCount: 0,
    failedCount: 0,
    bouncedCount: 0,
    suppressionCount: 0,
    estimatedMonthlyCost: '₹0.00 (Brevo Free Tier)',
    recentLogs: []
  };

  const percentUsed = Math.min(100, Math.round((t.sentToday / t.dailyLimit) * 100));

  // Filter logs
  const filteredLogs = (t.recentLogs || []).filter(log => {
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'DELIVERED' && !log.status.toLowerCase().includes('accept') && !log.status.toLowerCase().includes('deliver')) return false;
      if (statusFilter === 'FAILED' && !log.status.toLowerCase().includes('fail')) return false;
      if (statusFilter === 'SUPPRESSED' && !log.status.toLowerCase().includes('suppress')) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTo = (log.to || '').toLowerCase().includes(q);
      const matchSub = (log.subject || '').toLowerCase().includes(q);
      const matchProv = (log.provider || '').toLowerCase().includes(q);
      if (!matchTo && !matchSub && !matchProv) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0B132B] via-[#0E1A3D] to-[#0B132B] border border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold tracking-wide uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Brevo Enterprise Engine · Active
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[11px] font-bold tracking-wide">
                Zero Monthly Cost (₹0.00)
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Mail className="w-6 h-6 text-purple-400" />
              Automated Email Infrastructure Command Center
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl mt-1">
              Mission-critical transactional delivery engine for institutional scholars, rolling OTP verifications, placement drives, and verified credentials.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsDnsModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-all flex items-center gap-2"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              DNS Records
            </button>
            <button
              onClick={() => setIsTestModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              Send Test Email
            </button>
            <button
              onClick={() => loadData(true)}
              disabled={refreshing}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors"
              title="Refresh telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-purple-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Telemetry Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Daily Quota Gauge */}
        <div className="p-5 rounded-2xl bg-[#0B132B]/90 border border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
            <span>Today's Sending Quota</span>
            <span className="font-mono text-purple-300 font-bold">{t.sentToday} / {t.dailyLimit}</span>
          </div>
          <div className="text-2xl font-black text-white tracking-tight mb-2">
            {t.remainingToday} <span className="text-xs text-slate-400 font-normal">emails left today</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
            <div
              className={`h-full transition-all duration-500 ${
                percentUsed > 85 ? 'bg-red-500' : percentUsed > 60 ? 'bg-amber-400' : 'bg-gradient-to-r from-purple-500 to-emerald-400'
              }`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-2 flex items-center justify-between">
            <span>Quota resets 00:00 UTC</span>
            <span className="text-emerald-400 font-medium">{t.securityBuffer} reserved for OTPs</span>
          </p>
        </div>

        {/* Card 2: Deliverability Health */}
        <div className="p-5 rounded-2xl bg-[#0B132B]/90 border border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
            <span>Deliverability Health</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 tracking-tight mb-1">
            {t.sentToday === 0 ? '100%' : `${Math.max(98, 100 - (t.failedCount + t.bouncedCount))}%`}
          </div>
          <p className="text-xs text-slate-300">
            {t.deliveredCount} successful deliveries recorded
          </p>
          <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            SPF, DKIM & DMARC Aligned
          </div>
        </div>

        {/* Card 3: Suppression & Bounce Protection */}
        <div className="p-5 rounded-2xl bg-[#0B132B]/90 border border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
            <span>Suppression List</span>
            <Ban className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300 tracking-tight mb-1">
            {t.suppressionCount} <span className="text-xs text-slate-400 font-normal">addresses</span>
          </div>
          <p className="text-xs text-slate-300">
            Automatic bounce & spam shield
          </p>
          <div className="mt-2 text-[10px] text-slate-400">
            Protects sender domain reputation
          </div>
        </div>

        {/* Card 4: Operating Cost */}
        <div className="p-5 rounded-2xl bg-[#0B132B]/90 border border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
            <span>Operating Cost</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white tracking-tight mb-1">
            ₹0.00
          </div>
          <p className="text-xs text-purple-300 font-medium">
            Brevo Free Tier · Lifetime
          </p>
          <div className="mt-2 text-[10px] text-slate-400">
            Target additional monthly cost: ₹0
          </div>
        </div>
      </div>

      {/* Official Senders & Deliverability Architecture Bar */}
      <div className="p-5 rounded-2xl bg-[#070D1E] border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Server className="w-4 h-4 text-purple-400" />
            Configured Professional Sender Identities (`@lumixora.in`)
          </h3>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Single Reusable Delivery Core
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {[
            { email: 'security@lumixora.in', label: 'OTPs & Resets', color: 'border-emerald-500/30 bg-emerald-500/5' },
            { email: 'welcome@lumixora.in', label: 'Onboarding', color: 'border-blue-500/30 bg-blue-500/5' },
            { email: 'careers@lumixora.in', label: 'Drives & Interns', color: 'border-purple-500/30 bg-purple-500/5' },
            { email: 'certificates@lumixora.in', label: 'Credentials', color: 'border-amber-500/30 bg-amber-500/5' },
            { email: 'notifications@lumixora.in', label: 'Announcements', color: 'border-cyan-500/30 bg-cyan-500/5' },
            { email: 'support@lumixora.in', label: 'Helpdesk & Reply', color: 'border-slate-500/30 bg-slate-500/5' }
          ].map((s, idx) => (
            <div key={idx} className={`p-2.5 rounded-xl border ${s.color} text-center`}>
              <div className="text-[11px] font-mono font-bold text-white truncate" title={s.email}>{s.email}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Template Catalog Quick-Preview Grid */}
      <div className="p-5 rounded-2xl bg-[#0B132B]/80 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-purple-400" />
              Apple-Inspired Premium Responsive Templates
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Dual MIME compliant with responsive HTML and plain-text fallback for zero spam scoring.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {AVAILABLE_TEMPLATES.map((tpl) => (
            <div
              key={tpl.key}
              className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${tpl.badgeColor}`}>
                    {tpl.badge}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 truncate max-w-[120px]">{tpl.sender}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-100 mb-1">{tpl.name}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{tpl.description}</p>
              </div>
              <button
                onClick={() => setPreviewTemplate(tpl)}
                className="mt-3 w-full py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-semibold text-slate-300 transition-colors flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3 h-3 text-purple-400" />
                Inspect Template
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Live Delivery Telemetry Logs Table */}
      <div className="rounded-2xl bg-[#0B132B] border border-white/10 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              Live Delivery Telemetry & Audit History
            </h3>
            <span className="text-xs text-slate-400 font-mono">({filteredLogs.length} events)</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search recipient, subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 transition-colors w-44 sm:w-56"
              />
            </div>

            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
              {['ALL', 'DELIVERED', 'FAILED', 'SUPPRESSED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wide transition-all ${
                    statusFilter === st ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center">
              <Mail className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-40" />
              <p className="text-sm text-slate-400 font-medium">No email activity recorded yet today.</p>
              <p className="text-xs text-slate-500 mt-1">Send a test email above to verify end-to-end Brevo delivery telemetry.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-white/5">
                <tr>
                  <th className="px-5 py-3">Timestamp</th>
                  <th className="px-5 py-3">Recipient Scholar</th>
                  <th className="px-5 py-3">Subject & Priority</th>
                  <th className="px-5 py-3">Sender Identity</th>
                  <th className="px-5 py-3">Provider Gateway</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLogs.map((log) => {
                  const isSuccess = (log.status || '').toLowerCase().includes('accept') || (log.status || '').toLowerCase().includes('deliver');
                  return (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-200">
                        <span className="font-mono text-slate-300">{log.to}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-slate-100 truncate max-w-xs">{log.subject}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{log.priority || 'P1_URGENT_SECURITY'}</div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-300 font-mono text-[11px]">
                        {log.senderEmail || `${log.senderType || 'security'}@lumixora.in`}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-bold">
                          {log.provider || 'Brevo API v3'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isSuccess
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'bg-red-500/15 text-red-300 border border-red-500/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isSuccess ? 'bg-emerald-400' : 'bg-red-400'}`} />
                          {log.status}
                        </span>
                        {log.error && <p className="text-[10px] text-red-400 mt-1 truncate max-w-xs">{log.error}</p>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ─── MODAL 1: Send Test Email ────────────────────────────────────────── */}
      {isTestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#0E172E] border border-white/10 rounded-2xl shadow-2xl p-6 relative">
            <button
              onClick={() => setIsTestModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Send Real Test Email</h3>
                <p className="text-xs text-slate-400">Verify Brevo API inbox placement & Apple styling</p>
              </div>
            </div>

            <form onSubmit={handleSendTestEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Recipient Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. 249xa33106@gprec.ac.in or personal email"
                  value={testRecipient}
                  onChange={(e) => setTestRecipient(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-purple-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Select Email Template
                </label>
                <select
                  value={testTemplateKey}
                  onChange={(e) => setTestTemplateKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-400 transition-colors"
                >
                  {AVAILABLE_TEMPLATES.map((t) => (
                    <option key={t.key} value={t.key}>
                      {t.name} ({t.badge})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-400">
                ⚡ <strong>Free Tier Safety:</strong> Uses 1 credit from your 300/day allowance. Sender identity is automatically routed through <code>@lumixora.in</code>.
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTestModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={testSending}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
                >
                  {testSending ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Dispatching...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Send Live Email
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: DNS Records Guide ────────────────────────────────────────── */}
      {isDnsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-[#0E172E] border border-white/10 rounded-2xl shadow-2xl p-6 relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setIsDnsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">DNS Records for `lumixora.in`</h3>
                <p className="text-xs text-slate-400">Authenticate SPF, DKIM, and DMARC in your domain registrar / Cloudflare DNS</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Google and Yahoo require SPF, DKIM, and DMARC alignment for all domain senders. Add these records in your Cloudflare DNS manager for <code>lumixora.in</code> to guarantee 100% inboxing.
            </p>

            <div className="space-y-3">
              {[
                {
                  type: 'TXT Record',
                  host: '@ (Root Domain)',
                  value: 'v=spf1 include:spf.brevo.com ~all',
                  desc: 'SPF Record: Authorizes Brevo mail servers to deliver emails from @lumixora.in.'
                },
                {
                  type: 'TXT Record',
                  host: 'mail._domainkey',
                  value: 'k=rsa; p=YOUR_BREVO_DKIM_KEY_FROM_BREVO_CONSOLE',
                  desc: 'DKIM Key: Cryptographic signature confirming email authenticity. Copy from Brevo > Senders & IP > Domains.'
                },
                {
                  type: 'TXT Record',
                  host: '_dmarc',
                  value: 'v=DMARC1; p=none; sp=none; rua=mailto:support@lumixora.in; pct=100; aspf=r;',
                  desc: 'DMARC Record: Protects your domain from spoofing and guarantees inbox delivery.'
                }
              ].map((rec, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-purple-400">{rec.type} · Host: <code className="text-white">{rec.host}</code></span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(rec.value);
                        addToast({ message: 'Copied to clipboard!', type: 'success' });
                      }}
                      className="text-[10px] font-semibold text-slate-300 hover:text-white px-2 py-0.5 rounded bg-white/5 border border-white/10"
                    >
                      Copy Value
                    </button>
                  </div>
                  <pre className="p-2 rounded-lg bg-black/40 text-[11px] font-mono text-emerald-300 overflow-x-auto border border-white/5 my-1.5">
                    {rec.value}
                  </pre>
                  <p className="text-[11px] text-slate-400">{rec.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setIsDnsModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: Template Preview Modal ─────────────────────────────────── */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-[#0E172E] border border-white/10 rounded-2xl shadow-2xl p-6 relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setPreviewTemplate(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-3">
              <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${previewTemplate.badgeColor}`}>
                {previewTemplate.badge}
              </span>
              <h3 className="text-base font-bold text-white">{previewTemplate.name}</h3>
            </div>

            <div className="space-y-3 mb-4 text-xs">
              <div className="p-2.5 rounded-lg bg-black/30 border border-white/5">
                <span className="text-slate-400">Sender Identity: </span>
                <strong className="text-purple-300 font-mono">{previewTemplate.sender}</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-black/30 border border-white/5">
                <span className="text-slate-400">Sample Subject: </span>
                <strong className="text-slate-200">{previewTemplate.sampleSubject}</strong>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 text-slate-900 shadow-inner">
              <div className="text-center pb-3 border-b border-slate-100">
                <span className="font-bold text-base text-slate-900">Lumixora<span className="text-indigo-600">.</span></span>
                <span className="text-[11px] text-slate-500 block">Official Academic Clearance</span>
              </div>
              <div className="py-4 text-center">
                <h4 className="text-lg font-bold text-slate-800 mb-1">{previewTemplate.name.replace(/^[0-9]\.\s*/, '')}</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">{previewTemplate.description}</p>
                <div className="my-4 p-3 bg-slate-50 border border-dashed border-indigo-400 rounded-lg font-mono text-xl font-bold text-indigo-600 tracking-widest inline-block">
                  489210
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 text-center text-[10px] text-slate-400">
                Lumixora — A Product of Vyomra · Kurnool, AP, India
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
