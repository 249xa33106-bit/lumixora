import React, { useState } from 'react';
import { Play, Loader2, Terminal, CheckCircle2, AlertCircle } from 'lucide-react';
import { executeCode } from '../services/compilerService';

function CodeBlockRunner({ codeBlock }) {
  let lang = 'python';
  let cleanCode = codeBlock;

  // Extract language specifier if present (e.g., ```python\nprint("Hello")```)
  const firstLineEnd = codeBlock.indexOf('\n');
  if (firstLineEnd !== -1) {
    const possibleLang = codeBlock.substring(0, firstLineEnd).trim().toLowerCase();
    if (['python', 'javascript', 'js', 'cpp', 'c++', 'java', 'c'].includes(possibleLang)) {
      lang = possibleLang === 'js' ? 'javascript' : (possibleLang === 'c++' ? 'cpp' : possibleLang);
      cleanCode = codeBlock.substring(firstLineEnd + 1).trim();
    }
  }

  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput(null);
    setError(null);
    try {
      const result = await executeCode({ id: 'sandbox', testCases: [] }, cleanCode, lang, false);
      if (result.success) {
        setOutput(result.output || 'Code executed successfully with zero errors.');
      } else {
        setError(result.compilerError || result.output || 'Execution Error');
      }
    } catch (err) {
      setError(err.message || 'Execution error');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="my-3 bg-[#0a0a0f] border border-white/10 rounded-xl overflow-hidden shadow-lg font-mono text-xs">
      <div className="bg-white/5 px-3 py-1.5 flex items-center justify-between border-b border-white/5">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-[#00f5d4]" />
          {lang}
        </span>
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="flex items-center gap-1 bg-[#00f5d4]/10 hover:bg-[#00f5d4]/20 text-[#00f5d4] border border-[#00f5d4]/30 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" /> Running...
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-current" /> Run Code
            </>
          )}
        </button>
      </div>

      <div className="p-3 text-[#00f5d4] overflow-x-auto">
        <code>{cleanCode}</code>
      </div>

      {(output || error) && (
        <div className={`p-3 border-t text-xs ${error ? 'bg-red-500/10 border-red-500/20 text-red-300' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'}`}>
          <div className="flex items-center gap-1.5 font-bold mb-1">
            {error ? <AlertCircle className="w-3.5 h-3.5 text-red-400" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{error ? 'Execution Error' : 'Output Console'}</span>
          </div>
          <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed opacity-90">{error || output}</pre>
        </div>
      )}
    </div>
  );
}

export default function MessageFormatter({ text }) {
  if (!text) return null;

  // Split text by code blocks first
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="whitespace-pre-wrap break-words">
      {parts.map((part, index) => {
        // Handle Code Blocks
        if (part.startsWith('```') && part.endsWith('```')) {
          const codeContent = part.substring(3, part.length - 3).trim();
          return <CodeBlockRunner key={index} codeBlock={codeContent} />;
        }

        // Handle inline formatting and links
        const words = part.split(/(\s+)/);
        return (
          <span key={index}>
            {words.map((word, wIdx) => {
              // URL matching
              const urlRegex = /(https?:\/\/[^\s]+)/g;
              if (urlRegex.test(word)) {
                return (
                  <a 
                    key={wIdx} 
                    href={word} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
                  >
                    {word}
                  </a>
                );
              }

              // Bold text: **text**
              if (word.startsWith('**') && word.endsWith('**') && word.length > 4) {
                return <strong key={wIdx} className="font-black">{word.slice(2, -2)}</strong>;
              }

              // Italic text: _text_
              if (word.startsWith('_') && word.endsWith('_') && word.length > 2) {
                return <em key={wIdx} className="italic text-white/80">{word.slice(1, -1)}</em>;
              }

              // Inline code: `text`
              if (word.startsWith('`') && word.endsWith('`') && word.length > 2) {
                return (
                  <code key={wIdx} className="bg-black/30 px-1.5 py-0.5 rounded text-[11px] font-mono text-[#00f5d4] border border-white/5">
                    {word.slice(1, -1)}
                  </code>
                );
              }

              return <span key={wIdx}>{word}</span>;
            })}
          </span>
        );
      })}
    </div>
  );
}
