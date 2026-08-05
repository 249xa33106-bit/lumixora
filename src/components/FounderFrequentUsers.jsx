import React, { useState, useMemo, useEffect } from 'react';
import { Flame, Clock, Award, TrendingUp, Search, Filter, Trophy } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function FounderFrequentUsers({ usersList }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('tests_written'); // Default to tests_written since we care about test submitters
  const [testSubmitters, setTestSubmitters] = useState([]);
  
  // Fetch actual test submissions to ensure we capture users whose test stats didn't sync to their user doc
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
          
          submittersMap.set(uid, {
            ...existing,
            uid,
            name: data.user || existing.name,
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
    
    // Add base users from usersList
    if (usersList && Array.isArray(usersList)) {
      usersList.forEach(u => mergedMap.set(u.uid || u.id, { ...u }));
    }
    
    // Merge test submitter data
    testSubmitters.forEach(ts => {
      const existing = mergedMap.get(ts.uid);
      if (existing) {
        mergedMap.set(ts.uid, {
          ...existing,
          tests_written: Math.max(existing.tests_written || 0, ts.tests_written),
          last_test_date: ts.last_test_date || existing.last_test_date
        });
      } else {
        // If user isn't in usersList but submitted a test
        mergedMap.set(ts.uid, {
          id: ts.uid,
          uid: ts.uid,
          name: ts.name || 'Unknown User',
          email: ts.email || '',
          college: 'Unknown',
          tests_written: ts.tests_written,
          last_test_date: ts.last_test_date,
          streak: 1, 
          studyHours: 0,
          xp: 10 * ts.tests_written
        });
      }
    });
    
    return Array.from(mergedMap.values());
  }, [usersList, testSubmitters]);

  const activeUsers = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return enrichedUsers
      .filter(u => {
        const hasEngagement = u.last_test_date === todayStr || (u.tests_written || 0) > 0 || (u.streak || 0) > 0 || (u.studyHours || 0) > 0;
        const matchesSearch = 
          (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
          (u.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch && hasEngagement;
      })
      .sort((a, b) => {
        let valA = a[sortBy] || 0;
        let valB = b[sortBy] || 0;
        
        // If sorting by completedDays, we want to sort by the length of the array
        if (sortBy === 'completedDays') {
          valA = Array.isArray(a.completedDays) ? a.completedDays.length : 0;
          valB = Array.isArray(b.completedDays) ? b.completedDays.length : 0;
        }

        return valB - valA; // Descending order
      })
      .slice(0, 50); // Top 50 most active users
  }, [usersList, searchTerm, sortBy]);

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

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <span className="text-[10px] text-gray-500 font-bold uppercase flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Sort By:
            </span>
            <div className="flex bg-black/40 rounded-xl border border-white/5 p-1">
              <button
                onClick={() => toggleSort('streak')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 ${
                  sortBy === 'streak' ? 'bg-brand-pink/20 text-brand-pink' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5" /> Streaks
              </button>
              <button
                onClick={() => toggleSort('studyHours')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 ${
                  sortBy === 'studyHours' ? 'bg-brand-blue/20 text-brand-blue' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" /> Study Hrs
              </button>
              <button
                onClick={() => toggleSort('xp')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 ${
                  sortBy === 'xp' ? 'bg-brand-teal/20 text-brand-teal' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5" /> AP
              </button>
              <button
                onClick={() => toggleSort('tests_written')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 ${
                  sortBy === 'tests_written' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" /> Tests
              </button>
            </div>
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
                <th className="p-4 text-center">Daily Streak</th>
                <th className="p-4 text-center">Study Hours</th>
                <th className="p-4 text-center">Tests Written</th>
                <th className="p-4 text-right pr-6">Total AP</th>
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
                activeUsers.map((u, index) => (
                  <tr 
                    key={u.id}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
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
                        <div className="w-9 h-9 rounded-full icon-3d-pink flex items-center justify-center">
{u.name ? u.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'S'}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-gray-100 block">{u.name || 'Unknown'}</span>
                          <span className="text-[10px] text-gray-500 font-semibold block">{u.college || 'GPREC'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-brand-pink/10 px-2.5 py-1 rounded-lg border border-white/10">
                        <Flame className={`w-3.5 h-3.5 ${u.streak > 0 ? 'text-brand-pink' : 'text-gray-500'}`} />
                        <span className="text-xs font-bold text-white">{u.streak || 0}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-brand-blue/10 px-2.5 py-1 rounded-lg border border-white/10">
                        <Clock className="w-3.5 h-3.5 text-brand-blue" />
                        <span className="text-xs font-bold text-white">{u.studyHours || 0}h</span>
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
                    <td className="p-4 pr-6 text-right">
                      <span className="text-xs font-semibold text-brand-teal">{u.xp || 0} AP</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
