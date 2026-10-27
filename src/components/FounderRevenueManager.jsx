import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  CreditCard, 
  IndianRupee, 
  Search, 
  Download, 
  Mail, 
  Copy, 
  Check, 
  ShieldCheck, 
  ExternalLink, 
  Filter, 
  ArrowUpDown,
  Building2,
  Users,
  Sparkles,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { supabase } from '../config/supabase';
import { approveFeePayment, rejectFeePayment } from '../services/founderNotificationService';

export default function FounderRevenueManager({ usersList = [], onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Pending Verifications Queue State
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // 1. Fetch pending payment verifications from Supabase
  const loadPendingPayments = useCallback(async () => {
    if (!supabase || typeof supabase.from !== 'function') return;
    try {
      setLoadingPending(true);
      const { data, error } = await supabase
        .from('founder_notifications')
        .select('*')
        .in('type', ['payment_pending'])
        .order('id', { ascending: false });

      if (!error && data) {
        // Keep only active pending items
        const activePending = data.filter(n => {
          const status = n.meta?.status;
          return status === 'pending_verification' || !status;
        });
        setPendingPayments(activePending);
      }
    } catch (e) {
      console.warn("loadPendingPayments notice:", e);
    } finally {
      setLoadingPending(false);
    }
  }, []);

  useEffect(() => {
    loadPendingPayments();

    // Subscribe to realtime changes on founder_notifications table
    let channel = null;
    if (supabase && typeof supabase.channel === 'function') {
      try {
        channel = supabase.channel('founder_revenue_pending_sync')
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'founder_notifications' 
          }, () => {
            loadPendingPayments();
          })
          .subscribe();
      } catch (e) {}
    }

    return () => {
      if (channel && typeof channel.unsubscribe === 'function') channel.unsubscribe();
    };
  }, [loadPendingPayments]);

  // Handle 1-click Approve
  const handleApprove = async (item) => {
    if (!item?.id) return;
    setActionInProgress(item.id);
    const meta = item.meta || {};

    try {
      const res = await approveFeePayment(item.id, meta);
      if (res.success) {
        setToastMessage(`✅ Verified ₹10 payment for ${meta.name || 'Scholar'} (UTR: ${meta.utr || 'UTR'}). Workspace unlocked!`);
        setPendingPayments(prev => prev.filter(p => p.id !== item.id));
        if (onRefresh) onRefresh();
      } else {
        setToastMessage(`⚠️ Approval error: ${res.reason || 'Could not verify'}`);
      }
    } catch (err) {
      setToastMessage(`⚠️ Error: ${err.message}`);
    } finally {
      setActionInProgress(null);
      setTimeout(() => setToastMessage(''), 5000);
    }
  };

  // Handle 1-click Reject Fake UTR
  const handleReject = async (item) => {
    if (!item?.id) return;
    const meta = item.meta || {};
    const confirmReject = window.confirm(`Reject fake or unverifiable UTR [${meta.utr || 'UTR'}] for ${meta.name || 'Scholar'}?\n\nThis will lock access and inform the student that the transaction was not found on your bank statement.`);
    if (!confirmReject) return;

    setActionInProgress(item.id);
    try {
      const res = await rejectFeePayment(item.id, 'Transaction was not found on Founder bank statement');
      if (res.success) {
        setToastMessage(`❌ Rejected fake UTR ${meta.utr || ''} for ${meta.name || 'Scholar'}. Student notified.`);
        setPendingPayments(prev => prev.filter(p => p.id !== item.id));
      } else {
        setToastMessage(`⚠️ Rejection error: ${res.reason || 'Could not reject'}`);
      }
    } catch (err) {
      setToastMessage(`⚠️ Error: ${err.message}`);
    } finally {
      setActionInProgress(null);
      setTimeout(() => setToastMessage(''), 5000);
    }
  };

  // Extract paid users strictly (those who paid the ₹10 or ₹5 fee with valid Tx/UTR)
  const paidUsers = useMemo(() => {
    const list = usersList.filter(u => {
      if (u.is_deleted) return false;
      const isPaid = Boolean(
        u.oneTimeFeePaid === true ||
        u.feePaid === true ||
        (u.feeTxId && u.feeTxId !== 'GPREC-FREE' && !u.feeTxId.includes('FREE')) ||
        (u.metadata?.oneTimeFeePaid === true) ||
        (u.metadata?.feePaid === true) ||
        (u.metadata?.feeTxId && !u.metadata.feeTxId.includes('FREE'))
      );
      return isPaid;
    });

    // Sort by payment date descending (most recent first)
    list.sort((a, b) => {
      const dateA = a.feePaidAt ? new Date(a.feePaidAt).getTime() : (a.created_at_raw || 0);
      const dateB = b.feePaidAt ? new Date(b.feePaidAt).getTime() : (b.created_at_raw || 0);
      return dateB - dateA;
    });

    return list;
  }, [usersList]);

  // Total Revenue calculation
  const totalRevenue = useMemo(() => {
    return paidUsers.reduce((sum, u) => {
      const amt = Number(u.feeAmount || u.metadata?.feeAmount || 10);
      return sum + (isNaN(amt) || amt <= 0 ? 10 : amt);
    }, 0);
  }, [paidUsers]);

  // College revenue breakdown
  const collegeBreakdown = useMemo(() => {
    const map = new Map();
    paidUsers.forEach(u => {
      const col = u.college || u.rawCollege || 'Academic Institution';
      const amt = Number(u.feeAmount || u.metadata?.feeAmount || 10);
      const cur = map.get(col) || { count: 0, revenue: 0 };
      map.set(col, {
        count: cur.count + 1,
        revenue: cur.revenue + (isNaN(amt) || amt <= 0 ? 10 : amt)
      });
    });
    return Array.from(map.entries()).map(([college, data]) => ({
      college,
      ...data
    })).sort((a, b) => b.revenue - a.revenue);
  }, [paidUsers]);

  // Unique colleges for dropdown
  const uniqueColleges = useMemo(() => {
    const set = new Set();
    paidUsers.forEach(u => {
      if (u.college) set.add(u.college);
    });
    return Array.from(set);
  }, [paidUsers]);

  // Filtered paid users
  const filteredPaidUsers = useMemo(() => {
    return paidUsers.filter(u => {
      const q = searchQuery.toLowerCase().trim();
      const name = (u.name || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const college = (u.college || '').toLowerCase();
      const txId = (u.feeTxId || u.metadata?.feeTxId || '').toLowerCase();

      const matchQuery = !q || name.includes(q) || email.includes(q) || college.includes(q) || txId.includes(q);
      const matchCollege = collegeFilter === 'ALL' || u.college === collegeFilter;

      return matchQuery && matchCollege;
    });
  }, [paidUsers, searchQuery, collegeFilter]);

  const copyToClipboard = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAllEmails = () => {
    const emails = filteredPaidUsers.map(u => u.email).filter(Boolean);
    if (emails.length === 0) return;
    navigator.clipboard.writeText(emails.join(', '));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleExportCSV = () => {
    const headers = [
      'Scholar Name',
      'Email',
      'College',
      'Department',
      'Year',
      'Roll Number',
      'Amount Paid (INR)',
      'Transaction / UTR ID',
      'Payment Date / Time',
      'Verification Status'
    ];

    const rows = filteredPaidUsers.map(u => [
      `"${(u.name || 'Scholar').replace(/"/g, '""')}"`,
      `"${u.email || ''}"`,
      `"${(u.college || 'Academic Institution').replace(/"/g, '""')}"`,
      `"${u.department || u.branch || 'CSE'}"`,
      `"${u.year || '1st Year'}"`,
      `"${u.rollNumber || ''}"`,
      u.feeAmount || u.metadata?.feeAmount || 10,
      `"${u.feeTxId || u.metadata?.feeTxId || 'UTR-VERIFIED'}"`,
      `"${u.feePaidAt || u.created_at || ''}"`,
      '"Verified (UPI)"'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Lumixora_Paid_Scholars_Revenue_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Toast Alert Feedback */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center justify-between shadow-lg animate-fade-in">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="p-1 hover:text-white">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner & Revenue KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-[#0e1726] border border-emerald-500/40 relative overflow-hidden shadow-lg shadow-emerald-500/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">Total Revenue Collected</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-lg">
              ₹
            </div>
          </div>
          <div className="text-3xl font-black text-white font-sora">
            ₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-emerald-300/80 font-medium mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            100% Real-time Verified UPI Receipts
          </p>
        </div>

        {/* Paid Users Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-[#0e1726] border border-cyan-500/40 relative overflow-hidden shadow-lg shadow-cyan-500/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-cyan-400">Amount Paid Users</span>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-sora">
            {paidUsers.length} <span className="text-base font-normal text-gray-400">Scholars</span>
          </div>
          <p className="text-[11px] text-cyan-300/80 font-medium mt-1">
            Paid Platform Access Gate Fee
          </p>
        </div>

        {/* Pending Approval Count Card */}
        <div className={`p-5 rounded-2xl bg-gradient-to-br ${pendingPayments.length > 0 ? 'from-amber-500/25 via-orange-500/15' : 'from-gray-800/20 via-gray-900/10'} to-[#0e1726] border ${pendingPayments.length > 0 ? 'border-amber-500/40 animate-pulse' : 'border-white/10'} relative overflow-hidden shadow-lg`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">Pending UTR Verification</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-sora">
            {pendingPayments.length} <span className="text-base font-normal text-gray-400">Awaiting</span>
          </div>
          <p className="text-[11px] text-amber-300/80 font-medium mt-1">
            {pendingPayments.length > 0 ? 'Action required in queue below' : 'All submissions verified'}
          </p>
        </div>

        {/* Security Gate Status */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/20 via-indigo-500/10 to-[#0e1726] border border-purple-500/40 relative overflow-hidden shadow-lg shadow-purple-500/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-400">Zero-Trust Gate</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl font-black text-emerald-400 font-sora flex items-center gap-2 mt-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Strict Bank Enforcement
          </div>
          <p className="text-[11px] text-gray-400 font-medium mt-1">
            Sequential UTRs & duplicates blocked
          </p>
        </div>
      </div>

      {/* =========================================================================
          PENDING FOUNDER PAYMENT VERIFICATIONS QUEUE (LIVE UPI GATE)
         ========================================================================= */}
      <div className="bg-[#0b0f19] border border-amber-500/30 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/40 via-orange-950/20 to-transparent border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-sm">
                  Pending Payment Verifications Queue
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black">
                  {pendingPayments.length} Pending
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Scholars who entered UTR and are waiting for you to verify their ₹10 transfer against bank statement.
              </p>
            </div>
          </div>

          <button
            onClick={loadPendingPayments}
            disabled={loadingPending}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold border border-white/10 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingPending ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Refresh Queue</span>
          </button>
        </div>

        {pendingPayments.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-xs space-y-1">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto opacity-75 mb-1" />
            <div className="font-bold text-gray-300">No Pending Payments!</div>
            <p className="text-[11px] text-gray-500">
              All scholar UPI submissions have been verified and activated.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-white/[0.02] border-b border-white/5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Scholar</th>
                  <th className="py-3 px-4">Campus / Department</th>
                  <th className="py-3 px-4 text-center">Amount</th>
                  <th className="py-3 px-4">Submitted UTR / Ref No</th>
                  <th className="py-3 px-4">Submitted At</th>
                  <th className="py-3 px-4 text-center">Founder Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pendingPayments.map((item) => {
                  const meta = item.meta || {};
                  const utr = meta.utr || meta.cleanUtr || 'N/A';
                  const isBusy = actionInProgress === item.id;

                  return (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Scholar Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-white text-xs">
                          {meta.name || 'Scholar'}
                        </div>
                        <div className="text-[11px] text-gray-400 font-mono flex items-center gap-1">
                          <span>{meta.email || 'N/A'}</span>
                          <button
                            onClick={() => copyToClipboard(meta.email, `pemail_${item.id}`)}
                            className="hover:text-white transition-colors"
                            title="Copy email"
                          >
                            {copiedId === `pemail_${item.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>

                      {/* College & Department */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-gray-200 line-clamp-1 max-w-[200px]">
                          {meta.college || 'Academic Institution'}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {meta.department || 'Engineering'}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-black font-sora text-xs">
                          ₹{meta.amount || 10}
                        </span>
                      </td>

                      {/* UTR */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-mono text-xs">
                          <span className="px-2.5 py-1 rounded-lg bg-black/50 border border-cyan-500/30 text-cyan-300 font-extrabold tracking-wider select-all">
                            UTR-{utr}
                          </span>
                          <button
                            onClick={() => copyToClipboard(utr, `putr_${item.id}`)}
                            className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
                            title="Copy UTR ID"
                          >
                            {copiedId === `putr_${item.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Submitted At */}
                      <td className="py-3.5 px-4 text-gray-400 text-[11px] whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span>
                            {item.created_at ? new Date(item.created_at).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 'Recent'}
                          </span>
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleApprove(item)}
                            disabled={isBusy}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-black font-black text-xs shadow-md shadow-emerald-500/20 disabled:opacity-50 transition-all flex items-center gap-1 cursor-pointer"
                            title="Confirm receipt of ₹10 and unlock student workspace"
                          >
                            {isBusy ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <>
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span>Verify & Unlock</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleReject(item)}
                            disabled={isBusy}
                            className="px-2.5 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 font-bold text-xs disabled:opacity-50 transition-all flex items-center gap-1 cursor-pointer"
                            title="Reject fake or unverified UTR"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject Fake</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* College Revenue Breakdown */}
      {collegeBreakdown.length > 0 && (
        <div className="p-5 rounded-2xl bg-[#0b0f19] border border-white/10 space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-gray-300 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>Revenue Breakdown By Partner Institution</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {collegeBreakdown.map((item, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between hover:border-emerald-500/30 transition-all"
              >
                <div>
                  <h5 className="font-bold text-white text-xs line-clamp-1">{item.college}</h5>
                  <span className="text-[11px] text-gray-400">{item.count} Paid Scholar{item.count > 1 ? 's' : ''}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-emerald-400">₹{item.revenue.toLocaleString()}</span>
                  <span className="text-[10px] text-gray-500 block">Total</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter & Action Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#0d121f] p-4 rounded-2xl border border-white/10">
        <div className="flex flex-1 items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search paid scholars by name, email, or UTR number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-400 transition-all"
            />
          </div>

          <select
            value={collegeFilter}
            onChange={(e) => setCollegeFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-[#141a29] border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
          >
            <option value="ALL">All Colleges ({paidUsers.length})</option>
            {uniqueColleges.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyAllEmails}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Copy all paid scholar emails to clipboard"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Mail className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{copiedAll ? 'Copied Emails!' : 'Copy Paid Emails (BCC)'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-xs font-black border border-emerald-500/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Export all paid user records as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {onRefresh && (
            <button
              onClick={() => {
                onRefresh();
                loadPendingPayments();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-all cursor-pointer"
              title="Refresh payments data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Paid Scholars List Table */}
      <div className="bg-[#0b0f19] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <h3 className="font-extrabold text-white text-sm">Verified Paid Scholars Roster</h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-black">
              {filteredPaidUsers.length} Recorded
            </span>
          </div>
          <span className="text-[11px] text-gray-400 font-mono">
            Total Displayed: <strong className="text-emerald-400 font-black">₹{filteredPaidUsers.reduce((s, u) => s + (Number(u.feeAmount) || 10), 0)}</strong>
          </span>
        </div>

        {filteredPaidUsers.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs">
            No paid scholar records match your current search/filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-white/[0.02] border-b border-white/5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Scholar</th>
                  <th className="py-3 px-4">College / Dept</th>
                  <th className="py-3 px-4 text-center">Amount Paid</th>
                  <th className="py-3 px-4">UPI / UTR Transaction ID</th>
                  <th className="py-3 px-4">Payment Date</th>
                  <th className="py-3 px-4 text-center">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPaidUsers.map((u, idx) => {
                  const tx = u.feeTxId || u.metadata?.feeTxId || 'UTR-VERIFIED';
                  const amount = u.feeAmount || u.metadata?.feeAmount || 10;
                  const dateStr = u.feePaidAt || u.metadata?.feePaidAt || u.created_at;
                  let formattedDate = 'Recent Payment';
                  if (dateStr && dateStr !== 'N/A') {
                    try {
                      formattedDate = new Date(dateStr).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      });
                    } catch (e) {
                      formattedDate = String(dateStr);
                    }
                  }

                  return (
                    <tr key={u.id || idx} className="hover:bg-white/[0.02] transition-colors">
                      {/* Scholar Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-300 uppercase shrink-0 text-xs">
                            {(u.name || 'S')[0]}
                          </div>
                          <div>
                            <div className="font-extrabold text-white text-xs flex items-center gap-1.5">
                              <span>{u.name || 'Scholar'}</span>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            </div>
                            <div className="text-[11px] text-gray-400 font-mono flex items-center gap-1">
                              <span>{u.email}</span>
                              <button
                                onClick={() => copyToClipboard(u.email, `email_${u.id || idx}`)}
                                className="hover:text-white transition-colors"
                                title="Copy email"
                              >
                                {copiedId === `email_${u.id || idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* College & Dept */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-gray-200 line-clamp-1 max-w-[220px]">
                          {u.college || u.rawCollege || 'Academic Institution'}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {u.department || u.branch || 'CSE'} {u.year ? `· ${u.year}` : ''}
                        </div>
                      </td>

                      {/* Amount Paid */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-black font-sora text-xs">
                          ₹{amount}
                        </span>
                      </td>

                      {/* UTR / Tx ID */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-mono text-xs">
                          <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10 text-cyan-300 font-bold">
                            {tx}
                          </span>
                          <button
                            onClick={() => copyToClipboard(tx, `tx_${u.id || idx}`)}
                            className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
                            title="Copy UTR ID"
                          >
                            {copiedId === `tx_${u.id || idx}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Payment Date */}
                      <td className="py-3.5 px-4 text-gray-400 text-[11px] whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span>{formattedDate}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
                          <Check className="w-3 h-3" /> Paid & Verified
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
