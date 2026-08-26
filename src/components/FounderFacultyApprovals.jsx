import React, { useState, useEffect } from 'react';
import { CheckCircle, X, Shield, Mail, Building, Phone, UserCheck, Lock, RefreshCw } from 'lucide-react';
import { supabase } from '../config/supabase';
import { db } from '../config/firebase';
import { collection, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';
import { useToast } from '../context/ToastContext';

export default function FounderFacultyApprovals() {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchFacultyAccounts = async () => {
    setLoading(true);
    try {
      const combinedMap = new Map();

      // 1. Query Supabase Database for Faculty / Mentor accounts
      try {
        const { data: sbData } = await supabase
          .from('users')
          .select('*')
          .or('role.eq.faculty,role.eq.mentor,role.eq.teacher');
        
        if (sbData && sbData.length > 0) {
          sbData.forEach(item => {
            const emailKey = item.email ? item.email.toLowerCase().trim() : item.id;
            combinedMap.set(emailKey, {
              id: item.id || emailKey,
              email: item.email || '',
              name: item.name || item.full_name || item.email?.split('@')[0] || 'Faculty Member',
              department: item.department || 'Academic Dept',
              designation: item.designation || 'Faculty',
              mobileNumber: item.mobileNumber || item.phone || '',
              isApproved: item.isApproved === true || item.is_approved === true,
              source: 'supabase'
            });
          });
        }
      } catch (sbErr) {
        console.warn("Supabase faculty query notice:", sbErr);
      }

      // 2. Query Firestore Database for Faculty / Mentor accounts from both 'users' and 'Users'
      try {
        const fetchFsCollection = async (collName) => {
          const snap = await getDocs(collection(db, collName));
          if (!snap.empty) {
            snap.docs.forEach(dDoc => {
              const data = dDoc.data();
              const isFaculty = data.role === 'faculty' || data.role === 'mentor' || data.mode === 'faculty' || !!data.designation;
              if (isFaculty) {
                const emailKey = data.email ? data.email.toLowerCase().trim() : dDoc.id;
                const existing = combinedMap.get(emailKey) || {};
                combinedMap.set(emailKey, {
                  id: data.uid || dDoc.id || existing.id,
                  docId: dDoc.id,
                  email: data.email || existing.email || '',
                  name: data.name || existing.name || 'Faculty Member',
                  department: data.department || existing.department || 'Academic Dept',
                  designation: data.designation || existing.designation || 'Faculty',
                  mobileNumber: data.mobileNumber || existing.mobileNumber || '',
                  isApproved: data.isApproved === true || data.is_approved === true || existing.isApproved === true,
                  source: 'firestore'
                });
              }
            });
          }
        };

        await fetchFsCollection('users');
        await fetchFsCollection('Users');
      } catch (fsErr) {
        console.warn("Firestore faculty query notice:", fsErr);
      }

      setFacultyList(Array.from(combinedMap.values()));
    } catch (err) {
      console.error("Error fetching faculty accounts:", err);
      addToast({ message: 'Failed to fetch faculty accounts', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacultyAccounts();
  }, []);

  const handleApprovalToggle = async (facultyMember, shouldApprove) => {
    try {
      const email = facultyMember.email;
      const id = facultyMember.id || facultyMember.docId;

      // 1. Update Supabase
      try {
        if (email) {
          await supabase
            .from('users')
            .update({ isApproved: shouldApprove, is_approved: shouldApprove, is_blocked: false })
            .or(`email.eq.${email},id.eq.${id}`);
        }
      } catch (sbErr) {
        console.warn("Supabase approval update notice:", sbErr);
      }

      // 2. Update Firestore Doc across both 'users' and 'Users' collections
      try {
        const payload = { 
          isApproved: shouldApprove, 
          is_approved: shouldApprove, 
          is_blocked: !shouldApprove, 
          role: 'faculty' 
        };
        if (id) {
          await setDoc(doc(db, 'users', id), payload, { merge: true });
          await setDoc(doc(db, 'Users', id), payload, { merge: true });
        }
        if (facultyMember.docId && facultyMember.docId !== id) {
          await setDoc(doc(db, 'users', facultyMember.docId), payload, { merge: true });
          await setDoc(doc(db, 'Users', facultyMember.docId), payload, { merge: true });
        }
        if (email) {
          const emailKeyDoc = email.toLowerCase().trim();
          await setDoc(doc(db, 'users', emailKeyDoc), payload, { merge: true });
          await setDoc(doc(db, 'Users', emailKeyDoc), payload, { merge: true });
        }
      } catch (fsErr) {
        console.warn("Firestore approval update notice:", fsErr);
      }

      addToast({ 
        message: `Faculty account ${facultyMember.name} ${shouldApprove ? 'APPROVED' : 'LOCKED'} successfully!`, 
        type: shouldApprove ? 'success' : 'info' 
      });

      // Refresh list
      fetchFacultyAccounts();
    } catch (err) {
      console.error("Error updating faculty approval status:", err);
      addToast({ message: 'Failed to update approval status. Please try again.', type: 'error' });
    }
  };

  const pending = facultyList.filter(f => !f.isApproved);
  const approved = facultyList.filter(f => f.isApproved);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-brand-teal gap-2 text-xs font-bold uppercase tracking-wider">
        <RefreshCw className="w-4 h-4 animate-spin" /> Querying Supabase & Firestore Faculty Databases...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
        <div>
          <h3 className="text-sm font-bold text-gray-200 flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-teal" /> Faculty & Mentor Security Approvals
          </h3>
          <p className="text-xs text-gray-500">Founder security portal to review, approve, or lock faculty registrations.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchFacultyAccounts}
            className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl text-xs flex items-center gap-1 transition-colors cursor-pointer"
            title="Refresh Faculty List"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <div className="bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-xl text-center">
            <span className="block text-orange-500 font-black text-lg">{pending.length}</span>
            <span className="text-[10px] text-orange-500 font-bold uppercase tracking-widest">Pending</span>
          </div>
          <div className="bg-brand-teal/10 border border-brand-teal/20 px-4 py-2 rounded-xl text-center">
            <span className="block text-brand-teal font-black text-lg">{approved.length}</span>
            <span className="text-[10px] text-brand-teal font-bold uppercase tracking-widest">Approved</span>
          </div>
        </div>
      </div>

      {/* Pending Approvals Section */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-orange-400 tracking-wide uppercase flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5" /> Pending Faculty Approval Queue ({pending.length})
        </h4>

        {pending.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl text-center border border-white/5">
            <Shield className="w-8 h-8 text-brand-teal/50 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-white mb-1">All Caught Up</h4>
            <p className="text-xs text-gray-400">No pending faculty approval requests at the moment.</p>
          </div>
        ) : (
          pending?.map(f => (
            <div key={f.id} className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-orange-500/30 bg-orange-500/5 hover:border-orange-500/60 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-black text-lg shadow-sm">
                  {f.name?.charAt(0) || 'F'}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    {f.name}
                    <span className="text-[9px] bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider">
                      Locked / Pending Approval
                    </span>
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-medium">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-gray-500"/> {f.email}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Building className="w-3 h-3 text-gray-500"/> {f.department} - {f.designation}</span>
                    {f.mobileNumber && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-gray-500"/> {f.mobileNumber}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={() => handleApprovalToggle(f, true)}
                  className="bg-brand-teal hover:bg-brand-teal/90 text-black px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" /> Approve Faculty Access
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Approved Faculty Roster */}
      {approved.length > 0 && (
        <div className="mt-8 space-y-3">
          <h4 className="text-xs font-bold text-brand-teal tracking-wide uppercase flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" /> Approved Verified Faculty Roster ({approved.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {approved?.map(f => (
              <div key={f.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between gap-3 hover:border-brand-teal/40 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-teal/20 border border-brand-teal/30 flex items-center justify-center text-brand-teal font-black text-sm">
                    {f.name?.charAt(0) || 'F'}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1">
                      {f.name} <CheckCircle className="w-3 h-3 text-brand-teal" />
                    </h4>
                    <p className="text-[10px] text-gray-400">{f.designation} • {f.department}</p>
                    <p className="text-[9px] text-gray-500">{f.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleApprovalToggle(f, false)}
                  className="text-[10px] text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-2 py-1 rounded border border-red-500/20 font-bold transition-colors cursor-pointer"
                  title="Lock / Revoke Access"
                >
                  Lock
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
