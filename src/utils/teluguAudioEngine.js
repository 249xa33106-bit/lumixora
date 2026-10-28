// Comprehensive Bilingual Telugu / English Audio Engine for Lumixora Interactive Notes & Digital Textbooks
// Provides native Telugu voice synthesis (te-IN), bilingual phonetic Telugish fallback, and live narration captions.

/**
 * Clean markdown symbols, asterisks, code blocks, and math characters for speech
 */
export function cleanSpeechText(text = '') {
  if (!text) return '';
  return text
    .replace(/```[\s\S]*?```/g, ' Code example in the editor. ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[*#_~$\\]/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Builds rich, educational audio narration scripts for any given chapter
 * @param {Object} chapter - Chapter data with title, summary, sections, caseStudy
 * @param {string} courseTitle - Name of the parent course / module
 */
export function buildAudioScripts(chapter = {}, courseTitle = '') {
  const title = chapter.title || 'Engineering Architecture';
  const chapterNumber = chapter.chapterNumber || 'Chapter';
  const summary = cleanSpeechText(chapter.summary || '');
  const sections = (chapter.sections || []).slice(0, 3);
  const caseStudy = chapter.caseStudy || null;

  // 1. PURE TELUGU SCRIPT (Used when browser has native te-IN Telugu voice engine)
  let telugu = `నమస్కారం విద్యార్థులారా! లూమిక్సోరా ఆడియో నోట్స్ కు స్వాగతం. `;
  telugu += `ఈ రోజు మన ఇంజనీరింగ్ పాఠం: ${title}. `;

  if (summary) {
    telugu += `ఈ పాఠం ముఖ్య ఉద్దేశ్యం ఏంటంటే: ${summary}. `;
  }

  if (sections.length > 0) {
    telugu += `ఈ చాప్టర్‌లోని ముఖ్యమైన కాన్సెప్ట్స్ పరిశీలిస్తే: `;
    sections.forEach((sec, idx) => {
      const heading = cleanSpeechText(sec.heading || `కాన్సెప్ట్ ${idx + 1}`);
      const snippet = cleanSpeechText(sec.content || '').slice(0, 140);
      telugu += `పాయింట్ ${idx + 1}: ${heading}. ${snippet}. `;
    });
  }

  if (caseStudy) {
    const comp = cleanSpeechText(caseStudy.company || 'టెక్ ఇండస్ట్రీ');
    const takeaway = cleanSpeechText(caseStudy.takeaway || '');
    telugu += `రియల్-వరల్డ్ ప్రాడక్షన్ కేస్ స్టడీ చూస్తే, ${comp} వారు ${takeaway}. `;
  }

  telugu += `ఈ కాన్సెప్ట్‌ను మీరు కింద ఉన్న గ్రీన్ కలర్ Try it Yourself బటన్ క్లిక్ చేసి, కోడ్ స్వయంగా రన్ చేసి ప్రాక్టీస్ చేయవచ్చు. ఆల్ ది బెస్ట్ మరియు హ్యాపీ లెర్నింగ్!`;

  // 2. PHONETIC TELUGISH BILINGUAL SCRIPT (Used when OS has Indian English or natural voice without native te-IN pack)
  let telugish = `Namaskaram vidyardhulaara! Lumixora interactive audio notes ki swagatham. `;
  telugish += `Ee roju mana engineering topic: ${title}. `;

  if (summary) {
    telugish += `Ee lesson yokka main concept enti ante: ${summary}. `;
  }

  if (sections.length > 0) {
    telugish += `Ee chapter lo main points chusinatlayithe: `;
    sections.forEach((sec, idx) => {
      const heading = cleanSpeechText(sec.heading || `Point ${idx + 1}`);
      const snippet = cleanSpeechText(sec.content || '').slice(0, 140);
      telugish += `Point number ${idx + 1}: ${heading}. ${snippet}. `;
    });
  }

  if (caseStudy) {
    const comp = cleanSpeechText(caseStudy.company || 'Industry Leader');
    const takeaway = cleanSpeechText(caseStudy.takeaway || '');
    telugish += `Real-world production case study lo, ${comp} vaaru ${takeaway}. `;
  }

  telugish += `Kindha unna green colour Try it Yourself button use chesi live ga code run chesi practice cheyandi. All the best and happy learning!`;

  // 3. PURE ENGLISH SCRIPT
  let english = `Welcome to Lumixora Interactive Notes tutorial. `;
  english += `Today's topic: ${chapterNumber}: ${title}. `;

  if (summary) {
    english += `Overview: ${summary}. `;
  }

  if (sections.length > 0) {
    sections.forEach((sec, idx) => {
      const heading = cleanSpeechText(sec.heading || `Section ${idx + 1}`);
      const snippet = cleanSpeechText(sec.content || '').slice(0, 140);
      english += `Section ${idx + 1}: ${heading}. ${snippet}. `;
    });
  }

  if (caseStudy) {
    const comp = cleanSpeechText(caseStudy.company || 'Meta');
    const takeaway = cleanSpeechText(caseStudy.takeaway || '');
    english += `Production case study from ${comp}: ${takeaway}. `;
  }

  english += `Feel free to edit and run the examples using the green Try it Yourself button below!`;

  return {
    teluguScript: cleanSpeechText(telugu),
    telugishScript: cleanSpeechText(telugish),
    englishScript: cleanSpeechText(english)
  };
}

/**
 * Safely fetches the list of available browser speech synthesis voices
 */
export function getAvailableVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  return window.speechSynthesis.getVoices() || [];
}

/**
 * Resolves the optimal voice, language code, and text for the selected language mode
 * @param {Object} chapter - Chapter object
 * @param {string} courseTitle - Course title
 * @param {string} voiceLang - 'en' | 'bilingual' | 'te'
 * @param {Array} customVoices - Optional voices array
 */
export function resolveVoiceAndSpeech({ chapter, courseTitle = '', voiceLang = 'en', customVoices = null }) {
  const voices = (customVoices && customVoices.length > 0) ? customVoices : getAvailableVoices();
  const scripts = buildAudioScripts(chapter, courseTitle);

  if (voiceLang === 'bilingual' || voiceLang === 'te') {
    // 1. Check for native Telugu voice on device (e.g. Google తెలుగు, Microsoft Mohan, te-IN, te)
    const nativeTelugu = voices.find(v => {
      const l = (v.lang || '').toLowerCase();
      const n = (v.name || '').toLowerCase();
      return l.startsWith('te') || l.includes('te-in') || n.includes('telugu') || n.includes('తెలుగు');
    });

    if (nativeTelugu) {
      return {
        voice: nativeTelugu,
        langCode: 'te-IN',
        text: scripts.teluguScript,
        displayScript: scripts.teluguScript,
        isNativeTelugu: true,
        modeLabel: 'Native Telugu Voice (తెలుగు)',
        badgeColor: 'bg-emerald-500 text-white'
      };
    }

    // 2. Check for Indian English voice (e.g. Google English India, Microsoft Ravi, Heera, Neerja, en-IN)
    // Indian English engines excel at articulating Telugish greetings and technical concepts
    const indianVoice = voices.find(v => {
      const l = (v.lang || '').toLowerCase();
      const n = (v.name || '').toLowerCase();
      return l.includes('en-in') || n.includes('india') || n.includes('ravi') || n.includes('heera') || n.includes('neerja') || n.includes('swara') || n.includes('madhav') || n.includes('priya');
    });

    if (indianVoice) {
      return {
        voice: indianVoice,
        langCode: 'en-IN',
        text: scripts.telugishScript,
        displayScript: scripts.teluguScript,
        isNativeTelugu: false,
        modeLabel: 'Bilingual Telugu/Eng (ద్విభాషా తెలుగు)',
        badgeColor: 'bg-teal-600 text-white'
      };
    }

    // 3. Fallback to any natural voice with Telugish phonetics
    const naturalVoice = voices.find(v => {
      const l = (v.lang || '').toLowerCase();
      const n = (v.name || '').toLowerCase();
      return l.startsWith('en') && (n.includes('natural') || n.includes('google') || n.includes('neural') || n.includes('samantha'));
    }) || voices.find(v => (v.lang || '').toLowerCase().startsWith('en')) || voices[0] || null;

    return {
      voice: naturalVoice,
      langCode: 'en-US',
      text: scripts.telugishScript,
      displayScript: scripts.teluguScript,
      isNativeTelugu: false,
      modeLabel: 'Bilingual Telugu Narration',
      badgeColor: 'bg-indigo-600 text-white'
    };
  }

  // Pure English mode
  const enVoice = voices.find(v => {
    const l = (v.lang || '').toLowerCase();
    const n = (v.name || '').toLowerCase();
    return l.startsWith('en') && (n.includes('natural') || n.includes('google') || n.includes('neural') || n.includes('samantha') || n.includes('david'));
  }) || voices.find(v => (v.lang || '').toLowerCase().startsWith('en')) || voices[0] || null;

  return {
    voice: enVoice,
    langCode: 'en-US',
    text: scripts.englishScript,
    displayScript: scripts.englishScript,
    isNativeTelugu: false,
    modeLabel: 'English Narration',
    badgeColor: 'bg-blue-600 text-white'
  };
}

/**
 * Speaks an utterance with robust browser heartbeat to avoid Chrome 15-second cutoff bug
 */
export function playSynthesizedNarration({
  text,
  voice,
  langCode = 'en-US',
  rate = 1.0,
  pitch = 1.0,
  onStart,
  onEnd,
  onError
}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onError?.(new Error('Speech synthesis not supported on this device'));
    return { stop: () => {} };
  }

  // Cancel prior audio
  window.speechSynthesis.cancel();

  // Handle Chrome paused state
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }

  const utterance = new SpeechSynthesisUtterance(text);
  if (voice) utterance.voice = voice;
  utterance.lang = langCode || (voice?.lang) || 'en-US';
  utterance.rate = Math.max(0.7, Math.min(1.5, rate || 1.0));
  utterance.pitch = Math.max(0.8, Math.min(1.2, pitch || 1.0));

  let heartbeatInterval = null;
  let hasFinished = false;

  const cleanup = () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }
  };

  utterance.onstart = () => {
    onStart?.();
    // Chrome speech synthesis workaround: pulse resume every 10s to prevent pause
    heartbeatInterval = setInterval(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      } else {
        cleanup();
      }
    }, 10000);
  };

  utterance.onend = () => {
    if (hasFinished) return;
    hasFinished = true;
    cleanup();
    onEnd?.();
  };

  utterance.onerror = (err) => {
    if (hasFinished) return;
    hasFinished = true;
    cleanup();
    onError?.(err);
  };

  try {
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    cleanup();
    onError?.(e);
  }

  return {
    stop: () => {
      hasFinished = true;
      cleanup();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      onEnd?.();
    }
  };
}
