import React, { useState, useEffect, useMemo } from 'react';
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

export const cleanScholarName = (str) => {
  if (!str || typeof str !== 'string') return 'Scholar';
  let cleaned = str;
  if (cleaned.includes('{')) {
    cleaned = cleaned.split('{')[0].trim();
  }
  cleaned = cleaned.replace(/[\{\}":;]/g, '').trim();
  return cleaned || 'Scholar';
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
      author: 'Lumixora Mentor',
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
  
  // Filter States
  const [selectedCollege, setSelectedCollege] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  const [sortBy, setSortBy] = useState('xp'); // 'xp', 'created_at', 'name'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

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

  // Load all users from Supabase
  const loadUsersData = async () => {
    setLoading(true);
    try {
      const mergedMap = new Map();

      // Fetch from Supabase with range(0, 2000) to retrieve all rows
      const { data: sbUsers, error: sbErr } = await supabase.from('users').select('*').range(0, 2000);
      if (sbErr) {
        console.warn("Supabase user fetch failed:", sbErr);
      } else if (sbUsers) {
        sbUsers.forEach(u => {
          const userId = u.id || u.uid || u.email;
          const parsed = parseProfileName(u.name);
          const registerDate = u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A';
          const cleanName = parsed.name || (u.name && !u.name.includes('{') ? u.name : 'Scholar');
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
            xp: u.xp !== undefined && u.xp !== null ? u.xp : 0,
            level: u.level !== undefined && u.level !== null ? u.level : 1,
            coins: u.coins !== undefined && u.coins !== null ? u.coins : 0,
            streak: u.streak !== undefined && u.streak !== null ? u.streak : 0,
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
          mergedMap.set(userId, userObj);
          if (u.email) {
            mergedMap.set(u.email.toLowerCase(), userObj);
          }
        });
      }

      // Fetch from Firebase
      const fbUsersSnapshot = await getDocs(collection(db, 'users'));
      fbUsersSnapshot.forEach(docSnap => {
        const u = docSnap.data();
        const existing = mergedMap.get(docSnap.id) || (u.email ? mergedMap.get(u.email.toLowerCase()) : null);
        const parsedFb = parseProfileName(u.name || u.displayName);
        const cleanFbName = u.cleanName || parsedFb.name || (u.name && !u.name.includes('{') ? u.name : 'Scholar');
        const college = u.college || parsedFb.college || 'GPREC';
        const department = u.department || u.branch || parsedFb.department || 'CSE';
        const year = u.year || parsedFb.year || '1st Year';
        const sem = u.sem || parsedFb.sem || '1';
        const sec = u.sec || parsedFb.sec || 'A';
        const rollNumber = u.rollNumber || (u.email && u.email.endsWith('@gprec.ac.in') ? u.email.split('@')[0].toUpperCase() : '');

        if (existing) {
          // Merge updated profile details & gamification data into existing user
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

          existing.xp = u.xp !== undefined ? u.xp : existing.xp;
          existing.level = u.level !== undefined ? u.level : existing.level;
          existing.coins = u.coins !== undefined ? u.coins : existing.coins;
          existing.streak = u.streak !== undefined ? u.streak : existing.streak;
          existing.badges = u.badges || existing.badges;
          existing.completedDays = u.completedDays || existing.completedDays;
          existing.studyHours = u.studyHours !== undefined ? u.studyHours : existing.studyHours;
          existing.quizScore = u.quizScore !== undefined ? u.quizScore : existing.quizScore;
          existing.notesShared = u.notesShared !== undefined ? u.notesShared : existing.notesShared;
          existing.is_deleted = u.is_deleted !== undefined ? u.is_deleted : (existing.is_deleted || false);
          existing.is_blocked = u.is_blocked !== undefined ? u.is_blocked : existing.is_blocked;
          existing.is_approved = u.is_approved !== undefined ? u.is_approved : (u.isApproved !== undefined ? u.isApproved : existing.is_approved);
          existing.isApproved = existing.is_approved;
          existing.source = 'Supabase + Firebase';
        } else {
          // User only exists in Firebase
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
            xp: u.xp || 0,
            level: u.level || 1,
            coins: u.coins || 0,
            streak: u.streak || 0,
            created_at: u.createdAt ? (u.createdAt.toDate ? u.createdAt.toDate().toLocaleDateString() : new Date(u.createdAt).toLocaleDateString()) : 'N/A',
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
            is_approved: u.is_approved !== undefined ? u.is_approved : (u.isApproved !== undefined ? u.isApproved : false),
            isApproved: u.isApproved !== undefined ? u.isApproved : (u.is_approved !== undefined ? u.is_approved : false),
            is_deleted: u.is_deleted || false,
            metadata: parsedFb
          };
          mergedMap.set(docSnap.id, newObj);
          if (u.email) {
            mergedMap.set(u.email.toLowerCase(), newObj);
          }
        }
      });

      const uniqueUsersList = Array.from(new Set(mergedMap.values()));
      setUsersList(uniqueUsersList);
    } catch (error) {
      console.error("Error loading users list:", error);
      addToast({ message: 'Failed to retrieve all users.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    loadUsersData();
  }, []);

  // --- Live real-time listener for users, notifications & onboarded college tenants ---
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [onboardedTenants, setOnboardedTenants] = useState(DEFAULT_COLLEGES);

  useEffect(() => {
    // 1. Listen to real-time changes in Firestore users collection
    const unsubUsers = onSnapshot(collection(db, 'users'), () => {
      loadUsersData();
    });

    // 2. Listen to real-time founder notifications with robust sorting
    const unsubNotifs = onSnapshot(
      collection(db, 'founder_notifications'),
      (snap) => {
        const fetched = snap.docs.map(d => {
          const data = d.data();
          let timeVal = 0;
          if (data.timestamp?.toMillis) {
            timeVal = data.timestamp.toMillis();
          } else if (data.timestamp?.toDate) {
            timeVal = data.timestamp.toDate().getTime();
          } else if (data.createdAt) {
            timeVal = new Date(data.createdAt).getTime();
          } else if (typeof data.timestamp === 'number') {
            timeVal = data.timestamp;
          } else if (typeof data.timestamp === 'string') {
            timeVal = new Date(data.timestamp).getTime() || 0;
          }
          return { id: d.id, ...data, _sortTime: timeVal || 0 };
        });
        fetched.sort((a, b) => (b._sortTime || 0) - (a._sortTime || 0));
        setNotifications(fetched.slice(0, 100));
      },
      (err) => {
        console.warn("Real-time notifications listener error:", err);
      }
    );

    // 3. Listen to onboarded partner college tenants & purge any legacy junk docs
    const unsubTenants = onSnapshot(collection(db, 'college_tenants'), (snap) => {
      const fetched = [];
      const junkIds = ['mcet', 'mec', 'pec', 'vmtw', 'rgukt', 'dsu', 'graphic', 'ufug', 'iit', 'gp', 'mvj college of engineering', 'g pullareddy engineering college'];
      
      snap.forEach(d => {
        if (d.id === 'init') return;
        const id = d.id.toLowerCase();
        const data = d.data();
        const name = (data.name || '').toLowerCase();
        const code = (data.code || '').toLowerCase();
        
        if (junkIds.includes(id) || junkIds.includes(name) || junkIds.includes(code)) {
          // Purge junk doc asynchronously from Firestore
          deleteDoc(doc(db, 'college_tenants', d.id)).catch(() => {});
        } else if (!data.is_deleted && !data.isDeleted) {
          fetched.push({ id: d.id, ...data });
        }
      });
      
      const hasGprec = fetched.some(c => c.id === 'gprec');
      const finalList = hasGprec ? fetched : [...DEFAULT_COLLEGES, ...fetched];
      setOnboardedTenants(finalList);
    });

    return () => {
      unsubUsers();
      unsubNotifs();
      unsubTenants();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    await Promise.all(unread.map(n => updateDoc(doc(db, 'founder_notifications', n.id), { read: true })));
  };

  const clearAllNotifications = async () => {
    await Promise.all(notifications.map(n => deleteDoc(doc(db, 'founder_notifications', n.id))));
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
    const totalXp = activeScholars.reduce((acc, u) => acc + (u.xp || 0), 0);
    const totalCoins = activeScholars.reduce((acc, u) => acc + (u.coins || 0), 0);
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
      addToast({ message: 'Generating complete platform activity workbook...', type: 'info' });
      const wb = XLSX.utils.book_new();

      // 1. All Users & Scholars
      const allUsersData = (usersList && usersList.length > 0 ? usersList : filteredUsers).map((u, i) => ({
        'S.No': i + 1,
        'Name': cleanScholarName(u.name),
        'Email': u.email || 'N/A',
        'Role': (u.role || 'user').toUpperCase(),
        'College': u.college || 'GPREC',
        'Department': u.department || u.branch || 'CSE',
        'Year': u.year || '1st Year',
        'Section': u.sec || 'A',
        'Semester': u.sem || '1',
        'Global Aura (AP)': u.xp || 0,
        'Synaptic Energy (SC)': u.coins || 0,
        'Account Status': u.is_blocked ? 'BLOCKED' : (u.is_approved ? 'APPROVED' : 'ACTIVE'),
        'Registered Date': u.created_at || 'N/A'
      }));
      const wsUsers = XLSX.utils.json_to_sheet(allUsersData);
      XLSX.utils.book_append_sheet(wb, wsUsers, 'All Scholars (131)');

      // 2. Test Submissions
      try {
        const { data: subs } = await supabase.from('test_submissions').select('*').limit(2000);
        if (subs && subs.length > 0) {
          const subsData = subs.map((s, i) => ({
            'S.No': i + 1,
            'Scholar Email': s.user_email || s.email || s.userId || '',
            'Scholar Name': s.user_name || s.name || '',
            'Test Title': s.test_title || s.testTitle || 'Assessment',
            'Score': s.score || 0,
            'Total Questions': s.total_marks || s.totalQuestions || 0,
            'Accuracy': s.accuracy ? s.accuracy + '%' : 'N/A',
            'Time Spent': s.time_spent || s.timeTaken || '',
            'Submitted Date': s.created_at ? new Date(s.created_at).toLocaleString() : 'N/A'
          }));
          const wsSubs = XLSX.utils.json_to_sheet(subsData);
          XLSX.utils.book_append_sheet(wb, wsSubs, 'Test Submissions');
        }
      } catch(e) {}

      // 3. Uploaded Notes & Papers
      try {
        const { data: notes } = await supabase.from('notes').select('*').limit(2000);
        if (notes && notes.length > 0) {
          const notesData = notes.map((n, i) => ({
            'S.No': i + 1,
            'Title': n.title || '',
            'Subject': n.subject || '',
            'Subject Code': n.subjectCode || n.subject_code || '',
            'Branch': n.branch || '',
            'Semester': n.semester || '',
            'Uploaded By': n.contributedBy || n.author || '',
            'Link': n.fileUrl || n.url || '',
            'Date': n.created_at ? new Date(n.created_at).toLocaleString() : 'N/A'
          }));
          const wsNotes = XLSX.utils.json_to_sheet(notesData);
          XLSX.utils.book_append_sheet(wb, wsNotes, 'Uploaded Papers & Notes');
        }
      } catch(e) {}

      // 4. Doubts & Questions
      try {
        const { data: doubts } = await supabase.from('doubts').select('*').limit(2000);
        if (doubts && doubts.length > 0) {
          const doubtsData = doubts.map((d, i) => ({
            'S.No': i + 1,
            'Author': d.author || d.name || '',
            'Email': d.email || '',
            'Topic': d.subject || d.topic || '',
            'Question': d.question || d.content || '',
            'Status': d.status || 'Active',
            'Date': d.createdAt || d.created_at ? new Date(d.createdAt || d.created_at).toLocaleString() : 'N/A'
          }));
          const wsDoubts = XLSX.utils.json_to_sheet(doubtsData);
          XLSX.utils.book_append_sheet(wb, wsDoubts, 'Doubts & Q&A');
        }
      } catch(e) {}

      XLSX.writeFile(wb, `Lumixora_Master_Database_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
      addToast({ message: `Exported complete database (${allUsersData.length} scholars & all activities) to Excel!`, type: 'success' });
    } catch (err) {
      console.error('Excel Export Error:', err);
      addToast({ message: 'Failed to export master Excel report.', type: 'error' });
    }
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
      const targetList = usersList && usersList.length > 0 ? usersList : filteredUsers;
      
      doc.setFillColor(3, 7, 18);
      doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
      
      doc.setTextColor(45, 212, 191);
      doc.setFontSize(16);
      doc.text("LUMIXORA SCHOLARS MASTER ACTIVITY REPORT", 40, 40);
      
      doc.setFontSize(9);
      doc.setTextColor(156, 163, 175);
      doc.text(`Generated: ${new Date().toLocaleString()} | Total Registered Scholars: ${targetList.length}`, 40, 58);
      
      const tableData = targetList.map((u, i) => [
        i + 1,
        cleanScholarName(u.name),
        u.email || 'N/A',
        (u.role || 'user').toUpperCase(),
        u.college || 'GPREC',
        u.department || u.branch || 'CSE',
        u.year || '1st',
        u.xp || 0,
        u.coins || 0,
        u.is_blocked ? 'BLOCKED' : 'ACTIVE'
      ]);
      
      autoTable(doc, {
        startY: 70,
        head: [['#', 'Name', 'Email', 'Role', 'College', 'Dept', 'Year', 'AP (XP)', 'SC (Coins)', 'Status']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [147, 51, 234], textColor: 255, fontSize: 8, fontStyle: 'bold' },
        styles: { fontSize: 7.5, textColor: [229, 231, 235], fillColor: [17, 24, 39] },
        alternateRowStyles: { fillColor: [31, 41, 55] },
        margin: { left: 40, right: 40 }
      });
      
      doc.save(`Lumixora_All_Scholars_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
      addToast({ message: `Exported all ${targetList.length} scholars to PDF successfully!`, type: 'success' });
    } catch (err) {
      console.error('PDF Export Error:', err);
      addToast({ message: 'Failed to export PDF report.', type: 'error' });
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
            <button
              onClick={() => setActiveTab('faculty-portal')}
              className="px-3.5 py-2.5 rounded-xl bg-brand-teal/15 hover:bg-brand-teal/25 text-brand-teal border border-brand-teal/30 transition-all flex items-center gap-2 text-xs font-bold shadow-sm cursor-pointer"
              title="Switch to Faculty Command Portal"
            >
              <GraduationCap className="w-4.5 h-4.5" />
              <span className="hidden sm:inline">Faculty Command</span>
            </button>
          )}

          <div className="relative">
            <button
              onClick={() => { setShowNotifDropdown(p => !p); if (unreadCount > 0) markAllRead(); }}
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
              <div className="absolute right-0 top-14 w-80 max-w-[calc(100vw-2rem)] max-h-[420px] overflow-y-auto bg-[#161622] border border-white/15 rounded-2xl shadow-2xl z-50 p-4 space-y-3 backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5" /> Notifications ({notifications.length})
                  </span>
                  {notifications.length > 0 && (
                    <button 
                      onClick={clearAllNotifications} 
                      className="text-[11px] text-red-400 hover:text-red-300 font-bold transition-colors hover:underline"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-6 italic">No notifications yet.</p>
                ) : (
                  <div className="space-y-2">
                    {notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`p-3 rounded-xl border text-xs space-y-1.5 transition-colors ${
                          n.read 
                            ? 'bg-white/[0.02] border-white/5 text-gray-400' 
                            : 'bg-amber-400/10 border-amber-400/30 text-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[9px] ${
                            n.type === 'register' 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                              : n.type === 'submission'
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                              : n.type === 'doubt'
                              ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}>
                            {n.type === 'register' ? '🆕 New Register' : n.type === 'submission' ? '📝 Test Submitted' : n.type === 'doubt' ? '❓ Doubt Raised' : '🔑 Login'}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">
                            {n.timestamp?.toDate 
                              ? n.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                              : n.createdAt 
                              ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                              : typeof n.timestamp === 'number'
                              ? new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : 'just now'}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-white text-xs">{cleanScholarName(n.name)}</p>
                          <p className="text-[11px] text-gray-400 truncate">{n.email} · <span className="text-amber-400 font-semibold uppercase">{n.role}</span></p>
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
                  title="Download all scholar data in Excel (.xlsx) format"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Export Excel (.xlsx)
                </button>
                <button 
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 bg-purple-500/15 hover:bg-purple-500/25 text-purple-400 border border-purple-500/30 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                  title="Download formatted printable PDF report"
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
