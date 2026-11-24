import React, { useState } from 'react';
import EmbeddedPdfViewer from './EmbeddedPdfViewer';

/**
 * FlipCard component for a note.
 * Front side shows basic info and a pin button.
 * Back side displays the PDF viewer.
 */
export default function FlipCard({ note, isPinned, togglePin }) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => setFlipped((prev) => !prev);

  // Prevent click on pin button from triggering flip
  const handlePinClick = (e) => {
    e.stopPropagation();
    togglePin(note.id);
  };

  return (
    <div
      className="relative w-full h-56 sm:h-64 perspective-800 cursor-pointer"
      onClick={handleFlip}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 preserve-3d ${
          flipped ? 'transform rotate-y-180' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front side */}
        <div
          className="absolute inset-0 backface-hidden bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-bold text-white line-clamp-2">{note.title}</h4>
            <button onClick={handlePinClick} className="text-yellow-400 text-lg">
              {isPinned ? '★' : '☆'}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {note.subjectCode} — {note.subjectName}
          </p>
          <p className="text-xs text-gray-400 mt-1">{note.unit || 'Notes'}</p>
        </div>
        {/* Back side – PDF viewer */}
        <div
          className="absolute inset-0 backface-hidden rotate-y-180"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <EmbeddedPdfViewer url={note.fileUrl} />
        </div>
      </div>
    </div>
  );
}
