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
  ExternalLink,
  UserPlus,
  Trash2,
  Check,
  PlusCircle,
  FileText,
  KeyRound,
  Edit3,
  X,
  Zap,
  Printer
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  fetchAllLoginLogs, 
  formatTimeAgo, 
  formatDuration, 
  deriveUserRoleMeta,
  deleteLoginLog
} from '../services/userActivityLogService';
import { 
  getGprecScholarRoster, 
  addGprecScholarRoll, 
  bulkAddGprecScholarRolls, 
  removeGprecScholarRoll,
  updateGprecScholarData,
  syncCustomRollsFromCloud,
  KNOWN_GPREC_SCHOLAR_NAMES
} from '../services/gprecPlacementAuth';
import { useToast } from '../context/ToastContext';
import { 
  testFounderMobileNotification, 
  getFounderAlertTopic, 
  requestMobileNotificationPermission 
} from '../services/founderNotificationService';

export default function FounderLoginAuditManager() {
  const { addToast } = useToast();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'student' | 'tpo' | 'faculty' | 'active' | 'roster'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPortal, setSelectedPortal] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all'); // 'all' | 'today' | '7days'

  // Scholar Roster & Access Management State
  const [roster, setRoster] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addMode, setAddMode] = useState('single'); // 'single' | 'bulk'
  const [singleRoll, setSingleRoll] = useState('');
  const [singleName, setSingleName] = useState('');
  const [singleDept, setSingleDept] = useState('CSM');
  const [singleYear, setSingleYear] = useState('3rd Year');
  const [bulkInput, setBulkInput] = useState('');
  const [isSubmittingRoster, setIsSubmittingRoster] = useState(false);

  // Edit Scholar State
  const [editingScholar, setEditingScholar] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDept, setEditDept] = useState('CSE');
  const [editYear, setEditYear] = useState('3rd Year');
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // Quick Whitelist Bar State
  const [quickRollInput, setQuickRollInput] = useState('');
  const [isQuickSubmitting, setIsQuickSubmitting] = useState(false);

  // Mobile Push Notification Test State
  const [isTestingMobile, setIsTestingMobile] = useState(false);
  const handleTestMobile = async () => {
    setIsTestingMobile(true);
    try {
      const res = await testFounderMobileNotification();
      if (res && res.success) {
        addToast({ 
          message: `📱 Push notification dispatched! Check your phone notification shade (${getFounderAlertTopic()}).`, 
          type: 'success' 
        });
      } else {
        addToast({ message: 'Dispatched test push alert to mobile channel.', type: 'info' });
      }
    } catch (e) {
      addToast({ message: 'Push dispatch notice: ' + e.message, type: 'info' });
    } finally {
      setIsTestingMobile(false);
    }
  };

  const handleRequestPush = async () => {
    const granted = await requestMobileNotificationPermission();
    if (granted) {
      addToast({ message: '🔔 Web Push notifications allowed on this device!', type: 'success' });
    } else {
      addToast({ message: 'Notice: You can install the free ntfy app on Android/iOS for instant push alerts.', type: 'info' });
    }
  };

  // Roster Tab Search & Branch Filters
  const [rosterBranchFilter, setRosterBranchFilter] = useState('all'); // 'all' | 'CSM' | 'CSE' | 'ECE' | 'ME' | 'EEE' | 'Civil'
  const [rosterYearFilter, setRosterYearFilter] = useState('all'); // 'all' | '1st' | '2nd' | '3rd' | '4th'
  const [isSendingWelcomeEmail, setIsSendingWelcomeEmail] = useState({});

  // Helper to open pre-filled WhatsApp invite
  const handleOpenWhatsAppInvite = (scholar) => {
    const roll = scholar.rollNumber || scholar.rawRoll;
    const name = KNOWN_GPREC_SCHOLAR_NAMES[scholar.rawRoll] || scholar.name || 'Scholar';
    const message = encodeURIComponent(
      `Hi ${name}! 🎉\n\nYour GPREC Placement Suite access has been officially approved and whitelisted by the Placement Cell!\n\n` +
      `🔗 Portal: https://gprec.lumixora.in/\n` +
      `📌 Roll Number: ${roll.toUpperCase()}\n` +
      `🔑 Login Method: Enter your roll number to receive your 5-minute security verification code at your institutional email (${scholar.email}).\n\n` +
      `All the best with your placement preparations!`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  // Helper to dispatch official GPREC Welcome Email via Cloudflare Worker
  const handleSendWelcomeEmail = async (scholar) => {
    const roll = scholar.rollNumber || scholar.rawRoll || '';
    const destEmail = scholar.email || (roll ? `${roll.toLowerCase()}@gprec.ac.in` : '');
    if (!destEmail) return;

    setIsSendingWelcomeEmail(prev => ({ ...prev, [roll]: true }));
    try {
      const res = await fetch('/api/send-gprec-welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rollNumber: roll,
          email: destEmail,
          name: KNOWN_GPREC_SCHOLAR_NAMES[scholar.rawRoll] || scholar.name,
          department: scholar.department
        })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        addToast({ message: `✉️ Welcome email dispatched to ${destEmail}!`, type: 'success' });
      } else {
        addToast({ message: data.error || 'Failed to dispatch welcome email.', type: 'error' });
      }
    } catch (err) {
      addToast({ message: 'Network error sending welcome email.', type: 'error' });
    } finally {
      setIsSendingWelcomeEmail(prev => ({ ...prev, [roll]: false }));
    }
  };

  // 1-Click Institutional TPO Excel Format Export
  const handleExportTpoExcel = () => {
    try {
      const exportData = roster.map((s, idx) => {
        // Compute total login sessions & active status from logs
        const studentLogs = logs.filter(l => (l.rollNumber || '').toLowerCase() === s.rawRoll.toLowerCase());
        const totalDurationSec = studentLogs.reduce((acc, curr) => acc + (curr.durationSeconds || 0), 0);
        const lastLogin = studentLogs[0]?.loginTimeFormatted || 'Not Yet Logged In';
        const hoursSpent = (totalDurationSec / 3600).toFixed(1);

        // Derive mock readiness badge status
        let readiness = 'Enrolled / Ready';
        if (studentLogs.length >= 3 || totalDurationSec > 1800) {
          readiness = 'Active Prep (Cleared OA)';
        } else if (studentLogs.length > 0) {
          readiness = 'Onboarded (Resume Uploaded)';
        }

        return {
          'S.No': idx + 1,
          'Roll Number': s.rollNumber,
          'Scholar Name': s.name,
          'Department': s.department,
          'Academic Year': s.year,
          'GPREC Email': s.email,
          'Total Sessions': studentLogs.length,
          'Prep Time (Hours)': `${hoursSpent} hrs`,
          'Last Login Activity': lastLogin,
          'Placement Readiness Status': readiness,
          'Cohort Source': s.type
        };
      });

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      ws['!cols'] = [
        { wch: 6 },  // S.No
        { wch: 15 }, // Roll Number
        { wch: 28 }, // Scholar Name
        { wch: 16 }, // Department
        { wch: 12 }, // Academic Year
        { wch: 28 }, // Email
        { wch: 14 }, // Total Sessions
        { wch: 16 }, // Prep Time
        { wch: 22 }, // Last Login
        { wch: 26 }, // Readiness
        { wch: 18 }  // Cohort Source
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'GPREC_TPO_Roster');
      XLSX.writeFile(wb, `GPREC_TPO_Official_Placement_Roster_${new Date().toISOString().slice(0, 10)}.xlsx`);
      addToast({ message: 'Institutional TPO Placement Sheet (.xlsx) downloaded successfully.', type: 'success' });
    } catch (err) {
      console.error(err);
      addToast({ message: 'Failed to export TPO Excel sheet.', type: 'error' });
    }
  };

  // 1-Click Cloud Snapshot Backup
  const handleBackupRosterJson = () => {
    try {
      const backupPayload = {
        exportedAt: new Date().toISOString(),
        institution: 'G. Pulla Reddy Engineering College (GPREC)',
        totalScholars: roster.length,
        scholars: roster
      };
      const blob = new Blob([JSON.stringify(backupPayload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gprec_whitelisted_scholars_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      addToast({ message: '☁️ Database snapshot downloaded as JSON backup.', type: 'success' });
    } catch (e) {
      addToast({ message: 'Failed to create JSON backup.', type: 'error' });
    }
  };

  // Load audit logs on mount
  const loadLogs = async (showToast = false) => {
    setIsRefreshing(true);
    try {
      const data = await fetchAllLoginLogs();
      setLogs(data);
      // Also refresh and sync scholars roster
      await syncCustomRollsFromCloud();
      setRoster(getGprecScholarRoster());

      if (showToast) {
        addToast({ message: `Synchronized ${data.length} live sessions and active scholar roster.`, type: 'success' });
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
    setRoster(getGprecScholarRoster());
    loadLogs(false);
    // Poll every 30 seconds for live session telemetry updates
    const interval = setInterval(() => {
      loadLogs(false);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAddSingleScholar = async (e) => {
    e.preventDefault();
    if (!singleRoll.trim()) {
      addToast({ message: 'Please enter a valid GPREC roll number (e.g. 249XA33106).', type: 'error' });
      return;
    }
    setIsSubmittingRoster(true);
    try {
      await addGprecScholarRoll(singleRoll, {
        name: singleName.trim() || undefined,
        department: singleDept,
        year: singleYear,
        addedBy: 'Founder'
      });
      setRoster(getGprecScholarRoster());
      addToast({ message: `Successfully whitelisted scholar ${singleRoll.toUpperCase()}!`, type: 'success' });
      setSingleRoll('');
      setSingleName('');
      setIsAddModalOpen(false);
    } catch (err) {
      addToast({ message: err.message || 'Failed to add scholar.', type: 'error' });
    } finally {
      setIsSubmittingRoster(false);
    }
  };

  const handleBulkAddScholars = async (e) => {
    e.preventDefault();
    if (!bulkInput.trim()) {
      addToast({ message: 'Please paste roll numbers separated by commas, spaces, or lines.', type: 'error' });
      return;
    }
    setIsSubmittingRoster(true);
    try {
      const added = await bulkAddGprecScholarRolls(bulkInput, {
        department: singleDept,
        year: singleYear,
        addedBy: 'Founder'
      });
      setRoster(getGprecScholarRoster());
      addToast({ message: `Bulk whitelisted ${added.length} scholars successfully!`, type: 'success' });
      setBulkInput('');
      setIsAddModalOpen(false);
    } catch (err) {
      addToast({ message: err.message || 'Failed to bulk add scholars.', type: 'error' });
    } finally {
      setIsSubmittingRoster(false);
    }
  };

  // 1-Click Quick Whitelist Submission
  const handleQuickWhitelist = async (e) => {
    e.preventDefault();
    const cleanInput = quickRollInput.trim();
    if (!cleanInput) {
      addToast({ message: 'Please enter a student roll number (e.g. 259XA04138).', type: 'error' });
      return;
    }

    setIsQuickSubmitting(true);
    try {
      // Check if multiple roll numbers separated by comma or space
      if (cleanInput.includes(',') || cleanInput.includes(' ') || cleanInput.includes('\n')) {
        const added = await bulkAddGprecScholarRolls(cleanInput, { addedBy: 'Founder Quick Bar' });
        await syncCustomRollsFromCloud();
        setRoster(getGprecScholarRoster());
        addToast({ message: `⚡ Successfully whitelisted ${added.length} scholars in real cloud database!`, type: 'success' });
      } else {
        const addedScholar = await addGprecScholarRoll(cleanInput, { addedBy: 'Founder Quick Bar' });
        await syncCustomRollsFromCloud();
        setRoster(getGprecScholarRoster());
        addToast({ message: `⚡ Successfully whitelisted ${cleanInput.toUpperCase()}!`, type: 'success' });
        // Auto-dispatch welcome email in the background
        handleSendWelcomeEmail(addedScholar).catch(() => {});
      }
      setQuickRollInput('');
    } catch (err) {
      addToast({ message: err.message || 'Failed to whitelist roll number.', type: 'error' });
    } finally {
      setIsQuickSubmitting(false);
    }
  };

  const handleOpenEditModal = (scholar) => {
    setEditingScholar(scholar);
    setEditName(scholar.name || '');
    setEditDept(scholar.department || 'CSE');
    setEditYear(scholar.year || '3rd Year');
  };

  const handleSaveScholarEdit = async (e) => {
    e.preventDefault();
    if (!editingScholar) return;
    setIsSubmittingEdit(true);
    try {
      await updateGprecScholarData(editingScholar.rawRoll || editingScholar.rollNumber, {
        name: editName.trim(),
        department: editDept,
        year: editYear,
        addedBy: 'Founder'
      });
      setRoster(getGprecScholarRoster());
      addToast({ message: `Updated details for scholar ${editingScholar.rollNumber} in real database!`, type: 'success' });
      setEditingScholar(null);
    } catch (err) {
      addToast({ message: err.message || 'Failed to update scholar.', type: 'error' });
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleRemoveScholar = async (scholarOrRoll) => {
    const roll = typeof scholarOrRoll === 'string' 
      ? scholarOrRoll 
      : (scholarOrRoll?.rollNumber || scholarOrRoll?.rawRoll || '');
    const scholarName = (typeof scholarOrRoll === 'object' && scholarOrRoll?.name) 
      ? scholarOrRoll.name 
      : roll;

    if (!roll) return;
    if (!confirm(`Are you sure you want to permanently delete user/scholar ${roll.toUpperCase()} (${scholarName})?\n\nThis will revoke their portal access, delete their record from the cloud database, and remove them from the whitelisted roster.`)) return;

    try {
      await removeGprecScholarRoll(roll);
      setRoster(getGprecScholarRoster());
      addToast({ message: `🗑️ Scholar ${roll.toUpperCase()} permanently deleted & access revoked.`, type: 'info' });
    } catch (err) {
      addToast({ message: 'Failed to delete scholar.', type: 'error' });
    }
  };

  const handleDeleteLog = async (log) => {
    if (!confirm(`Delete this session log record for ${log.name || log.email || 'this user'}?`)) return;
    try {
      await deleteLoginLog(log.id);
      setLogs(prev => prev.filter(l => l.id !== log.id));
      addToast({ message: 'Session log record deleted.', type: 'info' });
    } catch (err) {
      addToast({ message: 'Failed to delete log entry.', type: 'error' });
    }
  };

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

  // Export Institutional Placement Summary to PDF
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      doc.setFillColor(11, 19, 43);
      doc.rect(0, 0, 210, 297, 'F');

      // Title & Header
      doc.setTextColor(197, 160, 89);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('G. PULLA REDDY ENGINEERING COLLEGE (AUTONOMOUS)', 14, 18);
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text('Institutional Placement Suite · Scholar Activity & Readiness Audit Report', 14, 25);

      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Generated: ${new Date().toLocaleString('en-IN')} | Total Whitelisted Scholars: ${roster.length} | Sessions Recorded: ${filteredLogs.length}`, 14, 31);

      // Table Data
      const tableData = filteredLogs.map((l, i) => [
        i + 1,
        l.name || 'Scholar',
        l.rollNumber || (l.email ? l.email.split('@')[0] : 'N/A'),
        l.department || 'CSE',
        l.roleTitle || l.role || 'Scholar',
        l.loginTimeFormatted || 'N/A',
        formatDuration(l.durationSeconds, l.status === 'active'),
        l.status === 'active' ? 'Active Now' : 'Completed'
      ]);

      autoTable(doc, {
        startY: 36,
        head: [['#', 'Scholar Name', 'Roll Number', 'Dept', 'Role Scope', 'Login Timestamp', 'Duration', 'Status']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [17, 28, 68],
          textColor: [197, 160, 89],
          fontSize: 8,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fillColor: [11, 19, 43],
          textColor: [241, 245, 249],
          fontSize: 7.5
        },
        alternateRowStyles: {
          fillColor: [15, 23, 42]
        },
        styles: {
          lineColor: [51, 65, 85],
          lineWidth: 0.1
        }
      });

      doc.save(`GPREC_Placement_Readiness_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
      addToast({ message: 'Institutional Placement PDF generated and downloaded successfully.', type: 'success' });
    } catch (e) {
      console.error(e);
      addToast({ message: 'Failed to generate PDF report.', type: 'error' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-white pb-12">
      {/* 1-Click Founder Quick Whitelist Persistent Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#111C44] to-[#0B132B] border border-amber-500/40 shadow-xl shadow-amber-950/20 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center shadow-lg shadow-amber-400/20">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 font-sora">
                ⚡ 1-Click Quick Whitelist
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Instant Cloud Sync
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Enter student roll number when they pay. Auto-assigns branch, grants access, and syncs to Supabase.
            </p>
          </div>
        </div>

        <form onSubmit={handleQuickWhitelist} className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-80">
            <input
              type="text"
              value={quickRollInput}
              onChange={(e) => setQuickRollInput(e.target.value)}
              placeholder="e.g. 259XA04138 (or 249XA33112, 259XA33030)"
              className="w-full px-3.5 py-2 pl-9 rounded-xl bg-[#070D1E] border border-amber-500/30 text-white placeholder-slate-500 text-xs font-mono uppercase focus:outline-none focus:border-amber-400 transition-colors"
            />
            <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
          </div>

          <button
            type="submit"
            disabled={isQuickSubmitting || !quickRollInput.trim()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-amber-400/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 whitespace-nowrap"
          >
            {isQuickSubmitting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <UserPlus className="w-3.5 h-3.5" />
            )}
            <span>Approve & Whitelist</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAddMode('bulk');
              setIsAddModalOpen(true);
            }}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Bulk CSV / List</span>
          </button>
        </form>
      </div>

      {/* 📱 Real-Time Mobile Push Notification Sync Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0B132B] to-purple-950/30 border border-emerald-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-300 font-sora">
                📱 Founder Mobile Notifications
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live on Phone
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Instant sound alerts arrive on your phone whenever any <strong>User</strong> or <strong>Intern</strong> logs in via <code className="text-emerald-300 font-mono text-[10px]">ntfy.sh/{getFounderAlertTopic()}</code>.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`https://ntfy.sh/${getFounderAlertTopic()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
            title="Open ntfy in mobile browser or install ntfy app"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Connect My Phone</span>
          </a>

          <button
            onClick={handleTestMobile}
            disabled={isTestingMobile}
            className="px-3.5 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Dispatch a live test alert to your phone"
          >
            <Zap className={`w-3.5 h-3.5 ${isTestingMobile ? 'animate-spin' : ''}`} />
            <span>{isTestingMobile ? 'Dispatching...' : 'Test Mobile Alert'}</span>
          </button>

          <button
            onClick={handleRequestPush}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 border border-white/20 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Enable browser notifications on this laptop or device"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Enable Web Push</span>
          </button>
        </div>
      </div>
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
            onClick={handleExportPDF}
            className="px-3.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-xs font-bold text-purple-300 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            title="Export Institutional Placement Report to PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PDF Report</span>
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

          <button
            onClick={() => setActiveCategory('roster')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
              activeCategory === 'roster'
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20 font-black'
                : 'bg-[#0B132B] text-amber-300 hover:bg-[#111C44] border-amber-500/30'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-500" />
            <span>Scholar Whitelist & Roster</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeCategory === 'roster' ? 'bg-slate-950/20 text-slate-950 font-black' : 'bg-amber-500/20 text-amber-300'}`}>
              {roster.length}
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

      {/* Login History & Time Logs Table OR Scholar Whitelist & Roster */}
      {activeCategory === 'roster' ? (
        <div className="rounded-2xl border border-amber-500/20 bg-[#0B132B] overflow-hidden shadow-2xl">
          {/* Roster Header */}
          <div className="p-5 bg-gradient-to-r from-amber-950/30 via-[#111C44] to-[#0B132B] border-b border-amber-500/20 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <KeyRound className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-white font-sora">
                  GPREC Whitelisted Scholars Roster
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {roster.length} Active Scholars
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Scholars in this roster are pre-approved to receive OTP verification codes and access <strong className="text-amber-400">gprec.lumixora.in</strong> with full placement features.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportTpoExcel}
                className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-xs font-bold text-emerald-300 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                title="Export official GPREC Placement TPO roster spreadsheet"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>TPO Sheet (.xlsx)</span>
              </button>

              <button
                onClick={handleBackupRosterJson}
                className="px-3 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 text-xs font-bold text-purple-300 flex items-center gap-1.5 transition-all cursor-pointer"
                title="Download full database snapshot as JSON backup"
              >
                <Download className="w-3.5 h-3.5" />
                <span>JSON Snapshot</span>
              </button>

              <button
                onClick={() => {
                  setAddMode('single');
                  setIsAddModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-amber-400/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Add Scholar</span>
              </button>
              <button
                onClick={() => {
                  setAddMode('bulk');
                  setIsAddModalOpen(true);
                }}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Bulk Import</span>
              </button>
            </div>
          </div>

          {/* Roster Branch & Year Filter Toolbar */}
          <div className="px-5 py-3 bg-[#0E1738] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Filter className="w-3 h-3 text-amber-400" /> Branch:
              </span>
              {['all', 'CSM', 'CSE', 'ECE', 'ME', 'EEE', 'Civil'].map(branch => (
                <button
                  key={branch}
                  onClick={() => setRosterBranchFilter(branch)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    rosterBranchFilter === branch
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  {branch === 'all' ? 'All Branches' : branch}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Year:</span>
              <select
                value={rosterYearFilter}
                onChange={(e) => setRosterYearFilter(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-[#070D1E] border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="all">All Years</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
              </select>
            </div>
          </div>

          {/* Roster Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111C44] text-slate-200 uppercase tracking-wider text-[10px] font-bold border-b border-white/10">
                <tr>
                  <th className="px-5 py-3.5">Roll Number</th>
                  <th className="px-5 py-3.5">Scholar Name</th>
                  <th className="px-5 py-3.5">GPREC Institutional Email</th>
                  <th className="px-5 py-3.5">Department / Branch</th>
                  <th className="px-5 py-3.5">Batch / Year</th>
                  <th className="px-5 py-3.5">Prep Readiness Status</th>
                  <th className="px-5 py-3.5">Cohort Category</th>
                  <th className="px-5 py-3.5 text-right">Instant Invite & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {roster
                  .filter(item => {
                    // 1. Search Query Filter
                    if (searchQuery.trim()) {
                      const q = searchQuery.toLowerCase().trim();
                      const matches = item.rollNumber.toLowerCase().includes(q) ||
                                      item.name.toLowerCase().includes(q) ||
                                      item.email.toLowerCase().includes(q) ||
                                      item.department.toLowerCase().includes(q);
                      if (!matches) return false;
                    }
                    // 2. Branch Filter
                    if (rosterBranchFilter !== 'all') {
                      const b = (item.department || '').toLowerCase();
                      if (rosterBranchFilter === 'CSM' && !b.includes('csm')) return false;
                      if (rosterBranchFilter === 'CSE' && (!b.includes('cse') || b.includes('csm'))) return false;
                      if (rosterBranchFilter === 'ECE' && !b.includes('ece')) return false;
                      if (rosterBranchFilter === 'ME' && !b.includes('mech')) return false;
                      if (rosterBranchFilter === 'EEE' && !b.includes('eee')) return false;
                      if (rosterBranchFilter === 'Civil' && !b.includes('civil')) return false;
                    }
                    // 3. Year Filter
                    if (rosterYearFilter !== 'all') {
                      if (!item.year.toLowerCase().includes(rosterYearFilter.toLowerCase())) return false;
                    }
                    return true;
                  })
                  .map((scholar) => {
                    // Compute live student activity for readiness badge
                    const studentLogs = logs.filter(l => (l.rollNumber || '').toLowerCase() === scholar.rawRoll.toLowerCase());
                    const totalDurationSec = studentLogs.reduce((acc, curr) => acc + (curr.durationSeconds || 0), 0);
                    const isLiveNow = studentLogs.some(l => l.status === 'active');

                    let readinessBadge = { label: 'Enrolled / Ready', color: 'bg-slate-500/15 text-slate-300 border-slate-500/30' };
                    if (isLiveNow) {
                      readinessBadge = { label: '🟢 Live in Placement Suite', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse' };
                    } else if (studentLogs.length >= 3 || totalDurationSec > 1800) {
                      readinessBadge = { label: '⭐ Active Prep (Cleared OA)', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
                    } else if (studentLogs.length > 0) {
                      readinessBadge = { label: '⚡ Onboarded (Logged In)', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
                    }

                    return (
                    <tr key={scholar.rawRoll} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {scholar.rollNumber}
                          </span>
                          {scholar.rawRoll === '249xa33106' && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              Founder
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-slate-100">{KNOWN_GPREC_SCHOLAR_NAMES[scholar.rawRoll] || scholar.name}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-slate-300 text-[11px]">{scholar.email}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/20 text-[10px] font-bold">
                          {scholar.department}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-slate-300 text-[11px]">{scholar.year}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${readinessBadge.color}`}>
                          {readinessBadge.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          scholar.isCustom 
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' 
                            : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          {scholar.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 📲 Instant WhatsApp Share */}
                          <button
                            onClick={() => handleOpenWhatsAppInvite(scholar)}
                            className="px-2 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                            title="Share instant WhatsApp invite message with student"
                          >
                            <span>WhatsApp</span>
                          </button>

                          {/* ✉️ Send Official Welcome Email */}
                          <button
                            onClick={() => handleSendWelcomeEmail(scholar)}
                            disabled={isSendingWelcomeEmail[scholar.rollNumber]}
                            className="px-2 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                            title="Dispatch official welcome clearance email to student inbox"
                          >
                            {isSendingWelcomeEmail[scholar.rollNumber] ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <span>Email</span>
                            )}
                          </button>

                          <button
                            onClick={() => handleOpenEditModal(scholar)}
                            className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 border border-blue-500/20 transition-all cursor-pointer"
                            title="Edit scholar data"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleRemoveScholar(scholar)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-all cursor-pointer"
                            title="Permanently delete user & revoke placement access"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )})}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-white/[0.02] border-t border-white/5 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
            <span>Whitelisted scholars can enter their roll number at <strong className="text-amber-300">gprec.lumixora.in</strong> and complete 5-minute rolling OTP verification.</span>
            <span className="text-[11px] text-slate-500">Auto-synchronized across localStorage and cloud database</span>
          </div>
        </div>
      ) : (
        /* Login History & Time Logs Table */
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
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin text-amber-400 mx-auto mb-2" />
                      <span>Loading real-time login audit telemetry...</span>
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-slate-500">
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

                        {/* 8. Actions (Revoke User & Delete Log) */}
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {item.rollNumber ? (
                              <button
                                onClick={() => handleRemoveScholar({ rollNumber: item.rollNumber, name: item.name })}
                                className="px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/25 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                                title={`Permanently delete & revoke access for scholar ${item.rollNumber}`}
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Delete User</span>
                              </button>
                            ) : null}
                            <button
                              onClick={() => handleDeleteLog(item)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-red-400 border border-white/5 transition-all cursor-pointer"
                              title="Delete this session record"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
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
      )}

      {/* Add / Whitelist Scholar Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl bg-[#0B132B] border border-amber-500/40 p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-sora">
                  {addMode === 'single' ? 'Whitelist GPREC Scholar' : 'Bulk Import GPREC Scholars'}
                </h3>
                <p className="text-xs text-slate-400">
                  Allow student to pass OTP gate and enter the Placement Suite
                </p>
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/10 mb-4">
              <button
                type="button"
                onClick={() => setAddMode('single')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  addMode === 'single' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Single Scholar
              </button>
              <button
                type="button"
                onClick={() => setAddMode('bulk')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  addMode === 'bulk' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Bulk Import
              </button>
            </div>

            {addMode === 'single' ? (
              <form onSubmit={handleAddSingleScholar} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    GPREC Roll Number <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={singleRoll}
                    onChange={(e) => setSingleRoll(e.target.value)}
                    placeholder="e.g. 249XA33106 or 249XA33107"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 uppercase tracking-wider"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Institutional email will automatically be resolved to: <span className="text-amber-300 font-mono">{singleRoll ? `${singleRoll.trim().toLowerCase()}@gprec.ac.in` : 'roll@gprec.ac.in'}</span>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Scholar Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={singleName}
                    onChange={(e) => setSingleName(e.target.value)}
                    placeholder="e.g. Mohammed Ghouse or Leave blank for auto-generate"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Department
                    </label>
                    <select
                      value={singleDept}
                      onChange={(e) => setSingleDept(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="CSM" className="bg-[#0B132B]">CSM (AI & ML)</option>
                      <option value="CSE" className="bg-[#0B132B]">CSE</option>
                      <option value="ECE" className="bg-[#0B132B]">ECE</option>
                      <option value="EEE" className="bg-[#0B132B]">EEE</option>
                      <option value="Civil" className="bg-[#0B132B]">Civil</option>
                      <option value="Mechanical" className="bg-[#0B132B]">Mechanical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Academic Year
                    </label>
                    <select
                      value={singleYear}
                      onChange={(e) => setSingleYear(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="1st Year" className="bg-[#0B132B]">1st Year (2026-2030)</option>
                      <option value="2nd Year" className="bg-[#0B132B]">2nd Year (2025-2029)</option>
                      <option value="3rd Year" className="bg-[#0B132B]">3rd Year (2024-2028)</option>
                      <option value="4th Year" className="bg-[#0B132B]">4th Year (2023-2027)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingRoster || !singleRoll.trim()}
                    className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-amber-400/20"
                  >
                    {isSubmittingRoster ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    <span>Whitelist Scholar</span>
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleBulkAddScholars} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Paste Roll Numbers <span className="text-amber-400">*</span>
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    placeholder="Paste roll numbers separated by commas, spaces, or line breaks:
249XA33106, 249XA33107
249XA33108
259XA05014"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Format: Any mix of commas, line breaks, or spaces. Duplicates will automatically be merged.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Default Department
                    </label>
                    <select
                      value={singleDept}
                      onChange={(e) => setSingleDept(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="CSM" className="bg-[#0B132B]">CSM (AI & ML)</option>
                      <option value="CSE" className="bg-[#0B132B]">CSE</option>
                      <option value="ECE" className="bg-[#0B132B]">ECE</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Default Batch Year
                    </label>
                    <select
                      value={singleYear}
                      onChange={(e) => setSingleYear(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="3rd Year" className="bg-[#0B132B]">3rd Year (2024-2028)</option>
                      <option value="2nd Year" className="bg-[#0B132B]">2nd Year (2025-2029)</option>
                      <option value="4th Year" className="bg-[#0B132B]">4th Year (2023-2027)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingRoster || !bulkInput.trim()}
                    className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-amber-400/20"
                  >
                    {isSubmittingRoster ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    <span>Import All Scholars</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Edit Scholar Modal */}
      {editingScholar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl bg-[#0B132B] border border-blue-500/40 p-6 shadow-2xl relative">
            <button
              onClick={() => setEditingScholar(null)}
              className="absolute right-4 top-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-sora">
                  Edit Scholar Details
                </h3>
                <p className="text-xs text-slate-400">
                  Update scholar name, department, or academic batch
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveScholarEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Roll Number
                </label>
                <input
                  type="text"
                  disabled
                  value={editingScholar.rollNumber}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm font-mono text-amber-400 font-bold uppercase tracking-wider opacity-80 cursor-not-allowed"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Institutional Email: <span className="text-slate-300 font-mono">{editingScholar.email}</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Scholar Full Name <span className="text-blue-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. GG PREETHI"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Department / Branch
                  </label>
                  <select
                    value={editDept}
                    onChange={(e) => setEditDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-blue-400"
                  >
                    <option value="CSE" className="bg-[#0B132B]">CSE</option>
                    <option value="CSM (AI & ML)" className="bg-[#0B132B]">CSM (AI & ML)</option>
                    <option value="ECE" className="bg-[#0B132B]">ECE</option>
                    <option value="EEE" className="bg-[#0B132B]">EEE</option>
                    <option value="Civil" className="bg-[#0B132B]">Civil</option>
                    <option value="Mechanical" className="bg-[#0B132B]">Mechanical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Academic Year / Batch
                  </label>
                  <select
                    value={editYear}
                    onChange={(e) => setEditYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-blue-400"
                  >
                    <option value="1st Year" className="bg-[#0B132B]">1st Year (2026-2030)</option>
                    <option value="2nd Year" className="bg-[#0B132B]">2nd Year (2025-2029)</option>
                    <option value="3rd Year" className="bg-[#0B132B]">3rd Year (2024-2028)</option>
                    <option value="4th Year" className="bg-[#0B132B]">4th Year (2023-2027)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingScholar(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit || !editName.trim()}
                  className="px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-blue-500/20"
                >
                  {isSubmittingEdit ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
