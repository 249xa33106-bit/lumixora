import React, { useState, useRef } from 'react';
import { X, Sparkles, FileText, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { generateLearningHubNotes } from '../services/aiService';
import mermaid from 'mermaid';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useData } from '../context/DataContext';
import { marked } from 'marked';

export default function AINotesGeneratorModal({ subject, isOpen, onClose }) {
  const { uploadFile, hubMaterials, updateHubMaterials } = useData();
  const [unitName, setUnitName] = useState('');
  const [topics, setTopics] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const previewRef = useRef(null);

  if (!isOpen) return null;

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!unitName || !topics) {
      setError('Please fill out all fields.');
      return;
    }
    setError(null);
    setSuccess(false);
    setIsGenerating(true);
    setStatus('Initializing AI Generation...');
    
    try {
      // 1. Fetch AI HTML Notes
      let rawContent = await generateLearningHubNotes(unitName, topics);
      
      // Strip markdown code block if the AI hallucinates it (e.g. ```html ... ```)
      let htmlContent = rawContent.trim();
      if (htmlContent.startsWith('```')) {
        htmlContent = htmlContent.replace(/^```[a-z]*\n?/i, '');
        htmlContent = htmlContent.replace(/\n?```$/, '');
      }
      if (previewRef.current) {
        previewRef.current.innerHTML = `
          <style>
            .pdf-container { padding: 50px; font-family: 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1a1a2e; background: white; line-height: 1.8; width: 800px; margin: 0 auto; box-sizing: border-box; }
            
            /* Colorful Main Headers */
            .pdf-container h1 { font-size: 36px; font-weight: 900; color: #ffffff; margin-bottom: 28px; padding: 20px 28px; background: linear-gradient(135deg, #0f172a, #1e40af, #7c3aed); border-radius: 12px; text-transform: uppercase; letter-spacing: 0.5px; text-align: center; box-shadow: 0 4px 20px rgba(30,64,175,0.3); }
            .pdf-container h2 { font-size: 26px; font-weight: 800; color: #1e40af; margin-top: 45px; margin-bottom: 18px; padding: 12px 20px; background: linear-gradient(90deg, #eff6ff, #dbeafe, #ffffff); border-left: 6px solid #2563eb; border-radius: 0 10px 10px 0; }
            .pdf-container h3 { font-size: 21px; font-weight: 700; color: #7c3aed; margin-top: 28px; margin-bottom: 14px; padding-left: 14px; border-left: 4px solid #a78bfa; }
            .pdf-container h4 { font-size: 17px; font-weight: 700; color: #059669; margin-top: 20px; margin-bottom: 10px; }
            
            /* Typography */
            .pdf-container p { font-size: 15px; margin-bottom: 16px; color: #334155; }
            .pdf-container ul, .pdf-container ol { margin-bottom: 20px; padding-left: 28px; }
            .pdf-container li { font-size: 15px; margin-bottom: 8px; color: #334155; }
            .pdf-container li::marker { color: #2563eb; font-weight: bold; }
            .pdf-container strong { font-weight: 700; color: #0f172a; background: linear-gradient(120deg, #fef9c3 0%, #fef9c3 100%); background-size: 100% 40%; background-position: 0 88%; background-repeat: no-repeat; padding: 0 2px; }
            .pdf-container code { background: #f1f5f9; color: #e11d48; padding: 2px 8px; border-radius: 4px; font-size: 14px; font-family: 'Fira Code', monospace; }
            .pdf-container pre { background: #0f172a; color: #e2e8f0; padding: 20px; border-radius: 10px; overflow-x: auto; font-size: 14px; margin: 20px 0; border: 1px solid #334155; }
            .pdf-container table { width: 100%; border-collapse: collapse; margin: 20px 0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
            .pdf-container thead { background: linear-gradient(135deg, #1e40af, #7c3aed); color: white; }
            .pdf-container th { padding: 12px 16px; text-align: left; font-weight: 700; font-size: 14px; }
            .pdf-container td { padding: 10px 16px; font-size: 14px; border-bottom: 1px solid #e2e8f0; }
            .pdf-container tr:nth-child(even) { background: #f8fafc; }
            .pdf-container tr:hover { background: #eff6ff; }
            
            /* Colorful Section Boxes */
            .pdf-container .topic-box { background: linear-gradient(135deg, #f0f9ff, #eff6ff); border-left: 6px solid #2563eb; padding: 24px; margin-bottom: 28px; border-radius: 0 12px 12px 0; box-shadow: 0 2px 12px rgba(37,99,235,0.08); }
            .pdf-container .example-box { background: linear-gradient(135deg, #ecfdf5, #d1fae5); border: 1px solid #34d399; border-left: 6px solid #059669; padding: 24px; margin: 24px 0; border-radius: 0 12px 12px 0; box-shadow: 0 2px 12px rgba(5,150,105,0.08); }
            .pdf-container .example-box::before { content: '💡 Example'; display: block; font-weight: 800; color: #059669; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
            .pdf-container .qa-box { background: linear-gradient(135deg, #faf5ff, #f3e8ff); border: 1px solid #c084fc; border-left: 6px solid #7c3aed; padding: 28px; margin-top: 35px; border-radius: 0 12px 12px 0; box-shadow: 0 2px 12px rgba(124,58,237,0.08); }
            .pdf-container .qa-box::before { content: '📝 Exam Q&A'; display: block; font-weight: 800; color: #7c3aed; margin-bottom: 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
            
            /* Colorful Callout Boxes */
            .pdf-container .note-box, .pdf-container blockquote { background: linear-gradient(135deg, #fffbeb, #fef3c7); border-left: 6px solid #f59e0b; padding: 18px 24px; margin: 20px 0; border-radius: 0 10px 10px 0; color: #92400e; font-style: italic; }
            
            /* Mermaid Flowcharts */
            .pdf-container .mermaid { display: flex; justify-content: center; margin: 30px 0; padding: 30px; background: linear-gradient(135deg, #f8fafc, #f1f5f9); border-radius: 16px; border: 2px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.04); }
            
            /* Images */
            .pdf-container img { max-width: 100%; height: auto; border-radius: 12px; margin: 25px auto; display: block; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            
            /* Dividers */
            .pdf-container hr { border: none; height: 3px; background: linear-gradient(90deg, #2563eb, #7c3aed, #ec4899); margin: 45px 0; border-radius: 2px; }
            
            /* Text Center Utility */
            .pdf-container .text-center { text-align: center; }
          </style>
          <div class="pdf-container">
            ${htmlContent}
          </div>
        `;
      }
      
      setStatus('Rendering diagrams...');
      // 3. Render mermaid diagrams
      mermaid.initialize({ 
        startOnLoad: false, 
        theme: 'default',
        flowchart: { htmlLabels: false } 
      });
      try {
        await mermaid.run({
          querySelector: '.mermaid',
        });
        
        // Fix for html2canvas SVG rendering: Convert SVG to Image for ALL diagrams
        const svgElements = previewRef.current.querySelectorAll('.mermaid svg');
        svgElements.forEach((svgElement) => {
          const width = svgElement.getBoundingClientRect().width || 500;
          const height = svgElement.getBoundingClientRect().height || 500;
          svgElement.setAttribute('width', width);
          svgElement.setAttribute('height', height);
          
          const svgData = new XMLSerializer().serializeToString(svgElement);
          const base64 = btoa(unescape(encodeURIComponent(svgData)));
          const img = document.createElement('img');
          img.src = `data:image/svg+xml;base64,${base64}`;
          img.style.width = '100%';
          img.style.maxWidth = width + 'px';
          img.style.height = 'auto';
          svgElement.parentNode.replaceChild(img, svgElement);
        });
      } catch (mermaidError) {
        console.warn('Mermaid failed to render diagram:', mermaidError);
      }

      // Wait a moment for rendering to settle
      await new Promise(res => setTimeout(res, 1000));

      // Use html2canvas with page-by-page slicing to handle massive documents
      setStatus('Generating PDF (this may take a moment for large notes)...');
      
      const targetElement = previewRef.current.querySelector('.pdf-container') || previewRef.current;
      
      // Render the entire content to a canvas
      const canvas = await html2canvas(targetElement, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 800,
        scrollX: 0,
        scrollY: 0
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfPageWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate how many pixels of the canvas fit on one PDF page
      const scaleFactor = pdfPageWidth / canvas.width;
      const canvasPageHeight = Math.floor(pdfPageHeight / scaleFactor);
      const totalPages = Math.ceil(canvas.height / canvasPageHeight);
      
      for (let i = 0; i < totalPages; i++) {
        if (i > 0) pdf.addPage();
        
        // Create a temporary canvas for this page slice
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = Math.min(canvasPageHeight, canvas.height - i * canvasPageHeight);
        
        const ctx = pageCanvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

        // Draw only the relevant slice from the full canvas
        ctx.drawImage(
          canvas,
          0, i * canvasPageHeight,           // source x, y
          canvas.width, pageCanvas.height,    // source width, height
          0, 0,                               // dest x, y
          pageCanvas.width, pageCanvas.height  // dest width, height
        );
        
        const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
        const imgHeight = pageCanvas.height * scaleFactor;
        pdf.addImage(pageImgData, 'JPEG', 0, 0, pdfPageWidth, imgHeight);
      }

      const pdfBlob = pdf.output('blob');
      const safeUnitName = unitName.replace(/[^a-zA-Z0-9 -]/g, '').trim().replace(/\s+/g, '_');
      const file = new File([pdfBlob], `${safeUnitName}_Notes.pdf`, { type: 'application/pdf' });

      setStatus('Uploading PDF...');
      
      // 6. Upload PDF
      const path = `subject_resources/${subject.id}/${Date.now()}_${file.name}`;
      const downloadUrl = await uploadFile(path, file);

      // 7. Save to subject resources
      const currentMat = hubMaterials.find(m => m.id === subject.id) || {
        playlists: { pass: { featured: null, alternatives: [] }, complete: { featured: null, alternatives: [] }, industry: { featured: null, alternatives: [] } },
        resources: []
      };

      const updatedMaterials = JSON.parse(JSON.stringify(currentMat));
      delete updatedMaterials.id;
      
      updatedMaterials.resources.push({
        id: Date.now(),
        label: `${unitName} - AI Generated Notes`,
        type: 'FileText',
        color: 'text-brand-pink',
        bg: 'bg-brand-pink/10',
        fileUrl: downloadUrl
      });
      
      await updateHubMaterials(subject.id, updatedMaterials);
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during generation.');
    } finally {
      setIsGenerating(false);
      setStatus('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#111] border border-[#222] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-[#222] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-teal" /> 
            AI Notes Generator
          </h3>
          <button onClick={onClose} disabled={isGenerating} className="text-gray-500 hover:text-white disabled:opacity-50">
            <X className="w-5 h-5"/>
          </button>
        </div>
        
        <form onSubmit={handleGenerate} className="p-5 space-y-4">
          <div className="bg-brand-teal/10 border border-brand-teal/20 rounded-lg p-3">
            <p className="text-xs text-brand-teal font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4" /> Generating for: {subject.name}
            </p>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-xs text-red-400 font-medium leading-relaxed">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
              <p className="text-xs text-green-400 font-medium">Notes generated and saved successfully!</p>
            </div>
          )}
          
          <div>
            <label className="text-[10px] text-gray-500 tracking-wide mb-1 block">Unit Name / Title</label>
            <input 
              type="text" 
              value={unitName} 
              onChange={(e) => setUnitName(e.target.value)} 
              placeholder="e.g. Unit 1: Thermodynamics" 
              className="w-full bg-black border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:border-brand-teal outline-none" 
              required
              disabled={isGenerating}
            />
          </div>
          
          <div>
            <label className="text-[10px] text-gray-500 tracking-wide mb-1 block">Topics Covered</label>
            <textarea 
              value={topics} 
              onChange={(e) => setTopics(e.target.value)} 
              placeholder="e.g. Laws of thermodynamics, Entropy, Enthalpy, Heat Engines" 
              className="w-full bg-black border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:border-brand-teal outline-none min-h-[100px] resize-y" 
              required
              disabled={isGenerating}
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-[#222]">
            <button 
              type="submit" 
              disabled={isGenerating || success}
              className="flex-1 bg-brand-teal text-black font-bold py-2.5 rounded-lg text-xs hover:bg-brand-teal/90 transition-colors disabled:opacity-50 flex flex-col items-center justify-center gap-1 shadow-sm h-[60px]"
            >
              {isGenerating ? (
                <>
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="animate-pulse">{status || 'Generating...'}</span>
                  </div>
                  <span className="text-[9px] font-semibold opacity-70">Please do not close this window (ETA: 45s)</span>
                </>
              ) : success ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Success!</span>
                </div>
              ) : (
                'Generate & Save PDF'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Hidden container for rendering HTML and Mermaid - rendered offscreen with visible opacity */}
      <div 
        style={{ position: 'fixed', top: 0, left: '-9999px', width: '800px', zIndex: -100, opacity: 1, pointerEvents: 'none', background: '#ffffff' }}
      >
        <div ref={previewRef}></div>
      </div>
    </div>
  );
}
