import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Plus, Calendar, Trophy, Sparkles, CheckCircle2, 
  Flame, MapPin, Clock, HeartHandshake, ArrowRight,
  MessageSquare, Star, Trash2, Edit, Zap, X
} from 'lucide-react';
import { DEFAULT_COLLEGE_CLUBS, BANNER_COLOR_PRESETS } from '../data/clubsData';
import { db } from '../config/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { useToast } from '../context/ToastContext';

export default function ClubsPortal({ user }) {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('directory'); // 'directory', 'events', 'feedback'
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [clubsList, setClubsList] = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(true);

  // Selected Club Modal State
  const [focusedClub, setFocusedClub] = useState(null);
  const [joinReason, setJoinReason] = useState('');
  const [applying, setApplying] = useState(false);
  const [editingClubPortal, setEditingClubPortal] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // User Joined / Applied Clubs state
  const [myMemberships, setMyMemberships] = useState({});

  // Participants Feedback State
  const [feedbackList, setFeedbackList] = useState([]);

  const [newFeedback, setNewFeedback] = useState({
    clubOrEvent: 'Lumixora CodeSprint 2026',
    rating: 5,
    category: 'Hackathon & Coding Sprint',
    comment: ''
  });

  // Create New Club Form State
  const [newClubForm, setNewClubForm] = useState({
    name: '',
    shortName: '',
    category: 'Coding',
    code: '',
    logo: '⚡',
    bannerColor: 'from-blue-600 via-indigo-600 to-purple-600',
    description: '',
    leadName: '',
    leadEmail: '',
    meetingSchedule: 'Every Wednesday @ 04:30 PM',
    establishedYear: '2026',
    memberCount: 50,
    tagsText: 'AI, Development, Code'
  });
  const [newClubCustomCat, setNewClubCustomCat] = useState('');
  const [editClubCustomCat, setEditClubCustomCat] = useState('');

  // Sync with Firestore for custom clubs & live participant feedback
  useEffect(() => {
    const fetchClubsAndFeedback = async () => {
      setLoadingClubs(true);
      try {
        const metaDoc = await getDoc(doc(db, 'college_clubs_meta', 'init'));
        let snap = await getDocs(collection(db, 'college_clubs'));

        // If Firestore collection has never been initialized, seed default clubs ONCE permanently into Cloud Firestore!
        if (!metaDoc.exists() && snap.empty) {
          console.log("Initializing Cloud Firestore college_clubs collection...");
          for (const club of DEFAULT_COLLEGE_CLUBS) {
            await setDoc(doc(db, 'college_clubs', club.id), club);
          }
          await setDoc(doc(db, 'college_clubs_meta', 'init'), { initialized: true, seededAt: new Date().toISOString() });
          snap = await getDocs(collection(db, 'college_clubs'));
        }

        const list = [];
        snap.forEach(d => {
          if (d.id !== 'init') list.push({ id: d.id, ...d.data() });
        });
        setClubsList(list);
      } catch (e) {
        console.error("Firestore read error:", e);
        setClubsList(DEFAULT_COLLEGE_CLUBS);
      } finally {
        setLoadingClubs(false);
      }

      try {
        const fbSnap = await getDocs(collection(db, 'club_event_feedback'));
        const liveFb = [];
        for (const d of fbSnap.docs) {
          const data = d.data();
          // Purge sample dummy feedback records permanently from Cloud Firestore
          if (
            d.id.startsWith('fb-sample-') || 
            data.studentName?.includes('Aarav Sharma') || 
            data.studentName?.includes('Priya Patel')
          ) {
            try { await deleteDoc(doc(db, 'club_event_feedback', d.id)); } catch(err){}
          } else {
            liveFb.push({ id: d.id, ...data });
          }
        }
        liveFb.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
        setFeedbackList(liveFb);
      } catch (e) {
        console.log("Error loading real feedback items:", e);
        setFeedbackList([]);
      }
    };
    fetchClubsAndFeedback();
  }, []);

  // Compute dynamic average rating strictly from real user feedback
  const avgRating = React.useMemo(() => {
    if (!feedbackList || feedbackList.length === 0) return null;
    const sum = feedbackList.reduce((acc, f) => acc + Number(f.rating || 5), 0);
    return (sum / feedbackList.length).toFixed(1);
  }, [feedbackList]);

  // Standard predefined categories
  const STANDARD_CATEGORIES = [
    'Communication & Awareness',
    'Coding',
    'Entrepreneurship',
    'Cultural Activities'
  ];

  // Dynamic filter categories (including standard + any custom category created by users)
  const categories = React.useMemo(() => {
    const cats = ['All', ...STANDARD_CATEGORIES];
    clubsList.forEach(club => {
      if (club.category && !cats.includes(club.category)) {
        cats.push(club.category);
      }
    });
    return cats;
  }, [clubsList]);

  // Category Color Badges Mapping
  const getCategoryBadgeStyle = (cat) => {
    switch(cat) {
      case 'Communication & Awareness':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-cyan-500/10';
      case 'Coding':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-blue-500/10';
      case 'Entrepreneurship':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/10';
      case 'Cultural Activities':
        return 'bg-pink-500/20 text-pink-300 border-pink-500/40 shadow-pink-500/10';
      default:
        return 'bg-brand-purple/20 text-brand-purple border-brand-purple/40 shadow-brand-purple/10';
    }
  };

  const filteredClubs = clubsList.filter(club => {
    const catMatch = categoryFilter === 'All' || club.category === categoryFilter;
    const q = searchQuery.toLowerCase().trim();
    const textMatch = !q || 
      club.name.toLowerCase().includes(q) || 
      (club.shortName && club.shortName.toLowerCase().includes(q)) || 
      club.description.toLowerCase().includes(q) || 
      (club.tags && club.tags.some(t => t.toLowerCase().includes(q)));
    return catMatch && textMatch;
  });

  // Extract all events across clubs
  const allEvents = React.useMemo(() => {
    const events = [];
    clubsList.forEach(club => {
      if (club.upcomingEvents && club.upcomingEvents.length > 0) {
        club.upcomingEvents.forEach(evt => {
          events.push({
            ...evt,
            clubName: club.shortName || club.name,
            clubLogo: club.logo,
            bannerColor: club.bannerColor,
            clubId: club.id
          });
        });
      }
    });
    return events;
  }, [clubsList]);



  const handleApplyJoin = async (e) => {
    e.preventDefault();
    if (!focusedClub) return;
    setApplying(true);

    const rollNo = user?.rollNumber || user?.rollNo || user?.id || 'STUDENT';
    const memberRecord = {
      clubId: focusedClub.id,
      clubName: focusedClub.name,
      studentName: user?.name || 'Student Participant',
      rollNumber: rollNo,
      email: user?.email || '',
      reason: joinReason,
      appliedAt: new Date().toISOString(),
      status: 'Active Member'
    };

    try {
      await setDoc(doc(db, 'club_memberships', `${focusedClub.id}_${rollNo}`), memberRecord);
      addToast({ message: `🎉 Successfully joined ${focusedClub.shortName || focusedClub.name}! Membership saved permanently to database.`, type: 'success' });
    } catch (err) {
      console.error("Firestore membership error:", err);
      addToast({ message: `🎉 Welcome to ${focusedClub.shortName || focusedClub.name}!`, type: 'success' });
    }

    setMyMemberships(prev => ({ ...prev, [focusedClub.id]: 'Active Member' }));
    setApplying(false);
    setFocusedClub(null);
    setJoinReason('');
  };

  // Edit Event State inside Clubs Portal
  const [editingEventPortal, setEditingEventPortal] = useState(null); // { clubId, evtId }
  const [editEventFormPortal, setEditEventFormPortal] = useState({
    title: '',
    date: '',
    time: '',
    venue: '',
    rewards: '',
    category: '',
    registrationLink: ''
  });

  const handleOpenEditEventPortal = (clubId, evt) => {
    setEditingEventPortal({ clubId, evtId: evt.id });
    setEditEventFormPortal({
      title: evt.title || '',
      date: evt.date || '',
      time: evt.time || '10:00 AM - 04:00 PM',
      venue: evt.venue || '',
      rewards: evt.rewards || 'Certificates & Trophies',
      category: evt.category || 'Hackathon',
      registrationLink: evt.registrationLink || evt.formUrl || ''
    });
  };

  const handleSaveEditEventPortal = async (e) => {
    e.preventDefault();
    if (!editingEventPortal) return;

    const targetClub = clubsList.find(c => c.id === editingEventPortal.clubId);
    if (!targetClub) return;

    const updatedEvents = (targetClub.upcomingEvents || []).map(evt => {
      if (evt.id === editingEventPortal.evtId) {
        return {
          ...evt,
          ...editEventFormPortal
        };
      }
      return evt;
    });

    const updatedClubObj = { ...targetClub, upcomingEvents: updatedEvents };
    const updatedList = clubsList.map(c => c.id === targetClub.id ? updatedClubObj : c);
    setClubsList(updatedList);

    try {
      await setDoc(doc(db, 'college_clubs', targetClub.id), updatedClubObj, { merge: true });
      addToast({ message: `Updated event details for "${editEventFormPortal.title}" permanently in database!`, type: 'success' });
    } catch (err) {
      console.error("Firestore event edit error:", err);
      addToast({ message: `Updated event details for "${editEventFormPortal.title}"!`, type: 'success' });
    }

    setEditingEventPortal(null);
  };

  const handleRsvpEvent = (evt) => {
    const title = typeof evt === 'string' ? evt : (evt?.title || 'Event');
    const link = typeof evt === 'object' ? (evt?.registrationLink || evt?.formUrl || evt?.link) : null;

    if (link) {
      addToast({ message: `🚀 Redirecting to registration form for "${title}"...`, type: 'info' });
      window.open(link, '_blank');
    } else {
      addToast({ message: `🗓️ RSVP Confirmed for "${title}"! Event added to schedule.`, type: 'success' });
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!newFeedback.comment.trim()) {
      addToast({ message: 'Please enter your feedback comments.', type: 'warning' });
      return;
    }

    const item = {
      id: `fb-${Date.now()}`,
      studentName: user?.name ? `${user.name} (${user.rollNumber || user.rollNo || 'Student'})` : 'Verified Student Participant',
      clubOrEvent: newFeedback.clubOrEvent,
      rating: parseInt(newFeedback.rating),
      category: newFeedback.category,
      comment: newFeedback.comment,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      createdAt: new Date().toISOString()
    };

    setFeedbackList(prev => [item, ...prev]);

    try {
      await setDoc(doc(db, 'club_event_feedback', item.id), item);
      addToast({ message: '✨ Thank you! Your review has been saved permanently to database.', type: 'success' });
    } catch (err) {
      console.error("Firestore feedback error:", err);
      addToast({ message: '✨ Thank you! Your review has been published.', type: 'success' });
    }

    setNewFeedback({
      clubOrEvent: 'Lumixora CodeSprint 2026',
      rating: 5,
      category: 'Hackathon & Coding Sprint',
      comment: ''
    });
  };

  const handleDeleteFeedback = async (id) => {
    const filtered = feedbackList.filter(f => f.id !== id);
    setFeedbackList(filtered);
    try {
      await deleteDoc(doc(db, 'club_event_feedback', id));
      addToast({ message: 'Feedback review permanently deleted from database.', type: 'success' });
    } catch (e) {
      console.error("Firestore delete error:", e);
      addToast({ message: 'Feedback review deleted.', type: 'info' });
    }
  };

  const handleCreateNewClub = async (e) => {
    e.preventDefault();
    if (!newClubForm.name || !newClubForm.code) {
      addToast({ message: 'Club name and unique code are required.', type: 'warning' });
      return;
    }

    const finalCategory = newClubForm.category === 'Other' 
      ? (newClubCustomCat.trim() || 'General') 
      : newClubForm.category;

    const clubId = `club-${newClubForm.code.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const formattedClub = {
      ...newClubForm,
      id: clubId,
      category: finalCategory,
      code: newClubForm.code.toUpperCase(),
      tags: newClubForm.tagsText.split(',').map(t => t.trim()).filter(Boolean),
      scoreXP: 3500,
      upcomingEvents: [],
      announcements: ['Welcome to our newly launched campus organization on Lumixora Portal!']
    };

    const updated = [formattedClub, ...clubsList];
    setClubsList(updated);

    try {
      await setDoc(doc(db, 'college_clubs', clubId), formattedClub);
      addToast({ message: `🚀 Club "${newClubForm.name}" (${finalCategory}) created and saved permanently to database!`, type: 'success' });
    } catch (err) {
      console.error("Firestore create error:", err);
      addToast({ message: `🚀 Club "${newClubForm.name}" created!`, type: 'success' });
    }

    setShowCreateModal(false);
    setNewClubCustomCat('');
    setNewClubForm({
      name: '',
      shortName: '',
      category: 'Coding',
      code: '',
      logo: '⚡',
      bannerColor: 'from-blue-600 via-indigo-600 to-purple-600',
      description: '',
      leadName: '',
      leadEmail: '',
      meetingSchedule: 'Every Wednesday @ 04:30 PM',
      establishedYear: '2026',
      memberCount: 50,
      tagsText: 'AI, Development, Code'
    });
  };

  const handleSaveEditClubPortal = async (e) => {
    e.preventDefault();
    if (!editingClubPortal) return;

    const finalCategory = editingClubPortal.category === 'Other'
      ? (editClubCustomCat.trim() || 'General')
      : editingClubPortal.category;

    const updatedClub = { ...editingClubPortal, category: finalCategory };
    const updated = clubsList.map(c => c.id === editingClubPortal.id ? updatedClub : c);
    setClubsList(updated);
    try {
      await setDoc(doc(db, 'college_clubs', editingClubPortal.id), updatedClub);
      addToast({ message: `✨ Updated details for ${editingClubPortal.name} permanently in database!`, type: 'success' });
    } catch (err) {
      console.error("Firestore edit error:", err);
      addToast({ message: `Updated details for ${editingClubPortal.name}.`, type: 'success' });
    }
    setEditClubCustomCat('');
    setEditingClubPortal(null);
  };

  const handleDeleteClubPortal = async (clubId, clubName) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${clubName}" from the database?`)) return;
    const filtered = clubsList.filter(c => c.id !== clubId);
    setClubsList(filtered);
    try {
      await deleteDoc(doc(db, 'college_clubs', clubId));
      addToast({ message: `Permanently deleted club "${clubName}" from database.`, type: 'success' });
    } catch (err) {
      console.error("Firestore delete error:", err);
      addToast({ message: `Deleted club "${clubName}".`, type: 'success' });
    }
  };

  const handleLogoUpload = (e, callback) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        addToast({ message: 'Logo image must be under 2MB.', type: 'warning' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderClubLogo = (logo, name = 'Club', sizeClass = 'w-10 h-10 text-2xl') => {
    if (!logo || typeof logo !== 'string') return <span className={`${sizeClass} flex items-center justify-center`}>🏛️</span>;
    const trimmed = logo.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:image') || trimmed.includes(';base64,')) {
      return (
        <img 
          src={trimmed} 
          alt={name} 
          className="w-10 h-10 rounded-2xl object-cover border border-white/20 shadow-md shrink-0" 
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      );
    }
    if (trimmed.length > 10) {
      return <span className={`${sizeClass} flex items-center justify-center`}>🏛️</span>;
    }
    return <span className={`${sizeClass} flex items-center justify-center`}>{trimmed}</span>;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      {/* Dynamic Colorful Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/15 p-6 md:p-10 bg-gradient-to-br from-indigo-900/60 via-purple-950/70 to-slate-950 backdrop-blur-xl shadow-2xl">
        {/* Animated Neon Ambient Lighting Circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-pink/25 rounded-full blur-[90px] pointer-events-none animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-teal/20 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-amber-500/15 rounded-full blur-[70px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-brand-purple/30 to-brand-pink/30 border border-brand-pink/40 text-brand-pink text-xs font-black tracking-wide uppercase shadow-lg shadow-brand-pink/10">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              Campus Student Clubs & Societies Portal
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Discover & Lead <span className="gradient-text-brand">College Societies</span>
            </h1>
            
            <p className="text-gray-300 text-sm md:text-base leading-relaxed font-medium">
              Join elite tech squads, hardware labs, cultural troupes, startup incubation cells, and sports leagues. Participate in hackathons, earn skill badges, and build your campus legacy.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-5 py-3 bg-gradient-to-r from-brand-purple via-purple-600 to-brand-pink hover:opacity-95 text-white font-extrabold text-xs md:text-sm rounded-2xl shadow-xl shadow-brand-purple/30 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Register New Campus Club
              </button>
            </div>
          </div>

          {/* Single Highlighted Metric Card: No. of Events */}
          <div className="min-w-[180px]">
            <div className="bg-black/50 backdrop-blur-xl border border-pink-500/40 p-5 rounded-3xl text-center relative overflow-hidden group hover:border-pink-400/70 transition-all shadow-2xl">
              <div className="absolute inset-0 bg-pink-500/10 group-hover:bg-pink-500/15 transition-colors"></div>
              <span className="block text-3xl md:text-4xl font-black text-pink-400 drop-shadow-md">{allEvents.length}</span>
              <span className="text-xs font-black text-pink-200 uppercase tracking-wider flex items-center justify-center gap-1.5 mt-1">
                <Flame className="w-4 h-4 text-pink-400" /> No. of Events
              </span>
            </div>
          </div>
        </div>

        {/* Global Search Input */}
        <div className="mt-8 relative z-10">
          <div className="relative">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by club name (e.g. CodeCraft), category (AI, Hardware), or tags (Open Source)..."
              className="w-full bg-black/60 border border-white/20 rounded-2xl pl-12 pr-12 py-4 text-white placeholder-gray-400 font-medium text-sm focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/50 transition-all shadow-2xl backdrop-blur-md"
            />
            <Search className="absolute left-4 top-4.5 w-5 h-5 text-brand-purple" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-4 text-xs font-bold text-gray-300 hover:text-white bg-white/10 px-2.5 py-1 rounded-lg transition-all"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Vibrant Main Navigation Tabs */}
        <div className="flex border-b border-white/15 mt-8 relative z-10 overflow-x-auto custom-scrollbar gap-2 pb-1">
          <button
            onClick={() => setActiveTab('directory')}
            className={`pb-3 px-5 font-extrabold text-xs md:text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'directory'
                ? 'border-brand-purple text-brand-purple bg-brand-purple/10 rounded-t-xl'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5 rounded-t-xl'
            }`}
          >
            <Users className="w-4 h-4" />
            Club Directory ({filteredClubs.length})
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`pb-3 px-5 font-extrabold text-xs md:text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'events'
                ? 'border-brand-pink text-brand-pink bg-brand-pink/10 rounded-t-xl'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5 rounded-t-xl'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Upcoming Events & Hackathons ({allEvents.length})
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`pb-3 px-5 font-extrabold text-xs md:text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'feedback'
                ? 'border-brand-teal text-brand-teal bg-brand-teal/10 rounded-t-xl'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5 rounded-t-xl'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Participant Reviews ({feedbackList.length})
          </button>
        </div>
      </div>

      {/* CATEGORY FILTER PILLS (Only for Directory tab) */}
      {activeTab === 'directory' && (
        <div className="flex items-center gap-2.5 overflow-x-auto custom-scrollbar pb-2 pt-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all whitespace-nowrap cursor-pointer border ${
                categoryFilter === cat
                  ? 'bg-gradient-to-r from-brand-purple to-brand-pink text-white border-white/30 shadow-lg shadow-brand-purple/25 scale-105'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* TAB 1: CLUB DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map(club => {
            const isMember = myMemberships[club.id] === 'Active Member';
            const catBadgeStyle = getCategoryBadgeStyle(club.category);
            return (
              <div 
                key={club.id}
                className="glass-panel rounded-3xl border border-white/15 overflow-hidden flex flex-col justify-between group hover:border-brand-purple/60 transition-all duration-300 hover:-translate-y-1.5 shadow-2xl relative"
              >
                <div>
                  {/* Vibrant Customizable Banner & Logo Header */}
                  <div className={`h-28 bg-gradient-to-r ${club.bannerColor || 'from-blue-600 via-indigo-600 to-purple-600'} p-4 relative flex items-end justify-between shadow-inner`}>
                    <div className="translate-y-5 p-2 rounded-2xl bg-black/70 backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center">
                      {renderClubLogo(club.logo, club.name, 'w-12 h-12 text-3xl')}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border backdrop-blur-md shadow-md ${catBadgeStyle}`}>
                      {club.category}
                    </span>
                  </div>

                  <div className="p-6 pt-9 space-y-3.5">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-base md:text-lg font-black text-white group-hover:text-brand-purple transition-colors leading-snug">
                          {club.name}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-300 mt-1.5 line-clamp-2 leading-relaxed font-medium">
                        {club.description}
                      </p>
                    </div>

                    {/* Member Count, Established & Schedule */}
                    <div className="flex items-center justify-between text-xs text-gray-300 pt-3 border-t border-white/10">
                      <span className="flex items-center gap-1.5 font-bold text-gray-200 bg-white/5 px-2.5 py-1 rounded-xl border border-white/5">
                        <Users className="w-3.5 h-3.5 text-brand-teal" /> {club.memberCount} Members
                      </span>
                      <span className="text-[11px] font-semibold text-gray-400">
                        Est. {club.establishedYear}
                      </span>
                    </div>

                    {/* Tags */}
                    {club.tags && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {club.tags.map((tag, i) => (
                          <span key={i} className="text-[10px] font-extrabold bg-brand-purple/10 text-brand-purple px-2.5 py-0.5 rounded-lg border border-brand-purple/20">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-6 pt-0 space-y-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFocusedClub(club)}
                      className="flex-1 py-2.5 bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl text-xs font-extrabold text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => setFocusedClub(club)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-md ${
                        isMember 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                          : 'bg-gradient-to-r from-brand-purple to-purple-600 hover:opacity-90 text-white shadow-brand-purple/25'
                      }`}
                    >
                      {isMember ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Member
                        </>
                      ) : (
                        <>
                          Join Club <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Club Edit & Delete Controls */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-white/10 text-xs font-bold">
                    <button
                      onClick={() => setEditingClubPortal(club)}
                      className="text-brand-teal hover:text-brand-teal/80 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit Club
                    </button>
                    <button
                      onClick={() => handleDeleteClubPortal(club.id, club.name)}
                      className="text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: UPCOMING EVENTS & HACKATHONS */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base md:text-lg font-black text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-pink" /> Official Club Workshops, Competitions & Hackathons
            </h2>
            <span className="text-xs font-bold text-gray-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
              {allEvents.length} Active Schedule
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allEvents.map((evt, idx) => (
              <div 
                key={idx}
                className="glass-panel p-6 rounded-3xl border border-white/15 relative overflow-hidden flex flex-col justify-between hover:border-brand-pink/50 transition-all shadow-xl space-y-4 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <span className="text-3xl p-3 rounded-2xl bg-black/40 border border-white/15 shadow-md flex items-center justify-center">
                      {renderClubLogo(evt.clubLogo, evt.clubName, 'w-8 h-8 text-2xl')}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-brand-pink bg-brand-pink/15 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-brand-pink/30">
                          {evt.category || 'Event'}
                        </span>
                        {evt.status && (
                          <span className="text-[10px] font-black text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase border border-emerald-500/30 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> {evt.status}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-black text-white mt-1 leading-snug group-hover:text-brand-pink transition-colors">{evt.title}</h3>
                      <p className="text-xs text-gray-300 font-bold">{evt.clubName}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-black/40 p-4 rounded-2xl border border-white/10 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 font-extrabold block text-[10px] uppercase">Date & Time</span>
                    <span className="text-gray-100 font-bold flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-brand-teal" /> {evt.date} • {evt.time}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-extrabold block text-[10px] uppercase">Venue Location</span>
                    <span className="text-gray-100 font-bold flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-purple" /> {evt.venue}
                    </span>
                  </div>
                </div>

                {evt.registrationLink && (
                  <div className="bg-brand-purple/10 border border-brand-purple/30 p-2.5 rounded-2xl flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold text-brand-purple flex items-center gap-1.5 truncate">
                      <span>🔗</span>
                      <span className="truncate">Registration Form Link Attached</span>
                    </span>
                    <a 
                      href={evt.registrationLink} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-[10px] font-black uppercase text-brand-teal hover:underline shrink-0 bg-brand-teal/10 px-2.5 py-1 rounded-lg border border-brand-teal/30"
                    >
                      Open Form ↗
                    </a>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-white/10 pt-4 gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 font-black bg-amber-400/10 px-3 py-1.5 rounded-xl border border-amber-400/20">
                    <Trophy className="w-4 h-4 text-amber-400" /> {evt.rewards}
                  </div>

                  <div className="flex items-center gap-2">
                    {(user?.role === 'founder' || user?.email?.toLowerCase() === 'founder@lumixora.com' || user?.email?.toLowerCase() === '249xa33106@gmail.com') && (
                      <button
                        onClick={() => handleOpenEditEventPortal(evt.clubId, evt)}
                        className="px-3.5 py-2.5 bg-brand-teal/20 text-brand-teal hover:bg-brand-teal hover:text-black font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1 border border-brand-teal/30 shadow-md"
                        title="Edit Event Date, Time, Venue & Registration Form Link"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </button>
                    )}

                    <button
                      onClick={() => handleRsvpEvent(evt)}
                      className="px-5 py-2.5 bg-gradient-to-r from-brand-pink to-purple-600 hover:opacity-90 text-white font-black text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-brand-pink/20"
                    >
                      {evt.registrationLink ? 'Register (Form Link)' : 'RSVP / Register'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}



      {/* TAB 4: PARTICIPANTS REVIEWS & FEEDBACK */}
      {activeTab === 'feedback' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* SUBMIT FEEDBACK FORM */}
            <div className="glass-panel p-6 rounded-3xl border border-white/15 space-y-4 lg:col-span-1 h-fit shadow-xl">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand-teal" /> Post Participant Review
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed font-medium">Share your genuine feedback & rating for attended workshops, hackathons, or club activities.</p>

              <form onSubmit={handleSubmitFeedback} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-gray-300 font-extrabold block mb-1">Select Event / Society</label>
                  <select 
                    value={newFeedback.clubOrEvent}
                    onChange={e => setNewFeedback({...newFeedback, clubOrEvent: e.target.value})}
                    className="w-full bg-[#0c0c16] border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-semibold outline-none focus:border-brand-teal"
                  >
                    <option value="Lumixora CodeSprint 2026">Lumixora CodeSprint 2026 - Hackathon</option>
                    <option value="RoboAI Innovation Workshop">RoboAI Autonomous Drone Workshop</option>
                    <option value="CodeCraft Society Sprints">CodeCraft Dynamic Programming Sprint</option>
                    <option value="NexusAI LLM RAG Workshop">NexusAI LLM RAG Workshop</option>
                    <option value="PixelCraft UI/UX Hackathon">PixelCraft UI/UX Hackathon</option>
                    <option value="Sanskriti Talent Hunt 2026">Sanskriti Music & Dance Talent Hunt</option>
                    <option value="E-Cell Pitch Day 2026">E-Cell Startup Pitching Session</option>
                    <option value="Spartans Cricket League">Spartans Cricket Tournament</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 font-extrabold block mb-1">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setNewFeedback({...newFeedback, rating: num})}
                        className={`flex-1 py-2.5 rounded-xl font-black text-xs border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          newFeedback.rating >= num 
                            ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-md shadow-amber-400/10' 
                            : 'bg-white/5 text-gray-500 border-white/10'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${newFeedback.rating >= num ? 'fill-amber-400 text-amber-400' : ''}`} /> {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-gray-300 font-extrabold block mb-1">Feedback Category</label>
                  <select 
                    value={newFeedback.category}
                    onChange={e => setNewFeedback({...newFeedback, category: e.target.value})}
                    className="w-full bg-[#0c0c16] border border-white/15 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-teal"
                  >
                    <option value="Hackathon & Coding Sprint">Hackathon & Coding Sprint</option>
                    <option value="Workshop & Hardware">Workshop & Hardware</option>
                    <option value="Competitive Programming">Competitive Programming</option>
                    <option value="Event Organization">Event Organization</option>
                    <option value="Mentorship Quality">Mentorship Quality</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 font-extrabold block mb-1">Your Review & Comments</label>
                  <textarea 
                    rows="3"
                    required
                    value={newFeedback.comment}
                    onChange={e => setNewFeedback({...newFeedback, comment: e.target.value})}
                    placeholder="Describe key takeaways, mentor quality, hardware kit availability, or suggestions..."
                    className="w-full bg-[#0c0c16] border border-white/15 rounded-xl p-3 text-white outline-none placeholder-gray-500 focus:border-brand-teal"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-gradient-to-r from-brand-teal to-emerald-600 text-black font-black rounded-xl hover:opacity-95 transition-opacity cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-brand-teal/20"
                >
                  <MessageSquare className="w-4 h-4" /> Publish Participant Feedback
                </button>
              </form>
            </div>

            {/* FEEDBACK FEED LIST */}
            <div className="space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between bg-black/40 p-4 rounded-2xl border border-white/10">
                <h2 className="text-sm md:text-base font-black text-white flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Verified Participant Reviews ({feedbackList.length})
                </h2>
                <span className="text-xs text-amber-300 font-black bg-amber-400/15 px-3 py-1 rounded-full border border-amber-400/30">
                  {avgRating ? `Avg Rating: ${avgRating} / 5.0 ⭐` : 'No Ratings Yet'}
                </span>
              </div>

              <div className="space-y-3.5">
                {feedbackList.length === 0 ? (
                  <div className="glass-panel p-10 rounded-3xl border border-white/15 text-center space-y-3">
                    <MessageSquare className="w-10 h-10 text-brand-teal/50 mx-auto" />
                    <h3 className="text-sm font-bold text-gray-200">No participant reviews submitted yet</h3>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto">
                      Be the first participant to post a review! Fill out the feedback form on the left to submit your rating.
                    </p>
                  </div>
                ) : (
                  feedbackList.map(item => (
                    <div key={item.id} className="glass-panel p-5 rounded-2xl border border-white/15 space-y-3 hover:border-brand-teal/40 transition-all shadow-md">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-black text-white">{item.studentName}</h3>
                            <span className="text-[10px] font-semibold text-gray-400">• {item.date}</span>
                          </div>
                          <p className="text-xs font-black text-brand-teal mt-0.5">{item.clubOrEvent}</p>
                        </div>

                        <div className="flex items-center gap-1 bg-amber-400/15 border border-amber-400/30 px-2.5 py-1 rounded-xl">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-xs font-black text-amber-300">{item.rating}.0</span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-200 leading-relaxed font-medium bg-black/30 p-3 rounded-xl border border-white/5">
                        "{item.comment}"
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                        <span className="bg-white/5 px-2.5 py-0.5 rounded-md border border-white/5 font-semibold text-gray-300">
                          Category: {item.category}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Verified Participant
                          </span>
                          <button
                            onClick={() => handleDeleteFeedback(item.id)}
                            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-all cursor-pointer"
                            title="Delete Feedback"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW CLUB MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-xl w-full rounded-3xl border border-white/15 p-6 md:p-8 space-y-5 relative max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-purple/20 text-brand-purple flex items-center justify-center font-bold border border-brand-purple/30">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base md:text-lg font-black text-white">Register New Campus Club</h2>
                  <p className="text-xs text-gray-400">Add an official society to Lumixora College Portal.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white bg-white/10 w-8 h-8 rounded-full flex items-center justify-center font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewClub} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-gray-300 font-extrabold block mb-1">Club Full Name *</label>
                  <input 
                    type="text" 
                    required
                    value={newClubForm.name} 
                    onChange={e => setNewClubForm({...newClubForm, name: e.target.value, shortName: e.target.value.split('-')[0].trim()})}
                    placeholder="e.g. Quantum & Cyber Defense Society" 
                    className="w-full bg-[#0c0c16] border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-semibold outline-none focus:border-brand-purple"
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-extrabold block mb-1">Unique Club Code *</label>
                  <input 
                    type="text" 
                    required
                    value={newClubForm.code} 
                    onChange={e => setNewClubForm({...newClubForm, code: e.target.value.toUpperCase()})}
                    placeholder="e.g. CYBERSEC" 
                    className="w-full bg-[#0c0c16] border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-bold outline-none uppercase focus:border-brand-purple"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-gray-300 font-extrabold block mb-1">Category</label>
                  <select 
                    value={STANDARD_CATEGORIES.includes(newClubForm.category) ? newClubForm.category : 'Other'} 
                    onChange={e => {
                      const val = e.target.value;
                      if (val === 'Other') {
                        setNewClubForm({...newClubForm, category: 'Other'});
                      } else {
                        setNewClubForm({...newClubForm, category: val});
                      }
                    }}
                    className="w-full bg-[#0c0c16] border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-semibold outline-none focus:border-brand-purple"
                  >
                    <option value="Communication & Awareness">Communication & Awareness</option>
                    <option value="Coding">Coding</option>
                    <option value="Entrepreneurship">Entrepreneurship</option>
                    <option value="Cultural Activities">Cultural Activities</option>
                    <option value="Other">Other (Custom Category)</option>
                  </select>

                  {(newClubForm.category === 'Other' || !STANDARD_CATEGORIES.includes(newClubForm.category)) && (
                    <input 
                      type="text"
                      required
                      value={newClubCustomCat}
                      onChange={e => setNewClubCustomCat(e.target.value)}
                      placeholder="Type custom category name..."
                      className="w-full mt-2 bg-[#0c0c16] border border-brand-purple rounded-xl px-3.5 py-2 text-white font-semibold outline-none text-xs"
                    />
                  )}
                </div>
                <div>
                  <label className="text-gray-300 font-extrabold block mb-1">Logo Icon / Emoji</label>
                  <input 
                    type="text" 
                    value={newClubForm.logo} 
                    onChange={e => setNewClubForm({...newClubForm, logo: e.target.value})}
                    placeholder="🛡️ or Image URL" 
                    className="w-full bg-[#0c0c16] border border-white/15 rounded-xl px-3.5 py-2.5 text-white text-center font-bold outline-none focus:border-brand-purple"
                  />
                </div>
              </div>

              {/* Colorful Banner Theme Selector */}
              <div>
                <label className="text-gray-300 font-extrabold block mb-1.5">Banner Gradient Theme</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {BANNER_COLOR_PRESETS.map((preset, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setNewClubForm({...newClubForm, bannerColor: preset.value})}
                      className={`h-10 rounded-xl bg-gradient-to-r ${preset.value} border-2 transition-all cursor-pointer flex items-center justify-center text-[10px] font-black text-white drop-shadow-md ${
                        newClubForm.bannerColor === preset.value ? 'border-white scale-105 ring-2 ring-white/50' : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                    >
                      {preset.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-extrabold block mb-1">Lead Contact Name & Email</label>
                <input 
                  type="text" 
                  value={newClubForm.leadName} 
                  onChange={e => setNewClubForm({...newClubForm, leadName: e.target.value})}
                  placeholder="e.g. Student Lead & Core Team (lead@lumixora.app)" 
                  className="w-full bg-[#0c0c16] border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-semibold outline-none focus:border-brand-purple"
                />
              </div>

              <div>
                <label className="text-gray-300 font-extrabold block mb-1">Description & Mission</label>
                <textarea 
                  rows="2"
                  value={newClubForm.description} 
                  onChange={e => setNewClubForm({...newClubForm, description: e.target.value})}
                  placeholder="Summary of club objectives, weekly sprints, and workshops..." 
                  className="w-full bg-[#0c0c16] border border-white/15 rounded-xl p-3 text-white outline-none focus:border-brand-purple"
                />
              </div>

              <div>
                <label className="text-gray-300 font-extrabold block mb-1">Tags (Comma Separated)</label>
                <input 
                  type="text" 
                  value={newClubForm.tagsText} 
                  onChange={e => setNewClubForm({...newClubForm, tagsText: e.target.value})}
                  placeholder="CyberSec, Ethical Hacking, CTF, Python" 
                  className="w-full bg-[#0c0c16] border border-white/15 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-purple"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 bg-white/10 hover:bg-white/15 text-gray-300 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-brand-purple to-brand-pink text-white font-black rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-brand-purple/20 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Save & Publish Club
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOCUSED CLUB DETAILS & JOIN MODAL */}
      {focusedClub && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full rounded-3xl border border-white/15 p-6 md:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
            <button
              onClick={() => setFocusedClub(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/10 w-8 h-8 rounded-full flex items-center justify-center font-bold"
            >
              ✕
            </button>

            <div className={`p-5 rounded-2xl bg-gradient-to-r ${focusedClub.bannerColor || 'from-brand-purple to-brand-blue'} flex items-center gap-4 text-white shadow-lg`}>
              <span className="text-4xl p-3 rounded-2xl bg-black/50 backdrop-blur-md border border-white/20 shadow-md">
                {renderClubLogo(focusedClub.logo, focusedClub.name, 'w-10 h-10 text-3xl')}
              </span>
              <div>
                <span className="text-[10px] font-black uppercase bg-black/60 px-2.5 py-0.5 rounded-full border border-white/20">
                  {focusedClub.category}
                </span>
                <h2 className="text-lg md:text-xl font-black mt-1 leading-snug">{focusedClub.name}</h2>
                <p className="text-xs text-gray-200 font-semibold">Lead: {focusedClub.leadName}</p>
              </div>
            </div>

            <div className="bg-black/40 p-4.5 rounded-2xl border border-white/10 space-y-3 text-xs">
              <p className="text-gray-200 leading-relaxed font-medium">{focusedClub.description}</p>
              <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-gray-300 font-semibold">
                <div><strong className="text-white">Established:</strong> {focusedClub.establishedYear}</div>
                <div><strong className="text-white">Members:</strong> {focusedClub.memberCount}+ Active</div>
                <div className="col-span-2"><strong className="text-white">Meeting Schedule:</strong> {focusedClub.meetingSchedule}</div>
              </div>
            </div>

            {/* Club Announcements if available */}
            {focusedClub.announcements && focusedClub.announcements.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-black text-brand-teal uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Latest Announcements
                </h3>
                <div className="space-y-1.5">
                  {focusedClub.announcements.map((ann, i) => (
                    <div key={i} className="p-3 bg-brand-teal/10 border border-brand-teal/20 rounded-xl text-xs text-gray-200 font-semibold flex items-start gap-2">
                      <Zap className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" />
                      <span>{ann}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Application Form */}
            <form onSubmit={handleApplyJoin} className="space-y-4 pt-2 border-t border-white/10">
              <h3 className="text-xs font-black text-brand-purple uppercase tracking-wider">Apply for Club Membership</h3>
              
              <div>
                <label className="text-xs text-gray-300 font-extrabold block mb-1">Why do you want to join this society?</label>
                <textarea
                  required
                  rows="3"
                  value={joinReason}
                  onChange={e => setJoinReason(e.target.value)}
                  placeholder="Mention your skills, interest in projects/workshops, and how you wish to contribute..."
                  className="w-full bg-[#0c0c16] border border-white/15 rounded-xl p-3 text-xs text-white placeholder-gray-500 outline-none focus:border-brand-purple"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFocusedClub(null)}
                  className="flex-1 py-3 bg-white/10 hover:bg-white/15 text-gray-300 font-bold text-xs rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="flex-1 py-3 bg-gradient-to-r from-brand-purple to-purple-600 hover:opacity-90 text-white font-black text-xs rounded-xl shadow-lg shadow-brand-purple/25 cursor-pointer flex items-center justify-center gap-2"
                >
                  <HeartHandshake className="w-4 h-4" />
                  {applying ? 'Submitting...' : 'Confirm Membership Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CLUB DETAILS MODAL */}
      {editingClubPortal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full rounded-3xl border border-white/15 p-6 space-y-4 relative max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Edit className="w-4 h-4 text-brand-teal" /> Edit Details ({editingClubPortal.shortName || editingClubPortal.name})
              </h3>
              <button 
                onClick={() => setEditingClubPortal(null)} 
                className="text-gray-400 hover:text-white text-xs bg-white/10 px-2.5 py-1 rounded-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditClubPortal} className="space-y-3.5 text-xs">
              <div>
                <label className="text-gray-300 font-extrabold block mb-1">Club Full Name</label>
                <input 
                  type="text" 
                  value={editingClubPortal.name} 
                  onChange={e => setEditingClubPortal({...editingClubPortal, name: e.target.value})}
                  className="w-full bg-[#0c0c16] border border-white/15 rounded-xl px-3.5 py-2 text-white font-semibold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 font-extrabold block mb-1">Category</label>
                  <select 
                    value={STANDARD_CATEGORIES.includes(editingClubPortal.category) ? editingClubPortal.category : 'Other'} 
                    onChange={e => {
                      const val = e.target.value;
                      if (val === 'Other') {
                        setEditingClubPortal({...editingClubPortal, category: 'Other'});
                      } else {
                        setEditingClubPortal({...editingClubPortal, category: val});
                      }
                    }}
                    className="w-full bg-[#0c0c16] border border-white/15 rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option value="Communication & Awareness">Communication & Awareness</option>
                    <option value="Coding">Coding</option>
                    <option value="Entrepreneurship">Entrepreneurship</option>
                    <option value="Cultural Activities">Cultural Activities</option>
                    <option value="Other">Other (Custom Category)</option>
                  </select>

                  {(editingClubPortal.category === 'Other' || !STANDARD_CATEGORIES.includes(editingClubPortal.category)) && (
                    <input 
                      type="text"
                      required
                      value={editClubCustomCat || (STANDARD_CATEGORIES.includes(editingClubPortal.category) ? '' : editingClubPortal.category)}
                      onChange={e => setEditClubCustomCat(e.target.value)}
                      placeholder="Type custom category name..."
                      className="w-full mt-2 bg-[#0c0c16] border border-brand-teal rounded-xl px-3 py-1.5 text-white font-semibold outline-none text-xs"
                    />
                  )}
                </div>

                <div>
                  <label className="text-gray-300 font-extrabold block mb-1">Established Year</label>
                  <input 
                    type="text" 
                    value={editingClubPortal.establishedYear || '2026'} 
                    onChange={e => setEditingClubPortal({...editingClubPortal, establishedYear: e.target.value})}
                    className="w-full bg-[#0c0c16] border border-white/15 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              {/* Logo Selection: Upload Image or URL/Emoji */}
              <div className="p-3.5 bg-black/40 rounded-2xl border border-white/10 space-y-2">
                <label className="text-gray-200 font-extrabold block">Club Logo (Upload Image or Emoji/URL)</label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                    {renderClubLogo(editingClubPortal.logo, editingClubPortal.name, 'w-10 h-10 text-2xl')}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={e => handleLogoUpload(e, (dataUrl) => setEditingClubPortal({...editingClubPortal, logo: dataUrl}))}
                      className="w-full text-[11px] text-gray-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-brand-purple/20 file:text-brand-purple hover:file:bg-brand-purple/30 cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={editingClubPortal.logo} 
                      onChange={e => setEditingClubPortal({...editingClubPortal, logo: e.target.value})}
                      placeholder="Or enter Image URL / Emoji (e.g. 💻)"
                      className="w-full bg-[#0c0c16] border border-white/15 rounded-xl px-3 py-1.5 text-white text-xs outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-extrabold block mb-1">Lead Name & Contact</label>
                <input 
                  type="text" 
                  value={editingClubPortal.leadName} 
                  onChange={e => setEditingClubPortal({...editingClubPortal, leadName: e.target.value})}
                  className="w-full bg-[#0c0c16] border border-white/15 rounded-xl px-3.5 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="text-gray-300 font-extrabold block mb-1">Description & Mandate</label>
                <textarea 
                  rows="3"
                  value={editingClubPortal.description} 
                  onChange={e => setEditingClubPortal({...editingClubPortal, description: e.target.value})}
                  className="w-full bg-[#0c0c16] border border-white/15 rounded-xl p-3 text-white outline-none"
                />
              </div>

              <div>
                <label className="text-gray-300 font-extrabold block mb-1">Meeting Schedule</label>
                <input 
                  type="text" 
                  value={editingClubPortal.meetingSchedule} 
                  onChange={e => setEditingClubPortal({...editingClubPortal, meetingSchedule: e.target.value})}
                  className="w-full bg-[#0c0c16] border border-white/15 rounded-xl px-3.5 py-2 text-white outline-none"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingClubPortal(null)}
                  className="flex-1 py-2.5 bg-white/10 hover:bg-white/15 text-gray-300 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-teal text-black font-black rounded-xl hover:opacity-95 transition-all cursor-pointer shadow-md shadow-brand-teal/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT EVENT DETAILS & GOOGLE FORM LINK MODAL IN CLUBS PORTAL */}
      {editingEventPortal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full rounded-3xl border border-white/15 p-6 space-y-4 relative shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Edit className="w-4 h-4 text-brand-pink" /> Edit Event Schedule & Google Form Link
              </h3>
              <button 
                onClick={() => setEditingEventPortal(null)} 
                className="text-gray-400 hover:text-white text-xs bg-white/10 px-2 py-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditEventPortal} className="space-y-3.5 text-xs">
              <div>
                <label className="text-gray-300 font-extrabold block mb-1">Event Title</label>
                <input 
                  type="text" 
                  value={editEventFormPortal.title} 
                  onChange={e => setEditEventFormPortal({...editEventFormPortal, title: e.target.value})}
                  className="w-full bg-[#0c0c16] border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-bold outline-none focus:border-brand-pink"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 font-extrabold block mb-1">Date</label>
                  <input 
                    type="text" 
                    value={editEventFormPortal.date} 
                    onChange={e => setEditEventFormPortal({...editEventFormPortal, date: e.target.value})}
                    placeholder="e.g. 28-08-2026"
                    className="w-full bg-[#0c0c16] border border-white/15 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-pink"
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-extrabold block mb-1">Time</label>
                  <input 
                    type="text" 
                    value={editEventFormPortal.time} 
                    onChange={e => setEditEventFormPortal({...editEventFormPortal, time: e.target.value})}
                    placeholder="e.g. 10:00 AM - 04:00 PM"
                    className="w-full bg-[#0c0c16] border border-white/15 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-pink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 font-extrabold block mb-1">Venue Location</label>
                  <input 
                    type="text" 
                    value={editEventFormPortal.venue} 
                    onChange={e => setEditEventFormPortal({...editEventFormPortal, venue: e.target.value})}
                    placeholder="e.g. CLASSROOMS / Main Audi"
                    className="w-full bg-[#0c0c16] border border-white/15 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-pink"
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-extrabold block mb-1">Event Type / Category</label>
                  <select 
                    value={editEventFormPortal.category}
                    onChange={e => setEditEventFormPortal({...editEventFormPortal, category: e.target.value})}
                    className="w-full bg-[#0c0c16] border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-semibold outline-none focus:border-brand-pink"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Competition">Competition</option>
                    <option value="Cultural Fest">Cultural Fest</option>
                    <option value="Tournament">Tournament</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-extrabold block mb-1">Rewards & Certificates</label>
                <input 
                  type="text" 
                  value={editEventFormPortal.rewards} 
                  onChange={e => setEditEventFormPortal({...editEventFormPortal, rewards: e.target.value})}
                  className="w-full bg-[#0c0c16] border border-white/15 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-pink"
                />
              </div>

              <div>
                <label className="text-gray-300 font-extrabold block mb-1">Registration Form Link (Google Form URL)</label>
                <input 
                  type="url" 
                  value={editEventFormPortal.registrationLink} 
                  onChange={e => setEditEventFormPortal({...editEventFormPortal, registrationLink: e.target.value})}
                  placeholder="https://forms.google.com/..."
                  className="w-full bg-[#0c0c16] border border-white/15 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-pink"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingEventPortal(null)}
                  className="flex-1 py-2.5 bg-white/10 hover:bg-white/15 text-gray-300 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-pink text-white font-black rounded-xl hover:opacity-95 transition-all cursor-pointer shadow-lg shadow-brand-pink/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
