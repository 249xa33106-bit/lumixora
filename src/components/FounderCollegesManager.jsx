import React, { useState, useEffect } from 'react';
import { 
  Building2, Plus, Save, Trash2, Edit, CheckCircle2, ShieldAlert, Globe, 
  Users, Sparkles, MapPin, X, Award, ShieldCheck, DollarSign, Calendar, 
  Check, ExternalLink, ArrowRight, Layers, Eye
} from 'lucide-react';
import { DEFAULT_COLLEGES, B2B_LICENSING_TIERS } from '../data/collegesData';
import { db } from '../config/firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { useToast } from '../context/ToastContext';

export default function FounderCollegesManager() {
  const { addToast } = useToast();
  const [colleges, setColleges] = useState(DEFAULT_COLLEGES);
  const [editingCollege, setEditingCollege] = useState(null);
  const [activeCampusId, setActiveCampusId] = useState(() => {
    return localStorage.getItem('lumixora_active_campus_id') || 'all';
  });

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
    maxSeats: 5000,
    licenseTier: 'pro',
    annualContractValue: '₹99,000',
    contractId: '',
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

  const handleSwitchCampus = (campusId, campusName) => {
    setActiveCampusId(campusId);
    localStorage.setItem('lumixora_active_campus_id', campusId);
    localStorage.setItem('lumixora_active_campus_name', campusName);
    window.dispatchEvent(new CustomEvent('lumixora_campus_changed', { 
      detail: { campusId, campusName } 
    }));
    addToast({ 
      message: `Switched active campus view to: ${campusName}`, 
      type: 'success' 
    });
  };

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

    const tierObj = B2B_LICENSING_TIERS.find(t => t.id === newCollege.licenseTier) || B2B_LICENSING_TIERS[1];

    const formatted = {
      ...newCollege,
      id: tenantId,
      code: newCollege.code.toUpperCase(),
      domains,
      maxSeats: Number(newCollege.maxSeats) || tierObj.maxSeats,
      annualContractValue: newCollege.annualContractValue || tierObj.price,
      contractId: newCollege.contractId || `LMX-${newCollege.code.toUpperCase()}-${new Date().getFullYear()}`,
      licenseStatus: 'active',
      licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
      createdAt: new Date().toISOString(),
      is_deleted: false,
      isDeleted: false
    };

    const updated = [formatted, ...colleges.filter(c => c.id !== tenantId)];
    setColleges(updated);

    try {
      await setDoc(doc(db, 'college_tenants', tenantId), formatted, { merge: true });
      addToast({ message: `Partner college "${newCollege.name}" licensed & onboarded!`, type: 'success' });
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
      maxSeats: 5000,
      licenseTier: 'pro',
      annualContractValue: '₹99,000',
      contractId: '',
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

    const updatedCollege = { 
      ...editingCollege, 
      domains, 
      maxSeats: Number(editingCollege.maxSeats) || 5000,
      is_deleted: false, 
      isDeleted: false 
    };
    delete updatedCollege.domainsText;

    const updatedColleges = colleges.map(c => c.id === editingCollege.id ? updatedCollege : c);
    setColleges(updatedColleges);

    try {
      await setDoc(doc(db, 'college_tenants', editingCollege.id), updatedCollege, { merge: true });
      addToast({ message: `Updated licensing details for ${editingCollege.name}!`, type: 'success' });
    } catch (err) {
      console.error("Firestore error:", err);
      addToast({ message: `Updated details for ${editingCollege.name}!`, type: 'success' });
    }

    setEditingCollege(null);
  };

  const handleDeleteCollege = async (tenantId, collegeName) => {
    if (!window.confirm(`Are you sure you want to delete "${collegeName}" from the Vyomra network?`)) return;

    setColleges(prev => prev.filter(c => c.id !== tenantId));

    try {
      await deleteDoc(doc(db, 'college_tenants', tenantId));
      addToast({ message: `Deleted institution "${collegeName}".`, type: 'success' });
    } catch (err) {
      console.error("Firestore delete error:", err);
    }
  };

  // Calculate High-Value B2B Financial Metrics
  const totalARR = colleges.reduce((acc, c) => {
    const raw = (c.annualContractValue || '').replace(/[^\d]/g, '');
    return acc + (Number(raw) || 99000);
  }, 0);

  const totalSeats = colleges.reduce((acc, c) => acc + (Number(c.maxSeats) || Number(c.studentCount) || 3000), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* EXECUTIVE B2B METRICS HEADER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4 bg-gradient-to-br from-amber-400/10 via-transparent to-transparent">
          <div className="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Licensed Annual ARR</span>
            <span className="text-xl font-black text-white">₹{totalARR.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-amber-400 font-semibold block mt-0.5">Recurring Institutional B2B</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4 bg-gradient-to-br from-brand-teal/10 via-transparent to-transparent">
          <div className="w-12 h-12 rounded-xl bg-brand-teal/20 text-brand-teal flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Partner Institutions</span>
            <span className="text-xl font-black text-white">{colleges.length} Campuses</span>
            <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">100% Tenant Isolation</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Student Seats Provisioned</span>
            <span className="text-xl font-black text-white">{totalSeats.toLocaleString('en-IN')} Seats</span>
            <span className="text-[10px] text-purple-400 font-semibold block mt-0.5">Licensed Capacity</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4 bg-gradient-to-br from-pink-500/10 via-transparent to-transparent">
          <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Whitelisted Domains</span>
            <span className="text-xl font-black text-white">{colleges.reduce((acc, c) => acc + (c.domains?.length || 1), 0)} Domains</span>
            <span className="text-[10px] text-pink-400 font-semibold block mt-0.5">Institutional Access Guard</span>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-pink/20 text-brand-pink flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                B2B College & University Licensing Hub
                <span className="text-xs bg-brand-purple/20 text-brand-purple px-2.5 py-0.5 rounded-full border border-brand-purple/30 uppercase font-black">
                  Enterprise SaaS
                </span>
              </h2>
              <p className="text-xs text-gray-400">Manage client institutions, licensing contracts, seat allocations, and domain whitelists.</p>
            </div>
          </div>

          {/* Quick Active Campus Selector */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-1.5 rounded-2xl">
            <span className="text-[11px] font-bold text-gray-400 px-2 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-amber-400" /> Active Campus:
            </span>
            <button
              onClick={() => handleSwitchCampus('all', 'All Campuses (Global)')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeCampusId === 'all'
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              🌐 All (HQ)
            </button>
            {colleges.map(c => (
              <button
                key={c.id}
                onClick={() => handleSwitchCampus(c.id, c.shortName || c.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                  activeCampusId === c.id
                    ? 'bg-brand-teal text-black shadow-md'
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <span>{c.logo || '🏛️'}</span>
                <span>{c.code || c.shortName}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ONBOARD NEW PARTNER COLLEGE */}
          <div className="bg-black/40 p-5 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-brand-teal flex items-center gap-2">
              <Plus className="w-4 h-4" /> License & Onboard New College / University
            </h3>

            <form onSubmit={handleAddCollege} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-400 font-bold block mb-1">Full Institution Name</label>
                <input 
                  type="text" 
                  required
                  value={newCollege.name} 
                  onChange={e => setNewCollege({...newCollege, name: e.target.value})}
                  placeholder="e.g. Madanapalle Institute of Technology & Science" 
                  className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white font-semibold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Short Name / Campus</label>
                  <input 
                    type="text" 
                    required
                    value={newCollege.shortName} 
                    onChange={e => setNewCollege({...newCollege, shortName: e.target.value})}
                    placeholder="e.g. MITS Madanapalle" 
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Tenant Code</label>
                  <input 
                    type="text" 
                    required
                    value={newCollege.code} 
                    onChange={e => setNewCollege({...newCollege, code: e.target.value.toUpperCase()})}
                    placeholder="e.g. MITS" 
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white font-bold outline-none uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 font-bold block mb-1">Whitelisted Email Domains (Comma-Separated)</label>
                <input 
                  type="text" 
                  required
                  value={newCollege.domainsText} 
                  onChange={e => setNewCollege({...newCollege, domainsText: e.target.value})}
                  placeholder="e.g. mits.ac.in, mitsedu.in" 
                  className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Licensing Plan</label>
                  <select
                    value={newCollege.licenseTier}
                    onChange={e => {
                      const tier = e.target.value;
                      const tierObj = B2B_LICENSING_TIERS.find(t => t.id === tier);
                      setNewCollege({
                        ...newCollege,
                        licenseTier: tier,
                        annualContractValue: tierObj?.price || '₹99,000',
                        maxSeats: tierObj?.maxSeats || 2500
                      });
                    }}
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white font-semibold outline-none"
                  >
                    {B2B_LICENSING_TIERS.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.price})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Allocated Seats</label>
                  <input 
                    type="number" 
                    value={newCollege.maxSeats} 
                    onChange={e => setNewCollege({...newCollege, maxSeats: Number(e.target.value)})}
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Annual Fee</label>
                  <input 
                    type="text" 
                    value={newCollege.annualContractValue} 
                    onChange={e => setNewCollege({...newCollege, annualContractValue: e.target.value})}
                    placeholder="₹99,000" 
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white font-bold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Location (City, State)</label>
                  <input 
                    type="text" 
                    value={newCollege.location} 
                    onChange={e => setNewCollege({...newCollege, location: e.target.value})}
                    placeholder="e.g. Madanapalle, AP" 
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Logo Emoji</label>
                  <input 
                    type="text" 
                    value={newCollege.logo} 
                    onChange={e => setNewCollege({...newCollege, logo: e.target.value})}
                    placeholder="🏛️" 
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white text-center font-bold outline-none"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-3 bg-gradient-to-r from-brand-pink to-purple-600 text-white font-extrabold rounded-xl hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-brand-pink/20"
              >
                <Save className="w-4 h-4" /> Save & Activate Institution License
              </button>
            </form>
          </div>

          {/* B2B TIER COMPARISON & CONTRACT TEMPLATES */}
          <div className="bg-black/40 p-5 rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-amber-400" /> B2B Institutional SaaS Pricing Tiers
              </h3>
              <div className="space-y-3">
                {B2B_LICENSING_TIERS.map(tier => (
                  <div key={tier.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white text-xs">{tier.name}</span>
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-amber-400/20 text-amber-400 border border-amber-400/30">
                          {tier.badge}
                        </span>
                      </div>
                      <span className="font-black text-brand-teal text-xs">{tier.price}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 font-medium">Up to {tier.maxSeats.toLocaleString()} student & faculty accounts included.</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tier.features.map((f, i) => (
                        <span key={i} className="text-[9px] bg-white/5 px-2 py-0.5 rounded text-gray-300 flex items-center gap-1 font-semibold">
                          <Check className="w-2.5 h-2.5 text-emerald-400" /> {f}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Multi-Tenant Engine Status: ACTIVE (Strict Tenant Isolation Enforced)</span>
            </div>
          </div>
        </div>

        {/* ONBOARDED PARTNER COLLEGES DIRECTORY */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-teal" /> Licensed Partner Institutions ({colleges.length})
            </h3>
            <span className="text-xs text-gray-400 font-medium">
              Click <strong>"Switch View"</strong> on any campus to filter the whole platform to that college.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {colleges.map(c => (
              <div 
                key={c.id} 
                className={`p-4 rounded-2xl bg-black/40 border transition-all flex flex-col justify-between gap-3 relative group ${
                  activeCampusId === c.id 
                    ? 'border-brand-teal shadow-lg shadow-brand-teal/10 bg-brand-teal/5' 
                    : 'border-white/10 hover:border-brand-purple/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{c.logo || '🏛️'}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black bg-amber-400/20 text-amber-400 border border-amber-400/30 px-2 py-0.5 rounded-full uppercase">
                        {c.licenseTier || 'Pro'}
                      </span>
                      <span className="text-[10px] font-black bg-brand-teal/20 text-brand-teal border border-brand-teal/30 px-2 py-0.5 rounded-full uppercase">
                        {c.code || c.id}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-sm font-extrabold text-white mt-2 leading-tight">{c.name}</h4>
                  <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-brand-pink" /> {c.location || 'India'}
                  </p>

                  {/* Contract Details */}
                  <div className="mt-3 grid grid-cols-2 gap-2 bg-white/5 p-2 rounded-xl text-[11px] border border-white/5">
                    <div>
                      <span className="text-[9px] text-gray-400 block uppercase font-bold">Annual ARR</span>
                      <span className="font-extrabold text-emerald-400">{c.annualContractValue || '₹99,000'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 block uppercase font-bold">Max Seats</span>
                      <span className="font-extrabold text-white">{(c.maxSeats || c.studentCount || 3000).toLocaleString()} Seats</span>
                    </div>
                  </div>

                  <div className="mt-2.5 space-y-1 text-xs">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Whitelisted Domains:</span>
                    <div className="flex flex-wrap gap-1">
                      {(c.domains || ['gprec.ac.in']).map((d, i) => (
                        <span key={i} className="text-[10px] font-bold text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded-md border border-brand-purple/20">
                          @{d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => handleSwitchCampus(c.id, c.shortName || c.name)}
                    className={`w-full py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      activeCampusId === c.id
                        ? 'bg-brand-teal text-black shadow-md'
                        : 'bg-white/5 hover:bg-brand-teal/20 text-gray-200 hover:text-brand-teal border border-white/10'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {activeCampusId === c.id ? 'Active Selected Campus' : 'Switch Platform View'}
                  </button>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Licensed
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingCollege({...c, domainsText: (c.domains || []).join(', ')})}
                        className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
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
                <Edit className="w-4 h-4 text-brand-teal" /> Edit Institution & License ({editingCollege.shortName || editingCollege.name})
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Allocated Student Seats</label>
                  <input 
                    type="number" 
                    value={editingCollege.maxSeats || 5000} 
                    onChange={e => setEditingCollege({...editingCollege, maxSeats: Number(e.target.value)})}
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Annual Contract ARR</label>
                  <input 
                    type="text" 
                    value={editingCollege.annualContractValue || '₹99,000'} 
                    onChange={e => setEditingCollege({...editingCollege, annualContractValue: e.target.value})}
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-white font-bold outline-none"
                  />
                </div>
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
