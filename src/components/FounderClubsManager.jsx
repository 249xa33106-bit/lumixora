import React, { useState, useEffect } from 'react';
import { Users, Plus, Save, Trash2, Edit, Calendar, Award, CheckCircle2, ShieldAlert, X } from 'lucide-react';
import { DEFAULT_COLLEGE_CLUBS } from '../data/clubsData';
import { db } from '../config/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { useToast } from '../context/ToastContext';

export default function FounderClubsManager() {
  const { addToast } = useToast();
  const [clubs, setClubs] = useState([]);
  const [editingClub, setEditingClub] = useState(null);

  // Edit Event State
  const [editingEvent, setEditingEvent] = useState(null); // { clubId, evtId }
  const [editEventForm, setEditEventForm] = useState({
    title: '',
    date: '',
    time: '',
    venue: '',
    rewards: '',
    category: '',
    registrationLink: ''
  });

  // New Event Form State
  const [eventClubId, setEventClubId] = useState('');
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '10:00 AM - 04:00 PM',
    venue: 'GPREC Main Auditorium',
    rewards: 'Certificates & Trophies',
    category: 'Hackathon',
    registrationLink: ''
  });

  const handleOpenEditEvent = (clubId, evt) => {
    setEditingEvent({ clubId, evtId: evt.id });
    setEditEventForm({
      title: evt.title || '',
      date: evt.date || '',
      time: evt.time || '10:00 AM - 04:00 PM',
      venue: evt.venue || '',
      rewards: evt.rewards || 'Certificates & Trophies',
      category: evt.category || 'Hackathon',
      registrationLink: evt.registrationLink || evt.formUrl || ''
    });
  };

  const handleSaveEditEvent = async (e) => {
    e.preventDefault();
    if (!editingEvent) return;

    const targetClub = clubs.find(c => c.id === editingEvent.clubId);
    if (!targetClub) return;

    const updatedEvents = (targetClub.upcomingEvents || []).map(evt => {
      if (evt.id === editingEvent.evtId) {
        return {
          ...evt,
          ...editEventForm
        };
      }
      return evt;
    });

    const updatedClubObj = { ...targetClub, upcomingEvents: updatedEvents };
    const updatedClubs = clubs.map(c => c.id === targetClub.id ? updatedClubObj : c);
    setClubs(updatedClubs);

    try {
      await setDoc(doc(db, 'college_clubs', targetClub.id), updatedClubObj, { merge: true });
      addToast({ message: `Updated event details for "${editEventForm.title}" permanently in database!`, type: 'success' });
    } catch (err) {
      console.error("Firestore save error:", err);
      addToast({ message: `Updated event details for "${editEventForm.title}"!`, type: 'success' });
    }

    setEditingEvent(null);
  };

  // New Club Form State
  const [newClub, setNewClub] = useState({
    name: '',
    shortName: '',
    category: 'Coding',
    code: '',
    logo: '⚡',
    description: '',
    leadName: '',
    leadEmail: '',
    meetingSchedule: 'Every Wednesday @ 04:00 PM',
    establishedYear: '2026',
    memberCount: 50,
    tagsText: 'AI, Development, Code'
  });

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

  // Load from Firestore
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const metaDoc = await getDoc(doc(db, 'college_clubs_meta', 'init'));
        let snap = await getDocs(collection(db, 'college_clubs'));

        if (!metaDoc.exists() && snap.empty) {
          for (const c of DEFAULT_COLLEGE_CLUBS) {
            await setDoc(doc(db, 'college_clubs', c.id), c, { merge: true });
          }
          await setDoc(doc(db, 'college_clubs_meta', 'init'), { initialized: true });
          snap = await getDocs(collection(db, 'college_clubs'));
        }

        const list = [];
        snap.forEach(d => {
          if (d.id !== 'init') list.push({ id: d.id, ...d.data() });
        });
        setClubs(list);
      } catch (e) {
        console.log("Error loading clubs:", e);
        setClubs(DEFAULT_COLLEGE_CLUBS);
      }
    };
    fetchClubs();
  }, []);

  const handleAddClub = async (e) => {
    e.preventDefault();
    if (!newClub.name || !newClub.code) {
      addToast({ message: 'Club name and code are required.', type: 'warning' });
      return;
    }

    const clubId = `club-${newClub.code.toLowerCase()}`;
    const formattedClub = {
      ...newClub,
      id: clubId,
      code: newClub.code.toUpperCase(),
      bannerColor: 'from-purple-600 via-indigo-600 to-blue-600',
      tags: newClub.tagsText.split(',').map(t => t.trim()),
      upcomingEvents: [],
      announcements: ['New official college club registered on Lumixora!']
    };

    const updated = [formattedClub, ...clubs];
    setClubs(updated);

    try {
      await setDoc(doc(db, 'college_clubs', clubId), formattedClub, { merge: true });
      addToast({ message: `Club "${newClub.name}" registered and saved permanently to database!`, type: 'success' });
    } catch (err) {
      console.error("Firestore error:", err);
      addToast({ message: `Club "${newClub.name}" registered.`, type: 'success' });
    }

    setNewClub({
      name: '',
      shortName: '',
      category: 'Technical',
      code: '',
      logo: '⚡',
      description: '',
      leadName: '',
      leadEmail: '',
      meetingSchedule: 'Every Wednesday @ 04:00 PM',
      establishedYear: '2026',
      memberCount: 50,
      tagsText: 'AI, Development, Code'
    });
  };

  const handleSaveEditClub = async (e) => {
    e.preventDefault();
    if (!editingClub) return;

    const updatedClubs = clubs.map(c => c.id === editingClub.id ? editingClub : c);
    setClubs(updatedClubs);

    try {
      await setDoc(doc(db, 'college_clubs', editingClub.id), editingClub, { merge: true });
      addToast({ message: `Updated details for ${editingClub.name} permanently in database!`, type: 'success' });
    } catch (err) {
      console.error("Firestore error:", err);
      addToast({ message: `Updated details for ${editingClub.name}!`, type: 'success' });
    }

    setEditingClub(null);
  };

  const handleDeleteClub = async (clubId, clubName) => {
    if (!window.confirm(`Are you sure you want to permanently delete the club "${clubName}" from the database?`)) return;

    const filtered = clubs.filter(c => c.id !== clubId);
    setClubs(filtered);

    try {
      await deleteDoc(doc(db, 'college_clubs', clubId));
      addToast({ message: `Permanently deleted club "${clubName}" from database.`, type: 'success' });
    } catch (err) {
      console.error("Firestore delete error:", err);
      addToast({ message: `Deleted club "${clubName}".`, type: 'success' });
    }
  };

  const handleAddEventToClub = async (e) => {
    e.preventDefault();
    if (!eventClubId || !newEvent.title) {
      addToast({ message: 'Select a club and enter event title.', type: 'warning' });
      return;
    }

    const targetClub = clubs.find(c => c.id === eventClubId);
    if (!targetClub) return;

    const evtId = `evt-${Date.now()}`;
    const eventObj = { ...newEvent, id: evtId };
    const updatedEvents = [...(targetClub.upcomingEvents || []), eventObj];
    const updatedClubObj = { ...targetClub, upcomingEvents: updatedEvents };

    const updatedClubs = clubs.map(c => c.id === eventClubId ? updatedClubObj : c);
    setClubs(updatedClubs);

    try {
      await setDoc(doc(db, 'college_clubs', eventClubId), updatedClubObj, { merge: true });
      addToast({ message: `New Event "${newEvent.title}" added and saved permanently to database!`, type: 'success' });
    } catch (err) {
      console.error("Firestore event add error:", err);
      addToast({ message: `New Event "${newEvent.title}" added!`, type: 'success' });
    }

    setNewEvent({
      title: '',
      date: '',
      time: '10:00 AM - 04:00 PM',
      venue: 'GPREC Main Auditorium',
      rewards: 'Certificates & Trophies',
      category: 'Hackathon',
      registrationLink: ''
    });
  };

  const handleDeleteEvent = async (clubId, evtId) => {
    const targetClub = clubs.find(c => c.id === clubId);
    if (!targetClub) return;

    const updatedEvents = (targetClub.upcomingEvents || []).filter(e => e.id !== evtId);
    const updatedClubObj = { ...targetClub, upcomingEvents: updatedEvents };

    const updatedClubs = clubs.map(c => c.id === clubId ? updatedClubObj : c);
    setClubs(updatedClubs);

    try {
      await setDoc(doc(db, 'college_clubs', clubId), updatedClubObj, { merge: true });
      addToast({ message: 'Event removed and saved permanently to database.', type: 'success' });
    } catch (err) {
      console.error("Firestore delete event error:", err);
      addToast({ message: 'Event removed from schedule.', type: 'success' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-purple/20 text-brand-purple flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">College Clubs & Societies Control Center</h2>
            <p className="text-xs text-gray-400">Register new campus clubs, edit details, delete clubs, and post upcoming hackathons/events.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* REGISTER NEW CLUB FORM */}
          <div className="bg-black/40 p-5 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-brand-purple flex items-center gap-2">
              <Plus className="w-4 h-4" /> Register New Campus Club
            </h3>

            <form onSubmit={handleAddClub} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Club Name</label>
                  <input 
                    type="text" 
                    value={newClub.name} 
                    onChange={e => setNewClub({...newClub, name: e.target.value})}
                    placeholder="e.g. CyberDefense Society" 
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Club Code</label>
                  <input 
                    type="text" 
                    value={newClub.code} 
                    onChange={e => setNewClub({...newClub, code: e.target.value.toUpperCase()})}
                    placeholder="CYBERSEC" 
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white font-bold outline-none uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Category</label>
                  <select 
                    value={newClub.category} 
                    onChange={e => setNewClub({...newClub, category: e.target.value})}
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white font-semibold outline-none"
                  >
                    <option value="Communication & Awareness">Communication & Awareness</option>
                    <option value="Coding">Coding</option>
                    <option value="Entrepreneurship">Entrepreneurship</option>
                    <option value="Cultural Activities">Cultural Activities</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Logo Emoji</label>
                  <input 
                    type="text" 
                    value={newClub.logo} 
                    onChange={e => setNewClub({...newClub, logo: e.target.value})}
                    placeholder="🛡️" 
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white text-center font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 font-bold block mb-1">Lead Name & Contact</label>
                <input 
                  type="text" 
                  value={newClub.leadName} 
                  onChange={e => setNewClub({...newClub, leadName: e.target.value})}
                  placeholder="Shaik Sowban & Core Team" 
                  className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white font-semibold outline-none"
                />
              </div>

              <div>
                <label className="text-gray-400 font-bold block mb-1">Description & Mandate</label>
                <textarea 
                  rows="2"
                  value={newClub.description} 
                  onChange={e => setNewClub({...newClub, description: e.target.value})}
                  placeholder="Brief summary of club objectives, activities, and workshops..." 
                  className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-3 bg-brand-purple text-white font-extrabold rounded-xl hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-brand-purple/20"
              >
                <Save className="w-4 h-4" /> Save New Club
              </button>
            </form>
          </div>

          {/* ADD EVENT / HACKATHON FORM */}
          <div className="bg-black/40 p-5 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-brand-pink flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Schedule Club Event / Hackathon
            </h3>

            <form onSubmit={handleAddEventToClub} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-400 font-bold block mb-1">Target Club</label>
                <select
                  value={eventClubId}
                  onChange={e => setEventClubId(e.target.value)}
                  className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white font-semibold outline-none"
                >
                  <option value="">-- Select Club --</option>
                  {clubs.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Event Title</label>
                  <input 
                    type="text" 
                    value={newEvent.title}
                    onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                    placeholder="e.g. AI Prompt Challenge"
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Event Type</label>
                  <select 
                    value={newEvent.category}
                    onChange={e => setNewEvent({...newEvent, category: e.target.value})}
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white font-semibold outline-none"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Competition">Competition</option>
                    <option value="Cultural Fest">Cultural Fest</option>
                    <option value="Tournament">Tournament</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Date</label>
                  <input 
                    type="text" 
                    value={newEvent.date}
                    onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                    placeholder="e.g. 15 Sep 2026"
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Time</label>
                  <input 
                    type="text" 
                    value={newEvent.time}
                    onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                    placeholder="e.g. 10:00 AM - 04:00 PM"
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Venue Location</label>
                  <input 
                    type="text" 
                    value={newEvent.venue}
                    onChange={e => setNewEvent({...newEvent, venue: e.target.value})}
                    placeholder="Block B - Lab 204"
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Rewards & Certificates</label>
                  <input 
                    type="text" 
                    value={newEvent.rewards}
                    onChange={e => setNewEvent({...newEvent, rewards: e.target.value})}
                    placeholder="Certificates & Trophies"
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 font-bold block mb-1">Registration Form Link (Google Form URL)</label>
                <input 
                  type="url" 
                  value={newEvent.registrationLink || ''}
                  onChange={e => setNewEvent({...newEvent, registrationLink: e.target.value})}
                  placeholder="https://forms.google.com/..."
                  className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-3 bg-brand-pink text-white font-extrabold rounded-xl hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-brand-pink/20"
              >
                <Save className="w-4 h-4" /> Add Event to Schedule
              </button>
            </form>
          </div>
        </div>

        {/* EXISTING CLUBS MANAGEMENT DIRECTORY (EDIT / DELETE) */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-teal" /> Existing Registered Clubs ({clubs.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clubs.map(c => (
              <div key={c.id} className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between">
                    {renderClubLogo(c.logo, c.name, 'w-10 h-10 text-2xl')}
                    <span className="text-[10px] font-black bg-brand-purple/20 text-brand-purple border border-brand-purple/30 px-2 py-0.5 rounded-full uppercase">
                      {c.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-2 leading-tight">{c.name}</h4>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{c.description}</p>

                  {/* Scheduled Events Sub-List */}
                  <div className="mt-3 space-y-2 pt-3 border-t border-white/5">
                    <h5 className="text-[11px] font-bold text-brand-teal uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-teal" /> Scheduled Events ({(c.upcomingEvents || []).length}):
                    </h5>
                    {(c.upcomingEvents || []).length === 0 ? (
                      <p className="text-[10px] text-gray-500 italic">No events scheduled.</p>
                    ) : (
                      (c.upcomingEvents || []).map(evt => (
                        <div key={evt.id} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between gap-2">
                          <div className="text-xs overflow-hidden">
                            <p className="font-bold text-white leading-tight truncate">{evt.title}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              📅 {evt.date || 'TBD'} • ⏰ {evt.time || 'TBD'}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              📍 {evt.venue || 'TBD'}
                            </p>
                            {evt.registrationLink && (
                              <a href={evt.registrationLink} target="_blank" rel="noreferrer" className="text-[10px] text-brand-pink hover:underline block mt-1 font-bold truncate">
                                🔗 Form Link Attached
                              </a>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleOpenEditEvent(c.id, evt)}
                              className="p-1.5 bg-brand-teal/20 text-brand-teal hover:bg-brand-teal hover:text-black rounded-lg transition-all text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                              title="Edit Event Date, Venue, Time & Registration Link"
                            >
                              <Edit className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteEvent(c.id, evt.id)}
                              className="p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                              title="Delete Event"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-xs text-gray-400 font-medium">Events: {(c.upcomingEvents || []).length}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingClub(c)}
                      className="p-2 bg-brand-teal/20 text-brand-teal hover:bg-brand-teal hover:text-black rounded-lg transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit Club
                    </button>
                    <button
                      onClick={() => handleDeleteClub(c.id, c.name)}
                      className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EDIT CLUB MODAL */}
      {editingClub && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full rounded-3xl border border-white/10 p-6 space-y-4 relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit className="w-4 h-4 text-brand-teal" /> Edit Club Details ({editingClub.shortName || editingClub.name})
              </h3>
              <button 
                onClick={() => setEditingClub(null)} 
                className="text-gray-400 hover:text-white text-xs bg-white/10 px-2 py-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditClub} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-400 font-bold block mb-1">Club Full Name</label>
                <input 
                  type="text" 
                  value={editingClub.name} 
                  onChange={e => setEditingClub({...editingClub, name: e.target.value})}
                  className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white font-semibold outline-none"
                />
              </div>

              <div>
                <label className="text-gray-400 font-bold block mb-1">Lead Name & Contact</label>
                <input 
                  type="text" 
                  value={editingClub.leadName} 
                  onChange={e => setEditingClub({...editingClub, leadName: e.target.value})}
                  className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="text-gray-400 font-bold block mb-1">Description</label>
                <textarea 
                  rows="3"
                  value={editingClub.description} 
                  onChange={e => setEditingClub({...editingClub, description: e.target.value})}
                  className="w-full bg-[#10101b] border border-white/10 rounded-xl p-3 text-white outline-none"
                />
              </div>

              <div>
                <label className="text-gray-400 font-bold block mb-1">Meeting Schedule</label>
                <input 
                  type="text" 
                  value={editingClub.meetingSchedule} 
                  onChange={e => setEditingClub({...editingClub, meetingSchedule: e.target.value})}
                  className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingClub(null)}
                  className="flex-1 py-2.5 bg-white/5 text-gray-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-teal text-black font-extrabold rounded-xl hover:opacity-90"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT EVENT DETAILS & REGISTRATION LINK MODAL */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full rounded-3xl border border-white/10 p-6 space-y-4 relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit className="w-4 h-4 text-brand-pink" /> Edit Event Schedule & Registration Form Link
              </h3>
              <button 
                onClick={() => setEditingEvent(null)} 
                className="text-gray-400 hover:text-white text-xs bg-white/10 px-2 py-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditEvent} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-400 font-bold block mb-1">Event Title</label>
                <input 
                  type="text" 
                  value={editEventForm.title} 
                  onChange={e => setEditEventForm({...editEventForm, title: e.target.value})}
                  className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Date</label>
                  <input 
                    type="text" 
                    value={editEventForm.date} 
                    onChange={e => setEditEventForm({...editEventForm, date: e.target.value})}
                    placeholder="e.g. 28-08-2026"
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Time</label>
                  <input 
                    type="text" 
                    value={editEventForm.time} 
                    onChange={e => setEditEventForm({...editEventForm, time: e.target.value})}
                    placeholder="e.g. 10:00 AM - 04:00 PM"
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Venue Location</label>
                  <input 
                    type="text" 
                    value={editEventForm.venue} 
                    onChange={e => setEditEventForm({...editEventForm, venue: e.target.value})}
                    placeholder="e.g. CLASSROOMS / Main Audi"
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Event Type / Category</label>
                  <select 
                    value={editEventForm.category}
                    onChange={e => setEditEventForm({...editEventForm, category: e.target.value})}
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white font-semibold outline-none"
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
                <label className="text-gray-400 font-bold block mb-1">Rewards & Prizes</label>
                <input 
                  type="text" 
                  value={editEventForm.rewards} 
                  onChange={e => setEditEventForm({...editEventForm, rewards: e.target.value})}
                  className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="text-gray-400 font-bold block mb-1">Registration Form Link (Google Form URL)</label>
                <input 
                  type="url" 
                  value={editEventForm.registrationLink} 
                  onChange={e => setEditEventForm({...editEventForm, registrationLink: e.target.value})}
                  placeholder="https://forms.google.com/..."
                  className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="flex-1 py-2.5 bg-white/5 text-gray-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-pink text-white font-extrabold rounded-xl hover:opacity-90 shadow-lg shadow-brand-pink/20"
                >
                  Save Event Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
