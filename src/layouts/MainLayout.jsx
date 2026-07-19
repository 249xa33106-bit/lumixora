import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Search, Bell, Sparkles, AlertCircle, Menu, Camera, Save, X, Flame, Coins, Sun, Moon } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useToast } from '../context/ToastContext';
import { useGamification } from '../context/GamificationContext';
import { useTheme } from '../context/ThemeContext';
import { FRAMES } from '../services/gamificationService';

export default function MainLayout({ children, activeTab, setActiveTab, user, onUpdateUser, onLogout }) {
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
  const [avatarUrl, setAvatarUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const parseUserProfile = (fullName) => {
    let name = fullName || '';
    let metadata = { qualification: '', college: '', place: '', year: '1st Year', avatarUrl: '' };
    if (name.includes('{')) {
      const idx = name.indexOf('{');
      const jsonStr = name.substring(idx).trim();
      name = name.substring(0, idx).trim();
      try {
        metadata = JSON.parse(jsonStr);
      } catch (e) {
        console.error("Failed to parse metadata:", e);
      }
    }
    return { name: name || 'Scholar', ...metadata };
  };

  const { profile: gamifyProfile } = useGamification();
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
    setAvatarUrl(prof.avatarUrl || '');
    setImageFile(null);
    setShowProfileModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create local preview URL
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      addToast({ message: 'Name cannot be empty.', type: 'error' });
      return;
    }

    setIsSaving(true);
    let finalAvatarUrl = avatarUrl;

    try {
      // 1. Upload image if selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const path = `avatars/${user.id}_${Date.now()}.${fileExt}`;
        
        const { data, error: uploadError } = await supabase.storage
          .from('academic_resources')
          .upload(path, imageFile, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('academic_resources')
          .getPublicUrl(path);

        finalAvatarUrl = publicUrl;
      }

      // 2. Serialize metadata
      const metadata = {
        qualification: editQualification.trim(),
        college: editCollege.trim(),
        place: editPlace.trim(),
        year: editYear,
        avatarUrl: finalAvatarUrl
      };

      const updatedName = `${editName.trim()} ${JSON.stringify(metadata)}`;

      // 3. Update database
      const { error: updateError } = await supabase
        .from('users')
        .update({ name: updatedName })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // 4. Update React state
      if (onUpdateUser) {
        onUpdateUser({ ...user, name: updatedName });
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
    <div className="min-h-screen bg-primary-bg flex overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen w-full overflow-x-hidden lg:pl-[280px]">
        {/* Top Header Bar */}
        <header className="h-16 lg:h-20 glass-panel border-b border-border-glass px-4 lg:px-8 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
          {/* Left: Hamburger + Welcome */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger */}
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-10 h-10 rounded-xl bg-white/5 border border-border-glass flex items-center justify-center text-gray-400 hover:text-brand-teal hover:bg-white/10 transition-all cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:block">
              <h2 className="text-sm font-black text-white flex items-center gap-1.5 uppercase tracking-wider">
                Welcome back, {profile.name ? profile.name.split(' ')[0].charAt(0).toUpperCase() + profile.name.split(' ')[0].slice(1).toLowerCase() : 'Student'} <span className="animate-bounce">👋</span>
              </h2>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mt-0.5">Explore your personalized academic portal</p>
            </div>
          </div>

          {/* Founder Tribute removed as requested */}

          {/* Right: Actions */}
          <div className="flex items-center gap-4">

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="w-10 h-10 rounded-xl bg-white/5 border border-border-glass flex items-center justify-center text-gray-400 hover:text-brand-teal hover:bg-white/10 transition-all cursor-pointer"
            >
              {theme === 'dark'
                ? <Sun className="w-4 h-4" />
                : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Center */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 rounded-xl bg-white/5 border border-border-glass flex items-center justify-center text-gray-400 hover:text-brand-teal hover:bg-white/10 transition-all cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-brand-pink shadow-[0_0_8px_rgba(247,37,133,0.5)]"></span>
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

            {/* Gamification stats hidden as requested */}

            {/* Quick Profile Overview (Clickable to edit profile) */}
            <div 
              onClick={openProfileModal}
              className="flex items-center gap-3 pl-3 lg:pl-4 border-l border-border-glass cursor-pointer group"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-gray-200 group-hover:text-brand-teal transition-colors">
                  {profile.name || 'Student'}
                </p>
                <span className="text-[9px] text-brand-teal font-semibold tracking-wider uppercase">
                  {user?.role === 'founder' ? 'Founder' : 'Student'}
                </span>
              </div>
              <div className={`w-9 h-9 lg:w-10 lg:h-10 rounded-xl relative ${frameConfig.id !== 'none' ? frameConfig.style : 'bg-gradient-to-tr from-brand-teal to-brand-purple p-[1px]'}`}>
                <div className="w-full h-full rounded-xl bg-primary-bg overflow-hidden flex items-center justify-center border border-white/5">
                  <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Body */}
        <main className="flex-1 p-3 sm:p-4 lg:p-8 overflow-y-auto overflow-x-hidden w-full">
          {children}
        </main>
      </div>

      {/* Profile Settings Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 border border-white/10 relative animate-scale-in max-h-[90vh] overflow-y-auto custom-scrollbar text-left">
            <button 
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-teal to-brand-purple flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Profile Settings</h3>
                <p className="text-[11px] text-gray-400">Update your academic profile and image.</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              
              {/* Profile Image Upload Box */}
              <div className="flex flex-col items-center justify-center gap-3 mb-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-brand-teal/40 group bg-white/5">
                  <img src={avatarSrc} alt="Avatar Preview" className="w-full h-full object-cover" />
                  <label htmlFor="profile-avatar-upload" className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity">
                    <Camera className="w-5 h-5" />
                  </label>
                  <input 
                    type="file" 
                    id="profile-avatar-upload" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="hidden" 
                  />
                </div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Click photo to update</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-400">Full Name</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  placeholder="Enter your name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-brand-teal outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-400">Qualification</label>
                <input 
                  type="text" 
                  value={editQualification}
                  onChange={(e) => setEditQualification(e.target.value)}
                  required
                  placeholder="e.g. B.Tech, Degree"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-brand-teal outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-400">College Name</label>
                <input 
                  type="text" 
                  value={editCollege}
                  onChange={(e) => setEditCollege(e.target.value)}
                  required
                  placeholder="e.g. GPREC"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-brand-teal outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-400">College Location (Place)</label>
                <input 
                  type="text" 
                  value={editPlace}
                  onChange={(e) => setEditPlace(e.target.value)}
                  required
                  placeholder="e.g. Kurnool"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-brand-teal outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-400">Year of Study</label>
                <select
                  value={editYear}
                  onChange={(e) => setEditYear(e.target.value)}
                  required
                  className="w-full bg-[#111118] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-brand-teal/50 transition-all appearance-none"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Completed">Completed</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-brand-teal to-brand-blue text-black hover:opacity-90 transition-all shadow-[0_0_15px_rgba(0,245,212,0.2)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
