/**
 * Zante's Matric Maths Studio — Crystalline & Viral Meme Web Audio Sound Engine
 *
 * 100% pure synthetic Web Audio API synthesizer + Web Speech API verbal voice-over cues.
 * Zero external audio assets (.mp3/.wav), zero network latency, zero 404 errors.
 *
 * Includes dual audio modes:
 * - "classy": Elegant Apple-tier glassmorphism acoustic chimes
 * - "meme": Unhinged viral meme stingers (Vine Boom, Airhorn, Camera Shutters, Sad Trombone)
 */

import type { AudioMode, SoundEngine } from '../types/audio.ts';
import { getFreshVoiceLine, type BanterCategory } from './banterMemory.ts';

export class CrystallineSoundEngine implements SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled = true;
  private mode: AudioMode = 'meme';
  private voiceEnabled = true;
  private unlocked = false;
  private soundListeners: Array<(soundName: string) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const savedAudio = localStorage.getItem('zante_audio_enabled');
        if (savedAudio !== null) {
          this.enabled = savedAudio === 'true';
        }
        const savedMode = localStorage.getItem('zante_audio_flavor') as AudioMode | null;
        if (savedMode === 'classy' || savedMode === 'meme') {
          this.mode = savedMode;
        } else {
          this.mode = 'meme';
        }
        const savedVoice = localStorage.getItem('zante_voice_enabled');
        if (savedVoice !== null) {
          this.voiceEnabled = savedVoice === 'true';
        }
      } catch {
        // LocalStorage might be disabled in private mode
      }
      this.attachUnlockListener();
    }
  }

  /**
   * One-time user gesture audio unlock routine
   */
  private attachUnlockListener(): void {
    if (typeof window === 'undefined') return;

    const unlock = () => {
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('keydown', unlock);
        window.removeEventListener('click', unlock);
      }
    };

    window.addEventListener('pointerdown', unlock, { once: true, passive: true });
    window.addEventListener('keydown', unlock, { once: true, passive: true });
    window.addEventListener('click', unlock, { once: true, passive: true });
  }

  /**
   * Register visual listener when sound effect is triggered (even if muted)
   */
  public onSoundTriggered(callback: (soundName: string) => void): () => void {
    this.soundListeners.push(callback);
    return () => {
      this.soundListeners = this.soundListeners.filter((cb) => cb !== callback);
    };
  }

  private notifySound(soundName: string): void {
    for (const listener of this.soundListeners) {
      try {
        listener(soundName);
      } catch {
        // Safe callback execution
      }
    }
  }

  /**
   * Initialize or resume the Web Audio context
   */
  public init(): void {
    if (typeof window === 'undefined' || !this.enabled) return;

    try {
      if (!this.ctx) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      }

      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.unlocked = true;
    } catch {
      // AudioContext creation might fail in non-interactive environments
    }
  }

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    this.init();
    return this.ctx;
  }

  // ==========================================
  // Audio Mode & Speech Controls
  // ==========================================

  public getAudioMode(): AudioMode {
    return this.mode;
  }

  public setAudioMode(mode: AudioMode): void {
    this.mode = mode;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('zante_audio_flavor', mode);
      } catch {
        // Ignore storage exceptions
      }
    }
    if (mode === 'meme') {
      this.playAirhorn();
    } else {
      this.playGlassChime();
    }
  }

  public toggleAudioMode(): AudioMode {
    const nextMode: AudioMode = this.mode === 'classy' ? 'meme' : 'classy';
    this.setAudioMode(nextMode);
    return nextMode;
  }

  public isVoiceEnabled(): boolean {
    return this.voiceEnabled;
  }

  public toggleVoice(): boolean {
    this.voiceEnabled = !this.voiceEnabled;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('zante_voice_enabled', String(this.voiceEnabled));
      } catch {
        // Ignore storage exceptions
      }
    }
    if (this.voiceEnabled) {
      this.speakReaction('Voice reactions enabled!');
    }
    return this.voiceEnabled;
  }

  public toggleMute(): boolean {
    this.enabled = !this.enabled;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('zante_audio_enabled', String(this.enabled));
      } catch {
        // Ignore storage exceptions
      }
    }
    if (this.enabled) {
      this.playTapPop();
    } else {
      this.cancelSpeech();
    }
    return this.enabled;
  }

  public isMuted(): boolean {
    return !this.enabled;
  }

  // ==========================================
  // Web Speech API Verbal Voice Engine
  // ==========================================

  public speakReaction(text: string, options?: { pitch?: number; rate?: number }): void {
    this.notifySound('Voice Reaction');
    if (!this.enabled || !this.voiceEnabled || typeof window === 'undefined') return;
    if (!('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = options?.pitch ?? 1.12;
      utterance.rate = options?.rate ?? 1.04;

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const preferred = voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Google UK English Female') ||
              v.name.includes('Samantha') ||
              v.name.includes('Victoria') ||
              v.name.includes('Karen') ||
              v.name.includes('Zira') ||
              v.name.includes('Natural'))
        ) || voices.find((v) => v.lang.startsWith('en'));

        if (preferred) {
          utterance.voice = preferred;
        }
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore in headless/restricted environments
    }
  }

  /**
   * Speaks a non-repeating high-status banter line selected via LRU memory buffer
   */
  public speakFreshBanter(category: BanterCategory = 'praise'): string {
    const line = getFreshVoiceLine(category);
    this.speakReaction(line);
    return line;
  }

  public cancelSpeech(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
    }
  }

  // ==========================================
  // Classic Apple Glass Synthesizer
  // ==========================================

  public playGlassChime(): void {
    this.notifySound('Glass Chime');
    const ctx = this.getContext();
    if (!ctx) return;

    const frequencies = [1046.5, 1318.5, 1567.9, 1975.5, 2093.0];
    const now = ctx.currentTime;

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.035);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(4500, now);

      gain.gain.setValueAtTime(0.0001, now + idx * 0.035);
      gain.gain.linearRampToValueAtTime(0.11 / (idx + 1), now + idx * 0.035 + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.035 + 1.1);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.035);
      osc.stop(now + idx * 0.035 + 1.15);
    });
  }

  public playTapPop(): void {
    this.notifySound('Tap Pop');
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.035);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
  }

  public playStreakFanfare(tier: number): void {
    if (tier < 0 || tier > 4) {
      throw new Error(`Invalid tier: ${tier}. Streak fanfare tier must be between 0 and 4.`);
    }
    this.notifySound('Streak Fanfare');

    const ctx = this.getContext();
    if (!ctx) return;

    const baseNotes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
    const count = 3 + tier;
    const notes = baseNotes.slice(0, count);
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.065);

      gain.gain.setValueAtTime(0.0001, now + idx * 0.065);
      gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.065 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.065 + 1.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.065);
      osc.stop(now + idx * 0.065 + 1.45);
    });
  }

  public playErrorChime(): void {
    this.notifySound('Error Chime');
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const tones = [392.0, 349.23];

    tones.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.11);

      gain.gain.setValueAtTime(0.0001, now + idx * 0.11);
      gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.11 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.11 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.11);
      osc.stop(now + idx * 0.11 + 0.5);
    });
  }

  public playConfettiBlast(): void {
    this.notifySound('Confetti Blast');
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const bufferSize = Math.floor(ctx.sampleRate * 0.22);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(3600, now + 0.22);
    filter.Q.setValueAtTime(3.2, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.11, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.23);

    this.playGlassChime();
  }

  public playShieldShatter(): void {
    this.notifySound('Shield Shatter');
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const shatterFrequencies = [2400, 3600, 4800, 1800];

    shatterFrequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.02);
      osc.frequency.exponentialRampToValueAtTime(600, now + idx * 0.02 + 0.35);

      gain.gain.setValueAtTime(0.0001, now + idx * 0.02);
      gain.gain.linearRampToValueAtTime(0.09, now + idx * 0.02 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.02 + 0.38);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.02);
      osc.stop(now + idx * 0.02 + 0.4);
    });
  }

  // ==========================================
  // Synthesized Viral Meme Stingers
  // ==========================================

  /**
   * 1. Vine Boom / Bass Drop
   * Deep sub-bass punch with saturation and 160Hz -> 28Hz exponential dive
   */
  public playVineBoom(): void {
    this.notifySound('Vine Boom');
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(175, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 1.25);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(380, now);
    filter.frequency.exponentialRampToValueAtTime(65, now + 1.25);
    filter.Q.setValueAtTime(2.5, now);

    gain.gain.setValueAtTime(0.42, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);

    const punchOsc = ctx.createOscillator();
    const punchGain = ctx.createGain();
    punchOsc.type = 'triangle';
    punchOsc.frequency.setValueAtTime(80, now);
    punchOsc.frequency.exponentialRampToValueAtTime(20, now + 0.08);
    punchGain.gain.setValueAtTime(0.3, now);
    punchGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    punchOsc.connect(punchGain);
    punchGain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.35);
    punchOsc.start(now);
    punchOsc.stop(now + 0.09);
  }

  /**
   * 2. Sad Trombone ("Wah-wah-wah-waaaah")
   * 4 comic descending notes with pitch bend & wah filter
   */
  public playSadTrombone(): void {
    this.notifySound('Sad Trombone');
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [
      { freq: 293.66, dur: 0.28, delay: 0 },       // D4
      { freq: 277.18, dur: 0.28, delay: 0.32 },    // C#4
      { freq: 261.63, dur: 0.28, delay: 0.64 },    // C4
      { freq: 246.94, dur: 0.85, delay: 0.96 },    // B3
    ];

    notes.forEach((note, idx) => {
      const start = now + note.delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(note.freq, start);

      if (idx === 3) {
        osc.frequency.exponentialRampToValueAtTime(196.0, start + note.dur);
      }

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, start);
      filter.frequency.linearRampToValueAtTime(1400, start + note.dur * 0.4);
      filter.frequency.linearRampToValueAtTime(600, start + note.dur);
      filter.Q.setValueAtTime(4.0, start);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.12, start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + note.dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + note.dur + 0.05);
    });
  }

  /**
   * 3. "Bruh" Thud / Bombastic Side-Eye
   */
  public playBruhThud(): void {
    this.notifySound('Bruh Thud');
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.35);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  /**
   * 4. Sparkly "Baddie / Fairy Dust" Shimmer
   */
  public playBaddieShimmer(): void {
    this.notifySound('Baddie Shimmer');
    const ctx = this.getContext();
    if (!ctx) return;

    const freqs = [1046.5, 1318.5, 1567.9, 1975.5, 2349.3, 2960.0, 3520.0, 4186.0];
    const now = ctx.currentTime;

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + idx * 0.042;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.09 / (idx * 0.2 + 1), start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.75);
    });
  }

  /**
   * 5. Paparazzi Camera Shutter 📸 (Mechanical double-click)
   */
  public playCameraShutter(): void {
    this.notifySound('Camera Shutter');
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const clicks = [0, 0.07];

    clicks.forEach((delay, idx) => {
      const start = now + delay;
      const bufferSize = Math.floor(ctx.sampleRate * 0.035);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = idx === 0 ? 'highpass' : 'bandpass';
      filter.frequency.setValueAtTime(idx === 0 ? 1800 : 2600, start);
      filter.Q.setValueAtTime(2.0, start);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.18, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.035);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(start);
      noise.stop(start + 0.04);
    });
  }

  /**
   * 6. Reggae Airhorn (Iconic triple blast 📯)
   */
  public playAirhorn(): void {
    this.notifySound('Airhorn');
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const hornPitches = [466.16, 554.37, 698.46]; // Bb4, Db5, F5
    const blasts = [
      { delay: 0, dur: 0.14 },
      { delay: 0.17, dur: 0.14 },
      { delay: 0.35, dur: 0.42 },
    ];

    blasts.forEach((blast) => {
      const start = now + blast.delay;

      hornPitches.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = idx === 0 ? 'sawtooth' : 'square';
        osc.frequency.setValueAtTime(freq, start);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, start);
        filter.Q.setValueAtTime(2.8, start);

        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.linearRampToValueAtTime(0.07, start + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + blast.dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + blast.dur + 0.02);
      });
    });
  }

  /**
   * 7. Game Show Jackpot (Coin Shower Cascade 💰)
   */
  public playJackpot(): void {
    this.notifySound('Jackpot');
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98, 2093.0];
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const start = now + idx * 0.06;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.12, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.65);
    });
  }
}

export const soundEngine = new CrystallineSoundEngine();
