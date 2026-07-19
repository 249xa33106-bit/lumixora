import React, { useState } from 'react';
import { AlertTriangle, Send, Sparkles, Cpu, Terminal, ArrowRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { Capacitor } from '@capacitor/core';

export default function ReportBug({ user }) {
  const { addToast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('Medium');
  const [steps, setSteps] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      addToast({ message: 'Please fill in all required fields.', type: 'error' });
      return;
    }

    const isNative = Capacitor.isNativePlatform();
    let newWindow = null;

    if (!isNative) {
      newWindow = window.open('', '_blank');
    }

    setLoading(true);

    try {
      const targetPhone = "919346476055"; // WhatsApp number
      const userEmail = user?.email || 'Anonymous Student';
      const text = `🚨 *BUG REPORT - LUMIXORA*\n\n`
        + `👤 *Reported By:* ${userEmail}\n`
        + `📌 *Title:* ${title.trim()}\n`
        + `🔥 *Severity:* ${severity}\n\n`
        + `📝 *Description:* ${description.trim()}\n\n`
        + `👣 *Steps to Reproduce:* ${steps.trim() || 'Not provided'}\n\n`
        + `📱 *Platform:* ${isNative ? 'Native Mobile App' : 'Web Browser'}`;

      const whatsappUrl = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(text)}`;

      if (isNative) {
        window.open(whatsappUrl, '_system');
      } else if (newWindow) {
        newWindow.location.href = whatsappUrl;
      } else {
        window.open(whatsappUrl, '_blank');
      }

      addToast({ message: 'Opening WhatsApp to send your bug report!', type: 'success' });
      setTitle('');
      setDescription('');
      setSteps('');
    } catch (err) {
      console.error(err);
      if (newWindow) newWindow.close();
      addToast({ message: 'Failed to report bug. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="relative rounded-3xl p-8 overflow-hidden glass-panel border border-border-glass bg-gradient-to-br from-red-500/10 via-slate-900/40 to-brand-purple/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-red-500/10 to-brand-purple/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/35 text-[10px] font-bold text-red-400 uppercase tracking-wider">
            <AlertTriangle className="w-3 h-3 animate-pulse" />
            <span>Bug & Issue Tracker</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
            Report a <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-brand-purple">Technical Bug</span>
          </h1>
          <p className="text-xs text-gray-400 leading-relaxed">
            Found something broken, misaligned, or functioning incorrectly? Submit a report with detailed steps and send it directly to the engineering team.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 bg-black/25 text-left">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Title */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-red-400" />
                <span>Issue Title (e.g. Code Editor crashes on run) *</span>
              </label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a brief title" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-red-400 outline-none transition-colors"
                required
              />
            </div>

            {/* Severity */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-red-400" />
                <span>Severity Level *</span>
              </label>
              <select 
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-xs text-gray-300 focus:border-red-400 outline-none transition-colors appearance-none"
              >
                <option value="Low">Low (Visual glitch)</option>
                <option value="Medium">Medium (Incorrect function)</option>
                <option value="High">High (Feature not loading)</option>
                <option value="Critical">Critical (App crash/freeze)</option>
              </select>
            </div>

          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300 block">
              Detailed Description *
            </label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what went wrong. What was the expected behavior versus what actually happened?"
              rows="4"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white focus:border-red-400 outline-none transition-colors resize-none"
              required
            ></textarea>
          </div>

          {/* Steps to Reproduce */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300 block">
              Steps to Reproduce (Optional)
            </label>
            <textarea 
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder="1. Go to tab X&#10;2. Click on Y&#10;3. Observe crash Z"
              rows="3"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white focus:border-red-400 outline-none transition-colors resize-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-red-500 to-brand-purple text-white hover:opacity-90 transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Submitting Bug...</span>
              ) : (
                <>
                  <span>Send Report</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
