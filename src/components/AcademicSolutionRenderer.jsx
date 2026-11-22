import React, { useState, useMemo, useCallback } from 'react';
import { marked } from 'marked';
import katex from 'katex';
import DOMPurify from 'dompurify';
import { 
  Copy, Check, Volume2, VolumeX, Sparkles, BookOpen, 
  HelpCircle, Code, Calculator, CheckCircle2, Lightbulb,
  FileDown, ChevronDown, Eye, Layers
} from 'lucide-react';

/**
 * Transforms raw markdown + LaTeX into styled, sanitized HTML with KaTeX formulas
 */
export function renderMarkdownWithKaTeX(content) {
  if (!content) return '';

  let text = content.replace(/\r\n/g, '\n');

  const mathTokens = [];

  // 1. Protect Display Math ($$...$$ and \[...\])
  text = text.replace(/(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\])/g, (match) => {
    let raw = match.replace(/^(\$\$|\\\[)/, '').replace(/(\$\$|\\\])$/, '').trim();
    const token = `__KATEX_DISPLAY_TOKEN_${mathTokens.length}_XYZ__`;
    mathTokens.push({ token, raw, display: true });
    return `\n\n${token}\n\n`;
  });

  // 2. Protect Inline Math ($...$ and \(...\))
  text = text.replace(/(\$(?:\\.|[^\$\\\n])+\$|\\\([\s\S]*?\\\))/g, (match) => {
    let raw = match.replace(/^(\$|\\\()/, '').replace(/(\$|\\\))$/, '').trim();
    const token = `__KATEX_INLINE_TOKEN_${mathTokens.length}_XYZ__`;
    mathTokens.push({ token, raw, display: false });
    return token;
  });

  // 3. Parse with marked GFM
  let html = marked.parse(text, { 
    gfm: true, 
    breaks: false
  });

  // 4. Inject Rendered KaTeX Math HTML
  for (const item of mathTokens) {
    let renderedMath = '';
    try {
      renderedMath = katex.renderToString(item.raw, {
        displayMode: item.display,
        throwOnError: false,
        output: 'htmlAndMathml'
      });
    } catch (err) {
      renderedMath = `<span class="katex-fallback font-mono text-cyan-300">${item.raw}</span>`;
    }

    if (item.display) {
      renderedMath = `
        <div class="my-3.5 p-4 rounded-2xl bg-gradient-to-r from-[#0a1220] via-[#0d1a30] to-[#0a1220] border border-cyan-500/30 overflow-x-auto text-center shadow-lg text-cyan-200 text-sm sm:text-base font-serif flex items-center justify-center">
          ${renderedMath}
        </div>
      `;
    } else {
      renderedMath = `<span class="px-1 py-0.5 text-cyan-300 font-serif align-middle inline-block">${renderedMath}</span>`;
    }

    html = html.replaceAll(item.token, renderedMath);
  }

  // 5. Sanitize with DOMPurify
  return DOMPurify.sanitize(html, {
    ADD_TAGS: [
      'math', 'semantics', 'mrow', 'mi', 'mo', 'mn', 'annotation', 'mspace', 
      'msup', 'msub', 'mfrac', 'msqrt', 'mtable', 'mtr', 'mtd', 'span', 
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'code', 'pre',
      'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'blockquote', 'p', 'strong', 'em', 'hr'
    ],
    ADD_ATTR: ['aria-hidden', 'encoding', 'style', 'class', 'align', 'start']
  });
}

