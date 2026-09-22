import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  Shield, 
  Users, 
  Search, 
  X, 
  Award, 
  Flame, 
  BookOpen, 
  Activity, 
  Star, 
  FileText, 
  CheckCircle, 
  Database,
  Coins,
  ArrowUpDown,
  Filter,
  Save,
  ClipboardList,
  ShoppingCart,
  MessageSquare,
  Trash2,
  RefreshCcw,
  Bell,
  GraduationCap,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase } from '../config/supabase';
import { db } from '../config/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc, onSnapshot, query, orderBy, limit, where, writeBatch } from 'firebase/firestore';
import { parseProfileName } from '../services/gamificationService';
import { useToast } from '../context/ToastContext';
import { useData } from '../context/DataContext';
import FounderTestManager from '../components/FounderTestManager';
import FounderSubmissionsManager from '../components/FounderSubmissionsManager';
import FounderFrequentUsers from '../components/FounderFrequentUsers';
import FounderAssignedTasks from '../components/FounderAssignedTasks';
import FounderAttendanceManager from '../components/FounderAttendanceManager';
import FounderCommunityManager from '../components/FounderCommunityManager';
import { 
  buildAggregatedNotifications, 
  markNotificationsAsRead, 
  clearNotificationsStorage,
  markSingleNotificationRead,
  dismissSingleNotification,
  formatNotificationTime
} from '../services/founderNotificationService';

