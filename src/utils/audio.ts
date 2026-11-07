/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Web Audio API context management
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Text-to-Speech (TTS) for Special Education Accessibility
 * Speaks Korean text at an accessible, friendly cadence (0.9x speed)
 */
export function speakKorean(text: string) {
  if (!('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.9; // Slightly slower, clear enunciation
    utterance.pitch = 1.05; // Friendly, warm pitch

    // Try finding a Korean voice
    const voices = window.speechSynthesis.getVoices();
    const koreanVoice = voices.find((v) => v.lang.includes('ko') || v.lang.includes('KO'));
    if (koreanVoice) {
      utterance.voice = koreanVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis not available or blocked', e);
  }
}

/**
 * Convenience Store Door Chime: "솔 - 미 - 레 - 도~" (Ding Dong Dang Dong)
 */
export function playDoorChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const notes = [
      { freq: 784.0, time: 0, dur: 0.25 },     // G5 (솔)
      { freq: 659.25, time: 0.25, dur: 0.25 },  // E5 (미)
      { freq: 587.33, time: 0.5, dur: 0.25 },   // D5 (레)
      { freq: 523.25, time: 0.75, dur: 0.5 },   // C5 (도)
    ];

    notes.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + time);

      gain.gain.setValueAtTime(0, now + time);
      gain.gain.linearRampToValueAtTime(0.2, now + time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + dur + 0.05);
    });
  } catch {
    // Audio context may require user gesture
  }
}

/**
 * Barcode Scanner Beep: "삐-빅!"
 */
export function playBarcodeBeep() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // First high beep
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(2400, now);
    gain1.gain.setValueAtTime(0.22, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.08);

    // Second slightly higher chirp
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(2800, now + 0.09);
    gain2.gain.setValueAtTime(0.25, now + 0.09);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.09);
    osc2.stop(now + 0.18);
  } catch {
    // Fallback
  }
}

/**
 * Cash Register Ding / Coin Clink
 */
export function playCoinSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Metallic ring
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  } catch {
    // Fallback
  }
}

/**
 * Card Tap / Payment Beep
 */
export function playCardTapSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1046.5, now); // C6
    osc.frequency.setValueAtTime(1318.51, now + 0.1); // E6

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  } catch {
    // Fallback
  }
}

/**
 * Success Celebration Fanfare (When mission or drill succeeds)
 */
export function playSuccessFanfare() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const notes = [
      { freq: 523.25, time: 0, dur: 0.15 },     // C5
      { freq: 659.25, time: 0.15, dur: 0.15 },  // E5
      { freq: 783.99, time: 0.3, dur: 0.15 },   // G5
      { freq: 1046.50, time: 0.45, dur: 0.4 },  // C6
    ];

    notes.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + time);

      gain.gain.setValueAtTime(0, now + time);
      gain.gain.linearRampToValueAtTime(0.25, now + time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + dur + 0.05);
    });
  } catch {
    // Fallback
  }
}

/**
 * Error / Gentle Hint Sound (Warm woodblock, never harsh)
 */
export function playGentleHintSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(260, now + 0.15);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  } catch {
    // Fallback
  }
}

/**
 * Cheerful Upbeat Background Music Synthesizer (BGM)
 * Built with Web Audio API: bouncy marimba melody + warm chords + walking bassline.
 */
class BGMManager {
  private isPlaying = false;
  private intervalId: number | null = null;
  private currentStep = 0;
  private volume = 0.12;

  // Upbeat, bouncy pentatonic / major pop progression in C Major
  private melodyNotes: (number | null)[] = [
    523.25, 659.25, 783.99, 659.25, // C5, E5, G5, E5
    880.00, 783.99, 659.25, null,   // A5, G5, E5
    587.33, 659.25, 783.99, 880.00, // D5, E5, G5, A5
    783.99, 659.25, 523.25, null,   // G5, E5, C5
    659.25, 783.99, 1046.5, 783.99, // E5, G5, C6, G5
    880.00, 1046.5, 880.00, 783.99, // A5, C6, A5, G5
    659.25, 587.33, 523.25, 587.33, // E5, D5, C5, D5
    523.25, null,   523.25, null    // C5, -, C5, -
  ];

  private bassNotes: (number | null)[] = [
    130.81, null, 130.81, null, // C3
    174.61, null, 174.61, null, // F3
    146.83, null, 146.83, null, // D3
    196.00, null, 196.00, null, // G3
    164.81, null, 164.81, null, // E3
    174.61, null, 174.61, null, // F3
    196.00, null, 196.00, null, // G3
    130.81, null, 130.81, null  // C3
  ];

  public start() {
    if (this.isPlaying) return;
    try {
      getAudioContext();
      this.isPlaying = true;
      this.currentStep = 0;

      // 120 BPM 16th-note step time = 125ms
      const stepDuration = 140; // upbeat bounce
      this.intervalId = window.setInterval(() => {
        this.tick();
      }, stepDuration);
    } catch (e) {
      console.warn('Could not start BGM', e);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private tick() {
    if (!this.isPlaying) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const step = this.currentStep % this.melodyNotes.length;

      // Play melody note
      const mFreq = this.melodyNotes[step];
      if (mFreq) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Marimba-like bell tone
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(mFreq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(this.volume, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
      }

      // Play bass note
      const bFreq = this.bassNotes[step];
      if (bFreq) {
        const oscB = ctx.createOscillator();
        const gainB = ctx.createGain();

        oscB.type = 'sine';
        oscB.frequency.setValueAtTime(bFreq, now);

        gainB.gain.setValueAtTime(0, now);
        gainB.gain.linearRampToValueAtTime(this.volume * 0.9, now + 0.02);
        gainB.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

        oscB.connect(gainB);
        gainB.connect(ctx.destination);
        oscB.start(now);
        oscB.stop(now + 0.21);
      }

      this.currentStep = (this.currentStep + 1) % this.melodyNotes.length;
    } catch {
      // Audio clock jitter guard
    }
  }
}

export const bgmManager = new BGMManager();
