import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { 
  Search, Bell, Sparkles, AlertCircle, Menu, Camera, Save, X, Flame, 
  Coins, Sun, Moon, ArrowLeft, LogOut, Code, Users, Home, Power,
  Bot, Award, HelpCircle, BookOpen, CheckSquare, UserCheck, Rocket, FileText
} from 'lucide-react';

import { auth, db, storage } from '../config/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '../context/ToastContext';
import { useGamification } from '../context/GamificationContext';
import { useTheme } from '../context/ThemeContext';
import { FRAMES } from '../services/gamificationService';

const QUICK_FEATURES = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'resume', label: 'AI Resume PDF', icon: FileText, highlight: true },
  { id: 'projects', label: 'Project Expo', icon: Rocket, highlight: true },
  { id: 'future-twin', label: 'Placement Twin', icon: Bot, highlight: true },
  { id: 'test-portal', label: 'Tests Hub', icon: Award },
  { id: 'coding-practice', label: 'Coding Lab', icon: Code },
  { id: 'doubts', label: 'Doubt Solver', icon: HelpCircle },
  { id: 'notes', label: 'Notes Hub', icon: BookOpen },
  { id: 'tasks', label: 'Tasks & Exam', icon: CheckSquare },
  { id: 'attendance', label: 'My Attendance', icon: UserCheck },
  { id: 'clubs', label: 'Clubs', icon: Users },
];

