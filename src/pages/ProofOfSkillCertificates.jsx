import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, Trophy, Share2, Download, CheckCircle2, ShieldCheck, 
  ExternalLink, Copy, Sparkles, Filter, Search, ArrowLeft,
  QrCode, Calendar, BookOpen, Layers, Check, Moon, Sun, CheckCheck,
  Lock, ArrowRight, Clock, FileCheck, CheckCircle
} from 'lucide-react';
import QRCode from 'qrcode';
import { 
  getStudentCertificates, BADGES_LIST, generateLinkedInAddUrl, getCertificateById, resolveRealStudentInfo, getEvaluatedBadges, calculateStudentRealProgress 
} from '../services/certificateService';
import { useToast } from '../context/ToastContext';
import CertificateRenderer, { CERTIFICATE_STYLES } from '../components/CertificateRenderer';

export default function ProofOfSkillCertificates({ user, setActiveTab }) {
  const { addToast } = useToast();
  const [certificates, setCertificates] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [copiedId, setCopiedId] = useState(null);
  const [searchVerifyId, setSearchVerifyId] = useState('');
  const [certTheme, setCertTheme] = useState('cyber'); // 'cyber' | 'gold' | 'executive' | 'emerald' | 'sapphire'
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const certRef = useRef(null);

  const realInfo = resolveRealStudentInfo(user);
  const studentName = realInfo.name;
  const collegeName = realInfo.college;

  const evaluatedBadges = getEvaluatedBadges(user);
  const unlockedBadgesCount = evaluatedBadges.filter(b => b.isUnlocked).length;

  useEffect(() => {
    const certs = getStudentCertificates(user);
    setCertificates(certs);
    if (certs.length > 0) {
      setSelectedCert(certs[0]);
    }
  }, [user]);

  // Generate real QR code when selected certificate changes
  useEffect(() => {
    if (selectedCert) {
      const verifyUrl = selectedCert.verificationUrl || `${window.location.origin}/#verify-cert/${selectedCert.id}`;
      QRCode.toDataURL(verifyUrl, {
        width: 300,
        margin: 1,
        color: {
          dark: '#0a0d18',
          light: '#ffffff'
        }
      })
      .then(url => setQrCodeDataUrl(url))
      .catch(err => console.warn('QR Code generation error:', err));
    }
  }, [selectedCert]);

  const handleCopyLink = (cert) => {
    const url = cert.verificationUrl || `${window.location.origin}/#verify-cert/${cert.id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(cert.id);
    addToast?.({ type: 'success', message: `Official verification link copied: ${cert.id}` });
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handlePrintCertificate = () => {
    if (!selectedCert?.isUnlocked) {
      addToast?.({ 
        type: 'warning', 
        message: '🔒 Certificate Locked! You must complete the course (100%) and pass the Grand Test to unlock and print your official certificate.' 
      });
      return;
    }
    window.print();
  };

  const handleLinkedInShare = (e) => {
    if (!selectedCert?.isUnlocked) {
      e.preventDefault();
      addToast?.({ 
        type: 'warning', 
        message: '🔒 Certificate Locked! Complete the course (100%) and pass the Grand Test to earn and export this credential to LinkedIn.' 
      });
    }
  };

  const filteredCerts = certificates.filter(c => {
    if (activeFilter === 'all') return true;
    const cat = (c.category || '').toLowerCase();
    if (activeFilter === 'courses') return cat.includes('course');
    if (activeFilter === 'languages') return cat.includes('language');
    if (activeFilter === 'problems') return cat.includes('problem') || cat.includes('dsa');
    if (activeFilter === 'weekly-award') return cat.includes('weekly') || cat.includes('award');
    return true;
  });

  return (
    <div className="min-h-screen bg-[#06070c] text-white p-4 md:p-8 space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#140e04] via-[#0d1424] to-[#080b14] border border-amber-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center text-3xl shadow-xl shadow-amber-500/30 border border-amber-300/40">
            🏆
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white font-sora">
                Proof-of-Skill Badges & Verified Credentials
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/40">
                LinkedIn Verified
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              Cryptographically verified academic diplomas, dynamic scannable QR verification hashes, and instant 1-click LinkedIn export.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab?.('courses')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold border border-cyan-500/40 transition-all cursor-pointer shadow-lg shadow-cyan-500/10"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            Courses Portal
          </button>
          <button
            onClick={() => setActiveTab?.('dashboard')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold border border-white/10 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </button>
        </div>
      </div>

      {/* Verified Badges Shelf (Live Real Progress) */}
      <div className="p-6 rounded-3xl bg-black/40 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2 text-white">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Verified Competency Badges
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Badges earned through courses completed, programming languages, coding problem milestones & weekly highest score awards
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full border text-xs font-bold font-mono ${
            unlockedBadgesCount > 0 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-white/5 border-white/10 text-amber-300'
          }`}>
            {unlockedBadgesCount} / {evaluatedBadges.length} Badges Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {evaluatedBadges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                badge.isUnlocked
                  ? 'bg-gradient-to-b from-white/[0.08] to-transparent border-emerald-400/40 shadow-lg shadow-emerald-500/10'
                  : 'bg-white/[0.02] border-white/5 hover:border-white/15'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-2xl mx-auto transition-transform ${
                badge.isUnlocked
                  ? 'bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-cyan-500/20 border-amber-400/30 shadow-inner'
                  : 'bg-white/5 border-white/10 opacity-70 grayscale'
              }`}>
                {badge.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-white line-clamp-1">{badge.name}</p>
                <p className="text-[10px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">{badge.description}</p>
              </div>
              {badge.isUnlocked ? (
                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  🔒 {badge.progressText}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Certificate Viewer & Selector Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Certificate Selector & Controls */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              My Credentials ({certificates.length})
            </h3>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-1 bg-white/5 p-1 rounded-2xl border border-white/5 text-[10px]">
            {[
              { id: 'all', label: 'All' },
              { id: 'courses', label: 'Courses' },
              { id: 'languages', label: 'Languages' },
              { id: 'problems', label: 'Problems' },
              { id: 'weekly-award', label: 'Weekly Awards' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  activeFilter === f.id ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Certificate Cards List */}
          <div className="space-y-3">
            {filteredCerts.map((cert) => {
              const isSelected = selectedCert?.id === cert.id;
              return (
                <button
                  key={cert.id}
                  onClick={() => setSelectedCert(cert)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all space-y-2 cursor-pointer ${
                    isSelected 
                      ? 'bg-gradient-to-r from-amber-950/40 via-[#10192e] to-black border-amber-400/60 shadow-xl shadow-amber-500/10' 
                      : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/5 text-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[10px] font-mono font-bold">
                      {cert.id}
                    </span>
                    <span className={`text-[10px] font-bold ${cert.isUnlocked ? 'text-emerald-400 font-black' : 'text-amber-400/90'}`}>
                      {cert.isUnlocked ? '✓ ' + cert.grade : '🔒 ' + (cert.currentProgress || 'In Progress')}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{cert.title}</h4>
                    <p className="text-[11px] text-gray-400 mt-1">{cert.category} • {cert.isUnlocked ? 'Issued ' + cert.issueDate : 'Milestone Track'}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Recruiter / Quick Verify Tool */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
            <label className="text-[11px] font-bold text-gray-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Recruiter Quick Hash Lookup
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchVerifyId}
                onChange={(e) => setSearchVerifyId(e.target.value)}
                placeholder="Enter LMX-CERT-XXXX..."
                className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-gray-500 outline-none uppercase font-mono"
              />
              <button
                onClick={() => {
                  if (searchVerifyId.trim()) {
                    window.location.hash = `#verify-cert/${searchVerifyId.trim().toUpperCase()}`;
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:opacity-90 text-black font-black text-xs transition-all cursor-pointer shadow-md"
              >
                Verify
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live High-Resolution Certificate Canvas & External Progress Track */}
        {selectedCert && (
          <div className="lg:col-span-8 space-y-4">
            
            {/* Top Toolbar: Multi-Style Theme Switcher & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-400 font-bold">Certificate Style:</span>
                <div className="flex flex-wrap gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
                  {CERTIFICATE_STYLES.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setCertTheme(st.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        certTheme === st.id
                          ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white font-black shadow-lg shadow-cyan-500/20'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{st.icon}</span>
                      <span>{st.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedCert.isUnlocked ? (
                  <span className="text-[11px] text-emerald-400 font-mono font-bold flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> Issued & Cryptographically Verified
                  </span>
                ) : (
                  <span className="text-[11px] text-amber-400 font-mono font-bold flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                    <Lock className="w-3.5 h-3.5 text-amber-400" /> Requirements Pending
                  </span>
                )}
              </div>
            </div>

            {/* ─── EXTERNAL PREREQUISITES & PROGRESSION TRACKER (OUTSIDE CERTIFICATE) ──── */}
            {!selectedCert.isUnlocked && (
              <div className="p-5 rounded-3xl bg-gradient-to-r from-[#171206] via-[#101728] to-[#0a0f1d] border border-amber-500/30 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 font-bold">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-white font-sora">
                        Prerequisites Required to Unlock Official Certificate
                      </h4>
                      <p className="text-[11px] text-gray-300">
                        Complete both institutional requirements below to issue and unlock your verified 16:9 credential.
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold self-start sm:self-auto">
                    {selectedCert.hasCompletedCourse && selectedCert.hasCompletedGrandTest 
                      ? '2/2 Complete' 
                      : (selectedCert.hasCompletedCourse || selectedCert.hasCompletedGrandTest ? '1/2 Complete' : '0/2 Complete')}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Prerequisite 1: Course Syllabus */}
                  <div className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 transition-all ${
                    selectedCert.hasCompletedCourse 
                      ? 'bg-emerald-500/10 border-emerald-500/40' 
                      : 'bg-black/40 border-white/10 hover:border-amber-500/30'
                  }`}>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          {selectedCert.hasCompletedCourse ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <BookOpen className="w-4 h-4 text-cyan-400" />}
                          1. Complete Course Curriculum
                        </span>
                        <span className={`text-[11px] font-mono font-bold ${selectedCert.hasCompletedCourse ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {selectedCert.hasCompletedCourse ? '100% Done' : `${selectedCert.courseProgress || 0}%`}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        Complete 100% of all modular syllabus units and code exercises in the official curriculum.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      {selectedCert.hasCompletedCourse ? (
                        <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Requirement Satisfied
                        </span>
                      ) : (
                        <button
                          onClick={() => setActiveTab?.('courses')}
                          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-black font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20"
                        >
                          <BookOpen className="w-3.5 h-3.5" /> Go to Course Syllabus <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Prerequisite 2: Grand Assessment Test */}
                  <div className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 transition-all ${
                    selectedCert.hasCompletedGrandTest 
                      ? 'bg-emerald-500/10 border-emerald-500/40' 
                      : 'bg-black/40 border-white/10 hover:border-amber-500/30'
                  }`}>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          {selectedCert.hasCompletedGrandTest ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <FileCheck className="w-4 h-4 text-amber-400" />}
                          2. Pass Grand Assessment Test
                        </span>
                        <span className={`text-[11px] font-mono font-bold ${selectedCert.hasCompletedGrandTest ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {selectedCert.hasCompletedGrandTest ? `Passed (${selectedCert.grandTestScore || 90}%)` : 'Min. ≥60%'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        Pass the rigorous timed grand assessment with 60% or higher to validate hands-on engineering mastery.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      {selectedCert.hasCompletedGrandTest ? (
                        <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Requirement Satisfied
                        </span>
                      ) : (
                        <button
                          onClick={() => setActiveTab?.('tests')}
                          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:opacity-95 text-black font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
                        >
                          <FileCheck className="w-3.5 h-3.5" /> Take Grand Assessment Test <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── THE MASTER CERTIFICATE CANVAS (Strict 16:9 Landscape Aspect Ratio) ─── */}
            <CertificateRenderer
              cert={selectedCert}
              studentName={studentName}
              collegeName={collegeName}
              styleId={certTheme}
              qrCodeDataUrl={qrCodeDataUrl}
              certRef={certRef}
            />

            {/* Action Bar (LinkedIn / Print / Share) */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-black/40 border border-white/10 shadow-xl">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyLink(selectedCert)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-bold border border-white/10 transition-all cursor-pointer"
                >
                  {copiedId === selectedCert.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
                  {copiedId === selectedCert.id ? 'Public Proof Link Copied!' : 'Copy Verification URL'}
                </button>
                <button
                  onClick={handlePrintCertificate}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-bold border border-white/10 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  Print / Save PDF
                </button>
              </div>

              <a
                href={selectedCert?.isUnlocked ? generateLinkedInAddUrl(selectedCert) : '#'}
                onClick={handleLinkedInShare}
                target={selectedCert?.isUnlocked ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black shadow-lg transition-all cursor-pointer ${
                  selectedCert?.isUnlocked
                    ? 'bg-[#0A66C2] hover:bg-[#004182] text-white shadow-blue-500/20'
                    : 'bg-white/10 text-gray-400 hover:bg-white/15'
                }`}
              >
                <Share2 className="w-4 h-4" />
                Add to LinkedIn Profile
              </a>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
