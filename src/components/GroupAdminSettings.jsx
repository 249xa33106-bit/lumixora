import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Shield, Users, Save, Search, CheckCircle, Image as ImageIcon, Plus, Link, Mail } from 'lucide-react';
import { db, storage } from '../config/firebase';
import { doc, updateDoc, getDocs, collection, query, where, setDoc } from 'firebase/firestore';
import { supabase } from '../config/supabase';
import { useToast } from '../context/ToastContext';

export default function GroupAdminSettings({ activeGroupId, groupMetadata, user, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  // Overview State
  const [displayName, setDisplayName] = useState(groupMetadata?.displayName || '');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(groupMetadata?.logoUrl || null);
  const fileInputRef = useRef(null);

  // Members / Roles State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterSec, setFilterSec] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [bulkEmails, setBulkEmails] = useState('');
  
  // Local metadata copy to manage before saving
  const [localMeta, setLocalMeta] = useState({
    admins: groupMetadata?.admins || [],
    faculty: groupMetadata?.faculty || [],
    addedMembers: groupMetadata?.addedMembers || []
  });

  // Derived / Pre-fetched members
  const [currentMembersInfo, setCurrentMembersInfo] = useState([]);

  useEffect(() => {
    // Fetch details for users currently in the lists
    const fetchMemberDetails = async () => {
      const uids = new Set([...localMeta.admins, ...localMeta.faculty, ...localMeta.addedMembers]);
      if (uids.size === 0) {
        setCurrentMembersInfo([]);
        return;
      }
      
      try {
        const allFetched = [];
        const uidArray = Array.from(uids);
        
        for (let i = 0; i < uidArray.length; i += 10) {
          const chunk = uidArray.slice(i, i + 10);
          const q = query(collection(db, 'users'), where('uid', 'in', chunk));
          const snap = await getDocs(q);
          snap.forEach(d => allFetched.push({ ...d.data(), id: d.id }));
        }
        setCurrentMembersInfo(allFetched);
      } catch (e) {
        console.error("Error fetching member details", e);
      }
    };
    fetchMemberDetails();
  }, [localMeta]);

  const handleLogoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        addToast({ message: 'Logo must be less than 2MB', type: 'warning' });
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveOverview = async () => {
    setLoading(true);
    try {
      let finalLogoUrl = groupMetadata?.logoUrl || null;
      
      if (logoFile) {
        const path = `group_logos/${activeGroupId}/${Date.now()}_${logoFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('academic_resources')
          .upload(path, logoFile, { cacheControl: '3600', upsert: false });
          
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('academic_resources')
          .getPublicUrl(path);
          
        finalLogoUrl = publicUrl;
      }

      const updateData = {
        displayName: displayName || activeGroupId || 'Group'
      };
      if (finalLogoUrl !== null && finalLogoUrl !== undefined) {
        updateData.logoUrl = finalLogoUrl;
      }

      const groupRef = doc(db, 'class_groups', activeGroupId);
      await setDoc(groupRef, updateData, { merge: true });

      addToast({ message: 'Group settings updated!', type: 'success' });
    } catch (err) {
      console.error("Save Overview Error:", err);
      addToast({ message: `Failed: ${err.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const executeSearch = async () => {
    if (!searchQuery.trim() && !filterDept && !filterYear && !filterSec) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const snap = await getDocs(collection(db, 'users'));
      const results = [];
      const term = searchQuery.toLowerCase().trim();
      
      snap.forEach(d => {
        const data = d.data();
        let matches = true;
        
        if (filterDept && data.department?.toLowerCase() !== filterDept.toLowerCase()) matches = false;
        if (filterYear && data.year?.toLowerCase() !== filterYear.toLowerCase()) matches = false;
        if (filterSec && data.sec?.toLowerCase() !== filterSec.toLowerCase()) matches = false;
        
        if (matches && term) {
          if (!(data.name && data.name.toLowerCase().includes(term)) &&
              !(data.email && data.email.toLowerCase().includes(term)) &&
              !(data.uid === term)) {
            matches = false;
          }
        }
        
        if (matches) {
          results.push({ ...data, id: d.id });
        }
      });
      
      setSearchResults(results.slice(0, 50)); // Top 50 matches for section view
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (filterDept || filterYear || filterSec) {
      executeSearch();
    }
  }, [filterDept, filterYear, filterSec]);

  const handleSearchUsers = async (e) => {
    if (e) e.preventDefault();
    executeSearch();
  };

  const handleBulkInvite = async () => {
    if (!bulkEmails.trim()) return;
    
    setLoading(true);
    try {
      const emailList = bulkEmails
        .split(/[,;\n]+/)
        .map(e => e.trim().toLowerCase())
        .filter(e => e.length > 0);
        
      if (emailList.length === 0) {
        setLoading(false);
        return;
      }

      // Query in chunks of 10 due to Firestore 'in' limits
      const foundUids = [];
      for (let i = 0; i < emailList.length; i += 10) {
        const chunk = emailList.slice(i, i + 10);
        const q = query(collection(db, 'users'), where('email', 'in', chunk));
        const snap = await getDocs(q);
        snap.forEach(d => foundUids.push(d.id));
      }

      if (foundUids.length === 0) {
        addToast({ message: 'No matching users found for those emails.', type: 'warning' });
        setLoading(false);
        return;
      }

      const currentList = localMeta.addedMembers || [];
      const newList = [...new Set([...currentList, ...foundUids])];
        
      const groupRef = doc(db, 'class_groups', activeGroupId);
      await setDoc(groupRef, {
        addedMembers: newList
      }, { merge: true });

      setLocalMeta(prev => ({ ...prev, addedMembers: newList }));
      setBulkEmails('');
      addToast({ message: `Successfully added ${foundUids.length} users!`, type: 'success' });
    } catch (err) {
      console.error(err);
      addToast({ message: 'Failed to bulk add users', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const copyInviteLink = () => {
    const link = `${window.location.origin}/#/join-group/${activeGroupId}`;
    navigator.clipboard.writeText(link);
    addToast({ message: 'Invite link copied to clipboard!', type: 'success' });
  };

  const toggleUserInList = async (listName, userId) => {
    setLoading(true);
    try {
      const currentList = localMeta[listName] || [];
      const isRemoving = currentList.includes(userId);
      const newList = isRemoving 
        ? currentList.filter(id => id !== userId)
        : [...currentList, userId];
        
      const groupRef = doc(db, 'class_groups', activeGroupId);
      await setDoc(groupRef, {
        [listName]: newList
      }, { merge: true });

      setLocalMeta(prev => ({ ...prev, [listName]: newList }));
      addToast({ message: `User ${isRemoving ? 'removed from' : 'added to'} ${listName}`, type: 'success' });
    } catch (e) {
      console.error(e);
      addToast({ message: 'Failed to update roles', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-[#0a0a0f] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f5d4]/20 to-brand-blue/20 flex items-center justify-center border border-[#00f5d4]/30">
              <Shield className="w-5 h-5 text-[#00f5d4]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">Group Settings</h2>
              <p className="text-xs text-gray-400">{activeGroupId}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5 px-6 shrink-0 bg-white/5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'overview' ? 'border-[#00f5d4] text-[#00f5d4]' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'members' ? 'border-[#00f5d4] text-[#00f5d4]' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Members
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'roles' ? 'border-[#00f5d4] text-[#00f5d4]' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Roles & Permissions
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Display Name</label>
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={activeGroupId}
                  className="w-full bg-[#111118] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f5d4]/50"
                />
                <p className="text-xs text-gray-500 mt-1">This will override the default group ID in the chat header.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Group Logo</label>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden bg-white/5 shrink-0">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleLogoSelect} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Image
                    </button>
                    <p className="text-xs text-gray-500 mt-2">Recommended: 256x256px. Max 2MB.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <button 
                  onClick={saveOverview}
                  disabled={loading}
                  className="w-full py-3 bg-[#00f5d4] text-black font-bold rounded-xl hover:bg-[#00f5d4]/90 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
                </button>
              </div>
            </div>
          )}

          {/* MEMBERS / ROLES TAB SHARED COMPONENT FOR SEARCH */}
          {(activeTab === 'members' || activeTab === 'roles') && (
            <div className="space-y-6 animate-fade-in">
              {activeTab === 'members' && (
                <>
                  {/* Shareable Join Link */}
                  <div className="bg-[#111118] p-4 rounded-xl border border-white/5">
                    <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                      <Link className="w-4 h-4 text-[#00f5d4]" />
                      Invite Link
                    </h3>
                    <p className="text-xs text-gray-400 mb-3">Share this link to let anyone join this group instantly.</p>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        readOnly
                        value={`${window.location.origin}/#/join-group/${activeGroupId}`}
                        className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-xs text-gray-400 focus:outline-none"
                      />
                      <button 
                        onClick={copyInviteLink}
                        className="px-4 py-2 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors text-xs shrink-0"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  {/* Bulk Invite via Emails */}
                  <div className="bg-[#111118] p-4 rounded-xl border border-white/5">
                    <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#00f5d4]" />
                      Bulk Invite by Emails
                    </h3>
                    <p className="text-xs text-gray-400 mb-3">Paste a comma-separated list of student emails.</p>
                    <textarea 
                      value={bulkEmails}
                      onChange={(e) => setBulkEmails(e.target.value)}
                      placeholder="e.g. alice@example.com, bob@example.com"
                      className="w-full h-20 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00f5d4]/50 custom-scrollbar resize-none mb-2"
                    />
                    <button 
                      onClick={handleBulkInvite}
                      disabled={loading || !bulkEmails.trim()}
                      className="px-4 py-2 bg-[#00f5d4] text-black font-bold rounded-xl hover:bg-[#00f5d4]/90 transition-colors text-xs disabled:opacity-50 flex items-center gap-2"
                    >
                      {loading ? 'Adding...' : 'Add Users'}
                    </button>
                  </div>
                </>
              )}

              <div className="bg-[#111118] p-4 rounded-xl border border-white/5">
                <h3 className="text-sm font-bold text-white mb-3">Search & Manage Users</h3>
                <form onSubmit={handleSearchUsers} className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2">
                    <select 
                      value={filterDept} 
                      onChange={(e) => setFilterDept(e.target.value)}
                      className="bg-[#0a0a0f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00f5d4]/50"
                    >
                      <option value="">All Branches</option>
                      <option value="CSE">CSE</option>
                      <option value="CSM">CSM</option>
                      <option value="CSD">CSD</option>
                      <option value="IT">IT</option>
                      <option value="ECE">ECE</option>
                    </select>
                    <select 
                      value={filterYear} 
                      onChange={(e) => setFilterYear(e.target.value)}
                      className="bg-[#0a0a0f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00f5d4]/50"
                    >
                      <option value="">All Years</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                    <select 
                      value={filterSec} 
                      onChange={(e) => setFilterSec(e.target.value)}
                      className="bg-[#0a0a0f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00f5d4]/50"
                    >
                      <option value="">All Sections</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, email, or UID..."
                        className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00f5d4]/50"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={isSearching || (!searchQuery.trim() && !filterDept && !filterYear && !filterSec)}
                      className="px-4 py-2 bg-brand-blue text-black font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      Search
                    </button>
                  </div>
                </form>
                
                {searchResults.length > 0 && (
                  <div className="mt-4 space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                    {searchResults.map(resUser => (
                      <div key={resUser.id || resUser.uid} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                        <div>
                          <p className="text-sm font-bold text-white">{resUser.name || 'Anonymous'}</p>
                          <p className="text-xs text-gray-400">{resUser.email || resUser.uid}</p>
                        </div>
                        <div className="flex gap-2">
                          {activeTab === 'members' && (
                            <button 
                              onClick={() => toggleUserInList('addedMembers', resUser.uid || resUser.id)}
                              disabled={loading}
                              className={`text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors ${
                                localMeta.addedMembers?.includes(resUser.uid || resUser.id) 
                                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                                  : 'bg-[#00f5d4]/20 text-[#00f5d4] hover:bg-[#00f5d4]/30'
                              }`}
                            >
                              {localMeta.addedMembers?.includes(resUser.uid || resUser.id) ? 'Remove' : 'Add Member'}
                            </button>
                          )}
                          
                          {activeTab === 'roles' && (
                            <>
                              <button 
                                onClick={() => toggleUserInList('faculty', resUser.uid || resUser.id)}
                                disabled={loading}
                                className={`text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors ${
                                  localMeta.faculty?.includes(resUser.uid || resUser.id) 
                                    ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' 
                                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                }`}
                              >
                                Faculty
                              </button>
                              <button 
                                onClick={() => toggleUserInList('admins', resUser.uid || resUser.id)}
                                disabled={loading}
                                className={`text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors ${
                                  localMeta.admins?.includes(resUser.uid || resUser.id) 
                                    ? 'bg-[#00f5d4]/20 text-[#00f5d4] hover:bg-[#00f5d4]/30' 
                                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                }`}
                              >
                                Admin
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="pt-4">
                <h3 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Currently Added {activeTab === 'members' ? 'Members' : 'Roles'}
                </h3>
                
                {currentMembersInfo.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 text-sm">
                    No users have been manually added. (Standard members join automatically by section).
                  </div>
                ) : (
                  <div className="space-y-2">
                    {currentMembersInfo.map(member => {
                      const uid = member.uid || member.id;
                      const isAddedMember = localMeta.addedMembers?.includes(uid);
                      const isFaculty = localMeta.faculty?.includes(uid);
                      const isAdmin = localMeta.admins?.includes(uid);
                      
                      // Filter based on tab
                      if (activeTab === 'members' && !isAddedMember) return null;
                      if (activeTab === 'roles' && !isFaculty && !isAdmin) return null;
                      
                      return (
                        <div key={uid} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-blue/20 text-brand-blue flex items-center justify-center font-bold text-xs shrink-0">
                              {(member.name || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white flex items-center gap-2">
                                {member.name || 'Anonymous'}
                                {isAdmin && <span className="text-[9px] bg-[#00f5d4]/20 text-[#00f5d4] px-1.5 py-0.5 rounded-md uppercase tracking-wider">Admin</span>}
                                {isFaculty && <span className="text-[9px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded-md uppercase tracking-wider">Faculty</span>}
                              </p>
                              <p className="text-xs text-gray-500">{member.email || uid}</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            {activeTab === 'members' && (
                              <button 
                                onClick={() => toggleUserInList('addedMembers', uid)}
                                className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                            {activeTab === 'roles' && (
                              <>
                                {isFaculty && (
                                  <button onClick={() => toggleUserInList('faculty', uid)} className="text-[10px] text-red-400 hover:underline">Remove Faculty</button>
                                )}
                                {isAdmin && (
                                  <button onClick={() => toggleUserInList('admins', uid)} className="text-[10px] text-red-400 hover:underline">Remove Admin</button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
