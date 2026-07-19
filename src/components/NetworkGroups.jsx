import React, { useState } from 'react';
import { Users, Search, Plus, MessageSquare, BookOpen, Volume2, Shield, Lock, Send, Vote } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function NetworkGroups({ user }) {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState(1);
  const [typedMessage, setTypedMessage] = useState('');
  
  // Announcement create tool
  const [isAnnouncing, setIsAnnouncing] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');

  const [groups, setGroups] = useState([
    {
      id: 1,
      name: 'GATE CSE 2027 Sprints',
      category: 'GATE Preparation',
      description: 'Daily mock questions, test analysis, and shared math formulas for GATE CSE aspirants.',
      membersCount: 48,
      private: false,
      admin: 'Mohammed Sowban',
      announcements: [
        { id: 101, text: 'Tomorrow\'s practice test will cover Theory of Computation (Regular Languages). Be prepared at 4 PM!', date: 'Just now' }
      ],
      messages: [
        { id: 1, sender: 'Preeti', text: 'Does anyone have a good reference for CN Subnetting calculations?', time: '2:15 PM' },
        { id: 2, sender: 'Rohan', text: 'Check the resources subfolder! I uploaded a CN notebook last week.', time: '2:18 PM' }
      ]
    },
    {
      id: 2,
      name: 'Placement Coding Sprints',
      category: 'Coding & Placements',
      description: 'LeetCode Medium practice, mock coding interviews, and review loops.',
      membersCount: 156,
      private: false,
      admin: 'Rohan Gupta',
      announcements: [],
      messages: [
        { id: 1, sender: 'Preeti', text: 'Are the slides for the Amazon DSA interview patterns available?', time: '3:00 PM' }
      ]
    }
  ]);

  const activeGroup = groups.find(g => g.id === selectedGroupId) || groups[0];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: user?.name || 'Scholar Student',
      text: typedMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setGroups(groups.map(g => {
      if (g.id === selectedGroupId) {
        return {
          ...g,
          messages: [...g.messages, newMsg]
        };
      }
      return g;
    }));

    setTypedMessage('');
    addToast({ message: 'Message sent to study group!', type: 'success' });
  };

  const handleAddAnnouncement = (e) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    const newAnn = {
      id: Date.now(),
      text: announcementText,
      date: 'Just now'
    };

    setGroups(groups.map(g => {
      if (g.id === selectedGroupId) {
        return {
          ...g,
          announcements: [newAnn, ...g.announcements]
        };
      }
      return g;
    }));

    setAnnouncementText('');
    setIsAnnouncing(false);
    addToast({ message: 'New group announcement published!', type: 'success' });
  };

  const filteredGroups = groups.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
      
      {/* Left Pane: Groups directory */}
      <div className="lg:col-span-4 space-y-4">
        
        {/* Header Search & Create */}
        <div className="glass-panel p-4 rounded-3xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">My Groups</span>
            <button 
              onClick={() => addToast({ message: 'Create Group functionality coming soon!', type: 'info' })}
              className="p-1 rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:text-white"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search study groups..." 
              className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs text-white"
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
          </div>
        </div>

        {/* Groups List */}
        <div className="space-y-3">
          {filteredGroups.map(group => (
            <div 
              key={group.id}
              onClick={() => setSelectedGroupId(group.id)}
              className={`glass-panel p-4 rounded-2xl cursor-pointer transition-all border text-left space-y-2 ${
                selectedGroupId === group.id ? 'border-brand-teal/40 bg-brand-teal/[0.02]' : 'border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex justify-between items-start gap-3">
                <h4 className="text-xs font-extrabold text-white">{group.name}</h4>
                {group.private ? <Lock className="w-3.5 h-3.5 text-gray-500 shrink-0" /> : <Users className="w-3.5 h-3.5 text-brand-teal shrink-0" />}
              </div>
              
              <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed font-normal">{group.description}</p>
              
              <div className="flex justify-between items-center pt-1">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">{group.category}</span>
                <span className="text-[9px] font-extrabold text-brand-teal">{group.membersCount} Members</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Pane: Active group panel with announcements and chat */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Active group header detail */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h2 className="text-lg font-black text-white">{activeGroup.name}</h2>
              <span className="text-[10px] font-bold text-brand-teal block mt-0.5">{activeGroup.category}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-brand-teal/10 border border-brand-teal/20 px-3 py-1 rounded-full text-[9px] text-brand-teal font-extrabold uppercase">
              <Shield className="w-3.5 h-3.5" />
              <span>Admin: {activeGroup.admin}</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed font-normal">{activeGroup.description}</p>
        </div>

        {/* Announcements List */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-brand-pink animate-pulse" />
              <span>Admin Announcements</span>
            </h3>
            
            <button 
              onClick={() => setIsAnnouncing(!isAnnouncing)}
              className="text-[9px] font-extrabold text-brand-pink uppercase hover:underline"
            >
              {isAnnouncing ? 'Cancel' : '+ New Announcement'}
            </button>
          </div>

          {isAnnouncing && (
            <form onSubmit={handleAddAnnouncement} className="space-y-3 bg-[#f72585]/5 border border-[#f72585]/10 p-4 rounded-2xl">
              <textarea 
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="Broadcast something critical to members..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none resize-none focus:border-brand-pink"
                rows="2"
                required
              />
              <div className="flex justify-end">
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-brand-pink text-white font-extrabold text-[10px] uppercase tracking-wider">
                  Publish
                </button>
              </div>
            </form>
          )}

          {activeGroup.announcements.length === 0 ? (
            <p className="text-xs text-gray-500 italic py-2">No critical admin broadcasts posted yet.</p>
          ) : (
            <div className="space-y-3">
              {activeGroup.announcements.map(ann => (
                <div key={ann.id} className="p-4 bg-brand-pink/5 border border-brand-pink/10 rounded-2xl flex justify-between items-start gap-4">
                  <p className="text-xs text-gray-300 font-normal leading-relaxed">{ann.text}</p>
                  <span className="text-[9px] text-gray-500 font-semibold shrink-0">{ann.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Group Chat Room */}
        <div className="glass-panel rounded-3xl overflow-hidden flex flex-col min-h-[300px]">
          <div className="p-4 border-b border-white/5 bg-black/25 flex items-center justify-between">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-brand-teal" />
              <span>Group Chat Discussion</span>
            </span>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[220px] custom-scrollbar flex flex-col justify-end bg-black/10">
            <div className="space-y-4">
              {activeGroup.messages.map(msg => (
                <div key={msg.id} className="text-left space-y-1 bg-white/[0.01] border border-white/5 p-3 rounded-2xl">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-black text-brand-teal">{msg.sender}</span>
                    <span className="text-[8px] text-gray-500 font-semibold">{msg.time}</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-normal font-normal">{msg.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Send Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-black/25 flex items-center gap-2">
            <input 
              type="text" 
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              placeholder="Send a query to the study group..." 
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-brand-teal"
            />
            <button 
              type="submit" 
              className="p-2.5 rounded-xl bg-brand-teal text-black hover:opacity-90 transition-opacity cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