export default function AcademicSolutionRenderer({ 
  content = '', 
  onAskFollowUp,
  onExportPdf,
  showToolbar = true,
  author = 'Vyomra AI Assistant',
  initialSocratic = false
}) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSocraticMode, setIsSocraticMode] = useState(initialSocratic);

  // Split content into Socratic steps if step markers exist
  const stepSegments = useMemo(() => {
    if (!content) return [];
    const regex = /\n(?=(?:###?\s+Step|\*\*Step|Step\s+\d+:))/i;
    const parts = content.split(regex);
    return parts.length > 1 ? parts : [content];
  }, [content]);

  const hasMultipleSteps = stepSegments.length > 1;
  const [visibleStepCount, setVisibleStepCount] = useState(1);

  // Text to speech handler
  const handleToggleSpeech = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanSpeechText = content
      .replace(/\\\[[\s\S]*?\\\]/g, ' mathematical equation ')
      .replace(/\$\$[\s\S]*?\$\$/g, ' mathematical equation ')
      .replace(/\$([^\$]+)\$/g, '$1')
      .replace(/```[\s\S]*?```/g, ' code snippet ')
      .replace(/[#*`_>|~-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, [content, isSpeaking]);

  const handleCopySolution = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Content to render based on Socratic mode
  const displayedContent = useMemo(() => {
    if (!isSocraticMode || !hasMultipleSteps) {
      return content;
    }
    return stepSegments.slice(0, visibleStepCount).join('\n\n');
  }, [content, isSocraticMode, hasMultipleSteps, stepSegments, visibleStepCount]);

  const renderedHtml = useMemo(() => {
    return renderMarkdownWithKaTeX(displayedContent);
  }, [displayedContent]);

  return (
    <div className="space-y-4 font-sans text-xs text-gray-200 leading-relaxed selection:bg-cyan-500 selection:text-black">
      
      {/* Socratic Step Mode Banner (if multiple steps detected) */}
      {hasMultipleSteps && (
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-bold text-white text-[11px]">
              {isSocraticMode ? `Socratic Tutor Mode • Step ${visibleStepCount} of ${stepSegments.length}` : 'Full Derivation View'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsSocraticMode(prev => !prev);
              if (!isSocraticMode) setVisibleStepCount(1);
            }}
            className="px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/50 text-cyan-300 font-semibold text-[10px] transition-all cursor-pointer flex items-center gap-1"
          >
            <Lightbulb className="w-3 h-3 text-cyan-400" />
            <span>{isSocraticMode ? 'View Full Solution' : 'Switch to Step-by-Step Reveal'}</span>
          </button>
        </div>
      )}

      {/* HTML Stream with CSS classes for Typography & Tables */}
      <div 
        className="academic-prose space-y-3 leading-relaxed text-gray-200 text-xs sm:text-[13px]"
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />

      {/* Socratic Reveal Next Step Action Button */}
      {isSocraticMode && hasMultipleSteps && visibleStepCount < stepSegments.length && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-slate-950 border border-cyan-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in shadow-lg">
          <div>
            <span className="text-xs font-bold text-white block">Test your understanding of Step {visibleStepCount}</span>
            <span className="text-[11px] text-slate-400">Try solving the next step in your notebook, then reveal the answer.</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setVisibleStepCount(stepSegments.length)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Reveal All
            </button>
            <button
              type="button"
              onClick={() => setVisibleStepCount(prev => prev + 1)}
              className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs shadow-md shadow-cyan-500/30 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Reveal Step {visibleStepCount + 1} &rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* QUICK ACADEMIC ACTIONS TOOLBAR */}
      {showToolbar && (
        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
          
          {/* Left Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleToggleSpeech}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                isSpeaking 
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' 
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
              }`}
              title={isSpeaking ? 'Stop voice reading' : 'Read solution aloud'}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{isSpeaking ? 'Stop Audio' : 'Read Aloud'}</span>
            </button>

            <button
              onClick={handleCopySolution}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
              title="Copy complete solution"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
              <span>{copied ? 'Copied!' : 'Copy Solution'}</span>
            </button>

            {onExportPdf && (
              <button
                onClick={onExportPdf}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-cyan-300 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
                title="Print or Save as Exam Note PDF"
              >
                <FileDown className="w-3.5 h-3.5 text-cyan-400" />
                <span>Save Exam Note</span>
              </button>
            )}
          </div>

          {/* Quick Follow-Up AI Prompt Pills */}
          {onAskFollowUp && (
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => onAskFollowUp("Can you generate 1 similar university exam practice question based on this topic with a hidden solution so I can test myself?")}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 transition-all cursor-pointer flex items-center gap-1"
                title="Generate a similar problem to test yourself"
              >
                <BookOpen className="w-3 h-3 text-emerald-400" />
                <span>Practice Similar Problem</span>
              </button>

              <button
                onClick={() => onAskFollowUp("Can you explain this simpler in plain English with an intuitive real-world analogy?")}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 transition-all cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Explain Simpler</span>
              </button>

              <button
                onClick={() => onAskFollowUp("Give me a rigorous step-by-step mathematical derivation of each intermediate formula.")}
                className="px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30 transition-all cursor-pointer flex items-center gap-1"
              >
                <Calculator className="w-3 h-3 text-purple-400" />
                <span>Deep Derivation</span>
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
