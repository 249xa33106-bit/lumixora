import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, CheckCircle2, Award, ExternalLink, ArrowLeft, 
  Calendar, Building2, User, Sparkles, AlertCircle, Share2, Printer,
  Check, CheckCheck, Moon, Sun
} from 'lucide-react';
import QRCode from 'qrcode';
import { getCertificateById, generateLinkedInAddUrl } from '../services/certificateService';
import CertificateRenderer, { CERTIFICATE_STYLES } from '../components/CertificateRenderer';

export default function PublicCertificateVerification({ certId: propCertId, onBack }) {
  const [certId, setCertId] = useState(() => {
    if (propCertId) return propCertId;
    const hash = window.location.hash || '';
    const parts = hash.split('/');
    if (parts.length > 1) {
      return parts[1];
    }
    return '';
  });

  const [cert, setCert] = useState(null);
  const [searchedId, setSearchedId] = useState('');
  const [certTheme, setCertTheme] = useState('cyber'); // 'cyber' | 'gold' | 'executive' | 'emerald' | 'sapphire'
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  useEffect(() => {
    if (certId) {
      const found = getCertificateById(certId);
      setCert(found);
    }
  }, [certId]);

  useEffect(() => {
    if (cert) {
      const verifyUrl = cert.verificationUrl || `${window.location.origin}/#verify-cert/${cert.id}`;
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
  }, [cert]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchedId.trim()) {
      const clean = searchedId.trim().toUpperCase();
      setCertId(clean);
      window.location.hash = `#verify-cert/${clean}`;
      const found = getCertificateById(clean);
      setCert(found);
    }
  };

  return (
    <div className="min-h-screen bg-[#06070c] text-white p-4 md:p-8 space-y-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Public Registry Header */}
        <div className="flex items-center justify-between p-4.5 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 flex items-center justify-center shrink-0">
              <img src="/lumixora_logo_transparent.png" alt="Lumixora" className="w-full h-full object-contain filter drop-shadow-sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white font-sora">Lumixora Public Credential Registry</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30 uppercase tracking-wider">
                  Live Cryptographic Ledger
                </span>
              </div>
              <p className="text-[11px] text-amber-300 font-mono">Autonomous Proof-of-Skill Cryptographic Seal</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
        {cert ? (
          <div className="space-y-6">
            
            {/* Authenticity Banner */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-black border border-emerald-500/40 flex items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-black text-emerald-300 uppercase tracking-wider">
                      Verified Authentic & Active Credential
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-black border border-emerald-500/30 uppercase">
                      Immutable & Tamper-Proof
                    </span>
                  </div>
                  <p className="text-xs text-gray-300">
                    This credential was officially issued by Lumixora Autonomous Board and recorded in the cryptographic registry.
                  </p>
                </div>
              </div>

              {/* Style Switcher */}
              <div className="flex flex-wrap gap-1 bg-white/5 p-1 rounded-xl border border-white/10 shrink-0">
                {CERTIFICATE_STYLES.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setCertTheme(st.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      certTheme === st.id
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black shadow'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <span>{st.icon}</span>
                    <span className="hidden md:inline">{st.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* THE MASTER CERTIFICATE CANVAS */}
            <CertificateRenderer
              cert={cert}
              studentName={cert.issuedTo}
              collegeName={cert.college}
              styleId={certTheme}
              qrCodeDataUrl={qrCodeDataUrl}
            />

            {/* Recruiter Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-black/40 border border-white/10 shadow-xl">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-bold border border-white/10 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-cyan-400" />
                  Print / Save PDF
                </button>
              </div>

              <a
                href={generateLinkedInAddUrl(cert)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-black shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                Add to LinkedIn Profile
              </a>
            </div>

          </div>
        ) : (
          /* Search / Lookup Form */
          <div className="p-8 rounded-3xl bg-black/40 border border-white/10 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-3xl mx-auto">
              🔍
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Look Up Verified Credential</h2>
              <p className="text-xs text-gray-400 mt-1">
                Enter any Vyomra Credential ID (e.g. <span className="text-amber-300 font-mono">LMX-CERT-2026-8891</span>) to view official cryptographic proof.
              </p>
            </div>

            <form onSubmit={handleSearch} className="flex max-w-md mx-auto gap-2">
              <input
                type="text"
                value={searchedId}
                onChange={(e) => setSearchedId(e.target.value)}
                placeholder="LMX-CERT-2026-XXXX"
                className="flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 uppercase font-mono outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:opacity-95 text-black font-black text-xs uppercase tracking-wide transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                Verify
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
