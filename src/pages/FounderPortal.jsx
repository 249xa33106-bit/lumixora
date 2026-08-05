import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, 
  Users, 
  Search, 
  X, 
  Award, 
  Flame, 
  BookOpen, 
  Clock, 
  Activity, 
  UserCheck, 
  Star, 
  FileText, 
  CheckCircle, 
  Database,
  SearchCode,
  Heart,
  HelpCircle,
  Coins,
  ArrowUpDown,
  Filter,
  Save,
  Check,
  Target,
  ClipboardList
} from 'lucide-react';
import { supabase } from '../config/supabase';
import { db } from '../config/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { parseProfileName, getAuraStateName } from '../services/gamificationService';
import { useToast } from '../context/ToastContext';
import FounderTestManager from '../components/FounderTestManager';
import FounderSubmissionsManager from '../components/FounderSubmissionsManager';
import FounderFrequentUsers from '../components/FounderFrequentUsers';
import FounderAssignedTasks from '../components/FounderAssignedTasks';

export default function FounderPortal({ user }) {
  const { addToast } = useToast();
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState('scholars'); // 'scholars', 'tests', 'submissions'
  
  // Filter States
  const [selectedCollege, setSelectedCollege] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  const [sortBy, setSortBy] = useState('xp'); // 'xp', 'created_at', 'name'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

  // Selected User for Detail View/Edit
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    xp: 0,
    level: 1,
    coins: 0,
    role: 'user',
    college: '',
    department: '',
    year: '1st Year',
    sem: '1',
    sec: 'A'
  });

  // Load all users from both Firestore and Supabase
  const loadUsersData = async () => {
    setLoading(true);
    try {
      const mergedMap = new Map();

      // 1. Fetch from Supabase
      try {
        const { data: sbUsers, error: sbErr } = await supabase.from('users').select('*');
        if (!sbErr && sbUsers) {
          sbUsers.forEach(u => {
            const parsed = parseProfileName(u.name);
            const registerDate = u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A';
            
            mergedMap.set(u.id || u.uid, {
              id: u.id || u.uid,
              uid: u.id || u.uid,
              name: parsed.name,
              email: u.email || '',
              college: parsed.college || 'GPREC',
              department: parsed.department || 'CSE',
              year: parsed.year || '1st Year',
              place: parsed.place || 'Kurnool',
              qualification: parsed.qualification || 'B.Tech',
              role: u.role || 'user',
              xp: u.xp !== undefined && u.xp !== null ? u.xp : 0,
              level: u.level !== undefined && u.level !== null ? u.level : 1,
              coins: u.coins !== undefined && u.coins !== null ? u.coins : 0,
              streak: u.streak !== undefined && u.streak !== null ? u.streak : 0,
              created_at: registerDate,
              last_test_date: u.last_test_date || null,
              tests_written: u.tests_written || 0,
              source: 'Supabase',
              metadata: parsed
            });
          });
        }
      } catch (err) {
        console.warn("Supabase user fetch failed:", err);
      }

      // 2. Fetch from Firestore
      try {
        const firestoreUsersRef = collection(db, 'users');
        const firestoreSnap = await getDocs(firestoreUsersRef);
        firestoreSnap.forEach(docSnap => {
          const u = docSnap.data();
          const uid = docSnap.id || u.uid;
          const parsed = parseProfileName(u.name);
          const existing = mergedMap.get(uid) || {};
          
          mergedMap.set(uid, {
            ...existing,
            id: uid,
            uid: uid,
            name: u.name || existing.name || parsed.name,
            email: u.email || existing.email || '',
            college: u.college || existing.college || parsed.college,
            department: u.department || existing.department || parsed.department,
            year: u.year || existing.year || parsed.year,
            sem: u.sem || existing.sem || '1',
            sec: u.sec || existing.sec || 'A',
            place: u.place || existing.place || parsed.place,
            qualification: u.qualification || existing.qualification || parsed.qualification,
            role: u.role || existing.role || 'user',
            xp: u.xp !== undefined ? u.xp : (existing.xp || 0),
            level: u.level !== undefined ? u.level : (existing.level || 1),
            coins: u.coins !== undefined ? u.coins : (existing.coins || 100),
            streak: u.streak !== undefined ? u.streak : (existing.streak || 0),
            created_at: u.created_at ? new Date(u.created_at).toLocaleDateString() : (existing.created_at || 'N/A'),
            last_test_date: u.last_test_date || existing.last_test_date || null,
            tests_written: u.tests_written !== undefined ? u.tests_written : (existing.tests_written || 0),
            source: existing.source ? 'Firestore + Supabase' : 'Firestore',
            badges: u.badges || [],
            completedDays: u.completedDays || [],
            studyHours: u.studyHours || 0,
            quizScore: u.quizScore || 0,
            notesShared: u.notesShared || 0,
            learningStyle: u.learningStyle || 'Practical',
            weakSubjects: u.weakSubjects || '',
            careerGoal: u.careerGoal || 'Placement',
            cgpa: u.cgpa || '9.0'
          });
        });
      } catch (err) {
        console.warn("Firestore user fetch failed:", err);
      }

      // 3. Fallback to LocalStorage competitive users if both failed/empty
      if (mergedMap.size === 0) {
        const cachedUsers = localStorage.getItem('lumixora_gamify_users');
        if (cachedUsers) {
          const parsed = JSON.parse(cachedUsers);
          Object.keys(parsed).forEach(uid => {
            const u = parsed[uid];
            mergedMap.set(uid, {
              ...u,
              id: uid,
              uid: uid,
              source: 'LocalStorage Local Cache'
            });
          });
        }
      }

      setUsersList(Array.from(mergedMap.values()));
    } catch (error) {
      console.error("Error loading users list:", error);
      addToast({ message: 'Failed to retrieve all users.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsersData();
  }, []);

  // Filter & Sort Logic
  const filteredUsers = useMemo(() => {
    return usersList
      .filter(u => {
        const matchesSearch = 
          (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
          (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
          (u.id || '').toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCollege = selectedCollege === 'All' || u.college === selectedCollege;
        const matchesDept = selectedDept === 'All' || u.department === selectedDept;
        const matchesRole = selectedRole === 'All' || u.role === selectedRole;

        return matchesSearch && matchesCollege && matchesDept && matchesRole;
      })
      .sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        // String conversions for sorting
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [usersList, searchTerm, selectedCollege, selectedDept, selectedRole, sortBy, sortOrder]);

  // Extract filter sets
  const collegeOptions = useMemo(() => {
    const colleges = new Set();
    usersList.forEach(u => u.college && colleges.add(u.college));
    return ['All', ...Array.from(colleges)];
  }, [usersList]);

  const deptOptions = useMemo(() => {
    const depts = new Set();
    usersList.forEach(u => u.department && depts.add(u.department));
    return ['All', ...Array.from(depts)];
  }, [usersList]);

  // Overall Statistics
  const statistics = useMemo(() => {
    const totalScholars = usersList.length;
    const totalXp = usersList.reduce((acc, u) => acc + (u.xp || 0), 0);
    const totalCoins = usersList.reduce((acc, u) => acc + (u.coins || 0), 0);
    const founderCount = usersList.filter(u => u.role === 'founder').length;

    return {
      totalScholars,
      totalXp,
      totalCoins,
      founderCount
    };
  }, [usersList]);

  const handleEditClick = (u) => {
    setSelectedUser(u);
    setEditForm({
      xp: u.xp || 0,
      level: u.level || 1,
      coins: u.coins || 0,
      role: u.role || 'user',
      college: u.college || '',
      department: u.department || '',
      year: u.year || '1st Year',
      sem: u.sem || '1',
      sec: u.sec || 'A'
    });
    setIsEditModalOpen(true);
  };

  const handleSaveUserUpdates = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const updates = {
        xp: parseInt(editForm.xp),
        level: parseInt(editForm.level),
        coins: parseInt(editForm.coins),
        role: editForm.role,
        college: editForm.college,
        department: editForm.department,
        year: editForm.year,
        sem: editForm.sem,
        sec: editForm.sec
      };

      // 1. Sync to Firebase if available
      try {
        const userDocRef = doc(db, 'users', selectedUser.uid);
        await updateDoc(userDocRef, updates);
        
        // Also sync leaderboards index
        const boardDocRef = doc(db, 'leaderboards', selectedUser.uid);
        await updateDoc(boardDocRef, {
          xp: updates.xp,
          level: updates.level,
          college: updates.college,
          department: updates.department,
          year: updates.year
        });
      } catch (err) {
        console.warn("Firestore sync failed on save:", err);
      }

      // 2. Sync to Supabase if available
      try {
        const { error } = await supabase
          .from('users')
          .update({
            role: updates.role,
            xp: updates.xp,
            level: updates.level,
            coins: updates.coins
          })
          .eq('id', selectedUser.uid);
        
        if (error) throw error;
      } catch (err) {
        console.warn("Supabase update failed on save:", err);
      }

      // 3. Update local state
      setUsersList(prev => prev.map(u => u.uid === selectedUser.uid ? { ...u, ...updates } : u));
      addToast({ message: 'User stats updated successfully!', type: 'success' });
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error(err);
      addToast({ message: 'Failed to update user stats.', type: 'error' });
    }
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-white pb-12">
      
      {/* Portal Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-100 uppercase tracking-tight flex items-center gap-2">
            <Shield className="w-8 h-8 text-brand-teal animate-pulse" />
            <span>Founder Control Deck</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">
            Authorized admin control room to oversee platform scholars, manage tests, and maintain platform security.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveView('scholars')}
              className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide flex items-center gap-2 transition-all ${activeView === 'scholars' ? 'bg-brand-teal text-black shadow-sm' : 'text-gray-400 hover:text-white'}`}
            >
              <Users className="w-4 h-4" /> Scholars
            </button>
            <button
              onClick={() => setActiveView('tests')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                activeView === 'tests'
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <FileText className="w-4 h-4" />
              Test Manager
            </button>
            <button
              onClick={() => setActiveView('submissions')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                activeView === 'submissions'
                  ? 'bg-brand-teal text-white shadow-sm'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Submissions
            </button>
            <button
              onClick={() => setActiveView('frequent')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                activeView === 'frequent'
                  ? 'bg-brand-pink text-white shadow-sm'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Flame className="w-4 h-4" />
              Frequent Users
            </button>
            <button
              onClick={() => setActiveView('assigned_tasks')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                activeView === 'assigned_tasks'
                  ? 'bg-brand-purple text-white shadow-sm'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              Assigned Tasks
            </button>
          </div>

          {activeView === 'scholars' && (
            <button
              onClick={loadUsersData}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 hover:border-white/10 text-xs font-bold rounded-xl hover:bg-white/10 transition-all cursor-pointer"
            >
              <Activity className="w-4 h-4 text-brand-teal" />
              Refresh
            </button>
          )}
        </div>
      </div>

      {activeView === 'submissions' ? (
        <FounderSubmissionsManager />
      ) : activeView === 'tests' ? (
        <FounderTestManager />
      ) : activeView === 'frequent' ? (
        <FounderFrequentUsers usersList={usersList} />
      ) : activeView === 'assigned_tasks' ? (
        <FounderAssignedTasks />
      ) : (
        <>
          {/* Analytics widgets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="glass-panel p-5 rounded-2xl border border-white/5 relative overflow-hidden flex items-center gap-4">
          <div className="p-3 icon-3d-teal shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase block leading-none">Total Scholars</span>
            <span className="text-xl font-semibold text-white mt-1 block">{statistics.totalScholars}</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 relative overflow-hidden flex items-center gap-4">
          <div className="p-3 icon-3d-blue shrink-0">
            <Award className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase block leading-none">Global Aura Resonance</span>
            <span className="text-xl font-semibold text-white mt-1 block">{statistics.totalXp.toLocaleString()} AP</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 relative overflow-hidden flex items-center gap-4">
          <div className="p-3 icon-3d-pink shrink-0">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase block leading-none">Total Synaptic Energy</span>
            <span className="text-xl font-semibold text-white mt-1 block">{statistics.totalCoins.toLocaleString()} SC</span>
          </div>
        </div>

      </div>

      {/* Control filters bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search scholars by name, email, or UID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-white placeholder-gray-500"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          
          <div className="flex items-center gap-1.5 bg-black/35 px-3 py-1.5 rounded-xl border border-white/5 text-xs text-gray-300">
            <Filter className="w-3.5 h-3.5 text-brand-teal" />
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="bg-transparent outline-none cursor-pointer font-semibold tracking-wide text-[10px] text-white"
            >
              <option value="All" className="bg-[#0b0b14]">All Colleges</option>
              {collegeOptions.filter(c => c !== 'All').map(col => (
                <option key={col} value={col} className="bg-[#0b0b14]">{col}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-black/35 px-3 py-1.5 rounded-xl border border-white/5 text-xs text-gray-300">
            <BookOpen className="w-3.5 h-3.5 text-brand-blue" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-transparent outline-none cursor-pointer font-semibold tracking-wide text-[10px] text-white"
            >
              <option value="All" className="bg-[#0b0b14]">All Depts</option>
              {deptOptions.filter(d => d !== 'All').map(dept => (
                <option key={dept} value={dept} className="bg-[#0b0b14]">{dept}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-black/35 px-3 py-1.5 rounded-xl border border-white/5 text-xs text-gray-300">
            <Shield className="w-3.5 h-3.5 text-brand-pink" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-transparent outline-none cursor-pointer font-semibold tracking-wide text-[10px] text-white"
            >
              <option value="All" className="bg-[#0b0b14]">All Roles</option>
              <option value="user" className="bg-[#0b0b14]">Students</option>
              <option value="founder" className="bg-[#0b0b14]">Founders</option>
            </select>
          </div>

        </div>

      </div>

      {/* Main Scholars Database Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-[10px] text-gray-400 font-bold tracking-wide">
                <th className="p-4 pl-6 cursor-pointer hover:text-white" onClick={() => toggleSort('name')}>
                  <div className="flex items-center gap-1">
                    <span>Scholar</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 cursor-pointer hover:text-white" onClick={() => toggleSort('college')}>
                  <div className="flex items-center gap-1">
                    <span>Institution</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>

                <th className="p-4 text-center">Sync Source</th>
                <th className="p-4 text-center w-24">Management</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-8 h-8 border-4 border-brand-teal border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs text-gray-400 font-semibold mt-2">Connecting to secure core database...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-16 text-center text-xs text-gray-500 italic">
                    No scholars found matching the queries.
                  </td>
                </tr>
              ) : filteredUsers.map((u) => (
                <tr 
                  key={u.id}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full icon-3d-teal relative">
                        {u.role === 'founder' && (
                          <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-pink rounded-full flex items-center justify-center border border-[#0a0a0f]" title="Founder Access">
                            <Shield className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                        {u.name ? u.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'S'}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-100 block">{u.name}</span>
                        <span className="text-[10px] text-gray-500 font-semibold block">{u.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-xs font-medium text-gray-300">
                    <div>
                      <span>{u.college || 'GPREC'}</span>
                      <span className="text-[10px] text-gray-500 block font-semibold uppercase">{u.department || 'CSE'} • {u.year || '1st Year'}</span>
                    </div>
                  </td>

                  <td className="p-4 text-center text-[10px] font-bold text-gray-400">
                    <span className="px-2 py-0.5 bg-white/5 rounded border border-white/5 tracking-wide flex items-center justify-center gap-1 w-max mx-auto">
                      <Database className="w-3 h-3 text-brand-blue" />
                      <span>{u.source}</span>
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleEditClick(u)}
                      className="px-3 py-1.5 rounded-lg bg-brand-teal/10 border border-white/10 text-brand-teal hover:bg-brand-teal hover:text-black font-extrabold text-[10px] tracking-wide transition-all cursor-pointer"
                    >
                      Control
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Control Stats / Roles edit modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-white/10 relative text-left bg-gradient-to-br from-[#0c0c16] via-transparent to-transparent max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <button 
              onClick={() => { setIsEditModalOpen(false); setSelectedUser(null); }}
              className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold text-gray-100 uppercase tracking-tight flex items-center gap-2 mb-6">
              <Shield className="w-6 h-6 text-brand-teal" />
              <span>Modify Scholar Control Profile</span>
            </h2>

            {/* Quick Profile Overview */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 mb-6 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full icon-3d-blue flex items-center justify-center">
{selectedUser.name ? selectedUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'S'}
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white">{selectedUser.name}</h4>
                <p className="text-xs text-gray-400 font-semibold">{selectedUser.email}</p>
                <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-widest">{selectedUser.id}</p>
              </div>
            </div>

            <form onSubmit={handleSaveUserUpdates} className="space-y-4">
              
              {/* Row 1: XP and Coins */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold tracking-wide flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-brand-blue" />
                    <span>Aura Resonance (AP)</span>
                  </label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={editForm.xp}
                    onChange={e => setEditForm({ ...editForm, xp: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs font-semibold focus:outline-none focus:border-white/10"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold tracking-wide flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Synaptic Energy (SC)</span>
                  </label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={editForm.coins}
                    onChange={e => setEditForm({ ...editForm, coins: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs font-semibold focus:outline-none focus:border-white/10"
                  />
                </div>
              </div>

              {/* Row 2: Level */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold tracking-wide flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-brand-teal" />
                  <span>Resonance Level</span>
                </label>
                <input 
                  type="number" 
                  required
                  min="1"
                  value={editForm.level}
                  onChange={e => setEditForm({ ...editForm, level: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs font-semibold focus:outline-none focus:border-white/10"
                />
              </div>

              {/* Row 3: Role and Year */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold tracking-wide">Access Role</label>
                  <select 
                    value={editForm.role}
                    onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs font-semibold focus:outline-none focus:border-white/10"
                  >
                    <option value="user">Student (Default Access)</option>
                    <option value="founder">Founder (Full Admin Access)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold tracking-wide">Year of Study</label>
                  <select 
                    value={editForm.year}
                    onChange={e => setEditForm({ ...editForm, year: e.target.value })}
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs font-semibold focus:outline-none focus:border-white/10"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Pass Out">Pass Out</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Institution and Department */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold tracking-wide">College Institution</label>
                  <input 
                    type="text" 
                    value={editForm.college}
                    onChange={e => setEditForm({ ...editForm, college: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs font-semibold focus:outline-none focus:border-white/10"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold tracking-wide">Department Course</label>
                  <input 
                    type="text" 
                    value={editForm.department}
                    onChange={e => setEditForm({ ...editForm, department: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs font-semibold focus:outline-none focus:border-white/10"
                  />
                </div>
              </div>

              {/* Row 5: Semester and Section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold tracking-wide">Semester</label>
                  <select 
                    value={editForm.sem}
                    onChange={e => setEditForm({ ...editForm, sem: e.target.value })}
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs font-semibold focus:outline-none focus:border-white/10"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={String(s)}>Sem {s}</option>
                    ))}
                    <option value="Completed">Completed</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold tracking-wide">Section</label>
                  <select 
                    value={editForm.sec}
                    onChange={e => setEditForm({ ...editForm, sec: e.target.value })}
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs font-semibold focus:outline-none focus:border-white/10"
                  >
                    {['A', 'B', 'C', 'D', 'E', 'None'].map(s => (
                      <option key={s} value={s}>Sec {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Extra Activity logs metrics read-only */}
              {selectedUser.studyHours !== undefined && (
                <div className="mt-4 pt-4 border-t border-white/5 bg-white/[0.01] p-4 rounded-xl space-y-2">
                  <h4 className="text-[10px] text-gray-400 font-semibold tracking-wide flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-brand-blue" />
                    <span>Scholar Platform Metrics (Read-only)</span>
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-gray-300">
                    <div className="bg-white/5 p-2 rounded-lg">
                      <span className="text-[9px] text-gray-500 uppercase block font-bold">Study Hours</span>
                      <span className="text-white font-mono mt-0.5 block">{selectedUser.studyHours}h</span>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg">
                      <span className="text-[9px] text-gray-500 uppercase block font-bold">Notes Shared</span>
                      <span className="text-white font-mono mt-0.5 block">{selectedUser.notesShared}</span>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg">
                      <span className="text-[9px] text-gray-500 uppercase block font-bold">CGPA</span>
                      <span className="text-white font-mono mt-0.5 block">{selectedUser.cgpa}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-4 pt-4 border-t border-white/5">
                <button 
                  type="button"
                  onClick={() => { setIsEditModalOpen(false); setSelectedUser(null); }}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold text-xs tracking-wide rounded-2xl border border-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-brand-teal hover:opacity-95 text-black font-semibold text-xs tracking-wide rounded-2xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Apply Modifications</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
}
