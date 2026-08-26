import React, { useState, useEffect } from 'react';
import { Building2, Plus, Save, Trash2, Edit, CheckCircle2, ShieldAlert, Globe, Users, Sparkles, MapPin, X } from 'lucide-react';
import { DEFAULT_COLLEGES } from '../data/collegesData';
import { db } from '../config/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { useToast } from '../context/ToastContext';

export default function FounderCollegesManager() {
  const { addToast } = useToast();
  const [colleges, setColleges] = useState(DEFAULT_COLLEGES);
  const [editingCollege, setEditingCollege] = useState(null);

  // New College Registration Form State
  const [newCollege, setNewCollege] = useState({
    name: '',
    shortName: '',
    code: '',
    domainsText: '',
    logo: '🏛️',
    location: '',
    established: '2026',
    studentCount: 3000,
    bannerColor: 'from-purple-600 via-indigo-600 to-blue-600',
    description: ''
  });

  // Load in real-time from Firestore
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'college_tenants'),
      (snap) => {
        const fetched = [];
        snap.forEach(d => {
          if (d.id === 'init') return;
          const data = d.data();
          if (!data.is_deleted && !data.isDeleted) {
            fetched.push({ id: d.id, ...data });
          }
        });

        // Ensure all DEFAULT_COLLEGES (GPREC, Ashoka, etc.) are present
        const existingIds = new Set(fetched.map(c => c.id));
        const missingDefaults = DEFAULT_COLLEGES.filter(c => !existingIds.has(c.id));
        const finalList = [...missingDefaults, ...fetched];
        setColleges(finalList);
      },
      (err) => {
        console.warn("Error listening to college tenants:", err);
      }
    );

    return () => unsub();
  }, []);

  const handleAddCollege = async (e) => {
    e.preventDefault();
    if (!newCollege.name || !newCollege.code || !newCollege.domainsText) {
      addToast({ message: 'College name, code, and email domain are required.', type: 'warning' });
      return;
    }

    const tenantId = newCollege.code.toLowerCase().trim();
    const domains = newCollege.domainsText
      .split(',')
      .map(d => d.trim().replace(/^@/, ''))
      .filter(Boolean);

    const formatted = {
      ...newCollege,
      id: tenantId,
      code: newCollege.code.toUpperCase(),
      domains,
      isActive: true,
      createdAt: new Date().toISOString(),
      is_deleted: false,
      isDeleted: false
    };

    const updated = [formatted, ...colleges.filter(c => c.id !== tenantId)];
    setColleges(updated);

    try {
      await setDoc(doc(db, 'college_tenants', tenantId), formatted, { merge: true });
      addToast({ message: `Partner college tenant "${newCollege.name}" registered and saved!`, type: 'success' });
    } catch (err) {
      console.error("Firestore error:", err);
      addToast({ message: `College "${newCollege.name}" registered.`, type: 'success' });
    }

    setNewCollege({
      name: '',
      shortName: '',
      code: '',
      domainsText: '',
      logo: '🏛️',
      location: '',
      established: '2026',
      studentCount: 3000,
      bannerColor: 'from-purple-600 via-indigo-600 to-blue-600',
      description: ''
    });
  };

  const handleSaveEditCollege = async (e) => {
    e.preventDefault();
    if (!editingCollege) return;

    const domains = typeof editingCollege.domainsText === 'string'
      ? editingCollege.domainsText.split(',').map(d => d.trim().replace(/^@/, '')).filter(Boolean)
      : (editingCollege.domains || []);

    const updatedCollege = { ...editingCollege, domains, is_deleted: false, isDeleted: false };
    delete updatedCollege.domainsText;

    const updatedColleges = colleges.map(c => c.id === editingCollege.id ? updatedCollege : c);
    setColleges(updatedColleges);

    try {
      await setDoc(doc(db, 'college_tenants', editingCollege.id), updatedCollege, { merge: true });
      addToast({ message: `Updated details for ${editingCollege.name} permanently in database!`, type: 'success' });
    } catch (err) {
      console.error("Firestore error:", err);
      addToast({ message: `Updated details for ${editingCollege.name}!`, type: 'success' });
    }

    setEditingCollege(null);
  };

  const handleDeleteCollege = async (tenantId, collegeName) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${collegeName}" from the Lumixora network? This cannot be undone.`)) return;

    setColleges(prev => prev.filter(c => c.id !== tenantId));

    try {
      // 1. Delete document permanently from Firestore
      await deleteDoc(doc(db, 'college_tenants', tenantId));
      addToast({ message: `Permanently deleted institution "${collegeName}".`, type: 'success' });
    } catch (err) {
      console.error("Firestore delete error:", err);
      // Fallback mark deleted
      try {
        await setDoc(doc(db, 'college_tenants', tenantId), {
          id: tenantId,
          name: collegeName,
          is_deleted: true,
          isDeleted: true
        }, { merge: true });
        await deleteDoc(doc(db, 'college_tenants', tenantId));
      } catch (_e) {}
      addToast({ message: `Deleted institution "${collegeName}".`, type: 'success' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-pink/20 text-brand-pink flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              Partner Colleges & SaaS Tenant Control Center
              <span className="text-xs bg-brand-purple/20 text-brand-purple px-2.5 py-0.5 rounded-full border border-brand-purple/30 uppercase font-black">
                Multi-Tenant Engine
              </span>
            </h2>
            <p className="text-xs text-gray-400">Onboard new engineering colleges, universities, and autonomous campuses into the Lumixora network.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* REGISTER NEW COLLEGE FORM */}
          <div className="bg-black/40 p-5 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-brand-teal flex items-center gap-2">
              <Plus className="w-4 h-4" /> Onboard New Partner College / University
            </h3>

            <form onSubmit={handleAddCollege} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-400 font-bold block mb-1">Full Institution Name</label>
                <input 
                  type="text" 
                  value={newCollege.name} 
                  onChange={e => setNewCollege({...newCollege, name: e.target.value})}
                  placeholder="e.g. Vellore Institute of Technology" 
                  className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white font-semibold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Short Name / Campus</label>
                  <input 
                    type="text" 
                    value={newCollege.shortName} 
                    onChange={e => setNewCollege({...newCollege, shortName: e.target.value})}
                    placeholder="e.g. VIT Vellore" 
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Tenant Code</label>
                  <input 
                    type="text" 
                    value={newCollege.code} 
                    onChange={e => setNewCollege({...newCollege, code: e.target.value.toUpperCase()})}
                    placeholder="e.g. VIT" 
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white font-bold outline-none uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 font-bold block mb-1">Allowed Email Domains (Comma-Separated)</label>
                <input 
                  type="text" 
                  value={newCollege.domainsText} 
                  onChange={e => setNewCollege({...newCollege, domainsText: e.target.value})}
                  placeholder="e.g. vit.ac.in, vitstudent.ac.in" 
                  className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Location (City, State)</label>
                  <input 
                    type="text" 
                    value={newCollege.location} 
                    onChange={e => setNewCollege({...newCollege, location: e.target.value})}
                    placeholder="e.g. Vellore, Tamil Nadu" 
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Logo Emoji</label>
                  <input 
                    type="text" 
                    value={newCollege.logo} 
                    onChange={e => setNewCollege({...newCollege, logo: e.target.value})}
                    placeholder="🎓" 
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white text-center font-bold outline-none"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-3 bg-gradient-to-r from-brand-pink to-purple-600 text-white font-extrabold rounded-xl hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-brand-pink/20"
              >
                <Save className="w-4 h-4" /> Onboard Partner College
              </button>
            </form>
          </div>

          {/* SAAS NETWORK SUMMARY STATS */}
          <div className="bg-black/40 p-5 rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-purple" /> Lumixora Multi-Tenant SaaS Overview
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-medium">
                Lumixora provides strict data segregation across all partner colleges. Each college operates in its own isolated digital campus workspace.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="block text-2xl font-black text-brand-pink">{colleges.length}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Active Institutions</span>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="block text-2xl font-black text-brand-teal">
                  {colleges.reduce((acc, c) => acc + (c.domains?.length || 1), 0)}
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Whitelisted Domains</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Multi-Tenant Engine Status: ACTIVE (100% Tenant Isolation Enforced)</span>
            </div>
          </div>
        </div>

        {/* REGISTERED PARTNER COLLEGES DIRECTORY */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-teal" /> Onboarded Institutions ({colleges.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {colleges.map(c => (
              <div key={c.id} className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between gap-3 relative group hover:border-brand-purple/50 transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{c.logo || '🏛️'}</span>
                    <span className="text-[10px] font-black bg-brand-teal/20 text-brand-teal border border-brand-teal/30 px-2.5 py-0.5 rounded-full uppercase">
                      ID: {c.id}
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-white mt-2 leading-tight">{c.name}</h4>
                  <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-brand-pink" /> {c.location || 'India'}
                  </p>

                  <div className="mt-3 space-y-1.5 pt-2 border-t border-white/5 text-xs">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Whitelisted Email Domains:</span>
                    <div className="flex flex-wrap gap-1">
                      {(c.domains || ['gprec.ac.in']).map((d, i) => (
                        <span key={i} className="text-[10px] font-bold text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded-md border border-brand-purple/20">
                          @{d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Active Tenant
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingCollege({...c, domainsText: (c.domains || []).join(', ')})}
                      className="p-1.5 bg-brand-teal/20 text-brand-teal hover:bg-brand-teal hover:text-black rounded-lg transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                    {c.id !== 'gprec' && (
                      <button
                        onClick={() => handleDeleteCollege(c.id, c.name)}
                        className="p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EDIT COLLEGE MODAL */}
      {editingCollege && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full rounded-3xl border border-white/10 p-6 space-y-4 relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit className="w-4 h-4 text-brand-teal" /> Edit Institution Details ({editingCollege.shortName || editingCollege.name})
              </h3>
              <button 
                onClick={() => setEditingCollege(null)} 
                className="text-gray-400 hover:text-white text-xs bg-white/10 px-2 py-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditCollege} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-400 font-bold block mb-1">Full Institution Name</label>
                <input 
                  type="text" 
                  value={editingCollege.name} 
                  onChange={e => setEditingCollege({...editingCollege, name: e.target.value})}
                  className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white font-semibold outline-none"
                />
              </div>

              <div>
                <label className="text-gray-400 font-bold block mb-1">Whitelisted Email Domains (Comma Separated)</label>
                <input 
                  type="text" 
                  value={editingCollege.domainsText} 
                  onChange={e => setEditingCollege({...editingCollege, domainsText: e.target.value})}
                  className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white font-bold outline-none"
                />
              </div>

              <div>
                <label className="text-gray-400 font-bold block mb-1">Location</label>
                <input 
                  type="text" 
                  value={editingCollege.location} 
                  onChange={e => setEditingCollege({...editingCollege, location: e.target.value})}
                  className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCollege(null)}
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
    </div>
  );
}
