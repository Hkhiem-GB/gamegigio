import { PopularityTier } from '../types/game';

class SoundEffectManager {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private lastTickTime: number = 0;
  private listeners: Set<(muted: boolean) => void> = new Set();
  private noiseBuffer: AudioBuffer | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('gamegigio_muted');
      this.isMuted = savedMute === 'true';
    }
  }

  public subscribe(listener: (muted: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.isMuted));
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('gamegigio_muted', String(muted));
    }
    if (this.masterGain && this.audioCtx) {
      try {
        const now = this.audioCtx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(muted ? 0 : 0.8, now);
      } catch {
        // Safe fallback
      }
    }
    this.notify();
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Safe getter for AudioContext & Master Gain Node, initialized only after user gesture.
   */
  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.8, this.audioCtx.currentTime);
        this.masterGain.connect(this.audioCtx.destination);
      }
    }

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }

    if (this.isMuted) return null;
    return this.audioCtx;
  }

  private getMasterOutput(ctx: AudioContext): AudioNode {
    if (!this.masterGain) {
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.8, ctx.currentTime);
      this.masterGain.connect(ctx.destination);
    }
    return this.masterGain;
  }

  /**
   * Helper to generate a brief white noise buffer for crisp mechanical transients & sweeps.
   */
  private getNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (this.noiseBuffer && this.noiseBuffer.sampleRate === ctx.sampleRate) {
      return this.noiseBuffer;
    }
    const bufferSize = ctx.sampleRate * 0.1; // 100ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  /**
   * A. Sound 1: Spin Start (Arcade Power-Up / Electronic Launch Impact)
   * Punchy electronic drop + rising energizing whoosh
   */
  public playSpinStart() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const master = this.getMasterOutput(ctx);

      // 1. Initial Punch Impact (Low punch: 180Hz -> 55Hz)
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(180, now);
      subOsc.frequency.exponentialRampToValueAtTime(55, now + 0.15);

      subGain.gain.setValueAtTime(0.35, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      subOsc.connect(subGain);
      subGain.connect(master);
      subOsc.start(now);
      subOsc.stop(now + 0.17);

      // 2. Rising Electronic Laser / Power-up Sweep (240Hz -> 820Hz)
      const sweepOsc = ctx.createOscillator();
      const sweepGain = ctx.createGain();
      sweepOsc.type = 'triangle';
      sweepOsc.frequency.setValueAtTime(240, now);
      sweepOsc.frequency.exponentialRampToValueAtTime(820, now + 0.28);

      sweepGain.gain.setValueAtTime(0.01, now);
      sweepGain.gain.linearRampToValueAtTime(0.2, now + 0.1);
      sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      sweepOsc.connect(sweepGain);
      sweepGain.connect(master);
      sweepOsc.start(now);
      sweepOsc.stop(now + 0.31);

      // 3. High Shimmer Whoosh
      const noise = ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer(ctx);
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(700, now);
      filter.frequency.exponentialRampToValueAtTime(2800, now + 0.25);
      filter.Q.setValueAtTime(3.0, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.08, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(master);
      noise.start(now);
      noise.stop(now + 0.27);
    } catch {
      // Safe fallback
    }
  }

  /**
   * B. Sound 2: Marker Tick (Arcade Gaming Ratchet / Electronic Click)
   * Synchronized to each card passing the center line.
   * Throttled to min 30ms so rapid motion feels like a thrilling smooth roll.
   */
  public playTick(velocityRatio: number = 0.5) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    if (now - this.lastTickTime < 0.028) {
      return;
    }
    this.lastTickTime = now;

    try {
      const master = this.getMasterOutput(ctx);

      // Modulate frequency based on velocity
      // Fast: high snappy transient 1200Hz
      // Slow: deeper, suspenseful mechanical ratchet 800Hz
      const baseFreq = 780 + velocityRatio * 460;
      const decayDuration = Math.max(0.012, 0.024 * (1 - velocityRatio * 0.4));

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.45, now + decayDuration);

      const vol = 0.08 + Math.min(velocityRatio, 1) * 0.1;
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + decayDuration);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + decayDuration + 0.005);

      // Micro-snap transient (gives that arcade tactile satisfaction)
      const snapNoise = ctx.createBufferSource();
      snapNoise.buffer = this.getNoiseBuffer(ctx);
      const snapFilter = ctx.createBiquadFilter();
      snapFilter.type = 'highpass';
      snapFilter.frequency.setValueAtTime(2400, now);

      const snapGain = ctx.createGain();
      snapGain.gain.setValueAtTime(0.04, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.008);

      snapNoise.connect(snapFilter);
      snapFilter.connect(snapGain);
      snapGain.connect(master);
      snapNoise.start(now);
      snapNoise.stop(now + 0.01);
    } catch {
      // Safe fallback
    }
  }

  /**
   * C. Sound 3: Stop & Winner Lock-in Sound (Arcade Target Lock / Metallic Thump)
   * Deep sub-bass punch + electronic locking chime.
   * Plays EXACTLY once when wheel halts at target card.
   */
  public playWin(tier: PopularityTier = 'gray') {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const master = this.getMasterOutput(ctx);

      // 1. Deep Sub Bass Impact (85Hz -> 36Hz)
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(95, now);
      bassOsc.frequency.exponentialRampToValueAtTime(36, now + 0.38);

      bassGain.gain.setValueAtTime(0.4, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

      bassOsc.connect(bassGain);
      bassGain.connect(master);
      bassOsc.start(now);
      bassOsc.stop(now + 0.43);

      // 2. Dual Metallic / Digital Latch Chimes (Locking Confirmation)
      const freqs = tier === 'red' ? [587.33, 880, 1174.66] : [523.25, 783.99]; // D or C chord
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now);

        const chordVol = 0.14 / (i + 1);
        gain.gain.setValueAtTime(chordVol, now + i * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5 + i * 0.05);

        osc.connect(gain);
        gain.connect(master);
        osc.start(now + i * 0.03);
        osc.stop(now + 0.55 + i * 0.05);
      });
    } catch {
      // Safe fallback
    }
  }

  /**
   * D. Sound 4: Modal Reveal (Exciting Arcade Gaming Reward Fanfare)
   * Sparkling ascending 3-note arpeggio + warm celebratory sweep.
   */
  public playModalReveal(tier: PopularityTier = 'gray') {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const master = this.getMasterOutput(ctx);

      // 1. Filtered shimmer sweep (Arcade portal reveal)
      const noise = ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer(ctx);
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.exponentialRampToValueAtTime(2600, now + 0.32);
      filter.Q.setValueAtTime(2.2, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.06, now);
      noiseGain.gain.linearRampToValueAtTime(0.12, now + 0.12);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(master);
      noise.start(now);
      noise.stop(now + 0.36);

      // 2. Ascending 3-note celebratory arpeggio
      // Red: High C-E-G (523, 659, 1046Hz)
      // Others: G-B-D (392, 493, 587Hz)
      const notes = tier === 'red' ? [523.25, 659.25, 1046.5] : [392.0, 493.88, 587.33];
      notes.forEach((freq, index) => {
        const noteStart = now + index * 0.07;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.001, noteStart);
        gain.gain.linearRampToValueAtTime(0.12, noteStart + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.38);

        osc.connect(gain);
        gain.connect(master);
        osc.start(noteStart);
        osc.stop(noteStart + 0.4);
      });
    } catch {
      // Safe fallback
    }
  }
}

export const soundManager = new SoundEffectManager();
