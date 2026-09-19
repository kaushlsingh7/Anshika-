/**
 * ROMANTIC AUDIO ENGINE (Web Audio API)
 * Lush romantic ambient piano, warm chords, arpeggiated melodies,
 * and celestial touch chimes.
 */

class RomanticAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.masterGain = null;
    this.reverbNode = null;
    this.filterNode = null;
    this.timerId = null;
    this.step = 0;
    this.volume = 0.65;

    // Romantic Chord Progressions (Frequencies in Hz)
    // Cmaj7 -> Am9 -> Fmaj7 -> Gsus4 / Em7
    this.chords = [
      // Cmaj7 (C3, G3, B3, E4)
      [130.81, 196.00, 246.94, 329.63],
      // Am9 (A2, E3, G3, C4, B4)
      [110.00, 164.81, 196.00, 261.63, 493.88],
      // Fmaj7 (F2, C3, A3, E4)
      [87.31, 130.81, 220.00, 329.63],
      // G6 / Em7 (G2, D3, B3, E4, G4)
      [98.00, 146.83, 246.94, 329.63, 392.00]
    ];

    // High melodic sweet notes (C5, D5, E5, G5, A5, B5, C6)
    this.melodyNotes = [
      523.25, 587.33, 659.25, 783.99, 880.00, 987.77, 1046.50
    ];

    this.currentChordIndex = 0;
    this.visualizerCallbacks = [];
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    // Master volume
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

    // Warm Lowpass filter for dreamy acoustic warmth
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(1400, this.ctx.currentTime);
    this.filterNode.Q.setValueAtTime(1.5, this.ctx.currentTime);

    // Delay/Reverb Simulation
    this.delayNode = this.ctx.createDelay();
    this.delayNode.delayTime.setValueAtTime(0.45, this.ctx.currentTime);

    this.delayGain = this.ctx.createGain();
    this.delayGain.gain.setValueAtTime(0.38, this.ctx.currentTime);

    // Routing
    this.delayNode.connect(this.delayGain);
    this.delayGain.connect(this.delayNode);
    this.delayGain.connect(this.filterNode);

    this.filterNode.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
  }

  play() {
    this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.isPlaying) return;
    this.isPlaying = true;

    // Start composition loop
    this.tick();
    this.timerId = setInterval(() => this.tick(), 650);

    this.notifyStatus(true);
  }

  pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.notifyStatus(false);
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.05);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  tick() {
    if (!this.ctx || !this.isPlaying) return;

    const chord = this.chords[this.currentChordIndex];
    const time = this.ctx.currentTime;

    // Play a sustained chord base on beat 0
    if (this.step % 8 === 0) {
      this.playChord(chord, 3.5, 0.18);
      this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;
    }

    // Play gentle arpeggiated piano note on each beat
    const noteIndex = (this.step % chord.length);
    const baseFreq = chord[noteIndex];
    this.playTone(baseFreq, 1.2, 0.12, 'sine');

    // Occasionally play a high celestial twinkle
    if (Math.random() > 0.45) {
      const melodyFreq = this.melodyNotes[Math.floor(Math.random() * this.melodyNotes.length)];
      setTimeout(() => {
        if (this.isPlaying && this.ctx) {
          this.playTone(melodyFreq, 1.8, 0.14, 'triangle');
        }
      }, 300);
    }

    this.step++;
    this.triggerVisualizer();
  }

  playChord(frequencies, duration, maxGain) {
    frequencies.forEach(freq => {
      this.playTone(freq, duration, maxGain / frequencies.length, 'sine');
    });
  }

  playTone(freq, duration, peakGain, type = 'sine') {
    if (!this.ctx || this.isMuted) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Smooth romantic envelope ADSR
      const t = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(peakGain, t + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc.connect(gain);
      gain.connect(this.filterNode);
      gain.connect(this.delayNode);

      osc.start(t);
      osc.stop(t + duration);
    } catch (e) {
      // Ignore transient audio error
    }
  }

  /**
   * Sound effect triggered on touch or interaction
   */
  playChime() {
    if (!this.ctx) this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const pentatonic = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    const freq = pentatonic[Math.floor(Math.random() * pentatonic.length)];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + 0.5);

    gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.85);

    this.triggerVisualizer();
  }

  onVisualizerTick(cb) {
    this.visualizerCallbacks.push(cb);
  }

  triggerVisualizer() {
    this.visualizerCallbacks.forEach(cb => cb());
  }

  notifyStatus(status) {
    const disc = document.getElementById('vinyl-disc');
    const playBtn = document.getElementById('play-toggle-btn');
    if (disc) {
      if (status) disc.classList.add('playing');
      else disc.classList.remove('playing');
    }
    if (playBtn) {
      playBtn.innerHTML = status
        ? `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`
        : `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>`;
    }
  }
}

// Singleton export
window.romanticAudio = new RomanticAudioEngine();
