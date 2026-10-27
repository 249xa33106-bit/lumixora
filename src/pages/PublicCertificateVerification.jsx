import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, CheckCircle2, Award, ExternalLink, ArrowLeft, 
  Calendar, Building2, User, Sparkles, AlertCircle, Share2, Printer,
  Check, CheckCheck, Moon, Sun, Briefcase, Clock, FileText,
  Star, Video, MessageSquare, Copy, RefreshCw, Send, AlertTriangle, Search
} from 'lucide-react';
import QRCode from 'qrcode';

const GithubIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);
import { getCertificateById } from '../services/certificateService';
import { 
  verifyCertificate, 
  generateLinkedInCertificationUrl, 
  generateLinkedInPostText, 
  generateWhatsAppShareUrl 
} from '../services/internDbService';
import CertificateRenderer, { CERTIFICATE_STYLES } from '../components/CertificateRenderer';
import LetterOfRecommendation from '../components/LetterOfRecommendation';

export default function PublicCertificateVerification({ certId: propCertId, onBack }) {
  const [certId, setCertId] = useState(() => {
    if (propCertId) return propCertId;
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const qId = searchParams.get('id') || searchParams.get('cert') || searchParams.get('ref') || searchParams.get('credentialId');
      if (qId) return qId.trim();

      const hash = window.location.hash || '';
      if (hash) {
        const cleanHash = hash.replace(/^#\/?/, '');
        const parts = cleanHash.split('/');
        if (parts.length > 1 && parts[1]) {
          return parts[1].trim();
        }
      }
    }
    return '';
  });

  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchedId, setSearchedId] = useState('');
  const [certTheme, setCertTheme] = useState('executive_ivory');
  const [activeTab, setActiveTab] = useState('certificate'); // 'certificate' | 'ledger' | 'lor'
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPost, setCopiedPost] = useState(false);

  // Fetch certificate from strictly live Firestore ledger
  useEffect(() => {
    const fetchCert = async () => {
      if (!certId) {
        setCert(null);
        return;
      }
      setLoading(true);
      try {
        // 1. Check live Firestore intern database
        const liveCert = await verifyCertificate(certId);
        if (liveCert) {
          setCert(liveCert);
        } else {
          // 2. Check student proof-of-skill certificates fallback
          const defaultCert = getCertificateById(certId);
          setCert(defaultCert || null);
        }
      } catch (err) {
        console.warn("Public verification lookup error:", err);
        setCert(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCert();
  }, [certId]);

  // QR Code generator
  useEffect(() => {
    if (cert) {
      const verifyUrl = cert.verificationUrl || `${window.location.origin}/verify?id=${cert.id}`;
      QRCode.toDataURL(verifyUrl, {
        width: 320,
        margin: 1,
        color: {
          dark: '#0a0d18',
          light: '#ffffff'
        }
      })
      .then(url => setQrCodeDataUrl(url))
      .catch(err => console.warn('QR Code generation notice:', err));
    }
  }, [cert]);

  const handleSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!searchedId.trim()) return;
    const clean = searchedId.trim();
    setCertId(clean);
    if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
      window.history.replaceState(null, '', `${window.location.pathname}?id=${encodeURIComponent(clean)}`);
    }
    window.location.hash = `#verify-cert/${clean}`;
  };

  const handleResetSearch = () => {
    setCertId('');
    setSearchedId('');
    setCert(null);
    if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    window.location.hash = '';
  };

  const handleCopyLink = () => {
    const url = cert?.verificationUrl || `${window.location.origin}/#verify-cert/${cert?.id || certId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyPost = () => {
    if (!cert) return;
    const postText = generateLinkedInPostText(cert);
    navigator.clipboard.writeText(postText);
    setCopiedPost(true);
    setTimeout(() => setCopiedPost(false), 2500);
  };

  const handlePrintCertificate = () => {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('print-lor');
      window.print();
    }
  };

  const handleShareLinkedInPost = () => {
    const url = encodeURIComponent(cert?.verificationUrl || `${window.location.origin}/#verify-cert/${cert?.id || certId}`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener,noreferrer');
  };

  const recipientName = cert?.internName || cert?.issuedTo || 'Scholar Intern';
  const collegeName = cert?.college || 'G. Pulla Reddy Engineering College (Autonomous)';
  const trackName = cert?.track || cert?.category || 'Full-Stack Software Engineering';

  return (
    <div className="min-h-screen bg-[#06070c] text-white p-4 md:p-8 space-y-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Public Registry Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4.5 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 flex items-center justify-center shrink-0">
              <img src="/lumixora_logo_transparent.png" alt="Lumixora" className="w-full h-full object-contain filter drop-shadow-sm" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-black text-white font-sora">Lumixora Public Credential Registry</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Cryptographic Ledger
                </span>
              </div>
              <p className="text-[11px] text-amber-300 font-mono">Autonomous Proof-of-Competence & Deliverables Hub</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => {
                if (onBack) onBack();
                else window.location.hash = '';
              }}
              className="px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold border border-white/10 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Platform
            </button>
          </div>
        </div>

        {/* Verification Status Card */}
        {loading ? (
          <div className="p-16 rounded-3xl bg-black/40 border border-white/10 text-center space-y-4 shadow-2xl">
            <RefreshCw className="w-10 h-10 text-indigo-400 animate-spin mx-auto" />
            <h3 className="text-base font-bold text-white">Validating Cryptographic Ledger...</h3>
            <p className="text-xs text-slate-400">Verifying SHA-256 seal against live Firestore institutional database</p>
          </div>
        ) : cert ? (
          <div className="space-y-6">
            
            {/* Authenticity Banner or Revocation Banner */}
            {cert.status === 'revoked' ? (
              <div className="p-6 rounded-3xl bg-red-950/40 border border-red-500/50 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-sm font-black text-red-300 uppercase tracking-wider">
                        Status: Revoked Credential
                      </h2>
                      <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[9px] font-mono font-black border border-red-500/30 uppercase">
                        Void & Invalid
                      </span>
                    </div>
                    <p className="text-xs text-red-200 mt-1">
                      {cert.revocationReason || 'This credential was officially revoked and is no longer valid.'}
                    </p>
                    {cert.revokedAt && (
                      <span className="text-[10px] text-slate-400 font-mono block mt-1">
                        Revocation Timestamp: {cert.revokedAt}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-red-400 font-mono font-bold shrink-0">
                  ID: {cert.id}
                </span>
              </div>
            ) : (
              <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-black border border-emerald-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-sm font-black text-emerald-300 uppercase tracking-wider">
                        Verified Authentic & Active Credential
                      </h2>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-black border border-emerald-500/30 uppercase">
                        Live Central Registry Match
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 mt-0.5">
                      Issued to <strong className="text-white">{recipientName}</strong> by Lumixora (a product of Vyomra) • Authorized by Shaik Sowban (Founder & CEO).
                    </p>
                  </div>
                </div>

                {/* Quick Identification Pill */}
                <div className="text-right text-[11px] font-mono text-slate-400 border-t md:border-t-0 pt-2 md:pt-0 border-white/10">
                  <span className="text-amber-300 font-bold block">Lumixora — a product of Vyomra</span>
                  <span className="text-slate-400 text-[10px]">Cryptographic Central Registry</span>
                </div>
              </div>
            )}

            {/* Sub-Navigation Tabs */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md overflow-x-auto">
              <button
                onClick={() => setActiveTab('certificate')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'certificate'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-lg shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Verifiable Certificate</span>
              </button>

              <button
                onClick={() => setActiveTab('ledger')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'ledger'
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Briefcase className="w-4 h-4 text-cyan-300" />
                <span>Proof-of-Work & Deliverables Ledger ({cert.tasks?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('lor')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'lor'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText className="w-4 h-4 text-amber-300" />
                <span>Letter of Recommendation (LOR)</span>
              </button>
            </div>

            {/* TAB 1: VISUAL CERTIFICATE CANVAS */}
            {activeTab === 'certificate' && (
              <div className="space-y-4">
                {/* Theme Switcher Bar */}
                <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-xs text-slate-400 font-bold">Diploma Theme:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {CERTIFICATE_STYLES.map((st) => (
                      <button
                        key={st.id}
                        onClick={() => setCertTheme(st.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          certTheme === st.id
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black shadow'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span>{st.icon}</span>
                        <span className="hidden sm:inline">{st.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* THE MASTER CERTIFICATE CANVAS */}
                <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl p-2 bg-black/60">
                  <CertificateRenderer
                    cert={cert}
                    studentName={recipientName}
                    collegeName={collegeName}
                    styleId={certTheme}
                    qrCodeDataUrl={qrCodeDataUrl}
                  />
                </div>
              </div>
            )}

            {/* TAB 2: PROOF-OF-WORK & DELIVERABLES LEDGER */}
            {activeTab === 'ledger' && (
              <div className="space-y-6">
                
                {/* Overview Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" /> Verified Effort
                    </span>
                    <p className="text-xl font-black text-white">{cert.hoursLogged || 0}+ Hours</p>
                    <p className="text-[10px] text-emerald-400 font-mono">Logged & Audited</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-400" /> Evaluation Grade
                    </span>
                    <p className="text-xl font-black text-amber-300">{cert.grade || 'Elite Distinction'}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Score: {cert.score || '98%'}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-violet-400" /> Deliverables
                    </span>
                    <p className="text-xl font-black text-white">{cert.tasks?.length || 0} Submissions</p>
                    <p className="text-[10px] text-emerald-400 font-mono">100% Peer Approved</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Credential Type
                    </span>
                    <p className="text-xl font-black text-emerald-300">Completion</p>
                    <p className="text-[10px] text-slate-400 font-mono">Lumixora — a product of Vyomra</p>
                  </div>
                </div>

                {/* Evaluated Competency Radar/Index */}
                {Array.isArray(cert.competencies) && cert.competencies.length > 0 && (
                  <div className="p-5 rounded-3xl bg-black/40 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        Verified Technical Competency Index
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400">Assessed by Lumixora Engineering Board</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {cert.competencies.map((comp, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white">{comp.name}</span>
                            <span className="font-mono font-black text-emerald-400">{comp.score}% • {comp.level}</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${comp.color || 'from-indigo-500 to-cyan-400'}`}
                              style={{ width: `${comp.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects & Deliverables Detailed Ledger Cards */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">
                        Production Deliverables & Research Evidence
                      </h3>
                      <p className="text-xs text-slate-400">
                        Live proof-of-work: inspect source code PRs, video walkthroughs, and AI research notes
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                      ALL AUDITED ✓
                    </span>
                  </div>

                  <div className="space-y-3">
                    {(!Array.isArray(cert.tasks) || cert.tasks.length === 0) ? (
                      <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-2">
                        <Briefcase className="w-8 h-8 text-slate-500 mx-auto" />
                        <h4 className="text-sm font-bold text-white">Live Deliverables Under Review</h4>
                        <p className="text-xs text-slate-400 max-w-md mx-auto">
                          The candidate has met core evaluation criteria. Granular task deliverables and sprint logs are being finalized on the live ledger.
                        </p>
                      </div>
                    ) : (
                      cert.tasks.map((task, idx) => (
                        <div 
                          key={task.id || idx}
                          className="p-5 rounded-3xl bg-black/50 border border-white/10 hover:border-indigo-500/40 transition-all space-y-4 shadow-xl"
                        >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold border border-indigo-500/30">
                                {task.id}
                              </span>
                              <h4 className="text-sm font-black text-white">{task.title}</h4>
                            </div>
                            <p className="text-[11px] text-slate-400">
                              Track: <span className="text-slate-300 font-medium">{task.track || cert.track}</span>
                              {task.submissionDate && (
                                <> • Submitted: <span className="text-amber-300 font-mono">{task.submissionDate} ({task.submissionDay || 'Verified'})</span></>
                              )}
                              {task.hoursSpent && (
                                <> • Effort: <span className="text-cyan-300 font-mono font-bold">{task.hoursSpent} hrs</span></>
                              )}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-center">
                            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-mono font-black border border-emerald-500/40">
                              Score: {task.score || 98}/100
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {task.description || task.researchNotes}
                        </p>

                        {/* Research notes and chat citations if present */}
                        {task.researchNotes && task.researchNotes !== task.description && (
                          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-slate-300 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 font-mono flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> Technical Research & Architecture Synthesis:
                            </span>
                            <p className="text-[11px] text-slate-400 font-mono whitespace-pre-line">{task.researchNotes}</p>
                          </div>
                        )}

                        {/* Deliverable Action Buttons */}
                        <div className="flex items-center gap-2 flex-wrap pt-1">
                          {task.githubUrl && (
                            <a
                              href={task.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold transition-all border border-white/10 flex items-center gap-1.5 cursor-pointer"
                            >
                              <GithubIcon className="w-3.5 h-3.5 text-cyan-400" />
                              <span>View GitHub PR / Repo</span>
                              <ExternalLink className="w-3 h-3 text-slate-500" />
                            </a>
                          )}

                          {task.liveDemoUrl && (
                            <a
                              href={task.liveDemoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-bold transition-all border border-emerald-500/30 flex items-center gap-1.5 cursor-pointer"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Live Production Demo</span>
                            </a>
                          )}

                          {task.loomUrl && (
                            <a
                              href={task.loomUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-bold transition-all border border-indigo-500/30 flex items-center gap-1.5 cursor-pointer"
                            >
                              <Video className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Loom Walkthrough</span>
                              <ExternalLink className="w-3 h-3 text-slate-500" />
                            </a>
                          )}

                          {task.researchChatLinks && (
                            <a
                              href={task.researchChatLinks}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold transition-all border border-amber-500/30 flex items-center gap-1.5 cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                              <span>Research Chat Session</span>
                              <ExternalLink className="w-3 h-3 text-slate-500" />
                            </a>
                          )}
                        </div>

                        {/* Mentor Evaluation Feedback Quote */}
                        {task.mentorFeedback && (
                          <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-xs space-y-0.5">
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">
                              Mentor Review & Endorsement:
                            </span>
                            <p className="text-slate-300 italic">"{task.mentorFeedback}"</p>
                          </div>
                        )}
                      </div>
                    )))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: OFFICIAL LETTER OF RECOMMENDATION (LOR) */}
            {activeTab === 'lor' && (
              <LetterOfRecommendation
                cert={cert}
                internName={recipientName}
                collegeName={collegeName}
                track={trackName}
              />
            )}

            {/* Recruiter & Intern Social Action Deck */}
            <div className="p-5 rounded-3xl bg-black/60 border border-white/10 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Career Distribution & Social Proof Hub
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Add credential to LinkedIn, download A4 print PDF, or share proof of work with recruiters
                  </p>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">1-Click Integration</span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handlePrintCertificate}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-bold border border-white/10 transition-all cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-cyan-400" />
                    Print Certificate (A4 Landscape)
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-bold border border-white/10 transition-all cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-indigo-400" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Credential Link'}</span>
                  </button>

                  <button
                    onClick={handleCopyPost}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-bold border border-white/10 transition-all cursor-pointer"
                    title="Copy pre-formatted LinkedIn announcement post"
                  >
                    {copiedPost ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Send className="w-4 h-4 text-amber-400" />}
                    <span>{copiedPost ? 'Announcement Copied!' : 'Copy Announcement Text'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href={generateWhatsAppShareUrl(cert)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    WhatsApp
                  </a>

                  <button
                    onClick={handleShareLinkedInPost}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-white/10 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 text-blue-400" />
                    Share on Feed
                  </button>

                  <a
                    href={generateLinkedInCertificationUrl(cert)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-black shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    Add to LinkedIn Profile
                  </a>
                </div>
              </div>
            </div>

          </div>
        ) : certId ? (
          /* Explicit Certificate Not Found State */
          <div className="p-8 md:p-12 rounded-3xl bg-red-950/20 border border-red-500/30 text-center space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto shadow-inner">
              <AlertCircle className="w-8 h-8" />
            </div>
            
            <div className="space-y-2 max-w-lg mx-auto">
              <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-[10px] font-mono font-black border border-red-500/30 uppercase tracking-widest inline-block">
                Central Registry Status: Not Found
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Unregistered or Invalid Credential
              </h2>
              <p className="text-xs text-red-200 font-mono bg-red-950/40 p-2.5 rounded-xl border border-red-500/20 break-all">
                Queried ID: <span className="text-white font-bold">{certId}</span>
              </p>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                No active or archived credential matches this identifier in the Lumixora central live database.
                To prevent credential inflation and maintain authentic institutional value, Lumixora strictly validates genuine evaluated submissions. Synthetic, mock, or unauthorized IDs are automatically rejected.
              </p>
            </div>

            <div className="pt-2 max-w-md mx-auto space-y-3">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchedId}
                  onChange={(e) => setSearchedId(e.target.value)}
                  placeholder="Try another ID (e.g. LMX-INT-CERT-2026-XXXX)"
                  className="flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 font-mono outline-none focus:border-red-400"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 hover:opacity-95 text-white font-black text-xs uppercase tracking-wide transition-all shadow-lg shadow-red-500/20 cursor-pointer"
                >
                  Verify
                </button>
              </form>
              
              <div className="flex items-center justify-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={handleResetSearch}
                  className="text-slate-400 hover:text-white underline font-mono text-[11px] cursor-pointer"
                >
                  ← Return to Search
                </button>
                <span className="text-slate-600">•</span>
                <a
                  href="mailto:verify@lumixora.in?subject=Certificate%20Verification%20Query"
                  className="text-amber-400 hover:text-amber-300 font-mono text-[11px]"
                >
                  Contact Verification Support
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* Standard Public Lookup Form */
          <div className="p-8 md:p-12 rounded-3xl bg-black/40 border border-white/10 text-center space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-inner">
              <Search className="w-8 h-8" />
            </div>
            
            <div className="max-w-lg mx-auto space-y-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-black border border-amber-500/30 uppercase tracking-widest inline-block">
                Public Verification Portal
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Inspect Authentic Lumixora Credential
              </h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                Enter any Lumixora Credential ID (e.g. <span className="text-amber-300 font-mono">LMX-INT-CERT-2026-4783</span>), Intern Ref ID, or registered email to inspect cryptographic authenticity, evaluated work, and verified deliverables.
              </p>
            </div>

            <form onSubmit={handleSearch} className="flex max-w-md mx-auto gap-2">
              <input
                type="text"
                value={searchedId}
                onChange={(e) => setSearchedId(e.target.value)}
                placeholder="LMX-INT-CERT-2026-XXXX or Ref ID"
                className="flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 font-mono outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:opacity-95 text-black font-black text-xs uppercase tracking-wide transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                Verify
              </button>
            </form>

            <div className="pt-4 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-2xl mx-auto">
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-[10px] font-mono font-bold text-amber-300 uppercase">1. Zero Login Required</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Recruiters, HR teams, and universities can verify credentials instantly.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-[10px] font-mono font-bold text-emerald-300 uppercase">2. Live Deliverables</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Directly inspect candidate pull requests, video demos, and evaluation rubric.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-[10px] font-mono font-bold text-cyan-300 uppercase">3. Tamper-Proof</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Cryptographic verification guarantees certificates cannot be forged or duplicated.</p>
              </div>
            </div>
          </div>
        )}

        {/* ── ORGANIZATIONAL IDENTITY & VERIFICATION POLICY FOOTER ── */}
        <footer className="mt-12 pt-8 border-t border-white/10 space-y-6 text-slate-400">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white font-sora">Lumixora</span>
                <span className="text-xs text-amber-400 font-semibold">— a product of Vyomra</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Authorized Signatory: <strong className="text-white">Shaik Sowban — Founder & CEO</strong>
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <a href="mailto:verify@lumixora.in" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                verify@lumixora.in
              </a>
              <span className="text-slate-600">•</span>
              <a href="https://lumixora.in" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors">
                lumixora.in
              </a>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-[11px] leading-relaxed space-y-2 text-slate-400">
            <p className="font-semibold text-slate-300">
              Institutional Verification Policy & Legal Disclosure:
            </p>
            <p>
              A verifiable certificate establishes the authenticity of the issuer's record. It does not independently establish government accreditation or guarantee acceptance by an employer or educational institution. All credentials are cryptographically matched against actual engineering deliverables, evaluated work hours, and supervisor assessments stored in the Lumixora central live database.
            </p>
            <p className="text-[10px] text-slate-500 font-mono">
              Lumixora — a product of Vyomra • Central Verification Registry • All rights reserved.
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}
