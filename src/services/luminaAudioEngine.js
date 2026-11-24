/**
 * 🎵 Lumina Audio Synthesis Engine
 * Provides authentic Web Audio API generation for:
 * - Real pitched musical notes & vocal sargam (Sa, Re, Ga, Ma, Pa, Dha, Ni)
 * - 8-Count dance rhythm metronome
 * - Zen meditation bell for yoga & breathing exercises
 */

class LuminaAudioEngine {
  constructor() {
    this.ctx = null;
    this.voices = [];
    this.initSpeech();
    this.noteFrequencies = {
      'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
      'G4': 392.00, 'A4': 440.00, 'B4': 493.88, 'C5': 523.25,
      // Indian Classical Swaras (Middle Octave - C Natural Key)
      'Sa': 261.63, 'Re': 293.66, 'Ga': 329.63, 'Ma': 349.23,
      'Pa': 392.00, 'Dha': 440.00, 'Ni': 493.88, 'Sa_high': 523.25
    };
  }

  /**
   * Initialize speech synthesis voices
   */
  initSpeech() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    this.voices = window.speechSynthesis.getVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.voices = window.speechSynthesis.getVoices();
      };
    }
  }

  getBestVoice() {
    if (!this.voices || this.voices.length === 0) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        this.voices = window.speechSynthesis.getVoices();
      }
    }
    if (!this.voices || this.voices.length === 0) return null;

    // Prefer high quality natural female voices (English / Indian English / US / UK)
    const preferredNames = [
      'Microsoft Neerja Online (Natural) - English (India)',
      'Microsoft Heera - English (India)',
      'Microsoft Zira - English (United States)',
      'Microsoft Jenny Online (Natural) - English (United States)',
      'Google UK English Female',
      'Google US English',
      'Samantha',
      'Victoria',
      'Karen'
    ];

    for (const name of preferredNames) {
      const match = this.voices.find(v => v.name.includes(name));
      if (match) return match;
    }

    // Secondary: Any English female voice
    const femaleVoice = this.voices.find(v => 
      v.lang.startsWith('en') && (
        v.name.toLowerCase().includes('female') || 
        v.name.toLowerCase().includes('woman') ||
        v.name.toLowerCase().includes('girl') ||
        v.name.toLowerCase().includes('zira') ||
        v.name.toLowerCase().includes('jenny') ||
        v.name.toLowerCase().includes('natural')
      )
    );
    if (femaleVoice) return femaleVoice;

    // Fallback: Any English voice
    const enVoice = this.voices.find(v => v.lang.startsWith('en'));
    return enVoice || this.voices[0] || null;
  }

  /**
   * Speak aloud using natural SpeechSynthesis with math phonetic conversion
   */
  speak(text, onStart, onEnd) {
    if (typeof window === 'undefined') return;
    this.init();

    if (!window.speechSynthesis) {
      console.warn('Speech synthesis not supported in this browser.');
      if (onStart) onStart();
      setTimeout(() => { if (onEnd) onEnd(); }, 3000);
      return;
    }

    // Cancel any previous utterance to avoid queuing delays
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    // Phonetic normalization for mathematical formula readability
    const spoken = text
      .replace(/ax² \+ bx \+ c = 0/gi, 'a x squared, plus b x, plus c, equals zero')
      .replace(/x = -b ± √\(b² - 4ac\) \/ 2a/gi, 'x equals negative b, plus or minus the square root of b squared minus 4 a c, all over 2 a')
      .replace(/x = \(-b ± √\(b² - 4ac\)\)\/2a/gi, 'x equals negative b, plus or minus the square root of b squared minus 4 a c, all over 2 a')
      .replace(/Δ = b² - 4ac/gi, 'the discriminant delta equals b squared minus 4 a c')
      .replace(/b² - 4ac/gi, 'b squared minus 4 a c')
      .replace(/a ≠ 0/gi, 'a is not equal to zero')
      .replace(/ax²/gi, 'a x squared')
      .replace(/bx/gi, 'b x')
      .replace(/±/g, 'plus or minus ')
      .replace(/√/g, 'square root of ')
      .replace(/²/g, ' squared ')
      .replace(/Δ/g, 'delta ');

    const utterance = new SpeechSynthesisUtterance(spoken);
    this.currentUtterance = utterance;
    const voice = this.getBestVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }

    utterance.pitch = 1.05; // Pleasant, warm female pitch
    utterance.rate = 0.98;  // Natural, articulate teaching pace
    utterance.volume = 1.0;

    let hasStarted = false;
    utterance.onstart = () => {
      hasStarted = true;
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);

    // Chrome/Safari safety: ensure onstart callback activates lip-sync
    setTimeout(() => {
      if (!hasStarted && window.speechSynthesis.speaking && onStart) {
        onStart();
      }
    }, 120);
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64;
        this.analyser.smoothingTimeConstant = 0.8;
        this.analyser.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  stopSpeech() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
    if (this.onBargeInListener) {
      this.onBargeInListener();
    }
  }

  /**
   * Barge-in interruption handler: stops current speech and notifies listeners
   */
  bargeIn() {
    this.stopSpeech();
  }

  /**
   * Get real-time audio frequency data for visualizer (0.0 to 1.0)
   */
  getFrequencyData(count = 24) {
    if (this.analyser && this.ctx && this.ctx.state === 'running') {
      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      this.analyser.getByteFrequencyData(dataArray);

      const result = [];
      const step = Math.max(1, Math.floor(bufferLength / count));
      for (let i = 0; i < count; i++) {
        const val = dataArray[i * step] || 0;
        result.push(val / 255.0);
      }
      return result;
    }

    // Fallback simulated spectrum if synthesiser audio is not routed via Web Audio node
    const isSpeaking = typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.speaking;
    const now = Date.now() / 1000;
    const result = [];
    for (let i = 0; i < count; i++) {
      if (isSpeaking) {
        const energy = (Math.sin(now * 8 + i * 0.4) * 0.5 + 0.5) * 
                       (Math.cos(now * 12 + i * 0.8) * 0.4 + 0.6);
        result.push(Math.max(0.15, Math.min(1.0, energy)));
      } else {
        result.push(0.04);
      }
    }
    return result;
  }

  /**
   * Play a pitched musical note / vocal warm-up tone with rich harmonic overtones
   */
  playNote(noteName = 'Sa', duration = 0.8, type = 'sine') {
    this.init();
    if (!this.ctx) return;

    const freq = this.noteFrequencies[noteName] || 440;
    const now = this.ctx.currentTime;

    // Primary Oscillator (Fundamental Pitch)
    const osc1 = this.ctx.createOscillator();
    osc1.type = type; // 'sine' or 'triangle' for warm vocal/piano timbre
    osc1.frequency.setValueAtTime(freq, now);

    // Secondary Harmonic Oscillator (Warm overtone)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);

    // Gain Envelope (Attack -> Decay -> Sustain -> Release)
    const gainNode1 = this.ctx.createGain();
    const gainNode2 = this.ctx.createGain();

    gainNode1.gain.setValueAtTime(0, now);
    gainNode1.gain.linearRampToValueAtTime(0.4, now + 0.05); // Attack
    gainNode1.gain.exponentialRampToValueAtTime(0.001, now + duration); // Release

    gainNode2.gain.setValueAtTime(0, now);
    gainNode2.gain.linearRampToValueAtTime(0.12, now + 0.05);
    gainNode2.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc1.connect(gainNode1);
    osc2.connect(gainNode2);
    const dest = this.analyser || this.ctx.destination;
    gainNode1.connect(dest);
    gainNode2.connect(dest);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  /**
   * Play an authentic 8-count dance beat click
   * @param {number} beatNum (1 to 8, with beat 1 and 5 accented)
   */
  playDanceBeat(beatNum = 1) {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Accent beats 1 and 5 (higher pitch & punchier kick)
    const isAccented = beatNum === 1 || beatNum === 5;
    const freq = isAccented ? 650 : 380;
    const vol = isAccented ? 0.5 : 0.28;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);

    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.analyser || this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  /**
   * Calming Tibetan Singing Bowl / Zen Bell for Yoga & Pranayama
   */
  playZenChime() {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [432, 864, 1296].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const initialGain = 0.25 / (idx + 1);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(initialGain, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(gain);
      gain.connect(this.analyser || this.ctx.destination);

      osc.start(now);
      osc.stop(now + 2.5);
    });
  }

  /**
   * Play authentic chalk writing sound effect (friction & scraping on slate chalkboard)
   */
  playChalkSound(duration = 2.0) {
    this.init();
    if (!this.ctx) return;

    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate modulated granular chalk friction noise
      for (let i = 0; i < bufferSize; i++) {
        const t = i / this.ctx.sampleRate;
        const scratch = Math.sin(t * 80) * Math.cos(t * 190);
        const burst = (Math.sin(t * 12) > 0.15) ? 1.0 : 0.2;
        data[i] = (Math.random() * 2 - 1) * 0.4 * burst * (1 + 0.5 * scratch);
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter to match chalk scraping frequencies (1800Hz - 3600Hz)
      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(2400, this.ctx.currentTime);
      bandpass.Q.setValueAtTime(3.0, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.22, this.ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      noise.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(this.analyser || this.ctx.destination);

      noise.start();
    } catch (err) {
      console.warn('Chalk sound synthesis error:', err);
    }
  }

  /**
   * Warm attention chime before teaching or explaining
   */
  playAttentionChime() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.8);

      osc.connect(gain);
      gain.connect(this.analyser || this.ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.8);
    });
  }
}

export const luminaAudio = new LuminaAudioEngine();
