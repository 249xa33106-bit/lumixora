import React, { useState } from 'react';
import { Mail, Phone, MapPin, Sparkles, MessageSquare, Send } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { Capacitor } from '@capacitor/core';

const LinkedinIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const InstagramIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function ContactUs({ user }) {
  const { addToast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !name.trim() || !email.trim()) return;
    
    const isNative = Capacitor.isNativePlatform();
    let newWindow = null;

    if (!isNative) {
      newWindow = window.open('', '_blank');
    }

    setLoading(true);
    
    try {
      const targetPhone = "919346476055";
      const text = `💬 *NEW INQUIRY - LUMIXORA*\n\n`
        + `👤 *Name:* ${name.trim()}\n`
        + `📧 *Email:* ${email.trim()}\n\n`
        + `✉️ *Message:* ${message.trim()}`;

      const whatsappUrl = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(text)}`;

      if (isNative) {
        window.open(whatsappUrl, '_system');
      } else if (newWindow) {
        newWindow.location.href = whatsappUrl;
      } else {
        window.open(whatsappUrl, '_blank');
      }

      addToast({ message: 'Opening WhatsApp to connect with Admin/Founder!', type: 'success' });
      setMessage('');
    } catch (error) {
      console.error(error);
      if (newWindow) newWindow.close();
      addToast({ message: 'Failed to send query. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="relative rounded-3xl p-8 overflow-hidden glass-panel border border-border-glass bg-gradient-to-br from-brand-purple/10 via-slate-900/40 to-brand-teal/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-brand-teal/10 to-brand-purple/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/35 text-[10px] font-bold text-brand-pink uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>Lumixora Portal Desk</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
            Connect with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-purple">Admin / Founder</span>
          </h1>
          <p className="text-xs text-gray-400 leading-relaxed">
            Have questions about Lumixora? Need technical support or want to request custom academic resources? Our support team is here to assist you 24/7.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Side: Contact Information Cards */}
        <div className="md:col-span-5 space-y-6">
          
          <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-black/10 text-left space-y-4">
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest">Office Contacts</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-pink/15 border border-brand-pink/20 flex items-center justify-center text-brand-pink shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">Email Address</span>
                  <a href="mailto:249xa33106@gmail.com" className="text-xs text-gray-200 hover:text-brand-pink font-semibold transition-colors">
                    249xa33106@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-blue/15 border border-brand-blue/20 flex items-center justify-center text-brand-blue shrink-0">
                  <LinkedinIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">LinkedIn</span>
                  <a href="https://www.linkedin.com/in/kumarkalava-mohammed-sowban-2b7327327?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-200 hover:text-brand-blue font-semibold transition-colors">
                    Mohammed Sowban
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-purple/15 border border-brand-purple/20 flex items-center justify-center text-brand-pink shrink-0">
                  <InstagramIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">Instagram</span>
                  <a href="https://www.instagram.com/lumixora_official?igsh=MW05ZGxnYWt0bzZtMQ==" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-200 hover:text-brand-pink font-semibold transition-colors">
                    lumixora
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-teal/15 border border-brand-teal/20 flex items-center justify-center text-brand-teal shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">Office Address</span>
                  <span className="text-xs text-gray-200 font-semibold block leading-relaxed">
                    Kurnool
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-brand-teal/5 text-left space-y-3">
            <h4 className="text-xs font-bold text-brand-teal uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Response Ticker</span>
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Standard review cycles for general emails and requests are handled within **2-4 business hours**. Academic resource disputes are processed instantly.
            </p>
          </div>

        </div>

        {/* Right Side: Message Submission Form */}
        <div className="md:col-span-7">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 bg-black/25 text-left">
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest mb-6 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-pink" />
              <span>Send An Instant Message</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-gray-400">Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-brand-pink outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-gray-400">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter email"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-brand-pink outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-400">Your Message</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="Type your message, feedback, or request details..."
                  rows="5"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white focus:border-brand-pink outline-none transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-brand-pink to-brand-purple text-white hover:opacity-90 transition-all shadow-[0_0_15px_rgba(247,37,133,0.2)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <span>Submit Query</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