export const cleanScholarName = (str, email = '') => {
  if (str && typeof str === 'string') {
    let cleaned = str.trim();
    if (cleaned.includes('{')) {
      try {
        const parsed = JSON.parse(cleaned.slice(cleaned.indexOf('{')));
        if (parsed.name && parsed.name.trim() && parsed.name.toLowerCase() !== 'scholar') {
          return parsed.name.trim();
        }
      } catch (e) {}
      cleaned = cleaned.split('{')[0].trim();
    }
    cleaned = cleaned.replace(/[{}:;"]/g, '').trim();
    if (cleaned && cleaned.toLowerCase() !== 'scholar' && cleaned.length > 1) {
      return cleaned;
    }
  }

  if (email && typeof email === 'string' && email.includes('@') && !email.includes('@scholar.lumixora.com')) {
    const userPart = email.split('@')[0];
    if (/\d/.test(userPart)) {
      return `Scholar (${userPart.toUpperCase()})`;
    }
    return userPart
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  return 'Scholar';
};
import FounderFacultyApprovals from '../components/FounderFacultyApprovals';
import FounderCollegesManager from '../components/FounderCollegesManager';
import FounderClubsManager from '../components/FounderClubsManager';
import FounderFeedbackManager from '../components/FounderFeedbackManager';
import FounderMarketplaceApprovals from '../components/FounderMarketplaceApprovals';
import { DEFAULT_COLLEGES } from '../data/collegesData';

// --- Mentor Connect & Doubt Manager ---
function FounderDoubtManager() {
  const { doubts, updateDoubt } = useData();
  const { addToast } = useToast();
  const [replyText, setReplyText] = useState('');
  const [selectedDoubt, setSelectedDoubt] = useState(null);

  const pendingDoubts = (doubts || []).filter(d => d.isHumanRequest && d.status === 'Pending Review');
  const resolvedDoubts = (doubts || []).filter(d => d.isHumanRequest && d.status === 'Resolved');

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedDoubt) return;

    const mentorMessage = {
      author: 'Vyomra Mentor',
      isMentor: true,
      content: replyText,
      timestamp: new Date().toISOString()
    };

    const updatedThread = [...(selectedDoubt.thread || []), mentorMessage];
    
    await updateDoubt(selectedDoubt.id, { 
      thread: updatedThread,
      status: 'Resolved' 
    });
    
    addToast({ message: "Mentor reply sent successfully!", type: "success" });
    setReplyText('');
    setSelectedDoubt(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
        <div>
          <h3 className="text-sm font-bold text-gray-200">Mentor Connect / Doubt Resolutions</h3>
          <p className="text-xs text-gray-500">Reply to student queries requiring human mentorship.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-brand-purple/10 border border-brand-purple/20 px-4 py-2 rounded-xl text-center">
            <span className="block text-brand-purple font-black text-lg">{pendingDoubts.length}</span>
            <span className="text-[10px] text-brand-purple font-bold uppercase tracking-widest">Pending</span>
          </div>
          <div className="bg-brand-teal/10 border border-brand-teal/20 px-4 py-2 rounded-xl text-center">
            <span className="block text-brand-teal font-black text-lg">{resolvedDoubts.length}</span>
            <span className="text-[10px] text-brand-teal font-bold uppercase tracking-widest">Resolved</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Queue */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 h-[500px] flex flex-col">
          <h4 className="text-xs font-bold text-brand-purple tracking-wide uppercase mb-4">Pending Review Queue</h4>
          <div className="flex-1 overflow-y-auto space-y-3">
            {pendingDoubts.length === 0 ? (
              <p className="text-xs text-gray-500 text-center mt-10">No pending mentor requests.</p>
            ) : (
              pendingDoubts.map(d => (
                <div 
                  key={d.id} 
                  onClick={() => setSelectedDoubt(d)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedDoubt?.id === d.id ? 'bg-white/10 border-brand-purple' : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-gray-400 bg-black/50 px-2 py-0.5 rounded uppercase tracking-wide">{d.tag}</span>
                    <span className="text-[10px] text-gray-500">{d.date}</span>
                  </div>
                  <p className="text-xs text-gray-300 font-medium line-clamp-2">{d.topic}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Reply Area */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 h-[500px] flex flex-col">
          <h4 className="text-xs font-bold text-gray-400 tracking-wide uppercase mb-4">Provide Mentorship</h4>
          {selectedDoubt ? (
            <div className="flex-1 flex flex-col h-full">
              <div className="flex-1 overflow-y-auto bg-black/20 rounded-xl p-4 mb-4 border border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-brand-purple/20 flex items-center justify-center font-bold text-[10px] text-brand-purple">S</div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Student Query</span>
                </div>
                <p className="text-xs text-gray-200 leading-relaxed font-medium mb-3">{selectedDoubt.topic}</p>
                {selectedDoubt.hasImage && (
                  <img src={selectedDoubt.imageUrl} alt="Attached" className="max-h-32 rounded-lg border border-white/10" />
                )}
                {selectedDoubt.thread && selectedDoubt.thread.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Thread History</span>
                    {selectedDoubt.thread.map((msg, idx) => (
                      <div key={idx} className={`p-3 rounded-xl text-xs ${msg.isMentor ? 'bg-brand-purple/10 text-gray-200' : 'bg-white/5 text-gray-300'}`}>
                        <span className="font-bold text-[10px] text-brand-purple block mb-1">{msg.author}</span>
                        {msg.content}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <form onSubmit={handleReply} className="flex gap-2">
                <input 
                  type="text" 
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your expert response..."
                  className="flex-1 glass-input rounded-xl px-4 py-2.5 text-xs text-white"
                />
                <button type="submit" className="bg-brand-purple hover:bg-brand-pink text-white px-4 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all shadow-sm">
                  Send
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <MessageSquare className="w-8 h-8 text-gray-600 mx-auto mb-2 opacity-50" />
                <p className="text-xs text-gray-500">Select a pending doubt to reply.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FounderPortal({ user, setActiveTab }) {
  const { addToast } = useToast();
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState('scholars'); // 'scholars', 'tests', 'submissions'
  
  // Filter States (Synchronized with Global Campus Switcher)
  const [selectedCollege, setSelectedCollege] = useState(() => {
    const activeId = localStorage.getItem('lumixora_active_campus_id');
    const activeName = localStorage.getItem('lumixora_active_campus_name');
    if (!activeId || activeId === 'all') return 'All';
    return activeName || 'All';
  });
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  const [sortBy, setSortBy] = useState('xp');
  const [sortOrder, setSortOrder] = useState('desc');

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  useEffect(() => {
    const handleCampusEvt = (e) => {
      if (e.detail) {
        if (e.detail.campusId === 'all') {
          setSelectedCollege('All');
        } else {
          setSelectedCollege(e.detail.campusName || 'All');
        }
      }
    };
    window.addEventListener('lumixora_campus_changed', handleCampusEvt);
    return () => window.removeEventListener('lumixora_campus_changed', handleCampusEvt);
  }, []);

  const [demoMode, setDemoMode] = useState(() => localStorage.getItem('lumixora_disable_xp') === 'true');
  const toggleDemoMode = () => {
    const newState = !demoMode;
    setDemoMode(newState);
    if (newState) {
      localStorage.setItem('lumixora_disable_xp', 'true');
      addToast({ message: "Demo Mode Enabled: XP accumulation paused.", type: "success" });
    } else {
      localStorage.removeItem('lumixora_disable_xp');
      addToast({ message: "Demo Mode Disabled: XP accumulation resumed.", type: "success" });
    }
  };

  // Selected User for Detail View/Edit
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    xp: 0,
    level: 1,
    coins: 0,
    role: 'user',
    college: 'GPREC',
    department: '',
    year: '1st Year',
    sem: '1',
    sec: 'A'
  });

  // Live notifications & state declaration
  const [notifications, setNotifications] = useState(() => buildAggregatedNotifications([], [], []));
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [onboardedTenants, setOnboardedTenants] = useState(DEFAULT_COLLEGES);

  // Keep live mutable refs for all event closures
  const usersListRef = useRef(usersList);
  const remoteNotifsRef = useRef([]);
  const remoteTestsRef = useRef([]);

  const refreshLiveNotifications = useCallback(() => {
    const fresh = buildAggregatedNotifications(
      usersListRef.current,
      remoteNotifsRef.current,
      remoteTestsRef.current
    );
    setNotifications(fresh);
  }, []);

  // Load strictly live registered users from Supabase, Firebase & Active Session
  const loadUsersData = async () => {
    setLoading(true);
    try {
      const mergedMap = new Map();

      // 1. Preload active logged-in user from localStorage
      try {
        const rawLocal = localStorage.getItem('lumixora_user');
        if (rawLocal) {
          const u = JSON.parse(rawLocal);
          const uId = u.id || u.uid || u.email;
          if (uId) {
            const userObj = {
              id: uId,
              uid: uId,
              name: cleanScholarName(u.name || u.displayName, u.email),
              email: u.email || '',
              college: u.college || 'GPREC',
              department: u.department || u.branch || 'CSE',
              branch: u.department || u.branch || 'CSE',
              year: u.year || '1st Year',
              sem: u.sem || '1',
              sec: u.sec || 'A',
              rollNumber: u.rollNumber || (u.email && u.email.endsWith('@gprec.ac.in') ? u.email.split('@')[0].toUpperCase() : ''),
              place: u.place || 'Kurnool',
              qualification: u.qualification || 'B.Tech',
              role: u.role || 'user',
              xp: u.xp || 100,
              level: u.level || 1,
              coins: u.coins || 100,
              streak: u.streak || 1,
              created_at: new Date().toLocaleDateString(),
              created_at_raw: Date.now(),
              source: 'Active Session',
              badges: u.badges || [],
              completedDays: u.completedDays || [],
              studyHours: u.studyHours || 5,
              quizScore: u.quizScore || 85,
              notesShared: u.notesShared || 1,
              learningStyle: u.learningStyle || 'Practical',
              weakSubjects: u.weakSubjects || '',
              careerGoal: u.careerGoal || 'Placement',
              cgpa: u.cgpa || '9.0',
              is_blocked: false,
              is_approved: true,
              isApproved: true,
              is_deleted: false
            };
            mergedMap.set(uId, userObj);
            if (u.email) mergedMap.set(u.email.toLowerCase(), userObj);
          }
        }
      } catch (e) {}

      // 3. Fetch from Supabase
      try {
        const { data: sbUsers, error: sbErr } = await supabase.from('users').select('*').range(0, 2000);
        if (!sbErr && sbUsers) {
          sbUsers.forEach(u => {
            const userId = u.id || u.uid || u.email;
            let parsed = {};
            if (u.name && u.name.includes('{')) {
              try {
                parsed = JSON.parse(u.name.slice(u.name.indexOf('{')));
              } catch (e) {}
            }
            const registerDate = u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A';
            const cleanName = cleanScholarName(u.name, u.email);
            const college = u.college || parsed.college || 'GPREC';
            const department = u.department || u.branch || parsed.department || 'CSE';
            const year = u.year || parsed.year || '1st Year';
            const sem = u.sem || parsed.sem || '1';
            const sec = u.sec || parsed.sec || 'A';
            const rollNumber = u.rollNumber || (u.email && u.email.endsWith('@gprec.ac.in') ? u.email.split('@')[0].toUpperCase() : '');

            const userObj = {
              id: userId,
              uid: userId,
              name: cleanName,
              email: u.email || '',
              college,
              department,
              branch: department,
              year,
              sem,
              sec,
              rollNumber,
              place: u.place || parsed.place || 'Kurnool',
              qualification: u.qualification || parsed.qualification || 'B.Tech',
              role: u.role || 'user',
              xp: (u.xp !== undefined && u.xp !== null && u.xp > 0) ? u.xp : (parsed.xp || u.ap || 100),
              level: (u.level !== undefined && u.level !== null && u.level > 0) ? u.level : (parsed.level || 1),
              coins: (u.coins !== undefined && u.coins !== null && u.coins > 0) ? u.coins : (parsed.coins || u.sc || 100),
              streak: (u.streak !== undefined && u.streak !== null && u.streak > 0) ? u.streak : (parsed.streak || 1),
              created_at: registerDate,
              created_at_raw: u.created_at ? new Date(u.created_at).getTime() : null,
              loginCount: u.loginCount || 1,
              lastLoginDate: u.lastLoginDate || new Date().toISOString(),
              last_test_date: u.last_test_date || null,
              tests_written: u.tests_written || 0,
              source: 'Supabase',
              badges: u.badges || [],
              completedDays: u.completedDays || [],
              studyHours: u.studyHours || 0,
              quizScore: u.quizScore || 0,
              notesShared: u.notesShared || 0,
              learningStyle: u.learningStyle || 'Practical',
              weakSubjects: u.weakSubjects || '',
              careerGoal: u.careerGoal || 'Placement',
              cgpa: u.cgpa || '9.0',
              is_blocked: u.is_blocked || u.is_deleted || false,
              is_approved: u.is_approved !== undefined ? u.is_approved : (u.isApproved !== undefined ? u.isApproved : false),
              isApproved: u.isApproved !== undefined ? u.isApproved : (u.is_approved !== undefined ? u.is_approved : false),
              is_deleted: u.is_deleted || false,
              metadata: parsed
            };
            const mapKey = (u.email || userId).toLowerCase().trim();
            mergedMap.set(mapKey, userObj);
          });
        }
      } catch (e) {}

      // 4. Fetch from Firebase ('users' and 'Users')
      try {
        const [fbSnap1, fbSnap2] = await Promise.allSettled([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'Users'))
        ]);

        const processFbSnap = (snap) => {
          if (!snap || !snap.forEach) return;
          snap.forEach(docSnap => {
            const u = docSnap.data() || {};
            const key = (u.email || docSnap.id).toLowerCase().trim();
            const existing = mergedMap.get(key) || (u.email ? mergedMap.get(u.email.toLowerCase().trim()) : null);
            const parsedFb = parseProfileName(u.name || u.displayName);
            const cleanFbName = u.cleanName || parsedFb.name || (u.name && !u.name.includes('{') ? u.name : 'Scholar');
            const college = u.college || parsedFb.college || 'GPREC';
            const department = u.department || u.branch || parsedFb.department || 'CSE';
            const year = u.year || parsedFb.year || '1st Year';
            const sem = u.sem || parsedFb.sem || '1';
            const sec = u.sec || parsedFb.sec || 'A';
            const rollNumber = u.rollNumber || (u.email && u.email.endsWith('@gprec.ac.in') ? u.email.split('@')[0].toUpperCase() : '');

            if (existing) {
              if (u.name && !u.name.includes('{')) existing.name = u.name;
              else if (u.cleanName) existing.name = u.cleanName;
              if (u.college) existing.college = u.college;
              if (u.department || u.branch) {
                existing.department = u.department || u.branch;
                existing.branch = existing.department;
              }
              if (u.year) existing.year = u.year;
              if (u.sem) existing.sem = u.sem;
              if (u.sec) existing.sec = u.sec;
              if (u.rollNumber) existing.rollNumber = u.rollNumber;
              if (u.role) existing.role = u.role;
              if (u.xp !== undefined && u.xp > 0) existing.xp = u.xp;
              if (u.level !== undefined && u.level > 0) existing.level = u.level;
              if (u.coins !== undefined && u.coins > 0) existing.coins = u.coins;
              if (u.streak !== undefined && u.streak > 0) existing.streak = u.streak;
            } else {
              const newObj = {
                id: docSnap.id,
                uid: docSnap.id,
                name: cleanFbName,
                email: u.email || '',
                college,
                department,
                branch: department,
                year,
                sem,
                sec,
                rollNumber,
                place: u.place || parsedFb.place || 'Kurnool',
                qualification: u.qualification || parsedFb.qualification || 'B.Tech',
                role: u.role || 'user',
                xp: u.xp || 100,
                level: u.level || 1,
                coins: u.coins || 100,
                streak: u.streak || 1,
                created_at: u.createdAt || u.created_at || new Date().toISOString(),
                last_login: u.last_login || u.lastActive || u.updated_at || null,
                source: 'Firebase',
                badges: u.badges || [],
                completedDays: u.completedDays || [],
                studyHours: u.studyHours || 0,
                quizScore: u.quizScore || 0,
                notesShared: u.notesShared || 0,
                learningStyle: u.learningStyle || 'Practical',
                weakSubjects: u.weakSubjects || '',
                careerGoal: u.careerGoal || 'Placement',
                cgpa: u.cgpa || '9.0',
                is_blocked: u.is_blocked || u.is_deleted || false,
                is_approved: u.is_approved !== undefined ? u.is_approved : true,
                isApproved: true,
                is_deleted: u.is_deleted || false,
                metadata: parsedFb
              };
              mergedMap.set(key, newObj);
            }
          });
        };

        if (fbSnap1.status === 'fulfilled') processFbSnap(fbSnap1.value);
        if (fbSnap2.status === 'fulfilled') processFbSnap(fbSnap2.value);
      } catch (e) {}

      // 5. Fetch notifications & test results from Supabase
      if (supabase && typeof supabase.from === 'function') {
        try {
          const [
            { data: sbNotifs },
            { data: sbTests }
          ] = await Promise.allSettled([
            supabase.from('founder_notifications').select('*').order('created_at', { ascending: false }).limit(60),
            supabase.from('test_results').select('*').order('created_at', { ascending: false }).limit(60)
          ]).then(results => [
            results[0].status === 'fulfilled' ? results[0].value : { data: [] },
            results[1].status === 'fulfilled' ? results[1].value : { data: [] }
          ]);

          if (sbNotifs && sbNotifs.length > 0) {
            remoteNotifsRef.current = [...sbNotifs, ...remoteNotifsRef.current];
          }
          if (sbTests && sbTests.length > 0) {
            remoteTestsRef.current = [...sbTests, ...remoteTestsRef.current];
          }
        } catch (sbNotifErr) {}
      }

      const uniqueUsersList = Array.from(new Set(mergedMap.values()));
      setUsersList(uniqueUsersList);
      usersListRef.current = uniqueUsersList;
      refreshLiveNotifications();
    } catch (error) {
      console.error("Error loading users list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    loadUsersData();
  }, []);

  useEffect(() => {
    usersListRef.current = usersList;
    refreshLiveNotifications();
  }, [usersList, refreshLiveNotifications]);

  useEffect(() => {
    // 1. Listen to real-time changes in Firestore users collection
    let unsubUsers = () => {};
    if (db) {
      try {
        unsubUsers = onSnapshot(collection(db, 'users'), () => {
          loadUsersData();
        }, () => {});
      } catch (e) {}
    }

    // 2. Real-time listener for live founder notifications in Firestore
    let unsubNotifs = () => {};
    if (db) {
      try {
        unsubNotifs = onSnapshot(
          collection(db, 'founder_notifications'),
          (snap) => {
            const remoteDocs = [];
            snap.forEach(d => {
              remoteDocs.push({ id: d.id, ...d.data() });
            });
            remoteNotifsRef.current = remoteDocs;
            refreshLiveNotifications();
          },
          (err) => {
            console.warn("Real-time notifications listener notice:", err);
          }
        );
      } catch (e) {}
    }

    // 3. Real-time listener for live test submissions in Firestore
    let unsubTests = () => {};
    if (db) {
      try {
        unsubTests = onSnapshot(
          collection(db, 'test_results'),
          (snap) => {
            const remoteDocs = [];
            snap.forEach(d => {
              remoteDocs.push({ id: d.id, ...d.data() });
            });
            remoteTestsRef.current = remoteDocs;
            refreshLiveNotifications();
          },
          (err) => {
            console.warn("Real-time test submissions listener notice:", err);
          }
        );
      } catch (e) {}
    }

    // 4. Real-time events from Supabase broadcast, Window Events & Local Storage
    const handleWindowNotif = (e) => {
      const payload = e.detail;
      if (payload) {
        if (payload.type === 'submission') {
          remoteTestsRef.current = [payload, ...remoteTestsRef.current];
        } else {
          remoteNotifsRef.current = [payload, ...remoteNotifsRef.current];
        }
      }
      refreshLiveNotifications();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('lumixora_founder_notification', handleWindowNotif);
      window.addEventListener('lumixora_test_submission', handleWindowNotif);
      window.addEventListener('storage', refreshLiveNotifications);
    }

    let realtimeCh = null;
    if (supabase && typeof supabase.channel === 'function') {
      try {
        realtimeCh = supabase.channel('founder_notifications_channel');
        realtimeCh
          .on('broadcast', { event: 'founder_notification' }, ({ payload }) => {
            if (payload) {
              remoteNotifsRef.current = [payload, ...remoteNotifsRef.current];
              refreshLiveNotifications();
              addToast({ 
                message: `🔔 ${payload.name || 'Scholar'}: ${payload.details || payload.type}`, 
                type: 'info' 
              });
            } else {
              refreshLiveNotifications();
            }
          })
          .on('broadcast', { event: 'test_submission' }, ({ payload }) => {
            if (payload) {
              remoteTestsRef.current = [payload, ...remoteTestsRef.current];
              refreshLiveNotifications();
              addToast({ 
                message: `📝 Test Submitted: ${payload.user || 'Scholar'} (${payload.testTitle || 'Test'})`, 
                type: 'success' 
              });
            } else {
              refreshLiveNotifications();
            }
          })
          .subscribe();
      } catch (e) {
        console.warn("Supabase realtime channel subscribe notice:", e);
      }
    }

    // 5. Listen to onboarded partner college tenants & purge any legacy junk docs
    let unsubTenants = () => {};
    if (db) {
      try {
        unsubTenants = onSnapshot(collection(db, 'college_tenants'), (snap) => {
          const fetched = [];
          const junkIds = ['mcet', 'mec', 'pec', 'vmtw', 'rgukt', 'dsu', 'graphic', 'ufug', 'iit', 'gp', 'mvj college of engineering', 'g pullareddy engineering college'];
          
          snap.forEach(d => {
            if (d.id === 'init') return;
            const id = d.id.toLowerCase();
            const data = d.data();
            const name = (data.name || '').toLowerCase();
            const code = (data.code || '').toLowerCase();
            
            if (junkIds.includes(id) || junkIds.includes(name) || junkIds.includes(code)) {
              deleteDoc(doc(db, 'college_tenants', d.id)).catch(() => {});
            } else if (!data.is_deleted && !data.isDeleted) {
              fetched.push({ id: d.id, ...data });
            }
          });
          
          const hasGprec = fetched.some(c => c.id === 'gprec');
          const finalList = hasGprec ? fetched : [...DEFAULT_COLLEGES, ...fetched];
          setOnboardedTenants(finalList);
        }, () => {});
      } catch (e) {}
    }

    return () => {
      unsubUsers();
      unsubNotifs();
      unsubTests();
      unsubTenants();
      if (typeof window !== 'undefined') {
        window.removeEventListener('lumixora_founder_notification', handleWindowNotif);
        window.removeEventListener('lumixora_test_submission', handleWindowNotif);
        window.removeEventListener('storage', refreshLiveNotifications);
      }
      if (realtimeCh && supabase && typeof supabase.removeChannel === 'function') {
        try { supabase.removeChannel(realtimeCh); } catch (e) {}
      }
    };
  }, [refreshLiveNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    markNotificationsAsRead(notifications);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast({ message: "All live notifications marked as read.", type: "success" });
  };

  const clearAllNotifications = async () => {
    await clearNotificationsStorage(notifications);
    remoteNotifsRef.current = [];
    remoteTestsRef.current = [];
    setNotifications([]);
    addToast({ message: "Live notifications queue cleared.", type: "info" });
  };

  const handleDismissNotification = (e, notifId) => {
    e.stopPropagation();
    dismissSingleNotification(notifId);
    setNotifications(prev => prev.filter(n => n.id !== notifId));
    addToast({ message: "Notification dismissed.", type: "info" });
  };

  const handleNotificationClick = (notif) => {
    if (!notif.read) {
      markSingleNotificationRead(notif.id);
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    }
    const searchVal = notif.rollNumber || notif.email || notif.name;
    if (searchVal) {
      setSearchTerm(searchVal);
      setActiveTab('users');
      setShowNotifDropdown(false);
      addToast({ message: `Filtering table for ${cleanScholarName(notif.name, notif.email)}`, type: "info" });
    }
  };


  // Filter & Sort Logic
  const filteredUsers = useMemo(() => {
    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    return usersList
      .filter(u => {
        if (activeView === 'trash') {
          if (!u.is_deleted) return false;
        } else if (activeView === 'newUsers') {
          // Show non-deleted users registered within the last 7 days (or newest accounts)
          if (u.is_deleted) return false;
          const createdTs = u.created_at_raw || (u.created_at && u.created_at !== 'N/A' ? new Date(u.created_at).getTime() : null);
          if (createdTs && (now - createdTs) > sevenDaysMs) return false;
        } else {
          if (u.is_deleted) return false;
        }

        const cleanSearch = searchTerm.trim().toLowerCase();
        const searchPrefix = cleanSearch.includes('@') ? cleanSearch.split('@')[0] : cleanSearch;

        const matchesSearch = 
          !cleanSearch ||
          (u.name || '').toLowerCase().includes(cleanSearch) || 
          (u.email || '').toLowerCase().includes(cleanSearch) || 
          (u.email || '').toLowerCase().includes(searchPrefix) ||
          (u.rollNumber || '').toLowerCase().includes(searchPrefix) ||
          (u.id || '').toLowerCase().includes(cleanSearch);
        
        let matchesCollege = true;
        if (selectedCollege !== 'All') {
          const allColleges = (onboardedTenants && onboardedTenants.length > 0) ? onboardedTenants : DEFAULT_COLLEGES;
          const targetTenant = allColleges.find(c =>
            (c.shortName || c.name || c.code || '').toLowerCase() === selectedCollege.toLowerCase()
          );

          if (targetTenant) {
            const uCol = (u.college || '').toLowerCase().trim();
            const uEmail = (u.email || '').toLowerCase().trim();
            const targetCode = (targetTenant.code || '').toLowerCase();
            const targetShort = (targetTenant.shortName || '').toLowerCase();
            const targetName = (targetTenant.name || '').toLowerCase();

            const isColNameMatch = uCol && (
              uCol.includes(targetCode) || 
              uCol.includes(targetShort) || 
              targetName.includes(uCol) ||
              targetShort.includes(uCol)
            );

            let isDomainMatch = false;
            if (targetTenant.domains && Array.isArray(targetTenant.domains)) {
              isDomainMatch = targetTenant.domains.some(dom => uEmail.endsWith(`@${dom}`));
            }

            matchesCollege = isColNameMatch || isDomainMatch;
          } else {
            matchesCollege = (u.college === selectedCollege);
          }
        }

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
  }, [usersList, searchTerm, selectedCollege, selectedDept, selectedRole, sortBy, sortOrder, activeView, onboardedTenants]);

  // Count new users (last 24h) for the badge
  const newUsersCount = useMemo(() => {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    return usersList.filter(u => {
      if (u.is_deleted) return false;
      const ts = u.created_at_raw || (u.created_at && u.created_at !== 'N/A' ? new Date(u.created_at).getTime() : null);
      return ts && (now - ts) <= oneDayMs;
    }).length;
  }, [usersList]);


  // Extract filter sets - STRICTLY KEEP ONLY ACTIVE ONBOARDED COLLEGES!
  const collegeOptions = useMemo(() => {
    const list = (onboardedTenants && onboardedTenants.length > 0) ? onboardedTenants : DEFAULT_COLLEGES;
    const junkIds = ['mcet', 'mec', 'pec', 'vmtw', 'rgukt', 'dsu', 'graphic', 'ufug', 'iit', 'gp', 'mvj college of engineering', 'g pullareddy engineering college'];
    
    const validColleges = list.filter(c => {
      if (!c) return false;
      if (c.is_deleted === true || c.isDeleted === true) return false;
      const id = (c.id || '').toLowerCase();
      const code = (c.code || '').toLowerCase();
      const name = (c.name || '').toLowerCase();
      if (junkIds.includes(id) || junkIds.includes(code) || junkIds.includes(name)) return false;
      return true;
    });

    const names = validColleges.map(c => c.shortName || c.name || c.code).filter(Boolean);
    const uniqueNames = Array.from(new Set(names));
    return ['All', ...uniqueNames];
  }, [onboardedTenants]);

  const deptOptions = useMemo(() => {
    const depts = new Set();
    usersList.forEach(u => u.department && depts.add(u.department));
    return ['All', ...Array.from(depts)];
  }, [usersList]);

  // Overall Statistics (Live Dynamic Sync)
  const statistics = useMemo(() => {
    const activeScholars = usersList.filter(u => !u.is_deleted);
    const totalScholars = activeScholars.length;
    const totalXp = activeScholars.reduce((acc, u) => acc + (u.xp !== undefined && u.xp !== null && u.xp > 0 ? u.xp : 100), 0);
    const totalCoins = activeScholars.reduce((acc, u) => acc + (u.coins !== undefined && u.coins !== null && u.coins > 0 ? u.coins : 100), 0);
    const founderCount = activeScholars.filter(u => u.role === 'founder').length;

    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const oneDayMs = 24 * 60 * 60 * 1000;

    const scholarsThisWeek = activeScholars.filter(u => {
      const ts = u.created_at_raw || (u.created_at && u.created_at !== 'N/A' ? new Date(u.created_at).getTime() : null);
      return ts && (now - ts) <= sevenDaysMs;
    }).length;

    const scholarsToday = activeScholars.filter(u => {
      const ts = u.created_at_raw || (u.created_at && u.created_at !== 'N/A' ? new Date(u.created_at).getTime() : null);
      return ts && (now - ts) <= oneDayMs;
    }).length;

    return {
      totalScholars,
      totalXp,
      totalCoins,
      founderCount,
      scholarsThisWeek,
      scholarsToday
    };
  }, [usersList]);

  const handleEditClick = (u) => {
    setSelectedUser(u);
    setEditForm({
      name: u.name || u.full_name || '',
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
      const userId = selectedUser.uid || selectedUser.id;
      const cleanNameStr = editForm.name.includes('{') ? editForm.name.split('{')[0].trim() : editForm.name.trim();
      const newMetadata = {
        college: editForm.college || 'GPREC',
        department: editForm.department || 'CSE',
        year: editForm.year || '1st Year',
        sem: editForm.sem || '1',
        sec: editForm.sec || 'A',
        qualification: selectedUser.qualification || 'B.Tech',
        place: selectedUser.place || 'Kurnool'
      };
      const packedName = `${cleanNameStr} ${JSON.stringify(newMetadata)}`;

      const updates = {
        name: packedName,
        displayName: cleanNameStr,
        cleanName: cleanNameStr,
        xp: parseInt(editForm.xp, 10) || 0,
        level: parseInt(editForm.level, 10) || 1,
        coins: parseInt(editForm.coins, 10) || 0,
        role: editForm.role,
        college: editForm.college,
        department: editForm.department,
        branch: editForm.department,
        year: editForm.year,
        sem: editForm.sem,
        sec: editForm.sec
      };

      // 1. Sync to Firebase Firestore (both users and Users collections)
      try {
        if (userId) {
          await setDoc(doc(db, 'users', userId), updates, { merge: true });
          await setDoc(doc(db, 'Users', userId), updates, { merge: true });
        }
        if (selectedUser.email) {
          const q = query(collection(db, 'users'), where('email', '==', selectedUser.email));
          const querySnap = await getDocs(q);
          querySnap.forEach(async (d) => {
            await setDoc(doc(db, 'users', d.id), updates, { merge: true });
            await setDoc(doc(db, 'Users', d.id), updates, { merge: true });
          });
        }
      } catch (fbErr) {
        console.warn("Firestore update failed on save:", fbErr);
      }

      // 2. Sync to Supabase
      try {
        if (userId) {
          await supabase
            .from('users')
            .update(updates)
            .eq('id', userId);
        }
        if (selectedUser.email) {
          await supabase
            .from('users')
            .update(updates)
            .eq('email', selectedUser.email);
        }
      } catch (sbErr) {
        console.warn("Supabase update failed on save:", sbErr);
      }

      // 3. Update local state in Founder deck
      setUsersList(prev => prev.map(u => (u.uid === userId || u.id === userId || u.email === selectedUser.email) ? { ...u, ...updates } : u));
      
      addToast({ message: 'Scholar control profile updated & saved permanently!', type: 'success' });
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error(err);
      addToast({ message: 'Failed to update scholar stats.', type: 'error' });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to deactivate this scholar? They will be moved to the Trash.")) return;
    try {
      let sbError = null;
      let fbError = null;

      try {
        const { error } = await supabase.from('users').update({ is_deleted: true }).eq('id', userId);
        if (error) sbError = error;
      } catch (e) { sbError = e; }

      try {
        await setDoc(doc(db, 'users', userId), { is_deleted: true }, { merge: true });
      } catch (e) { fbError = e; }

      if (sbError && fbError) throw new Error(`SB: ${sbError.message || sbError} | FB: ${fbError.message || fbError}`);

      addToast({ message: 'Scholar moved to Trash.', type: 'success' });
      loadUsersData();
    } catch (err) {
      console.error("Delete Error:", err);
      addToast({ message: `Failed to delete scholar: ${err.message}`, type: 'error' });
    }
  };

  const handleRestoreUser = async (userId) => {
    try {
      let sbError = null;
      let fbError = null;

      try {
        const { error } = await supabase.from('users').update({ is_deleted: false }).eq('id', userId);
        if (error) sbError = error;
      } catch (e) { sbError = e; }

      try {
        await setDoc(doc(db, 'users', userId), { is_deleted: false }, { merge: true });
      } catch (e) { fbError = e; }

      if (sbError && fbError) throw new Error(`SB: ${sbError.message || sbError} | FB: ${fbError.message || fbError}`);

      addToast({ message: 'Scholar restored successfully.', type: 'success' });
      loadUsersData();
    } catch (err) {
      console.error("Restore Error:", err);
      addToast({ message: `Failed to restore scholar: ${err.message}`, type: 'error' });
    }
  };

  const isUserBlocked = (u) => {
    if (!u) return false;
    if (u.is_blocked === true || u.is_deleted === true) return true;
    const email = (u.email || '').toLowerCase().trim();
    const isSpecial = email === 'founder@lumixora.com' || email === '249xa33106@gmail.com';
    if (isSpecial) return false;
    if (email.endsWith('@gprec.ac.in')) return false;
    return !(u.is_blocked === false && (u.is_approved === true || u.isApproved === true));
  };

  const handleToggleBlock = async (userObj) => {
    const email = (userObj.email || '').toLowerCase().trim();
    const isSpecial = email === 'founder@lumixora.com' || email === '249xa33106@gmail.com';
    if (isSpecial) {
      addToast({ message: "Founder accounts cannot be blocked.", type: "error" });
      return;
    }

    const currentlyBlocked = isUserBlocked(userObj);
    const nextBlockState = !currentlyBlocked;
    const actionText = nextBlockState ? 'BLOCK' : 'UNBLOCK';

    if (!window.confirm(`Are you sure you want to ${actionText} access for ${userObj.name || userObj.email || 'this user'}?`)) return;

    try {
      const updateData = {
        is_blocked: nextBlockState,
        is_deleted: nextBlockState,
        isApproved: !nextBlockState,
        is_approved: !nextBlockState
      };

      setUsersList(prev => prev.map(u => {
        const uEmail = (u.email || '').toLowerCase().trim();
        const isMatch = (u.id && u.id === userObj.id) || (u.uid && u.uid === userObj.uid) || (email && uEmail === email);
        if (isMatch) {
          return {
            ...u,
            is_blocked: nextBlockState,
            is_deleted: nextBlockState,
            isApproved: !nextBlockState,
            is_approved: !nextBlockState
          };
        }
        return u;
      }));

      try {
        if (userObj.id) await supabase.from('users').update(updateData).eq('id', userObj.id);
        if (userObj.uid && userObj.uid !== userObj.id) await supabase.from('users').update(updateData).eq('id', userObj.uid);
        if (email) await supabase.from('users').update(updateData).eq('email', email);
      } catch (e) {}

      try {
        if (userObj.id) {
          await setDoc(doc(db, 'users', userObj.id), updateData, { merge: true });
          await setDoc(doc(db, 'Users', userObj.id), updateData, { merge: true });
        }
        if (userObj.uid && userObj.uid !== userObj.id) {
          await setDoc(doc(db, 'users', userObj.uid), updateData, { merge: true });
          await setDoc(doc(db, 'Users', userObj.uid), updateData, { merge: true });
        }
        if (email) {
          const q1 = query(collection(db, 'users'), where('email', '==', email));
          const snap1 = await getDocs(q1);
          snap1.forEach(async (d) => await setDoc(doc(db, 'users', d.id), updateData, { merge: true }));

          const q2 = query(collection(db, 'Users'), where('email', '==', email));
          const snap2 = await getDocs(q2);
          snap2.forEach(async (d) => await setDoc(doc(db, 'Users', d.id), updateData, { merge: true }));
        }
      } catch (e) {}

      addToast({ 
        message: `Successfully ${nextBlockState ? 'BLOCKED' : 'UNBLOCKED'} ${userObj.name || email}.`, 
        type: nextBlockState ? 'error' : 'success' 
      });
      loadUsersData();
    } catch (err) {
      console.error("Toggle Block Error:", err);
      addToast({ message: `Failed to update user block state: ${err.message}`, type: 'error' });
    }
  };

  const handlePermanentDeleteUser = async (userId) => {
    if (!window.confirm("WARNING: This will permanently delete the scholar's profile from the database. This action cannot be undone. Proceed?")) return;
    try {
      let sbError = null;
      let fbError = null;

      try {
        const { error } = await supabase.from('users').delete().eq('id', userId);
        if (error) sbError = error;
      } catch (e) { sbError = e; }

      try {
        await deleteDoc(doc(db, 'users', userId));
      } catch (e) { fbError = e; }

      if (sbError && fbError) throw new Error(`SB: ${sbError.message || sbError} | FB: ${fbError.message || fbError}`);

      addToast({ message: 'Scholar permanently deleted.', type: 'success' });
      loadUsersData();
    } catch (err) {
      console.error("Permanent Delete Error:", err);
      addToast({ message: `Failed to permanently delete scholar: ${err.message}`, type: 'error' });
    }
  };

  const handleDeleteAllUsers = async () => {
    if (!window.confirm("WARNING: Are you sure you want to deactivate ALL scholars (except founders)? They will be moved to the Trash.")) return;
    try {
      const toDelete = usersList.filter(u => u.role !== 'founder');
      for (const u of toDelete) {
        try {
          await supabase.from('users').update({ is_deleted: true }).eq('id', u.id);
        } catch (e) {}
        try {
          await setDoc(doc(db, 'users', u.id), { is_deleted: true }, { merge: true });
        } catch (e) {}
      }
      loadUsersData();
      addToast({ message: `Successfully deactivated ${toDelete.length} scholars.`, type: "success" });
    } catch (error) {
      addToast({ message: "Failed to deactivate some scholars", type: "error" });
    }
  };

  const handleExportExcel = async () => {
    try {
      addToast({ message: 'Fetching real live data from Supabase across all portals...', type: 'info' });
      const targetUsers = (usersList && usersList.length > 0) ? usersList : (filteredUsers || []);
      const wb = XLSX.utils.book_new();

      const safeFormatDate = (val) => {
        if (!val) return 'N/A';
        try {
          if (typeof val === 'object' && val !== null) {
            if (typeof val.toDate === 'function') return val.toDate().toLocaleString();
            if (val.seconds) return new Date(val.seconds * 1000).toLocaleString();
          }
          const d = new Date(val);
          if (!isNaN(d.getTime())) return d.toLocaleString();
        } catch (e) {}
        return typeof val === 'string' ? val : 'N/A';
      };

      // 1. Fetch Real Data Directly from Supabase
      let sbUsersList = [];
      let codingSubsList = [];
      let mockInterviewsList = [];
      let testResultsList = [];
      let academicsList = [];
      let tasksList = [];
      let doubtsList = [];
      let notesList = [];

      if (supabase && typeof supabase.from === 'function') {
        try {
          const [uRes, cRes, mRes, tRes, aRes, taskRes, dRes, nRes] = await Promise.allSettled([
            supabase.from('users').select('*').limit(2000),
            supabase.from('coding_submissions').select('*').order('created_at', { ascending: false }).limit(2000),
            supabase.from('mock_interviews').select('*').order('created_at', { ascending: false }).limit(2000),
            supabase.from('test_results').select('*').order('created_at', { ascending: false }).limit(2000),
            supabase.from('student_academics').select('*').limit(2000),
            supabase.from('tasks').select('*').limit(2000),
            supabase.from('doubts').select('*').limit(2000),
            supabase.from('notes').select('*').limit(2000)
          ]);

          if (uRes.status === 'fulfilled' && uRes.value.data) sbUsersList = uRes.value.data;
          if (cRes.status === 'fulfilled' && cRes.value.data) codingSubsList = cRes.value.data;
          if (mRes.status === 'fulfilled' && mRes.value.data) mockInterviewsList = mRes.value.data;
          if (tRes.status === 'fulfilled' && tRes.value.data) testResultsList = tRes.value.data;
          if (aRes.status === 'fulfilled' && aRes.value.data) academicsList = aRes.value.data;
          if (taskRes.status === 'fulfilled' && taskRes.value.data) tasksList = taskRes.value.data;
          if (dRes.status === 'fulfilled' && dRes.value.data) doubtsList = dRes.value.data;
          if (nRes.status === 'fulfilled' && nRes.value.data) notesList = nRes.value.data;
        } catch (sbErr) {
          console.warn("Supabase multi-table export fetch notice:", sbErr);
        }
      }

      // Also merge any local/Firestore submissions for 100% complete coverage
      if (db) {
        try {
          const [compSnap, testSnap] = await Promise.allSettled([
            getDocs(collection(db, 'completed_tasks')),
            getDocs(collection(db, 'test_results'))
          ]);
          if (compSnap.status === 'fulfilled' && compSnap.value) {
            compSnap.value.forEach(d => {
              const data = d.data();
              if (!codingSubsList.some(s => s.id === d.id)) {
                codingSubsList.push({ id: d.id, ...data, language: data.language || 'Code', status: 'Accepted' });
              }
            });
          }
          if (testSnap.status === 'fulfilled' && testSnap.value) {
            testSnap.value.forEach(d => {
              const data = d.data();
              if (!testResultsList.some(s => s.id === d.id)) {
                testResultsList.push({ id: d.id, ...data });
              }
            });
          }
        } catch (e) {}
      }

      // Also extract packed JSON data from users if stored inside user.name
      targetUsers.forEach(u => {
        if (u.metadata) {
          const meta = u.metadata;
          if (Array.isArray(meta.submissions)) {
            meta.submissions.forEach(sub => {
              if (!codingSubsList.some(s => s.id === sub.id || (s.problemId === sub.problemId && s.user_email === u.email))) {
                codingSubsList.push({
                  id: sub.id || Date.now(),
                  user_email: u.email,
                  user_name: cleanScholarName(u.name),
                  problem_title: sub.problemTitle || sub.title || 'Coding Problem',
                  language: sub.language || 'javascript',
                  status: sub.status || 'Accepted',
                  runtime: sub.runtime || 'N/A',
                  memory: sub.memory || 'N/A',
                  created_at: sub.timestamp || new Date().toISOString()
                });
              }
            });
          }
          if (Array.isArray(meta.mockInterviews)) {
            meta.mockInterviews.forEach(m => {
              if (!mockInterviewsList.some(item => item.id === m.id)) {
                mockInterviewsList.push({
                  id: m.id || Date.now(),
                  user_email: u.email,
                  user_name: cleanScholarName(u.name),
                  company: m.company || 'Tech Company',
                  role: m.role || 'Software Engineer',
                  overall_score: m.overallScore || 85,
                  technical_score: m.technicalScore || 80,
                  communication_score: m.communicationScore || 90,
                  verdict: m.verdict || 'Strong Hire',
                  created_at: m.timestamp || new Date().toISOString()
                });
              }
            });
          }
        }
      });

      // Build User-level aggregated progress map
      const userProgressMap = {};
      targetUsers.forEach(u => {
        const keyEmail = (u.email || '').toLowerCase().trim();
        userProgressMap[keyEmail] = {
          user: u,
          codingSolved: (u.metadata?.solvedProblems?.length) || (u.metadata?.solvedCount) || 0,
          testsAttempted: 0,
          totalScore: 0,
          maxScore: 0,
          mockInterviewsCount: (u.metadata?.mockInterviews?.length) || 0,
          cgpa: u.cgpa || u.metadata?.academics?.cgpa || '9.0',
          attendancePct: u.metadata?.academics?.attendancePct || 85
        };
      });

      codingSubsList.forEach(s => {
        const email = (s.user_email || s.userEmail || s.email || '').toLowerCase().trim();
        if (userProgressMap[email] && s.status === 'Accepted') {
          userProgressMap[email].codingSolved++;
        }
      });

      testResultsList.forEach(s => {
        const email = (s.user_email || s.userEmail || s.email || '').toLowerCase().trim();
        if (userProgressMap[email]) {
          userProgressMap[email].testsAttempted++;
          const score = parseInt(s.score || 0, 10) || 0;
          const total = parseInt(s.total || s.total_marks || 10, 10) || 10;
          userProgressMap[email].totalScore += score;
          userProgressMap[email].maxScore += total;
        }
      });

      mockInterviewsList.forEach(m => {
        const email = (m.user_email || m.userEmail || m.email || '').toLowerCase().trim();
        if (userProgressMap[email]) {
          userProgressMap[email].mockInterviewsCount++;
        }
      });

      // --- SHEET 1: Master Scholar Registry & Real-Time Stats ---
      const summaryData = targetUsers.map((u, i) => {
        const keyEmail = (u.email || '').toLowerCase().trim();
        const stats = userProgressMap[keyEmail] || { codingSolved: 0, testsAttempted: 0, totalScore: 0, maxScore: 0, mockInterviewsCount: 0, cgpa: '9.0', attendancePct: 85 };
        const avgAccuracy = stats.maxScore > 0 ? Math.round((stats.totalScore / stats.maxScore) * 100) : (stats.testsAttempted > 0 ? 80 : 0);
        const readiness = Math.min(100, Math.round((stats.codingSolved * 5) + (stats.testsAttempted * 6) + (stats.mockInterviewsCount * 12) + (((u.xp || 0) + (u.coins || 0)) / 100)));

        return {
          'S.No': i + 1,
          'Scholar Name': cleanScholarName(u.name),
          'Email Address': u.email || 'N/A',
          'Role': (u.role || 'scholar').toUpperCase(),
          'College': u.college || 'GPREC',
          'Department': u.department || u.branch || 'CSE',
          'Year': u.year || '1st Year',
          'Section': u.sec || 'A',
          'Roll Number': u.rollNumber || (u.email?.endsWith('@gprec.ac.in') ? u.email.split('@')[0].toUpperCase() : 'N/A'),
          'Coding Problems Solved': stats.codingSolved,
          'Assessments & Tests Taken': stats.testsAttempted,
          'Test Accuracy (%)': `${avgAccuracy}%`,
          'AI Mock Interviews Taken': stats.mockInterviewsCount,
          'Placement Readiness Score': `${readiness}%`,
          'CGPA': stats.cgpa,
          'Attendance (%)': `${stats.attendancePct}%`,
          'Global Aura (AP/XP)': u.xp || 0,
          'Synaptic Energy (SC/Coins)': u.coins || 0,
          'Account Status': u.is_blocked ? 'BLOCKED' : 'ACTIVE',
          'Data Source': 'Supabase PostgreSQL',
          'Registered On': safeFormatDate(u.created_at || u.created_at_raw)
        };
      });
      const wsSummary = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Scholars Master Registry');

      // --- SHEET 2: Live Coding Submissions ---
      const codingData = codingSubsList.map((s, i) => ({
        'S.No': i + 1,
        'Scholar Name': cleanScholarName(s.user_name || s.name || s.user || 'Scholar'),
        'Scholar Email': s.user_email || s.userEmail || s.email || s.userId || 'N/A',
        'Problem Title': s.problem_title || s.problemTitle || s.title || 'Coding Exercise',
        'Language': (s.language || 'javascript').toUpperCase(),
        'Status': s.status || 'Accepted',
        'Runtime': s.runtime || 'N/A',
        'Memory': s.memory || 'N/A',
        'Submission Date': safeFormatDate(s.created_at || s.timestamp)
      }));
      const wsCoding = XLSX.utils.json_to_sheet(codingData.length > 0 ? codingData : [{ 'Status': 'No coding submissions in Supabase yet' }]);
      XLSX.utils.book_append_sheet(wb, wsCoding, 'Real Coding Submissions');

      // --- SHEET 3: Live Test & Quiz Scorecards ---
      const testData = testResultsList.map((s, i) => {
        const score = s.score || 0;
        const total = s.total || s.total_marks || 10;
        const pct = `${Math.round((score / (total || 1)) * 100)}%`;
        return {
          'S.No': i + 1,
          'Scholar Name': cleanScholarName(s.user_name || s.user || s.name || 'Scholar'),
          'Scholar Email': s.user_email || s.userEmail || s.email || 'N/A',
          'Test Title': s.test_title || s.testTitle || 'General Assessment',
          'Marks Obtained': score,
          'Total Marks': total,
          'Accuracy (%)': pct,
          'Tab Switch Flagged': s.flagged_for_tab_switch ? 'YES' : 'NO',
          'Verdict': score >= (total * 0.5) ? 'PASSED' : 'RETAKE RECOMMENDED',
          'Completed At': safeFormatDate(s.created_at || s.date)
        };
      });
      const wsTest = XLSX.utils.json_to_sheet(testData.length > 0 ? testData : [{ 'Status': 'No test results in Supabase yet' }]);
      XLSX.utils.book_append_sheet(wb, wsTest, 'Live Test Results');

      // --- SHEET 4: AI Mock Placement Interviews ---
      const mockData = mockInterviewsList.map((m, i) => ({
        'S.No': i + 1,
        'Scholar Name': cleanScholarName(m.user_name || m.user || 'Scholar'),
        'Scholar Email': m.user_email || m.userEmail || 'N/A',
        'Company': m.company || 'Tech Company',
        'Role': m.role || 'Software Engineer',
        'Overall Score (%)': `${m.overall_score || m.overallScore || 0}%`,
        'Technical Accuracy (%)': `${m.technical_score || m.technicalScore || 0}%`,
        'Communication Score (%)': `${m.communication_score || m.communicationScore || 0}%`,
        'Verdict': m.verdict || 'Clear',
        'Interview Date': safeFormatDate(m.created_at || m.timestamp)
      }));
      const wsMock = XLSX.utils.json_to_sheet(mockData.length > 0 ? mockData : [{ 'Status': 'No mock interview records in Supabase yet' }]);
      XLSX.utils.book_append_sheet(wb, wsMock, 'AI Mock Interviews');

      // --- SHEET 5: Doubts & Q&A Discussions ---
      if (doubtsList.length > 0) {
        const doubtsData = doubtsList.map((d, i) => ({
          'S.No': i + 1,
          'Author': cleanScholarName(d.user_name || d.author || 'Scholar'),
          'Email': d.user_email || d.email || 'N/A',
          'Topic': d.title || 'General Query',
          'Description': d.description || '',
          'Status': (d.status || 'open').toUpperCase(),
          'Created At': safeFormatDate(d.created_at)
        }));
        const wsDoubts = XLSX.utils.json_to_sheet(doubtsData);
        XLSX.utils.book_append_sheet(wb, wsDoubts, 'Doubts & Q&A');
      }

      // --- SHEET 6: Notes & Resources ---
      if (notesList.length > 0) {
        const notesData = notesList.map((n, i) => ({
          'S.No': i + 1,
          'Title': n.title || 'Note',
          'Category': n.category || 'General',
          'Author Email': n.user_email || 'N/A',
          'Is Public': n.is_public ? 'YES' : 'NO',
          'Created At': safeFormatDate(n.created_at)
        }));
        const wsNotes = XLSX.utils.json_to_sheet(notesData);
        XLSX.utils.book_append_sheet(wb, wsNotes, 'Notes Platform Data');
      }

      const dateStr = new Date().toISOString().slice(0, 10);
      const filename = `Vyomra_Supabase_Real_Data_Export_${dateStr}.xlsx`;

      try {
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (blobErr) {
        XLSX.writeFile(wb, filename);
      }

      addToast({ message: `Successfully downloaded Real Supabase Data (${targetUsers.length} scholars & all activities) to Excel!`, type: 'success' });
    } catch (err) {
      console.error('Excel Export Error:', err);
      addToast({ message: `Failed to export Supabase report: ${err.message || 'Error'}`, type: 'error' });
    }
  };

  const handleExportCSV = () => {
    try {
      const targetList = usersList && usersList.length > 0 ? usersList : filteredUsers;
      const headers = ["S.No", "Scholar Name", "Email", "Role", "College", "Department", "Year", "Section", "Roll Number", "Coding Solved", "Tests Written", "CGPA", "Attendance %", "AP (XP)", "SC (Coins)", "Status", "Database Source", "Registered Date"];
      const rows = targetList.map((u, i) => [
        i + 1,
        `"${cleanScholarName(u.name)}"`,
        `"${u.email || 'N/A'}"`,
        `"${(u.role || 'scholar').toUpperCase()}"`,
        `"${u.college || 'GPREC'}"`,
        `"${u.department || u.branch || 'CSE'}"`,
        `"${u.year || '1st Year'}"`,
        `"${u.sec || 'A'}"`,
        `"${u.rollNumber || (u.email?.endsWith('@gprec.ac.in') ? u.email.split('@')[0].toUpperCase() : 'N/A')}"`,
        u.metadata?.solvedCount || u.metadata?.solvedProblems?.length || 0,
        u.tests_written || u.metadata?.quizHistory?.length || 0,
        `"${u.cgpa || u.metadata?.academics?.cgpa || '9.0'}"`,
        `"${u.metadata?.academics?.attendancePct || 85}%"`,
        u.xp || 0,
        u.coins || 0,
        `"${u.is_blocked ? 'BLOCKED' : 'ACTIVE'}"`,
        `"Supabase"`,
        `"${u.created_at || 'N/A'}"`
      ]);

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Vyomra_Real_Supabase_Scholars_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addToast({ message: `Exported ${targetList.length} scholars from Supabase to CSV successfully!`, type: 'success' });
    } catch (err) {
      console.error('CSV Export Error:', err);
      addToast({ message: 'Failed to export CSV report.', type: 'error' });
    }
  };

  const handleExportPDF = async () => {
    try {
      addToast({ message: 'Generating comprehensive Supabase live progress PDF...', type: 'info' });
      const targetList = (usersList && usersList.length > 0) ? usersList : (filteredUsers || []);
      const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

      const safeFormatDate = (val) => {
        if (!val) return 'N/A';
        try {
          if (typeof val === 'object' && val !== null) {
            if (typeof val.toDate === 'function') return val.toDate().toLocaleDateString();
            if (val.seconds) return new Date(val.seconds * 1000).toLocaleDateString();
          }
          const d = new Date(val);
          if (!isNaN(d.getTime())) return d.toLocaleDateString();
        } catch (e) {}
        return typeof val === 'string' ? val : 'N/A';
      };

      // 1. Fetch real submissions from Supabase
      let testSubsList = [];
      let codingSubsList = [];
      if (supabase && typeof supabase.from === 'function') {
        try {
          const [tRes, cRes] = await Promise.allSettled([
            supabase.from('test_results').select('*').limit(500),
            supabase.from('coding_submissions').select('*').limit(500)
          ]);
          if (tRes.status === 'fulfilled' && tRes.value.data) testSubsList = tRes.value.data;
          if (cRes.status === 'fulfilled' && cRes.value.data) codingSubsList = cRes.value.data;
        } catch(e) {}
      }
      try {
        const localSubs = getStoredTestSubmissions() || [];
        if (Array.isArray(localSubs) && localSubs.length > 0) testSubsList = [...testSubsList, ...localSubs];
      } catch (e) {}

      // Build User-level aggregated progress maps
      const userProgressMap = {};
      targetList.forEach(u => {
        const keyEmail = (u.email || '').toLowerCase().trim();
        userProgressMap[keyEmail] = {
          user: u,
          tasksCompleted: 0,
          testsAttempted: 0,
          totalScore: 0,
          maxScore: 0,
          codingSolved: 0,
          placementPrepCount: 0
        };
      });

      completedTasksList.forEach(t => {
        try {
          const uEmail = (t.userId || '').toLowerCase().trim();
          const uName = (t.userName || '').toLowerCase().trim();
          let target = userProgressMap[uEmail];
          if (!target && uName) {
            const foundKey = Object.keys(userProgressMap).find(k => (userProgressMap[k]?.user?.name || '').toLowerCase().includes(uName));
            if (foundKey) target = userProgressMap[foundKey];
          }
          if (target) {
            target.tasksCompleted++;
            const subj = (t.subject || '').toLowerCase();
            if (subj.includes('java') || subj.includes('python') || subj.includes('code') || subj.includes('dsa') || subj.includes('program')) {
              target.codingSolved++;
            }
          }
        } catch (e) {}
      });

      testSubsList.forEach(s => {
        try {
          const sEmail = (s.user_email || s.email || s.userId || '').toLowerCase().trim();
          const sName = (s.user_name || s.user || s.name || '').toLowerCase().trim();
          let target = userProgressMap[sEmail];
          if (!target && sName) {
            const foundKey = Object.keys(userProgressMap).find(k => (userProgressMap[k]?.user?.name || '').toLowerCase().includes(sName));
            if (foundKey) target = userProgressMap[foundKey];
          }
          if (target) {
            target.testsAttempted++;
            const score = parseInt(s.score || 0, 10) || 0;
            const totalMarks = parseInt(s.total_marks || s.totalQuestions || 10, 10) || 10;
            target.totalScore += score;
            target.maxScore += totalMarks;
            const title = (s.test_title || s.testTitle || '').toLowerCase();
            if (title.includes('placement') || title.includes('aptitude') || title.includes('mock')) {
              target.placementPrepCount++;
            }
          }
        } catch (e) {}
      });

      // Dynamic Placement Readiness calculation (0% if no activity completed)
      const calculatePlacementReadiness = (u, stats) => {
        if (stats.tasksCompleted === 0 && stats.testsAttempted === 0 && (!u.xp || u.xp <= 100)) {
          return 0;
        }
        const codingScore = Math.min(45, (stats.tasksCompleted * 4) + (stats.codingSolved * 3));
        const testScore = Math.min(35, (stats.testsAttempted * 8) + (stats.maxScore > 0 ? (stats.totalScore / stats.maxScore) * 15 : 0));
        const auraScore = Math.min(20, Math.round(((u.xp || 0) + (u.coins || 0)) / 120));
        return Math.min(100, Math.round(codingScore + testScore + auraScore));
      };

      // Cover Header
      doc.setFillColor(7, 10, 19);
      doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
      
      doc.setTextColor(45, 212, 191);
      doc.setFontSize(16);
      doc.text("VYOMRA STUDENT OS - COMPREHENSIVE SCHOLARS PROGRESS REPORT", 40, 36);
      
      doc.setFontSize(9);
      doc.setTextColor(156, 163, 175);
      doc.text(`Generated: ${new Date().toLocaleString()} | Total Registered Scholars: ${targetList.length} | Codes Solved, Tests & Placement Prep`, 40, 52);

      // Section 1: Progress Summary Table
      const summaryTableData = targetList.map((u, i) => {
        const keyEmail = (u.email || '').toLowerCase().trim();
        const stats = userProgressMap[keyEmail] || { tasksCompleted: 0, testsAttempted: 0, totalScore: 0, maxScore: 0, codingSolved: 0, placementPrepCount: 0 };
        const avgAccuracy = stats.maxScore > 0 ? `${Math.round((stats.totalScore / stats.maxScore) * 100)}%` : (stats.testsAttempted > 0 ? '75%' : '0%');
        const readinessScore = `${calculatePlacementReadiness(u, stats)}%`;

        return [
          i + 1,
          cleanScholarName(u.name),
          u.email || 'N/A',
          `${u.department || 'CSE'} (${u.year || '1st'})`,
          stats.codingSolved,
          stats.tasksCompleted,
          stats.testsAttempted,
          avgAccuracy,
          readinessScore,
          u.xp || 0,
          u.is_blocked ? 'BLOCKED' : 'ACTIVE'
        ];
      });

      autoTable(doc, {
        startY: 65,
        head: [['#', 'Scholar Name', 'Email', 'Dept & Year', 'Codes Solved', 'Tasks Done', 'Tests', 'Avg Score', 'Placement %', 'AP (XP)', 'Status']],
        body: summaryTableData,
        theme: 'striped',
        headStyles: { fillColor: [20, 184, 166], textColor: 0, fontSize: 7.5, fontStyle: 'bold' },
        styles: { fontSize: 7, textColor: [229, 231, 235], fillColor: [15, 23, 42] },
        alternateRowStyles: { fillColor: [30, 41, 59] },
        margin: { left: 40, right: 40 }
      });

      // Section 2: Solved Coding & Daily Tasks Table (New Page)
      if (completedTasksList.length > 0) {
        doc.addPage();
        doc.setFillColor(7, 10, 19);
        doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
        
        doc.setTextColor(168, 85, 247);
        doc.setFontSize(14);
        doc.text("SECTION 2: SOLVED CODING & ASSIGNED TASKS BREAKDOWN", 40, 36);
        
        const tasksTableData = completedTasksList.slice(0, 500).map((t, i) => [
          i + 1,
          cleanScholarName(t.userName || 'Scholar'),
          t.userId || 'N/A',
          t.subject || 'Java Core & Advanced',
          t.dayLabel || 'Day 1',
          t.taskId || 'Task',
          'COMPLETED',
          safeFormatDate(t.completedAt)
        ]);

        autoTable(doc, {
          startY: 50,
          head: [['#', 'Scholar Name', 'Email / User ID', 'Track / Subject', 'Timeline / Day', 'Task Title / ID', 'Status', 'Completed Date']],
          body: tasksTableData,
          theme: 'striped',
          headStyles: { fillColor: [147, 51, 234], textColor: 255, fontSize: 7.5, fontStyle: 'bold' },
          styles: { fontSize: 7, textColor: [229, 231, 235], fillColor: [15, 23, 42] },
          alternateRowStyles: { fillColor: [30, 41, 59] },
          margin: { left: 40, right: 40 }
        });
      }

      // Section 3: Test Submissions & Exam Results (New Page)
      if (testSubsList.length > 0) {
        doc.addPage();
        doc.setFillColor(7, 10, 19);
        doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
        
        doc.setTextColor(245, 158, 11);
        doc.setFontSize(14);
        doc.text("SECTION 3: TEST & EXAMINATION ASSESSMENT RESULTS", 40, 36);

        const testTableData = testSubsList.slice(0, 500).map((s, i) => {
          const score = s.score || 0;
          const totalMarks = s.total_marks || s.totalQuestions || 10;
          const pct = s.accuracy ? `${s.accuracy}%` : `${Math.round((score / (totalMarks || 1)) * 100)}%`;
          return [
            i + 1,
            cleanScholarName(s.user_name || s.user || s.name || 'Scholar'),
            s.user_email || s.email || s.userId || 'N/A',
            s.test_title || s.testTitle || 'Exam Assessment',
            `${score} / ${totalMarks}`,
            pct,
            s.time_spent || s.timeTaken || '15 mins',
            score >= (totalMarks * 0.4) ? 'PASSED' : 'IMPROVE',
            safeFormatDate(s.created_at || s.timestamp)
          ];
        });

        autoTable(doc, {
          startY: 50,
          head: [['#', 'Scholar Name', 'Email', 'Assessment Title', 'Marks', 'Accuracy', 'Time Spent', 'Result', 'Date']],
          body: testTableData,
          theme: 'striped',
          headStyles: { fillColor: [217, 119, 6], textColor: 255, fontSize: 7.5, fontStyle: 'bold' },
          styles: { fontSize: 7, textColor: [229, 231, 235], fillColor: [15, 23, 42] },
          alternateRowStyles: { fillColor: [30, 41, 59] },
          margin: { left: 40, right: 40 }
        });
      }

      const dateStr = new Date().toISOString().slice(0, 10);
      doc.save(`Vyomra_Complete_Scholars_Progress_Dossier_${dateStr}.pdf`);
      addToast({ message: `Exported full multi-section Progress Dossier (${targetList.length} scholars) to PDF!`, type: 'success' });
    } catch (err) {
      console.error('PDF Export Error:', err);
      addToast({ message: `Failed to export PDF report: ${err.message || 'Error'}`, type: 'error' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-fade-in text-[var(--text-main)]">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-[32px] font-sora font-bold text-[var(--text-main)] uppercase tracking-tight leading-[1.1] flex items-center gap-2">
            <span>Founder Control Deck</span>
          </h1>
          <p className="text-[14px] font-inter text-[var(--text-secondary)] mt-2 font-normal leading-relaxed max-w-2xl">
            Authorized admin control room to oversee platform scholars, manage tests, and maintain platform security.
          </p>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          {setActiveTab && (
            <>
              <button
                onClick={() => setActiveTab('my-academics')}
                className="px-3.5 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all flex items-center gap-2 text-xs font-black shadow-sm cursor-pointer"
                title="View My Academics Performance Engine"
              >
                <Award className="w-4.5 h-4.5 text-emerald-400" />
                <span>📊 My Academics</span>
              </button>
              <button
                onClick={() => setActiveTab('faculty-portal')}
                className="px-3.5 py-2.5 rounded-xl bg-brand-teal/15 hover:bg-brand-teal/25 text-brand-teal border border-brand-teal/30 transition-all flex items-center gap-2 text-xs font-bold shadow-sm cursor-pointer"
                title="Switch to Faculty Command Portal"
              >
                <GraduationCap className="w-4.5 h-4.5" />
                <span className="hidden sm:inline">Faculty Command</span>
              </button>
            </>
          )}

          <div className="relative">
            <button
              onClick={() => { 
                setShowNotifDropdown(p => {
                  const nextState = !p;
                  if (nextState) {
                    loadUsersData();
                  }
                  return nextState;
                }); 
                if (unreadCount > 0) markAllRead(); 
              }}
              className="relative p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-400/30 transition-all flex items-center gap-2 shadow-sm"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="text-xs font-bold hidden sm:inline">Notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse shadow-md">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

          {showNotifDropdown && (
            <>
              {/* Click outside overlay */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifDropdown(false)} 
              />
              <div className="absolute right-0 top-14 w-88 sm:w-[430px] max-w-[calc(100vw-2rem)] max-h-[560px] overflow-y-auto bg-[#0d0f18] border border-[#232738] rounded-3xl shadow-2xl shadow-black/90 z-50 p-4 sm:p-5 space-y-3.5 backdrop-blur-2xl custom-scrollbar">
                <div className="flex items-center justify-between border-b border-[#232738] pb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4.5 h-4.5 text-[#facc15] fill-[#facc15]/20" />
                    <span className="text-[13px] font-extrabold text-[#facc15] uppercase tracking-wide">
                      LIVE NOTIFICATIONS ({notifications.length})
                    </span>
                  </div>
                  {notifications.length > 0 && (
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={markAllRead} 
                        className="text-[#facc15] hover:text-amber-300 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Mark Read
                      </button>
                      <button 
                        onClick={clearAllNotifications} 
                        className="text-[#f87171] hover:text-rose-400 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="py-10 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-500">
                      <Bell className="w-6 h-6 opacity-40" />
                    </div>
                    <p className="text-xs text-gray-300 font-semibold">No new live notifications</p>
                    <p className="text-[11px] text-gray-500 max-w-[260px] mx-auto">Real-time logins, test assessments, and student activities will appear here live.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => handleNotificationClick(n)}
                        className={`p-4 rounded-2xl border text-xs space-y-2 transition-all cursor-pointer group ${
                          n.read 
                            ? 'bg-[#12141f]/70 border-[#1f2233] text-gray-400 hover:bg-[#181a27]' 
                            : 'bg-[#151724] border-[#262a3d] text-gray-100 shadow-md hover:bg-[#1a1d2d]'
                        }`}
                      >
                        {/* Line 1: Badge & Time */}
                        <div className="flex items-center justify-between gap-2">
                          <span className={`px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider text-[10.5px] flex items-center gap-1.5 ${
                            n.type === 'register' 
                              ? 'bg-[#064e3b]/80 text-[#34d399] border border-[#10b981]/40' 
                              : n.type === 'submission'
                              ? 'bg-[#3b0764]/80 text-[#c084fc] border border-[#8b5cf6]/40'
                              : n.type === 'doubt'
                              ? 'bg-[#500724]/80 text-[#fb7185] border border-[#ec4899]/40'
                              : n.type === 'task'
                              ? 'bg-[#451a03]/80 text-[#fbbf24] border border-[#f59e0b]/40'
                              : n.type === 'grievance'
                              ? 'bg-[#881337]/80 text-[#fb7185] border border-[#f43f5e]/40'
                              : 'bg-[#172554]/80 text-[#60a5fa] border border-[#3b82f6]/40'
                          }`}>
                            {n.type === 'register' ? '⏪ SCHOLAR ENROLLED' : n.type === 'submission' ? '📝 TEST SUBMITTED' : n.type === 'doubt' ? '❓ DOUBT RAISED' : n.type === 'task' ? '📋 TASK COMPLETED' : n.type === 'grievance' ? '⚠️ GRIEVANCE' : '🔑 ACTIVE LOGIN'}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 font-normal">
                              {formatNotificationTime(n._sortTime || n.createdAt)}
                            </span>
                            <button
                              onClick={(e) => handleDismissNotification(e, n.id)}
                              className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded-md hover:bg-rose-500/20 text-gray-400 hover:text-rose-300 flex items-center justify-center transition-all cursor-pointer"
                              title="Dismiss notification"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Line 2: Scholar Name / Roll */}
                        <div className="pt-0.5">
                          <h4 className="font-bold text-white text-[15px] tracking-normal leading-snug group-hover:text-amber-300 transition-colors">
                            {cleanScholarName(n.name, n.email)}
                          </h4>
                        </div>

                        {/* Line 3: Email · Role · College */}
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-wrap font-medium pt-0.5">
                          <span>{n.email || (n.rollNumber ? `${n.rollNumber.toLowerCase()}@gprec.ac.in` : '')}</span>
                          <span className="text-gray-600 font-bold">·</span>
                          <span className="text-[#facc15] font-extrabold uppercase tracking-wide">{(n.role || 'USER').toUpperCase()}</span>
                          <span className="text-gray-600 font-bold">·</span>
                          <span className="text-gray-300 font-semibold uppercase">{n.college || 'GPREC'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
          </div>{/* close relative div */}
        </div>{/* close action buttons div */}
      </div>{/* close header row div */}

        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar w-full border-b border-[var(--border-color)]">
            <button
              onClick={() => setActiveView('scholars')}
              className={`px-4 py-2.5 rounded-[10px] text-[13px] font-semibold tracking-wide flex items-center gap-2 transition-all whitespace-nowrap ${activeView === 'scholars' ? 'bg-amber-400/10 text-amber-400 shadow-sm' : 'text-[var(--text-secondary)] hover:text-amber-400 hover:bg-white/5'}`}
            >
              <Users className="w-4 h-4" /> Scholars
            </button>
            <button
              onClick={() => setActiveView('colleges')}
              className={`px-4 py-2.5 rounded-[10px] text-[13px] font-bold tracking-wide flex items-center gap-2 transition-all whitespace-nowrap border ${activeView === 'colleges' ? 'bg-brand-pink/20 text-brand-pink border-brand-pink/50 shadow-md' : 'bg-brand-pink/10 text-brand-pink border-brand-pink/30 hover:bg-brand-pink/20'}`}
            >
              <Award className="w-4 h-4 text-brand-pink" /> 🏫 Partner Colleges (SaaS Tenants)
            </button>
            <button
              onClick={() => { setActiveView('newUsers'); loadUsersData(); }}
              className={`px-4 py-2.5 rounded-[10px] text-[13px] font-semibold tracking-wide flex items-center gap-2 transition-all whitespace-nowrap relative ${activeView === 'newUsers' ? 'bg-green-500/10 text-green-400 shadow-sm' : 'text-[var(--text-secondary)] hover:text-green-400 hover:bg-white/5'}`}
            >
              <Bell className="w-4 h-4" />
              New Users
              {newUsersCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-green-500 text-white text-[10px] font-black flex items-center justify-center">
                  {newUsersCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveView('tests')}
              className={`px-4 py-2.5 rounded-[10px] text-[13px] font-semibold tracking-wide flex items-center gap-2 transition-all whitespace-nowrap ${activeView === 'tests' ? 'bg-amber-400/10 text-amber-400 shadow-sm' : 'text-[var(--text-secondary)] hover:text-amber-400 hover:bg-white/5'}`}
            >
              <FileText className="w-4 h-4" /> Test Manager
            </button>
            <button
              onClick={() => setActiveView('submissions')}
              className={`px-4 py-2.5 rounded-[10px] text-[13px] font-semibold tracking-wide flex items-center gap-2 transition-all whitespace-nowrap ${activeView === 'submissions' ? 'bg-amber-400/10 text-amber-400 shadow-sm' : 'text-[var(--text-secondary)] hover:text-amber-400 hover:bg-white/5'}`}
            >
              <CheckCircle className="w-4 h-4" /> Submissions
            </button>
            <button
              onClick={() => setActiveView('frequent')}
              className={`px-4 py-2.5 rounded-[10px] text-[13px] font-semibold tracking-wide flex items-center gap-2 transition-all whitespace-nowrap ${activeView === 'frequent' ? 'bg-amber-400/10 text-amber-400 shadow-sm' : 'text-[var(--text-secondary)] hover:text-amber-400 hover:bg-white/5'}`}
            >
              <Flame className="w-4 h-4" /> Frequent Users
            </button>
            <button
              onClick={() => setActiveView('assigned_tasks')}
              className={`px-4 py-2.5 rounded-[10px] text-[13px] font-semibold tracking-wide flex items-center gap-2 transition-all whitespace-nowrap ${activeView === 'assigned_tasks' ? 'bg-amber-400/10 text-amber-400 shadow-sm' : 'text-[var(--text-secondary)] hover:text-amber-400 hover:bg-white/5'}`}
            >
              <ClipboardList className="w-4 h-4" /> Assigned Tasks
            </button>
            <button
              onClick={() => setActiveView('attendance')}
              className={`px-4 py-2.5 rounded-[10px] text-[13px] font-semibold tracking-wide flex items-center gap-2 transition-all whitespace-nowrap ${activeView === 'attendance' ? 'bg-amber-400/10 text-amber-400 shadow-sm' : 'text-[var(--text-secondary)] hover:text-amber-400 hover:bg-white/5'}`}
            >
              <CheckCircle className="w-4 h-4" /> Attendance
            </button>
            <button
              onClick={() => setActiveView('approvals')}
              className={`px-4 py-2.5 rounded-[10px] text-[13px] font-semibold tracking-wide flex items-center gap-2 transition-all whitespace-nowrap ${activeView === 'approvals' ? 'bg-amber-400/10 text-amber-400 shadow-sm' : 'text-[var(--text-secondary)] hover:text-amber-400 hover:bg-white/5'}`}
            >
              <ShoppingCart className="w-4 h-4" /> Approvals
            </button>
            <button
              onClick={() => setActiveView('feedbacks')}
              className={`px-4 py-2.5 rounded-[10px] text-[13px] font-semibold tracking-wide flex items-center gap-2 transition-all whitespace-nowrap ${activeView === 'feedbacks' ? 'bg-amber-400/10 text-amber-400 shadow-sm' : 'text-[var(--text-secondary)] hover:text-amber-400 hover:bg-white/5'}`}
            >
              <MessageSquare className="w-4 h-4" /> Feedbacks
            </button>
            <button
              onClick={() => setActiveView('community')}
              className={`px-4 py-2.5 rounded-[10px] text-[13px] font-semibold tracking-wide flex items-center gap-2 transition-all whitespace-nowrap ${activeView === 'community' ? 'bg-amber-400/10 text-amber-400 shadow-sm' : 'text-[var(--text-secondary)] hover:text-amber-400 hover:bg-white/5'}`}
            >
              <Users className="w-4 h-4" /> Class Groups
            </button>
            <button
              onClick={() => setActiveView('doubts')}
              className={`px-4 py-2.5 rounded-[10px] text-[13px] font-semibold tracking-wide flex items-center gap-2 transition-all whitespace-nowrap ${activeView === 'doubts' ? 'bg-amber-400/10 text-amber-400 shadow-sm' : 'text-[var(--text-secondary)] hover:text-amber-400 hover:bg-white/5'}`}
            >
              <MessageSquare className="w-4 h-4" /> Mentor Doubts
            </button>
            <button
              onClick={() => setActiveView('trash')}
              className={`px-4 py-2.5 rounded-[10px] text-[13px] font-semibold tracking-wide flex items-center gap-2 transition-all whitespace-nowrap ${activeView === 'trash' ? 'bg-amber-400/10 text-amber-400 shadow-sm' : 'text-[var(--text-secondary)] hover:text-amber-400 hover:bg-white/5'}`}
            >
              <Trash2 className="w-4 h-4" /> Deleted
            </button>
            <button
              onClick={() => setActiveView('faculty_approvals')}
              className={`px-4 py-2.5 rounded-[10px] text-[13px] font-semibold tracking-wide flex items-center gap-2 transition-all whitespace-nowrap ${activeView === 'faculty_approvals' ? 'bg-amber-400/10 text-amber-400 shadow-sm' : 'text-[var(--text-secondary)] hover:text-amber-400 hover:bg-white/5'}`}
            >
              <CheckCircle className="w-4 h-4" /> Faculty Approvals
            </button>
            <button
              onClick={() => setActiveView('clubs')}
              className={`px-4 py-2.5 rounded-[10px] text-[13px] font-semibold tracking-wide flex items-center gap-2 transition-all whitespace-nowrap ${activeView === 'clubs' ? 'bg-brand-purple/10 text-brand-purple shadow-sm border border-brand-purple/30' : 'text-[var(--text-secondary)] hover:text-brand-purple hover:bg-white/5'}`}
            >
              <Users className="w-4 h-4 text-brand-purple" /> College Clubs Manager
            </button>
          </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          {activeView === 'scholars' && (
            <div className="flex flex-wrap items-center justify-between gap-4 w-full">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleDeleteAllUsers}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold uppercase transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Deactivate All
                </button>
                <button 
                  onClick={handleExportExcel}
                  className="flex items-center gap-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                  title="Download complete multi-sheet progress report (Coding, Tests, Placement, Tasks) in Excel (.xlsx) format"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Full Progress Excel (.xlsx)
                </button>
                <button 
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                  title="Download scholar summary in CSV format"
                >
                  <Download className="w-4 h-4" />
                  Export CSV (.csv)
                </button>
                <button 
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 bg-purple-500/15 hover:bg-purple-500/25 text-purple-400 border border-purple-500/30 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                  title="Download formatted printable PDF progress report"
                >
                  <Download className="w-4 h-4" />
                  Export PDF (.pdf)
                </button>
              </div>

              <div className="flex gap-2 items-center">
                <button 
                  onClick={toggleDemoMode}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    demoMode ? 'bg-brand-teal/20 text-brand-teal border border-brand-teal/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  {demoMode ? 'Demo Mode: ON (XP Paused)' : 'Demo Mode: OFF'}
                </button>
                <button 
                  onClick={loadUsersData}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 text-xs font-bold text-gray-300 transition-colors"
                >
                  <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-teal' : ''}`} />
                  Refresh Data
                </button>
              </div>
            </div>
          )}
  </div>


      {activeView === 'submissions' ? (
        <FounderSubmissionsManager />
      ) : activeView === 'tests' ? (
        <FounderTestManager />
      ) : activeView === 'frequent' ? (
        <FounderFrequentUsers usersList={usersList} onToggleBlock={handleToggleBlock} />
      ) : activeView === 'assigned_tasks' ? (
        <FounderAssignedTasks />
      ) : activeView === 'attendance' ? (
        <FounderAttendanceManager />
      ) : activeView === 'approvals' ? (
        <FounderMarketplaceApprovals />
      ) : activeView === 'feedbacks' ? (
        <FounderFeedbackManager />
      ) : activeView === 'doubts' ? (
        <FounderDoubtManager />
      ) : activeView === 'faculty_approvals' ? (
        <FounderFacultyApprovals />
      ) : activeView === 'clubs' ? (
        <FounderClubsManager />
      ) : activeView === 'colleges' ? (
        <FounderCollegesManager />
      ) : activeView === 'community' ? (
        <FounderCommunityManager />
      ) : (
        <>
          {/* Analytics widgets */}
          {activeView !== 'trash' && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Scholars Card - PURPLE */}
        <div className="glass-panel p-[22px] px-[24px] rounded-[16px] border border-[var(--border-color)] relative overflow-hidden flex items-center gap-5 bg-[var(--bg-card)]">
          <div className="w-14 h-14 rounded-full bg-[var(--brand-primary-soft)] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-[var(--primary)]" />
          </div>
          <div>
            <span className="text-[11px] font-inter text-[var(--text-main)] font-bold uppercase block tracking-wider">Total Scholars</span>
            <span className="text-2xl md:text-[32px] font-sora font-bold text-[var(--primary)] mt-1 block">{statistics.totalScholars}</span>
            <span className="text-[11px] font-inter text-[var(--success)] font-semibold mt-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              {statistics.scholarsThisWeek > 0 
                ? `↑ ${statistics.scholarsThisWeek} registered this week`
                : '🟢 Live Real-Time Network'}
            </span>
          </div>
        </div>

        {/* Aura Card - ORANGE */}
        <div className="glass-panel p-[22px] px-[24px] rounded-[16px] border border-[var(--border-color)] relative overflow-hidden flex items-center gap-5 bg-[var(--bg-card)]">
          <div className="w-14 h-14 rounded-full bg-[var(--brand-cta-soft)] flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-[var(--accent)]" />
          </div>
          <div>
            <span className="text-[11px] font-inter text-[var(--text-main)] font-bold uppercase block tracking-wider">Global Aura (Resonance)</span>
            <span className="text-2xl md:text-[32px] font-sora font-bold text-[var(--accent)] mt-1 block">{statistics.totalXp.toLocaleString()} AP</span>
            <span className="text-[11px] font-inter text-[var(--text-secondary)] font-semibold mt-2 flex items-center gap-1.5 flex-wrap">
              <span>⚡ Live Metric:</span>
              <span className="text-amber-400 font-bold">
                {statistics.totalScholars > 0 ? (statistics.totalXp / statistics.totalScholars).toFixed(1) : 0} AP / scholar
              </span>
            </span>
          </div>
        </div>

        {/* Synaptic Energy Card - GREEN */}
        <div className="glass-panel p-[22px] px-[24px] rounded-[16px] border border-[var(--border-color)] relative overflow-hidden flex items-center gap-5 bg-[var(--bg-card)]">
          <div className="w-14 h-14 rounded-full bg-[var(--brand-success-soft)] flex items-center justify-center shrink-0">
            <Coins className="w-6 h-6 text-[var(--success)]" />
          </div>
          <div>
            <span className="text-[11px] font-inter text-[var(--text-main)] font-bold uppercase block tracking-wider">Total Synaptic Energy</span>
            <span className="text-2xl md:text-[32px] font-sora font-bold text-brand-success mt-1 block">{statistics.totalCoins.toLocaleString()} SC</span>
            <span className="text-[11px] font-inter text-brand-success font-semibold mt-2 flex items-center gap-1.5 flex-wrap">
              <span>💎 Live Economy:</span>
              <span className="font-bold">
                {statistics.totalScholars > 0 ? (statistics.totalCoins / statistics.totalScholars).toFixed(1) : 0} SC / scholar
              </span>
            </span>
          </div>
        </div>

      </div>
      )}

      {/* Control filters bar */}
      <div className="glass-panel p-3 px-5 rounded-[12px] flex flex-col md:flex-row gap-4 items-center justify-between border-[var(--border-color)]">
        
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search scholars by name, email, or UID..."
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs text-[var(--text-main)] placeholder-gray-500 focus:border-[var(--primary)]"
          />
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-500" />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          
          <div className="flex items-center gap-1.5 bg-[var(--bg-card)] px-3 py-1.5 rounded-xl border border-[var(--border-color)] text-xs text-[var(--text-main)]">
            <Filter className="w-3.5 h-3.5 text-[var(--primary)]" />
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="bg-transparent outline-none cursor-pointer font-semibold tracking-wide text-[10px] text-[var(--text-main)] [&>option]:bg-[#13131f]"
            >
              <option value="All">All Colleges</option>
              {collegeOptions.filter(c => c !== 'All').map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[var(--bg-card)] px-3 py-1.5 rounded-xl border border-[var(--border-color)] text-xs text-[var(--text-main)]">
            <BookOpen className="w-3.5 h-3.5 text-[var(--primary)]" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-transparent outline-none cursor-pointer font-semibold tracking-wide text-[10px] text-[var(--text-main)] [&>option]:bg-[#13131f]"
            >
              <option value="All">All Depts</option>
              {deptOptions.filter(d => d !== 'All').map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[var(--bg-card)] px-3 py-1.5 rounded-xl border border-[var(--border-color)] text-xs text-[var(--text-main)]">
            <Shield className="w-3.5 h-3.5 text-[var(--primary)]" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-transparent outline-none cursor-pointer font-semibold tracking-wide text-[10px] text-[var(--text-main)] [&>option]:bg-[#13131f]"
            >
              <option value="All" className="bg-[#13131f]">All Roles</option>
              <option value="user" className="bg-[#13131f]">Students</option>
              <option value="teammate" className="bg-[#13131f]">Teammates / Contributors ⚡</option>
              <option value="faculty" className="bg-[#13131f]">Faculty 👨‍🏫</option>
              <option value="founder" className="bg-[#13131f]">Founders 🛡️</option>
            </select>
          </div>

        </div>

      </div>

      {/* Main Scholars Database Table */}
      <div className="glass-panel rounded-[16px] overflow-hidden border border-[var(--border-color)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-card)] border-b border-[var(--border-color)] text-[11px] text-[var(--text-secondary)] font-bold tracking-wide">
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
                    {activeView === 'newUsers'
                      ? '✅ No new registrations in the last 24 hours. Check back after users sign up!'
                      : 'No scholars found matching the queries.'}
                  </td>
                </tr>
              ) : filteredUsers.map((u) => (
                <tr 
                  key={u.id}
                  className="border-b border-[var(--border-color)] hover:bg-[var(--bg-card-hover)] transition-colors"
                >
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full relative flex items-center justify-center bg-[var(--brand-primary-soft)] text-[var(--primary)] font-bold text-[13px] shadow-sm">
                        {u.role === 'founder' && (
                          <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[var(--accent)] rounded-full flex items-center justify-center border border-[var(--bg-card)]" title="Founder Access">
                            <Shield className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                        {cleanScholarName(u.name) ? cleanScholarName(u.name).split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'S'}
                      </div>
                      <div>
                        <span className="text-[13px] font-semibold text-[var(--text-main)] flex items-center gap-2 flex-wrap">
                          {cleanScholarName(u.name)}
                          {isUserBlocked(u) ? (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              Login Blocked
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Access Allowed
                            </span>
                          )}
                          {u.created_at_raw && (Date.now() - u.created_at_raw) <= 24 * 60 * 60 * 1000 && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse">
                              NEW
                            </span>
                          )}
                        </span>
                        <span className="text-[11px] text-[var(--text-secondary)] font-medium block">{u.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-xs font-medium text-[var(--text-main)]">
                    <div>
                      <span>{u.college || 'GPREC'}</span>
                      <span className="text-[10px] text-[var(--text-secondary)] block font-semibold uppercase">{u.department || 'CSE'} • {u.year || '1st Year'}</span>
                    </div>
                  </td>

                  <td className="p-4 text-center text-[10px] font-bold text-[var(--text-secondary)]">
                    <span className="px-2 py-0.5 bg-[var(--bg-card)] rounded border border-[var(--border-color)] tracking-wide flex items-center justify-center gap-1 w-max mx-auto shadow-sm">
                      <Database className="w-3 h-3 text-[var(--primary)]" />
                      <span>{u.source}</span>
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    {activeView === 'trash' ? (
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleRestoreUser(u.id)}
                          className="px-3 py-1.5 rounded-lg bg-[var(--brand-success-soft)] border border-[var(--brand-success-soft)] text-[var(--success)] hover:bg-[var(--success)] hover:text-white font-extrabold text-[10px] tracking-wide transition-all cursor-pointer flex items-center gap-1"
                        >
                          <RefreshCcw className="w-3 h-3" /> Restore
                        </button>
                        <button 
                          onClick={() => handlePermanentDeleteUser(u.id)}
                          className="px-3 py-1.5 rounded-lg bg-[var(--brand-error-soft)] border border-[var(--brand-error-soft)] text-[var(--error)] hover:bg-[var(--error)] hover:text-white font-extrabold text-[10px] tracking-wide transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Purge
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEditClick(u)}
                          className="px-3 py-1.5 rounded-[8px] bg-transparent border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white font-bold text-[11px] tracking-wide transition-all cursor-pointer"
                        >
                          Control
                        </button>
                        {u.role !== 'founder' && (
                          <button 
                            onClick={() => handleToggleBlock(u)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold tracking-wide border transition-all cursor-pointer ${
                              isUserBlocked(u)
                                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-white'
                                : 'bg-red-500/10 border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white'
                            }`}
                          >
                            {isUserBlocked(u) ? 'Unblock' : 'Block'}
                          </button>
                        )}
                      </div>
                    )}
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

            <form onSubmit={handleSaveUserUpdates} className="space-y-5">
              
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold tracking-wide">Scholar Full Name</label>
                <input 
                  type="text" 
                  required
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs font-semibold focus:outline-none focus:border-brand-teal transition-colors"
                />
              </div>

              {/* Row 2: XP and Coins */}
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
                    <option value="teammate">Teammate (Previous Papers & Learning Hub Contributor ⚡)</option>
                    <option value="faculty">Faculty (Faculty Command 👨‍🏫)</option>
                    <option value="founder">Founder / Super Admin 🛡️</option>
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
