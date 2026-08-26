import React, { useState, useMemo, useEffect } from 'react';
import { Flame, Clock, Award, TrendingUp, Search, Filter, Trophy, LogIn } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function FounderFrequentUsers({ usersList, onToggleBlock }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('tests_written');
  const [testSubmitters, setTestSubmitters] = useState([]);
  
  const isUserBlocked = (u) => {
    if (!u) return false;
    if (u.is_blocked === true || u.is_deleted === true) return true;
    const email = (u.email || '').toLowerCase().trim();
    const isSpecial = email === 'founder@lumixora.com' || email === '249xa33106@gmail.com';
    if (isSpecial) return false;
    if (email.endsWith('@gprec.ac.in')) return false;
    return !(u.is_blocked === false && (u.is_approved === true || u.isApproved === true));
  };
  
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'test_results'));
        const submittersMap = new Map();
        
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const uid = data.userId || `anonymous_${Math.random()}`;
          const dateStr = data.date ? new Date(data.date).toISOString().split('T')[0] : '';
          
          const existing = submittersMap.get(uid) || { tests_written: 0, last_test_date: '' };
          
          let cleanName = data.user || existing.name || 'Unknown User';
          if (cleanName.includes('{')) {
            cleanName = cleanName.substring(0, cleanName.indexOf('{')).trim() || 'Unknown User';
          }
          
          submittersMap.set(uid, {
            ...existing,
            uid,
            name: cleanName,
            email: data.userEmail || existing.email,
            tests_written: existing.tests_written + 1,
            last_test_date: dateStr > existing.last_test_date ? dateStr : existing.last_test_date
          });
        });
        setTestSubmitters(Array.from(submittersMap.values()));
      } catch (err) {
        console.error("Error fetching test submitters:", err);
      }
    };
    fetchSubmissions();
  }, []);

  const enrichedUsers = useMemo(() => {
    const mergedMap = new Map();

    const getMatchKey = (u) => {
      if (u.email && u.email.trim() !== '') return u.email.trim().toLowerCase();
      if (u.name && u.name.trim() !== '' && u.name !== 'Unknown User') return u.name.trim().toLowerCase();
      return u.uid || u.id;
    };
    
    if (usersList && Array.isArray(usersList)) {
      usersList.forEach(u => {
        const key = getMatchKey(u);
        const existing = mergedMap.get(key);
        if (existing) {
          mergedMap.set(key, { ...existing, ...u });
        } else {
          mergedMap.set(key, { ...u, matchKey: key });
        }
      });
    }
    
    testSubmitters.forEach(ts => {
      const key = getMatchKey(ts);
      const existing = mergedMap.get(key);
      
      if (existing) {
        mergedMap.set(key, {
          ...existing,
          tests_written: Math.max(existing.tests_written || 0, ts.tests_written),
          last_test_date: ts.last_test_date > (existing.last_test_date || '') ? ts.last_test_date : (existing.last_test_date || '')
        });
      } else {
        mergedMap.set(key, {
          id: ts.uid,
          uid: ts.uid,
          name: ts.name || 'Unknown User',
          email: ts.email || '',
          college: 'GPREC',
          tests_written: ts.tests_written,
          last_test_date: ts.last_test_date,
          streak: 1, 
          studyHours: 0,
          xp: 10 * ts.tests_written,
          matchKey: key
        });
      }
    });
    
    return Array.from(mergedMap.values());
  }, [usersList, testSubmitters]);

  const activeUsers = useMemo(() => {
    return enrichedUsers
      .filter(u => {
        const matchesSearch = 
          (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
          (u.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      })
      .sort((a, b) => {
        let valA = a[sortBy] || 0;
        let valB = b[sortBy] || 0;
        
        if (sortBy === 'completedDays') {
          valA = Array.isArray(a.completedDays) ? a.completedDays.length : 0;
          valB = Array.isArray(b.completedDays) ? b.completedDays.length : 0;
        }

        return valB - valA;
      });
  }, [enrichedUsers, searchTerm, sortBy]);

  const toggleSort = (field) => {
    setSortBy(field);
  };

  return (
    <div className="space-y-6 animate-fade-in text-white">
      <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-[#10101b] to-transparent">
        <h2 className="text-xl font-semibold text-gray-100 uppercase tracking-tight flex items-center gap-2 mb-2">
          <Flame className="w-6 h-6 text-brand-pink animate-pulse" />
          <span>Most Active Scholars</span>
        </h2>
        <p className="text-xs text-gray-400 font-medium">
          Monitor the most frequently engaged users based on login streaks, study hours, and resonance (AP).
        </p>

        <div className="flex flex-col md:flex-row gap-4 mt-6 items-center justify-between">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search active scholars..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-white placeholder-gray-500"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <span className="text-xs font-bold text-gray-400 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-brand-pink" /> Sort By:
            </span>
            <button
              onClick={() => toggleSort('tests_written')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                sortBy === 'tests_written' 
                  ? 'bg-brand-pink text-white border-brand-pink shadow-md' 
                  : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" /> Tests
            </button>
            <button
              onClick={() => toggleSort('xp')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                sortBy === 'xp' 
                  ? 'bg-brand-teal text-white border-brand-teal shadow-md' 
                  : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
              }`}
            >
              <Award className="w-3.5 h-3.5" /> AP (Aura)
            </button>
            <button
              onClick={() => toggleSort('loginCount')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                sortBy === 'loginCount' 
                  ? 'bg-purple-600 text-white border-purple-600 shadow-md' 
                  : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" /> Logins
            </button>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-[10px] text-gray-400 font-bold tracking-wide">
                <th className="p-4 pl-6 w-16 text-center">Rank</th>
                <th className="p-4">Scholar</th>
                <th className="p-4 text-center">Tests Written</th>
                <th className="p-4 text-center">Logins</th>
                <th className="p-4 text-right pr-6">Total AP</th>
                <th className="p-4 text-center">Management</th>
              </tr>
            </thead>
            <tbody>
              {activeUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-16 text-center text-xs text-gray-500 italic">
                    No active scholars found.
                  </td>
                </tr>
              ) : (
                activeUsers?.map((u, index) => {
                  const todayStr = new Date().toDateString();
                  const hasLoggedToday = u.lastLoginDate && new Date(u.lastLoginDate).toDateString() === todayStr;
                  const email = (u.email || '').toLowerCase().trim();
                  const isSpecial = email === 'founder@lumixora.com' || email === '249xa33106@gmail.com';
                  const blocked = isUserBlocked(u);

                  return (
                  <tr 
                    key={u.id}
                    className={`border-b border-white/5 transition-colors group ${blocked ? 'bg-amber-500/5 hover:bg-amber-500/10' : !hasLoggedToday ? 'bg-red-500/5 hover:bg-red-500/10' : 'hover:bg-white/[0.02]'}`}
                  >
                    <td className="p-4 pl-6 text-center">
                      {index < 3 ? (
                        <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center border ${
                          index === 0 ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' :
                          index === 1 ? 'bg-gray-300/20 border-gray-300/50 text-gray-300' :
                          'bg-amber-700/20 border-amber-700/50 text-amber-600'
                        }`}>
                          <Trophy className="w-4 h-4" />
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-gray-500">#{index + 1}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${blocked ? 'bg-amber-500/20 text-amber-400 font-bold text-xs' : !hasLoggedToday ? 'bg-red-500/20 text-red-500' : 'icon-3d-pink'}`}>
                          {u.name ? u.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'S'}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-xs font-bold block ${blocked ? 'text-amber-300' : !hasLoggedToday ? 'text-red-400' : 'text-gray-100'}`}>{u.name || 'Unknown'}</span>
                            {u.email && (
                              <span className="text-[10px] text-gray-400 font-mono">({u.email})</span>
                            )}
                          </div>
                          <span className={`text-[10px] font-semibold block ${blocked ? 'text-amber-400/70' : !hasLoggedToday ? 'text-red-500/70' : 'text-gray-500'}`}>
                            {u.college || 'GPREC'} • {u.department || 'CSE'}
                          </span>
                        </div>
                        {blocked ? (
                          <span className="ml-2 px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 uppercase tracking-widest border border-amber-500/30">
                            Login Blocked
                          </span>
                        ) : !email.endsWith('@gprec.ac.in') && !isSpecial ? (
                          <span className="ml-2 px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 uppercase tracking-widest border border-emerald-500/30">
                            Access Allowed
                          </span>
                        ) : !hasLoggedToday ? (
                          <span className="ml-2 px-2 py-0.5 rounded text-[9px] font-bold bg-red-500/20 text-red-400 uppercase tracking-widest border border-red-500/30">
                            Missing
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-brand-teal/10 px-2.5 py-1 rounded-lg border border-white/10">
                        <TrendingUp className="w-3.5 h-3.5 text-brand-teal" />
                        <span className="text-xs font-bold text-white">
                          {u.tests_written || 0}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-white/10">
                        <LogIn className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-xs font-bold text-white">
                          {u.loginCount || 0}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <span className="text-xs font-semibold text-brand-teal">{u.xp || 0} AP</span>
                    </td>
                    <td className="p-4 text-center">
                      {!isSpecial && onToggleBlock && (
                        <button 
                          onClick={() => onToggleBlock(u)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold tracking-wide border transition-all cursor-pointer ${
                            blocked
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-white'
                              : 'bg-red-500/10 border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white'
                          }`}
                        >
                          {blocked ? 'Unblock' : 'Block'}
                        </button>
                      )}
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
