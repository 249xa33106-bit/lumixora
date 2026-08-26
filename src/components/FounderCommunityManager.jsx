import React, { useState } from 'react';
import { Mail, Copy, Check, Users, Link as LinkIcon, Share2 } from 'lucide-react';

export default function FounderCommunityManager() {
  const [department, setDepartment] = useState('CSE');
  const [section, setSection] = useState('A');
  const [year, setYear] = useState('1st Year');
  const [copied, setCopied] = useState(false);

  const generateInviteLink = () => {
    // Current origin of the app
    const origin = window.location.origin;
    // Format: ?invite=CSE-A-2nd-Year
    const formattedYear = year.replace(/\s+/g, '-');
    const inviteParam = `${department.toUpperCase()}-${section.toUpperCase()}-${formattedYear}`;
    return `${origin}/#join-group/${inviteParam}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generateInviteLink());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = () => {
    const link = generateInviteLink();
    const subject = encodeURIComponent("Join Your Class Community on Lumixora!");
    const body = encodeURIComponent(`Hello,\n\nYou have been invited to join your official class community group on Lumixora.\n\nClick the link below to sign up and instantly join the group for ${department} Section ${section}, ${year}:\n\n${link}\n\nBest,\nLumixora Team`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden bg-gradient-to-br from-[#00f5d4]/5 to-transparent">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f5d4]/10 rounded-full blur-3xl"></div>
        
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00f5d4]/20 to-brand-blue/20 flex items-center justify-center border border-[#00f5d4]/30">
            <Users className="w-6 h-6 text-[#00f5d4]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">Class Community Invites</h2>
            <p className="text-sm text-gray-400">Generate and send invite links for specific class groups</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 relative z-10">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Branch / Dept</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. CSE"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00f5d4]/50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Section</label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00f5d4]/50 appearance-none"
            >
              {['A', 'B', 'C', 'D', 'E', 'None'].map(s => (
                <option key={s} value={s}>Section {s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Year</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00f5d4]/50 appearance-none"
            >
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="p-4 bg-black/50 border border-white/5 rounded-2xl relative z-10">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Generated Invite Link</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#00f5d4] overflow-hidden text-ellipsis whitespace-nowrap font-mono">
              {generateInviteLink()}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-all border border-white/10"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleSendEmail}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#00f5d4] hover:bg-[#00f5d4]/90 text-black text-sm font-extrabold transition-all"
              >
                <Mail className="w-4 h-4" />
                Send via Email
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            When a student clicks this link, their branch, section, and year will be pre-filled automatically on the registration page, instantly placing them into the correct group chat.
          </p>
        </div>
      </div>
    </div>
  );
}
