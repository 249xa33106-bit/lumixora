import React, { useState, useEffect, useMemo } from 'react';
import { 
  GraduationCap, Users, ClipboardList, CheckCircle, FileText, 
  HelpCircle, Search, Filter, Save, X, Edit2, Trash2, 
  RefreshCcw, Sparkles, Send, Tag, Copy, Check, Shield
} from 'lucide-react';
import { db } from '../config/firebase';
import { supabase } from '../config/supabase';
import { collection, getDocs, doc, setDoc, query, where } from 'firebase/firestore';
import { useToast } from '../context/ToastContext';
import { useData } from '../context/DataContext';
import FounderAttendanceManager from '../components/FounderAttendanceManager';
import FounderSubmissionsManager from '../components/FounderSubmissionsManager';
import FounderTestManager from '../components/FounderTestManager';
import { generateDeterministicFacultyCode, syncFacultyToDirectory } from '../services/facultyCodeService';

export default function FacultyPortal({ user, setActiveTab }) {
  const { addToast } = useToast();
  const { doubts, updateDoubt } = useData();
  const [activeView, setActiveView] = useState('scholars');
  const [scholarsList, setScholarsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState(user?.department || 'All');

  // Edit / Modify Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedScholar, setSelectedScholar] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    rollNumber: '',
    email: '',
    department: 'CSE',
    year: '1st Year',
    sem: '1-1',
    sec: 'A',
    xp: 0,
    coins: 100,
    cgpa: '9.0',
    role: 'user'
  });

  // Doubt Reply State
  const [replyText, setReplyText] = useState('');
  const [selectedDoubt, setSelectedDoubt] = useState(null);

  const facultyDept = user?.department || 'CSE';
  const facultyCollege = user?.college || 'GPREC';

  // Clean raw name that may contain embedded JSON metadata
  const cleanName = (str) => {
    if (!str || typeof str !== 'string') return 'Scholar';
    let cleaned = str;
    if (cleaned.includes('{')) cleaned = cleaned.split('{')[0].trim();
    cleaned = cleaned.replace(/[{}":;]/g, '').trim();
    return cleaned || 'Scholar';
  };
  const displayName = cleanName(user?.name);

  // Faculty Unique Identification Code
  const facultyCode = useMemo(() => {
    return generateDeterministicFacultyCode(user?.email || 'faculty@gprec.ac.in', facultyCollege);
  }, [user?.email, facultyCollege]);

  const [copiedFacultyCode, setCopiedFacultyCode] = useState(false);

  useEffect(() => {
    if (user) {
      syncFacultyToDirectory(user).catch(console.warn);
    }
  }, [user]);

  const handleCopyCode = () => {
    if (!facultyCode) return;
    navigator.clipboard.writeText(facultyCode);
    setCopiedFacultyCode(true);
    addToast({ message: `Unique Faculty Code "${facultyCode}" copied! Share with your students.`, type: 'success' });
    setTimeout(() => setCopiedFacultyCode(false), 2500);
  };

  // Fetch scholars from Supabase (with Firebase merge)
  const fetchFacultyScholars = async () => {
    setLoading(true);
    try {
      const mergedMap = new Map();

      // 1. Fetch from Supabase
      const { data: sbUsers, error: sbErr } = await supabase.from('users').select('*').range(0, 2000);
      if (sbUsers && !sbErr) {
        sbUsers.forEach(u => {
          if (u.is_deleted || u.role === 'founder' || u.role === 'faculty' || u.role === 'mentor') return;

          let meta = {};
          if (u.name && u.name.includes('{')) {
            try { meta = JSON.parse(u.name.substring(u.name.indexOf('{'))); } catch (_e) {}
          }

          const rawName = u.name || '';
          let cName = rawName.includes('{') ? rawName.split('{')[0].trim() : rawName;
          cName = cName.replace(/[{}":;]/g, '').trim();

          const email = (u.email || '').toLowerCase().trim();
          if (!cName || cName.toLowerCase() === 'scholar') {
            if (email && email.endsWith('@gprec.ac.in')) {
              cName = `Scholar (${email.split('@')[0].toUpperCase()})`;
            } else if (email && email.includes('@') && !email.includes('@scholar.lumixora.com')) {
              cName = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            } else {
              cName = 'Scholar';
            }
          }

          const rollNumber = u.rollNumber || meta.rollNumber || (email && email.endsWith('@gprec.ac.in') ? email.split('@')[0].toUpperCase() : '');
          const department = u.department || u.branch || meta.department || meta.branch || 'CSE';
          const year = u.year || meta.year || '1st Year';
          const sem = u.sem || u.semester || meta.sem || '1-1';
          const sec = u.sec || u.section || meta.sec || 'A';
          const xp = (u.xp !== undefined && u.xp !== null) ? u.xp : (meta.xp || 50);
          const coins = (u.coins !== undefined && u.coins !== null) ? u.coins : (meta.coins || 100);

          const scholarObj = {
            id: u.id,
            uid: u.id,
            name: cName,
            email: u.email || '',
            college: u.college || meta.college || 'GPREC',
            department,
            branch: department,
            year,
            sem,
            sec,
            rollNumber,
            xp,
            coins,
            cgpa: u.cgpa || meta.cgpa || '8.5',
            role: u.role || 'user',
            is_blocked: u.is_blocked || false
          };

          mergedMap.set(u.id, scholarObj);
          if (email) mergedMap.set(email, scholarObj);
        });
      }

      // 2. Merge from Firestore if available
      try {
        const snap = await getDocs(collection(db, 'users'));
        snap.forEach(d => {
          const data = d.data();
          if (data.is_deleted || data.isDeleted || data.role === 'founder' || data.role === 'faculty' || data.role === 'mentor') return;
          const email = (data.email || '').toLowerCase().trim();
          const existing = mergedMap.get(d.id) || (email ? mergedMap.get(email) : null);
          if (existing) {
            if (data.cleanName) existing.name = data.cleanName;
            if (data.rollNumber) existing.rollNumber = data.rollNumber;
            if (data.department) existing.department = data.department;
            if (data.xp) existing.xp = data.xp;
            if (data.coins) existing.coins = data.coins;
          }
        });
      } catch (fbErr) {
        console.warn("Firestore fetch in FacultyPortal:", fbErr);
      }

      const list = Array.from(new Set(mergedMap.values()));
      setScholarsList(list);
    } catch (err) {
      console.error("Error fetching scholars for faculty portal:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacultyScholars();
  }, []);

  const filteredScholars = useMemo(() => {
    return scholarsList.filter(s => {
      const matchesSearch = 
        (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.rollNumber || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDept = selectedDept === 'All' || 
        (s.department || s.branch || '').toLowerCase() === selectedDept.toLowerCase();

      return matchesSearch && matchesDept;
    });
  }, [scholarsList, searchTerm, selectedDept]);

  // Open Edit Modal
  const handleOpenEdit = (scholar) => {
    setSelectedScholar(scholar);
    setEditForm({
      name: cleanName(scholar.name),
      rollNumber: scholar.rollNumber || (scholar.email && scholar.email.endsWith('@gprec.ac.in') ? scholar.email.split('@')[0].toUpperCase() : ''),
      department: scholar.department || scholar.branch || 'CSE',
      year: scholar.year || '1st Year',
      sem: scholar.sem || scholar.semester || '1-1',
      sec: scholar.sec || scholar.section || 'A',
      xp: scholar.xp || 0,
      coins: scholar.coins || 0,
      cgpa: scholar.cgpa || '8.5',
      role: scholar.role || 'user'
    });
    setIsEditModalOpen(true);
  };

  // Save Scholar Modifications
  const handleSaveScholar = async (e) => {
    e.preventDefault();
    if (!selectedScholar) return;

    try {
      const scholarId = selectedScholar.id || selectedScholar.uid;
      const cleanNameStr = editForm.name.includes('{') ? editForm.name.split('{')[0].trim() : editForm.name.trim();
      const newMetadata = {
        college: selectedScholar.college || 'GPREC',
        department: editForm.department,
        branch: editForm.department,
        year: editForm.year,
        sem: editForm.sem,
        sec: editForm.sec,
        rollNumber: editForm.rollNumber.trim().toUpperCase(),
        qualification: selectedScholar.qualification || 'B.Tech',
        place: selectedScholar.place || 'Kurnool'
      };
      const packedName = `${cleanNameStr} ${JSON.stringify(newMetadata)}`;

      const updates = {
        name: packedName,
        displayName: cleanNameStr,
        cleanName: cleanNameStr,
        rollNumber: editForm.rollNumber.trim().toUpperCase(),
        college: selectedScholar.college || 'GPREC',
        department: editForm.department,
        branch: editForm.department,
        year: editForm.year,
        sem: editForm.sem,
        sec: editForm.sec,
        xp: parseInt(editForm.xp, 10) || 0,
        coins: parseInt(editForm.coins, 10) || 0,
        cgpa: editForm.cgpa.trim(),
        role: editForm.role
      };

      // 1. Sync to Firebase Firestore
      try {
        if (scholarId) {
          await setDoc(doc(db, 'users', scholarId), updates, { merge: true });
          await setDoc(doc(db, 'Users', scholarId), updates, { merge: true });
        }
        if (selectedScholar.email) {
          const q = query(collection(db, 'users'), where('email', '==', selectedScholar.email));
          const snap = await getDocs(q);
          snap.forEach(async (d) => {
            await setDoc(doc(db, 'users', d.id), updates, { merge: true });
            await setDoc(doc(db, 'Users', d.id), updates, { merge: true });
          });
        }
      } catch (fbErr) {
        console.warn("Firestore scholar update notice:", fbErr);
      }

      // 2. Sync to Supabase
      try {
        if (scholarId) {
          await supabase.from('users').update(updates).eq('id', scholarId);
        }
        if (selectedScholar.email) {
          await supabase.from('users').update(updates).eq('email', selectedScholar.email);
        }
      } catch (sbErr) {
        console.warn("Supabase scholar update notice:", sbErr);
      }

      // 3. Update local state
      setScholarsList(prev => prev.map(s => (s.id === scholarId || s.email === selectedScholar.email) ? { ...s, ...updates } : s));

      addToast({ message: `Scholar ${editForm.name} profile modified & saved successfully!`, type: 'success' });
      setIsEditModalOpen(false);
      setSelectedScholar(null);
    } catch (err) {
      console.error('Error saving scholar modifications:', err);
      addToast({ message: 'Failed to save modifications.', type: 'error' });
    }
  };

  // Delete / Deactivate Scholar
  const handleDeleteScholar = async (scholar) => {
    const scholarName = cleanName(scholar.name);
    if (!window.confirm(`Are you sure you want to deactivate ${scholarName}? This will revoke their platform access.`)) return;

    try {
      const scholarId = scholar.id || scholar.uid;
      const deletePayload = { is_deleted: true, isDeleted: true };

      // 1. Sync to Firestore
      try {
        if (scholarId) {
          await setDoc(doc(db, 'users', scholarId), deletePayload, { merge: true });
          await setDoc(doc(db, 'Users', scholarId), deletePayload, { merge: true });
        }
        if (scholar.email) {
          const q = query(collection(db, 'users'), where('email', '==', scholar.email));
          const snap = await getDocs(q);
          snap.forEach(async (d) => {
            await setDoc(doc(db, 'users', d.id), deletePayload, { merge: true });
          });
        }
      } catch (fbErr) {
        console.warn("Firestore delete notice:", fbErr);
      }

      // 2. Sync to Supabase
      try {
        if (scholarId) {
          await supabase.from('users').update(deletePayload).eq('id', scholarId);
        }
        if (scholar.email) {
          await supabase.from('users').update(deletePayload).eq('email', scholar.email);
        }
      } catch (sbErr) {
        console.warn("Supabase delete notice:", sbErr);
      }

      // Remove from local list
      setScholarsList(prev => prev.filter(s => s.id !== scholarId && s.email !== scholar.email));
      addToast({ message: `Scholar ${scholarName} deactivated successfully.`, type: 'success' });
    } catch (err) {
      console.error('Error deleting scholar:', err);
      addToast({ message: 'Failed to deactivate scholar.', type: 'error' });
    }
  };

  // Department Doubt Clearing
  const departmentDoubts = useMemo(() => {
    if (!doubts) return [];
    return doubts.filter(d => 
      !d.resolved && 
      (d.department?.toLowerCase() === facultyDept.toLowerCase() || !d.department)
    );
  }, [doubts, facultyDept]);

  const handleSendDoubtResponse = async (doubtId) => {
    if (!replyText.trim()) {
      addToast({ message: 'Please enter a reply before sending.', type: 'warning' });
      return;
    }

    try {
      await updateDoubt(doubtId, {
        mentorReply: replyText.trim(),
        repliedBy: `${displayName} (${facultyDept} Faculty)`,
        repliedAt: new Date().toISOString(),
        resolved: true
      });

      addToast({ message: 'Response sent and doubt marked as resolved!', type: 'success' });
      setReplyText('');
      setSelectedDoubt(null);
    } catch (err) {
      console.error("Error sending doubt response:", err);
      addToast({ message: 'Failed to send doubt response.', type: 'error' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-fade-in text-white">
      {/* Faculty Command Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-brand-teal/30 relative overflow-hidden bg-gradient-to-r from-[#0d1527] via-[#121b2d] to-[#181329] shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-brand-teal/20 text-brand-teal border border-brand-teal/40 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                Faculty Portal Command Center
              </span>
              <span className="px-3 py-1 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-black text-xs sm:text-sm uppercase tracking-wider shadow-sm">
                {facultyCollege}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Welcome, Prof. {displayName} 🎓
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl font-medium">
              Manage student rosters, edit scholar profiles, mark class attendance, create departmental assessments, and answer academic doubts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Faculty Unique Code Badge */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/40 flex items-center justify-between gap-3 shadow-lg">
              <div>
                <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-wider block">
                  Your Faculty Code
                </span>
                <span className="font-mono text-xs sm:text-sm font-black text-amber-300 tracking-wider">
                  {facultyCode}
                </span>
              </div>
              <button
                onClick={handleCopyCode}
                className="px-2.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black flex items-center gap-1 transition-all cursor-pointer shadow"
                title="Copy Unique Faculty Code"
              >
                {copiedFacultyCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFacultyCode ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <button
              onClick={() => setActiveTab && setActiveTab('grievance')}
              className="px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>Student Grievance Inbox</span>
            </button>

            <button
              onClick={fetchFacultyScholars}
              className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-gray-300 transition-colors self-end sm:self-auto"
              title="Refresh Roster"
            >
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-teal' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-6 border-t border-white/10 pt-4 custom-scrollbar">
          <button
            onClick={() => setActiveView('scholars')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeView === 'scholars' 
                ? 'bg-brand-teal/20 text-brand-teal border border-brand-teal/50 shadow-md' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" /> Department Scholars ({scholarsList.length})
          </button>

          <button
            onClick={() => setActiveView('attendance')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeView === 'attendance' 
                ? 'bg-brand-teal/20 text-brand-teal border border-brand-teal/50 shadow-md' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ClipboardList className="w-4 h-4" /> Class Attendance
          </button>

          <button
            onClick={() => setActiveView('tests')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeView === 'tests' 
                ? 'bg-brand-purple/20 text-brand-purple border border-brand-purple/50 shadow-md' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-4 h-4" /> Tests & Assignments
          </button>

          <button
            onClick={() => setActiveView('submissions')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeView === 'submissions' 
                ? 'bg-amber-400/20 text-amber-400 border border-amber-400/50 shadow-md' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <CheckCircle className="w-4 h-4" /> Student Submissions
          </button>

          <button
            onClick={() => setActiveView('doubts')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeView === 'doubts' 
                ? 'bg-brand-pink/20 text-brand-pink border border-brand-pink/50 shadow-md' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <HelpCircle className="w-4 h-4" /> Scholar Doubts ({departmentDoubts.length})
          </button>
        </div>
      </div>

      {/* Main View Router */}
      {activeView === 'scholars' && (
        <div className="space-y-4">
          {/* Quick Roster Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3 shadow-sm">
              <div className="p-2.5 rounded-xl bg-brand-teal/20 text-brand-teal border border-brand-teal/30">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Scholars</span>
                <span className="text-lg font-black text-white">{scholarsList.length}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3 shadow-sm">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                <Filter className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">In Current View</span>
                <span className="text-lg font-black text-cyan-300">{filteredScholars.length}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3 shadow-sm">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">CSE Dept</span>
                <span className="text-lg font-black text-purple-300">
                  {scholarsList.filter(s => (s.department || '').toUpperCase().includes('CSE')).length}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3 shadow-sm">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Avg Aura (AP)</span>
                <span className="text-lg font-black text-amber-300">
                  {scholarsList.length ? Math.round(scholarsList.reduce((a, b) => a + (b.xp || 0), 0) / scholarsList.length) : 0} AP
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search scholars by name, email, roll..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-teal"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-bold flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-brand-teal" /> Branch:
              </span>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-[#11111a] border border-white/10 text-xs text-white px-3 py-2 rounded-xl font-semibold outline-none cursor-pointer focus:border-brand-teal"
              >
                <option value="All">All Departments</option>
                <option value="CSE">CSE</option>
                <option value="CSM">CSM</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="Civil">Civil</option>
                <option value="Mechanical">Mechanical</option>
              </select>
            </div>
          </div>

          {/* Scholars Roster Table with Edit / Modify & Delete actions */}
          <div className="glass-panel rounded-3xl overflow-hidden border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    <th className="p-4 pl-6">Scholar Name</th>
                    <th className="p-4">Department & Year</th>
                    <th className="p-4">Sem & Section</th>
                    <th className="p-4 text-center">AP (XP)</th>
                    <th className="p-4 text-center">Synapte Coins</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center pr-6">Manage Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs font-medium">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-gray-400">Loading scholars roster...</td>
                    </tr>
                  ) : filteredScholars.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-gray-400">No scholars match the search criteria.</td>
                    </tr>
                  ) : (
                    filteredScholars.map(s => {
                      const cleanStudentName = cleanName(s.name);
                      return (
                        <tr key={s.id} className="hover:bg-white/5 transition-colors group">
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-brand-teal/20 border border-brand-teal/40 flex items-center justify-center font-bold text-brand-teal text-xs shrink-0">
                                {cleanStudentName[0].toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-white text-xs">{cleanStudentName}</p>
                                <p className="text-[11px] text-gray-400">{s.email}</p>
                                {s.rollNumber && <p className="text-[10px] text-brand-teal font-mono">{s.rollNumber}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-gray-300">
                            <span className="font-bold text-brand-teal">{s.department || 'CSE'}</span> · {s.year || '1st Year'}
                          </td>
                          <td className="p-4 text-gray-300">
                            <span className="font-medium">{s.sem || s.semester || '1-1'}</span> · Sec <span className="font-bold text-white">{s.sec || s.section || 'A'}</span>
                          </td>
                          <td className="p-4 text-center font-bold text-amber-400">
                            {s.xp || 0} AP
                          </td>
                          <td className="p-4 text-center font-bold text-green-400">
                            {s.coins !== undefined ? s.coins : 100} SC
                          </td>
                          <td className="p-4 text-center">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/40">
                              Active Student
                            </span>
                          </td>
                          <td className="p-4 text-center pr-6">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenEdit(s)}
                                className="p-2 bg-brand-teal/10 hover:bg-brand-teal/20 text-brand-teal border border-brand-teal/30 rounded-xl transition-all cursor-pointer shadow-sm"
                                title="Edit & Modify Scholar Profile"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteScholar(s)}
                                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl transition-all cursor-pointer shadow-sm"
                                title="Deactivate / Delete Scholar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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
          </div>
        </div>
      )}

      {/* Attendance View */}
      {activeView === 'attendance' && (
        <FounderAttendanceManager />
      )}

      {/* Tests View */}
      {activeView === 'tests' && (
        <FounderTestManager />
      )}

      {/* Submissions & PDF Download View */}
      {activeView === 'submissions' && (
        <FounderSubmissionsManager />
      )}

      {/* Doubts View */}
      {activeView === 'doubts' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-brand-pink" />
              <span>Scholar Doubt Clearing Center</span>
            </h2>
            <p className="text-xs text-gray-400">
              Directly address questions raised by students in your academic branch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departmentDoubts.length === 0 ? (
              <div className="col-span-full p-12 text-center text-gray-400 bg-white/5 border border-white/5 rounded-3xl">
                <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2 opacity-80" />
                <h3 className="font-bold text-white text-base">All Caught Up!</h3>
                <p className="text-xs text-gray-400 mt-1">No pending student doubts in the queue.</p>
              </div>
            ) : (
              departmentDoubts.map(d => (
                <div key={d.id} className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="px-2 py-0.5 rounded-full bg-brand-pink/20 text-brand-pink text-[10px] font-bold">
                        {d.subject || 'General'}
                      </span>
                      <h4 className="font-bold text-white text-sm mt-1">{d.title || d.question}</h4>
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 bg-white/5 p-3 rounded-xl">
                    {d.description || d.question}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-white/5">
                    <span>Asked by: <strong className="text-white">{cleanName(d.studentName || d.userName)}</strong></span>
                    <button
                      onClick={() => {
                        setSelectedDoubt(d);
                        setReplyText(d.mentorReply || '');
                      }}
                      className="px-3 py-1 bg-brand-teal/20 text-brand-teal hover:bg-brand-teal/30 font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Answer Doubt &rarr;
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Answer Doubt Modal */}
      {selectedDoubt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-brand-teal/40 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-brand-teal" />
                <span>Provide Faculty Resolution</span>
              </h3>
              <button 
                onClick={() => setSelectedDoubt(null)}
                className="p-1 rounded-lg bg-white/5 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-white/5 rounded-xl text-xs space-y-1">
              <p className="font-bold text-brand-teal">{selectedDoubt.title || selectedDoubt.question}</p>
              <p className="text-gray-300">{selectedDoubt.description}</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300">Your Academic Solution:</label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your explanation, formula, or code snippet solution..."
                rows={5}
                className="w-full bg-[#11111a] border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-teal"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedDoubt(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSendDoubtResponse(selectedDoubt.id)}
                className="px-5 py-2 bg-brand-teal hover:opacity-90 text-black rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-lg"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Resolution</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit & Modify Scholar Modal */}
      {isEditModalOpen && selectedScholar && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass-panel w-full max-w-xl p-6 sm:p-8 rounded-3xl border border-brand-teal/40 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-start border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-brand-teal" />
                  <span>Modify Scholar Profile</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Update student credentials, department, section, aura points, and academic details.
                </p>
              </div>
              <button 
                onClick={() => { setIsEditModalOpen(false); setSelectedScholar(null); }}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveScholar} className="space-y-4">
              {/* Name & Roll Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Scholar Name</label>
                  <input 
                    type="text" 
                    value={editForm.name}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    required
                    className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs font-semibold focus:outline-none focus:border-brand-teal"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Roll Number / ID</label>
                  <input 
                    type="text" 
                    value={editForm.rollNumber}
                    onChange={e => setEditForm({ ...editForm, rollNumber: e.target.value })}
                    placeholder="e.g. 249XA04093"
                    className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs font-semibold focus:outline-none focus:border-brand-teal"
                  />
                </div>
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase">Institutional Email</label>
                <input 
                  type="email" 
                  value={editForm.email}
                  disabled
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-3.5 py-2.5 text-gray-400 text-xs font-mono cursor-not-allowed"
                />
              </div>

              {/* Department & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Branch / Department</label>
                  <select 
                    value={editForm.department}
                    onChange={e => setEditForm({ ...editForm, department: e.target.value })}
                    className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs font-semibold focus:outline-none focus:border-brand-teal cursor-pointer"
                  >
                    <option value="CSE">CSE</option>
                    <option value="CSM">CSM</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="Civil">Civil</option>
                    <option value="Mechanical">Mechanical</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Year of Study</label>
                  <select 
                    value={editForm.year}
                    onChange={e => setEditForm({ ...editForm, year: e.target.value })}
                    className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs font-semibold focus:outline-none focus:border-brand-teal cursor-pointer"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              {/* Semester & Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Semester</label>
                  <select 
                    value={editForm.sem}
                    onChange={e => setEditForm({ ...editForm, sem: e.target.value })}
                    className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs font-semibold focus:outline-none focus:border-brand-teal cursor-pointer"
                  >
                    {['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'].map(sm => (
                      <option key={sm} value={sm}>{sm}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Section</label>
                  <select 
                    value={editForm.sec}
                    onChange={e => setEditForm({ ...editForm, sec: e.target.value })}
                    className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs font-semibold focus:outline-none focus:border-brand-teal cursor-pointer"
                  >
                    {['A', 'B', 'C', 'D', 'E'].map(sc => (
                      <option key={sc} value={sc}>Section {sc}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Aura Points (AP / XP) & Synapte Coins */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Aura Points (AP)</label>
                  <input 
                    type="number" 
                    value={editForm.xp}
                    onChange={e => setEditForm({ ...editForm, xp: e.target.value })}
                    className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3.5 py-2.5 text-amber-400 text-xs font-bold focus:outline-none focus:border-brand-teal"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Synapte Coins (SC)</label>
                  <input 
                    type="number" 
                    value={editForm.coins}
                    onChange={e => setEditForm({ ...editForm, coins: e.target.value })}
                    className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3.5 py-2.5 text-green-400 text-xs font-bold focus:outline-none focus:border-brand-teal"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Academic CGPA</label>
                  <input 
                    type="text" 
                    value={editForm.cgpa}
                    onChange={e => setEditForm({ ...editForm, cgpa: e.target.value })}
                    placeholder="9.0"
                    className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs font-semibold focus:outline-none focus:border-brand-teal"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button 
                  type="button"
                  onClick={() => { setIsEditModalOpen(false); setSelectedScholar(null); }}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl border border-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-brand-teal hover:opacity-90 text-black font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Modifications</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
