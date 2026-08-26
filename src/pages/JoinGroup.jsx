import React, { useEffect, useState } from 'react';
import { Users, Loader2, CheckCircle, Shield } from 'lucide-react';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc, arrayUnion } from 'firebase/firestore';
import { useToast } from '../context/ToastContext';

export default function JoinGroup({ groupId, user, setActiveTab }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [success, setSuccess] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (!groupId) {
      setError('Invalid invite link.');
      setLoading(false);
      return;
    }

    const processJoin = async () => {
      try {
        const groupRef = doc(db, 'class_groups', groupId);
        const groupSnap = await getDoc(groupRef);

        if (groupSnap.exists()) {
          setGroupName(groupSnap.data().displayName || groupId);
        } else {
          // Group might not exist explicitly in DB yet (dynamically created), but can still be joined
          setGroupName(groupId);
        }

        if (user?.uid) {
          // Add user to the addedMembers array
          await setDoc(groupRef, {
            addedMembers: arrayUnion(user.uid),
            lastActivity: new Date() // just to ensure the doc exists
          }, { merge: true });
          
          setSuccess(true);
          
          // Wait a second so they see the success message, then redirect to community
          setTimeout(() => {
            setActiveTab('community');
          }, 2000);
        } else {
          setError('You must be logged in to join a group.');
        }
      } catch (err) {
        console.error("Error joining group:", err);
        setError('Failed to join the group. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    processJoin();
  }, [groupId, user, setActiveTab]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] px-4 animate-fade-in">
      <div className="glass-panel max-w-md w-full rounded-3xl p-8 border border-white/10 text-center relative overflow-hidden bg-[#111118]/80">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00f5d4]/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-brand-blue/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col items-center space-y-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00f5d4]/20 to-brand-blue/20 flex items-center justify-center border border-[#00f5d4]/30 shadow-lg">
            {loading ? (
              <Loader2 className="w-8 h-8 text-[#00f5d4] animate-spin" />
            ) : success ? (
              <CheckCircle className="w-8 h-8 text-[#00f5d4]" />
            ) : (
              <Shield className="w-8 h-8 text-red-400" />
            )}
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-white mb-2 tracking-wide">
              {loading ? 'Joining Group...' : success ? 'Joined Successfully!' : 'Invite Error'}
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              {loading && 'Please wait while we add you to the community...'}
              {success && `You are now a member of ${groupName || 'the group'}. Redirecting you to the chat...`}
              {error && error}
            </p>
          </div>
          
          {error && (
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors border border-white/10"
            >
              Return Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
