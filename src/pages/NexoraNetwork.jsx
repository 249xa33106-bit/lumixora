import React, { useState, useEffect } from 'react';
import { Newspaper, MessageSquare, Users, Sparkles, User, Search, UserCheck } from 'lucide-react';
import NetworkFeed from '../components/NetworkFeed';
import NetworkMessages from '../components/NetworkMessages';
import NetworkGroups from '../components/NetworkGroups';
import NetworkAssistant from '../components/NetworkAssistant';
import NetworkProfile from '../components/NetworkProfile';
import { useToast } from '../context/ToastContext';
import { useData } from '../context/DataContext';
import { supabase } from '../config/supabase';

const parseUserProfile = (fullName) => {
  let name = fullName || '';
  let metadata = { qualification: 'B.Tech', college: 'GPREC', place: 'Kurnool', year: '3rd Year', avatarUrl: '' };
  if (name.includes('{')) {
    const idx = name.indexOf('{');
    const jsonStr = name.substring(idx).trim();
    name = name.substring(0, idx).trim();
    try {
      metadata = { ...metadata, ...JSON.parse(jsonStr) };
    } catch (e) {}
  }
  return { name: name || 'Scholar Student', ...metadata };
};

export default function NexoraNetwork({ user }) {
  const { addToast } = useToast();
  const { notes, doubts } = useData();
  const [activeSubTab, setActiveSubTab] = useState('feed'); // 'feed', 'messages', 'groups', 'assistant', 'profile'
  
  // Smart Connect & Connection Requests lists
  const [connectTab, setConnectTab] = useState('explore'); // 'explore', 'pending'
  const [pendingRequests, setPendingRequests] = useState([
    { id: 201, name: 'Ankita Verma', branch: 'CSE Sem 3', college: 'LUMIXORA University' },
    { id: 202, name: 'Vikram Malhotra', branch: 'CSM Sem 5', college: 'BITS Hyderabad' }
  ]);
  const [suggestedStudents, setSuggestedStudents] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  useEffect(() => {
    const fetchRegisteredUsers = async () => {
      try {
        const { data, error } = await supabase.from('users').select('*');
        if (!error && data) {
          const parsed = data.map(dbUser => {
            const profile = parseUserProfile(dbUser.name);
            return {
              id: dbUser.id || dbUser.uid,
              name: profile.name,
              college: profile.college || 'GPREC',
              branch: profile.qualification || 'CSE',
              year: profile.year || '3rd Year',
              avatarUrl: dbUser.avatarUrl || '',
              mutual: Math.floor(Math.random() * 8) + 1
            };
          }).filter(u => u.name.toLowerCase() !== 'scholar student' && u.name.toLowerCase() !== (user?.name || '').toLowerCase());
          
          setRegisteredUsers(parsed);
          setSuggestedStudents(parsed);
        }
      } catch (err) {
        console.error("Error loading network suggestions:", err);
      }
    };
    fetchRegisteredUsers();
  }, [user]);

  const handleAcceptConnect = (reqId, name) => {
    setPendingRequests(pendingRequests.filter(r => r.id !== reqId));
    addToast({ message: `Connection request from ${name} accepted!`, type: 'success' });
  };

  const handleSendConnect = (studentId, name) => {
    setSuggestedStudents(suggestedStudents.filter(s => s.id !== studentId));
    addToast({ message: `Connection request sent to ${name}!`, type: 'success' });
  };

  return (
    <div className="space-y-6 text-white pb-12 animate-fade-in">
      
      {/* Social Hub Top Navigation Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent uppercase tracking-tight flex items-center gap-2">
            <Users className="w-8 h-8 text-brand-pink" />
            <span>Nexora Network</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">
            LUMIXORA's premium academic networking sandbox. Connect, chat, write blogs, and build study cohorts.
          </p>
        </div>

        {/* Categories toggler */}
        <div className="flex flex-wrap gap-1 bg-black/45 p-1 rounded-2xl border border-white/5">
          {[
            { id: 'feed', label: 'Feed Timeline', icon: Newspaper },
            { id: 'messages', label: 'Direct Messages', icon: MessageSquare },
            { id: 'groups', label: 'Study Groups', icon: Users },
            { id: 'assistant', label: 'AI Partner Matches', icon: Sparkles },
            { id: 'profile', label: 'My Portfolio', icon: User }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSubTab === tab.id 
                    ? 'bg-gradient-to-r from-brand-pink to-brand-purple text-white shadow-[0_0_12px_rgba(247,37,133,0.3)] font-black' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid Switcher layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Side Tab Content Panel */}
        <div className="xl:col-span-8 space-y-6">
          {activeSubTab === 'feed' && <NetworkFeed user={user} dbNotes={notes} dbDoubts={doubts} dbUsers={registeredUsers} />}
          {activeSubTab === 'messages' && <NetworkMessages user={user} />}
          {activeSubTab === 'groups' && <NetworkGroups user={user} />}
          {activeSubTab === 'assistant' && <NetworkAssistant user={user} />}
          {activeSubTab === 'profile' && <NetworkProfile user={user} />}
        </div>

        {/* Right Side: Smart Connect / Explore Students drawer */}
        <div className="xl:col-span-4 space-y-6">
          
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-1.5 border-b border-white/5 pb-3">
              <UserCheck className="w-4 h-4 text-brand-purple" />
              <span>Smart Connect</span>
            </h3>

            {/* Smart Connect Subtabs */}
            <div className="flex gap-1.5 bg-black/25 p-1 rounded-xl border border-white/5">
              <button
                onClick={() => setConnectTab('explore')}
                className={`flex-1 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  connectTab === 'explore' ? 'bg-white/5 text-white' : 'text-gray-500'
                }`}
              >
                Explore Suggestions
              </button>
              <button
                onClick={() => setConnectTab('pending')}
                className={`flex-1 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all relative cursor-pointer ${
                  connectTab === 'pending' ? 'bg-white/5 text-white' : 'text-gray-500'
                }`}
              >
                <span>Pending Invites</span>
                {pendingRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-pink text-white flex items-center justify-center text-[8px] font-black">
                    {pendingRequests.length}
                  </span>
                )}
              </button>
            </div>

            <div className="space-y-3 pt-1 text-left">
              
              {/* SUBTAB: EXPLORE SUGGESTIONS */}
              {connectTab === 'explore' && (
                <>
                  {suggestedStudents.length === 0 ? (
                    <p className="text-[11px] text-gray-500 italic py-4 text-center">No new connection suggestions found.</p>
                  ) : (
                    suggestedStudents.map(student => (
                      <div key={student.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <h4 className="text-xs font-extrabold text-white truncate">{student.name}</h4>
                          <span className="text-[9px] text-gray-500 font-bold block truncate mt-0.5">{student.branch} • {student.college}</span>
                          <span className="text-[9px] text-brand-purple font-extrabold block mt-0.5">{student.mutual} mutual connections</span>
                        </div>
                        <button 
                          onClick={() => handleSendConnect(student.id, student.name)}
                          className="px-3 py-1.5 rounded-xl bg-brand-purple hover:brightness-110 text-white font-extrabold text-[9px] uppercase tracking-wider cursor-pointer shrink-0"
                        >
                          Connect
                        </button>
                      </div>
                    ))
                  )}
                </>
              )}

              {/* SUBTAB: PENDING REQUESTS */}
              {connectTab === 'pending' && (
                <>
                  {pendingRequests.length === 0 ? (
                    <p className="text-[11px] text-gray-500 italic py-4 text-center">No pending invites remaining.</p>
                  ) : (
                    pendingRequests.map(req => (
                      <div key={req.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
                        <div className="min-w-0">
                          <h4 className="text-xs font-extrabold text-white truncate">{req.name}</h4>
                          <span className="text-[9px] text-gray-500 font-bold block truncate mt-0.5">{req.branch} • {req.college}</span>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleAcceptConnect(req.id, req.name)}
                            className="flex-1 py-1.5 rounded-xl bg-brand-teal text-black font-extrabold text-[9px] uppercase tracking-wider cursor-pointer"
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => { setPendingRequests(pendingRequests.filter(r => r.id !== req.id)); addToast({ message: 'Request declined', type: 'info' }); }}
                            className="flex-1 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white font-extrabold text-[9px] uppercase tracking-wider cursor-pointer"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
