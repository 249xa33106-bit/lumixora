import React from 'react';
import { ShieldCheck, Lock, Heart } from 'lucide-react';

export default function Footer({ onOpenPrivacy, onOpenTerms }) {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 tracking-tight">Lumixora Technologies Inc.</span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">Internship Cohort 2026</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-md">
              Empowering the next generation of engineers, designers, and innovators through experiential mentorship and impactful production projects.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="hover:text-indigo-600 underline underline-offset-4"
            >
              Privacy Policy & Data Retention
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={onOpenTerms}
              className="hover:text-indigo-600 underline underline-offset-4"
            >
              Terms of Internship
            </button>
            <span className="text-slate-300">•</span>
            <div className="inline-flex items-center space-x-1 text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>TLS 256-bit Encrypted Uploads</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>© {new Date().getFullYear()} Lumixora. All rights reserved.</p>
          <p className="inline-flex items-center space-x-1">
            <span>Built with care for aspiring creators</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