export default function MainLayout({ children, activeTab, setActiveTab, user, onUpdateUser, onLogout, onExitApp }) {
  const { addToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync notifications from local storage and handle real-time events
  React.useEffect(() => {
    const loadNotifications = () => {
      try {
        const saved = localStorage.getItem('lumixora_notifications');
        setNotifications(saved ? JSON.parse(saved) : []);
      } catch (e) {
        console.error("Failed to load notifications:", e);
      }
    };

    loadNotifications();

    const handleNotificationsUpdate = () => {
      loadNotifications();
    };

    const handleAppNotification = (e) => {
      addToast({ message: e.detail.message, type: e.detail.type || 'info' });
    };

    window.addEventListener('lumixora_notifications_updated', handleNotificationsUpdate);
    window.addEventListener('lumixora_app_notification', handleAppNotification);
    return () => {
      window.removeEventListener('lumixora_notifications_updated', handleNotificationsUpdate);
      window.removeEventListener('lumixora_app_notification', handleAppNotification);
    };
  }, []);

  const markAllNotificationsRead = () => {
    const updated = notifications.map(n => ({ ...n, unread: false }));
    setNotifications(updated);
    try {
      localStorage.setItem('lumixora_notifications', JSON.stringify(updated));
    } catch (e) {}
  };

  // Profile Edit states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editQualification, setEditQualification] = useState('');
  const [editCollege, setEditCollege] = useState('');
  const [editPlace, setEditPlace] = useState('');
  const [editYear, setEditYear] = useState('1st Year');
  const [editLeetcode, setEditLeetcode] = useState('');
  const [editHackerrank, setEditHackerrank] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const cleanScholarName = (str) => {
    if (!str || typeof str !== 'string') return 'Scholar';
    let cleaned = str;
    if (cleaned.includes('{')) {
      cleaned = cleaned.split('{')[0].trim();
    }
    cleaned = cleaned.replace(/[\{\}":;]/g, '').trim();
    return cleaned || 'Scholar';
  };

  const parseUserProfile = (fullName) => {
    let rawStr = fullName || '';
    let name = cleanScholarName(rawStr);
    let metadata = { qualification: '', college: 'GPREC', place: 'Kurnool, AP', year: '1st Year', avatarUrl: '' };
    if (rawStr.includes('{')) {
      const idx = rawStr.indexOf('{');
      const jsonStr = rawStr.substring(idx).trim();
      try {
        const rawJson = JSON.parse(jsonStr);
        if (rawJson && typeof rawJson === 'object') {
          Object.keys(rawJson).forEach(k => {
            const lowerK = k.toLowerCase();
            if (lowerK === 'qualification') metadata.qualification = rawJson[k];
            if (lowerK === 'college') metadata.college = rawJson[k];
            if (lowerK === 'place') metadata.place = rawJson[k];
            if (lowerK === 'year') metadata.year = rawJson[k];
            if (lowerK === 'avatarurl') metadata.avatarUrl = rawJson[k];
          });
        }
      } catch (e) {
        const qualMatch = jsonStr.match(/"qualification"\s*:\s*"([^"]+)"/i);
        const collMatch = jsonStr.match(/"college"\s*:\s*"([^"]+)"/i);
        const placeMatch = jsonStr.match(/"place"\s*:\s*"([^"]+)"/i);
        const yearMatch = jsonStr.match(/"year"\s*:\s*"([^"]+)"/i);
        const avatarMatch = jsonStr.match(/"avatarurl"\s*:\s*"([^"]+)"/i);
        if (qualMatch) metadata.qualification = qualMatch[1];
        if (collMatch) metadata.college = collMatch[1];
        if (placeMatch) metadata.place = placeMatch[1];
        if (yearMatch) metadata.year = yearMatch[1];
        if (avatarMatch) metadata.avatarUrl = avatarMatch[1];
      }
    }
    return { name: name || 'Scholar', ...metadata };
  };

  const { profile: gamifyProfile } = useGamification() || {};
  const profile = parseUserProfile(user?.name);
  const frameConfig = FRAMES.find(f => f.id === (gamifyProfile?.currentFrame || 'none')) || FRAMES[0];
  const avatarSrc = gamifyProfile?.avatarUrl || profile.avatarUrl || '/lumixora_logo.jpg';

  const openProfileModal = () => {
    const prof = parseUserProfile(user?.name);
    setEditName(prof.name);
    setEditQualification(prof.qualification || '');
    setEditCollege(prof.college || '');
    setEditPlace(prof.place || '');
    setEditYear(prof.year || '1st Year');
    setEditLeetcode(localStorage.getItem('lumixora_leetcode_user') || '');
    setEditHackerrank(localStorage.getItem('lumixora_hackerrank_user') || '');
    setAvatarUrl(prof.avatarUrl || '');
    setImageFile(null);
    setShowProfileModal(true);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      addToast({ message: 'Name cannot be empty.', type: 'warning' });
      return;
    }

    setIsSaving(true);
    try {
      let finalAvatarUrl = avatarUrl;

      // 1. Upload profile image to Firebase Storage if a new file is chosen
      if (imageFile) {
        try {
          const storageRef = ref(storage, `avatars/${user?.id || user?.uid || Date.now()}_${imageFile.name}`);
          await uploadBytes(storageRef, imageFile);
          finalAvatarUrl = await getDownloadURL(storageRef);
        } catch (uploadErr) {
          console.warn("Avatar upload warning:", uploadErr);
        }
      }

      // Save platform handles to localStorage for 100% persistent retention on refresh
      localStorage.setItem('lumixora_leetcode_user', editLeetcode.trim());
      localStorage.setItem('lumixora_hackerrank_user', editHackerrank.trim());

      // 2. Construct updated profile string with embedded metadata
      const metadata = {
        qualification: editQualification,
        college: editCollege,
        place: editPlace,
        year: editYear,
        avatarUrl: finalAvatarUrl
      };
      const cleanName = editName.trim();

      // 3. Update Firebase Auth
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: cleanName,
          photoURL: finalAvatarUrl || auth.currentUser.photoURL
        });
      }

      // 4. Update Firestore database
      const userId = user?.id || user?.uid || auth.currentUser?.uid;
      if (userId) {
        try {
          await setDoc(doc(db, 'users', userId), { 
            name: cleanName,
            qualification: editQualification,
            college: editCollege,
            place: editPlace,
            year: editYear,
            avatarUrl: finalAvatarUrl || null,
            leetcodeUser: editLeetcode.trim(),
            hackerrankUser: editHackerrank.trim()
          }, { merge: true });

          await setDoc(doc(db, 'Users', userId), { 
            name: cleanName,
            qualification: editQualification,
            college: editCollege,
            place: editPlace,
            year: editYear,
            avatarUrl: finalAvatarUrl || null
          }, { merge: true });
        } catch (dbErr) {
          console.warn("Failed to sync profile to Firestore:", dbErr);
        }
      }

      // 5. Update React state
      if (onUpdateUser) {
        onUpdateUser({ 
          ...user, 
          name: cleanName, 
          qualification: editQualification,
          college: editCollege,
          place: editPlace,
          year: editYear,
          avatarUrl: finalAvatarUrl || user?.avatarUrl 
        });
      }

      addToast({ message: 'Profile updated successfully!', type: 'success' });
      setShowProfileModal(false);
    } catch (err) {
      console.error(err);
      addToast({ message: 'Failed to update profile. Please try again.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg flex pb-16 lg:pb-0">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={onLogout}
        onExitApp={onExitApp}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen w-full lg:pl-[250px] bg-[var(--bg-main)]">
        {/* Top Header Bar (Fixed & pinned at top on all scrolls) */}
        <header className="fixed top-0 right-0 left-0 lg:left-[250px] h-16 lg:h-20 bg-[var(--bg-sidebar)]/95 backdrop-blur-xl text-[var(--text-main)] border-b border-[var(--border-color)] px-4 lg:px-6 flex items-center justify-between z-40 shadow-sm transition-all">
          {/* Left: Hamburger + Back Button + Welcome */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Mobile Hamburger */}
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-10 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-brand-primary hover:bg-[var(--bg-card-hover)] transition-all cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Native App Back Button */}
            {activeTab !== 'dashboard' && activeTab !== 'founder-portal' && (
              <button
                onClick={() => setActiveTab(user?.role === 'founder' ? 'founder-portal' : 'dashboard')}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-extrabold text-xs tracking-wide flex items-center gap-1.5 border border-white/10 cursor-pointer shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 text-brand-teal" />
                <span>Back</span>
              </button>
            )}

            <div className="hidden xl:block">
              <h2 className="text-sm font-semibold text-[var(--text-main)] flex items-center gap-1.5 tracking-wide">
                Welcome back, {profile.name ? profile.name.split(' ')[0].charAt(0).toUpperCase() + profile.name.split(' ')[0].slice(1).toLowerCase() : 'Student'} <span className="animate-bounce">👋</span>
              </h2>
              <p className="text-[10px] text-[var(--text-secondary)] font-semibold tracking-wide mt-0.5">Explore your personalized academic portal</p>
            </div>
          </div>

          {/* Middle: Quick Access Navigation Pills for Most Important Features */}
          <nav className="flex items-center gap-1.5 overflow-x-auto py-1 px-2 custom-scrollbar flex-1 min-w-0 mx-2">
            {(user?.role === 'founder' || user?.email?.toLowerCase() === 'founder@lumixora.com'
              ? [{ id: 'founder-portal', label: 'Founder Deck', icon: Sparkles, highlight: true }, ...QUICK_FEATURES]
              : QUICK_FEATURES
            ).map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-teal/20 to-brand-purple/20 text-brand-teal border border-brand-teal/40 shadow-sm shadow-brand-teal/10'
                      : item.highlight
                      ? 'bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 border border-brand-purple/20'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] border border-transparent hover:border-[var(--border-color)]'
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-brand-teal' : item.highlight ? 'text-brand-purple' : 'text-[var(--text-secondary)]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 shrink-0">


            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="w-10 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-brand-primary hover:bg-[var(--bg-card-hover)] transition-all cursor-pointer"
            >
              {theme === 'dark'
                ? <Sun className="w-4 h-4" />
                : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Center */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-brand-primary hover:bg-[var(--bg-card-hover)] transition-all cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-brand-orange shadow-sm"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 glass-panel border border-border-glass rounded-2xl shadow-xl overflow-hidden z-30">
                  <div className="p-4 border-b border-border-glass flex items-center justify-between bg-white/5">
                    <span className="text-xs font-bold text-gray-200">Recent Notifications</span>
                    <button 
                      onClick={markAllNotificationsRead} 
                      className="text-[10px] text-brand-teal font-semibold hover:underline bg-transparent border-none cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-xs text-gray-500">
                        <AlertCircle className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="p-3 border-b border-border-glass hover:bg-white/5 flex items-start gap-3 transition-colors cursor-pointer">
                          <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${n.unread ? 'bg-brand-teal' : 'bg-gray-600'}`}></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] text-gray-300 leading-snug">{n.text}</p>
                            <span className="text-[9px] text-gray-500 mt-1 block">{n.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar trigger */}
            <button 
              onClick={openProfileModal}
              className="flex items-center gap-3 p-1 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-brand-teal transition-all cursor-pointer"
            >
              <div className={`w-9 h-9 rounded-xl overflow-hidden border ${frameConfig.border || 'border-white/10'} shadow-sm relative`}>
                <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </button>
          </div>
        </header>

        {/* Fixed Header Height Spacer */}
        <div className="h-16 lg:h-20 shrink-0 w-full" aria-hidden="true" />

        {/* Main Body View */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile App Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0b0b14]/95 backdrop-blur-xl border-t border-white/10 px-2 py-2 flex justify-around items-center text-white shadow-2xl">
        <button
          onClick={() => setActiveTab(user?.role === 'founder' ? 'founder-portal' : 'dashboard')}
          className={`flex flex-col items-center gap-0.5 text-[9px] font-bold cursor-pointer ${activeTab === 'dashboard' || activeTab === 'founder-portal' ? 'text-brand-pink' : 'text-gray-400'}`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('coding-practice')}
          className={`flex flex-col items-center gap-0.5 text-[9px] font-bold cursor-pointer ${activeTab === 'coding-practice' || activeTab === 'code-editor' ? 'text-brand-teal' : 'text-gray-400'}`}
        >
          <Code className="w-4 h-4" />
          <span>Arena</span>
        </button>

        <button
          onClick={() => setActiveTab('community')}
          className={`flex flex-col items-center gap-0.5 text-[9px] font-bold cursor-pointer ${activeTab === 'community' ? 'text-brand-purple' : 'text-gray-400'}`}
        >
          <Users className="w-4 h-4" />
          <span>Network</span>
        </button>

        <button
          onClick={() => setActiveTab('future-twin')}
          className={`flex flex-col items-center gap-0.5 text-[9px] font-bold cursor-pointer ${activeTab === 'future-twin' ? 'text-brand-pink' : 'text-gray-400'}`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Twin</span>
        </button>

        <button
          onClick={() => setSidebarOpen(true)}
          className="flex flex-col items-center gap-0.5 text-[9px] font-bold text-gray-400 cursor-pointer"
        >
          <Menu className="w-4 h-4" />
          <span>Menu</span>
        </button>
      </div>

      {/* Edit Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-white/10 relative overflow-hidden bg-gradient-to-br from-brand-purple/10 to-transparent">
            <button 
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-gray-100 tracking-wide mb-4">Edit Profile</h2>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex flex-col items-center gap-3 mb-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-brand-teal group">
                  <img src={avatarUrl || avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                  <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                    <Camera className="w-6 h-6 text-white" />
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
                <span className="text-[10px] text-gray-400">Click photo to change avatar</span>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full bg-[#111118] border border-white/10 rounded-xl px-4 py-2 text-xs text-gray-300 focus:outline-none focus:border-brand-teal transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Qualification / Degree</label>
                  <input
                    type="text"
                    value={editQualification}
                    onChange={(e) => setEditQualification(e.target.value)}
                    placeholder="e.g. B.Tech"
                    className="w-full bg-[#111118] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-brand-purple transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">College / Institution</label>
                  <input
                    type="text"
                    value={editCollege}
                    onChange={(e) => setEditCollege(e.target.value)}
                    placeholder="e.g. GPREC"
                    className="w-full bg-[#111118] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-brand-purple transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Place / City</label>
                  <input
                    type="text"
                    value={editPlace}
                    onChange={(e) => setEditPlace(e.target.value)}
                    placeholder="e.g. Kurnool"
                    className="w-full bg-[#111118] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-brand-blue transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Year of Study</label>
                  <select
                    value={editYear}
                    onChange={(e) => setEditYear(e.target.value)}
                    required
                    className="w-full bg-[#111118] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-white/10 transition-all appearance-none"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Completed">Completed</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">LeetCode Username</label>
                  <input
                    type="text"
                    value={editLeetcode}
                    onChange={(e) => setEditLeetcode(e.target.value)}
                    placeholder="e.g. leet_coder"
                    className="w-full bg-[#111118] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-amber-400 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">HackerRank Username</label>
                  <input
                    type="text"
                    value={editHackerrank}
                    onChange={(e) => setEditHackerrank(e.target.value)}
                    placeholder="e.g. hr_coder"
                    className="w-full bg-[#111118] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-emerald-400 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 rounded-xl font-bold text-xs tracking-wide bg-gradient-to-r from-brand-teal to-brand-blue text-black hover:opacity-90 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <span>Saving Profile...</span>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
