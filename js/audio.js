/**
 * ROMANTIC AUDIO ENGINE
 * Uses the supplied audio files:
 *   assets/audio/bgm.mp3
 *   assets/audio/touch-tone.mp3
 *
 * BGM starts after the visitor clicks "Enter Our World" so it
 * complies with normal browser autoplay restrictions.
 */

class RomanticAudioEngine {
  constructor() {
    this.isPlaying = false;
    this.isMuted = false;
    this.volume = 0.65;
    this.touchVolume = 0.55;

    this.bgm = new Audio("assets/audio/bgm.mp3");
    this.bgm.loop = true;
    this.bgm.preload = "auto";
    this.bgm.volume = this.volume;

    this.touch = new Audio("assets/audio/touch-tone.mp3");
    this.touch.preload = "auto";
    this.touch.volume = this.touchVolume;

    this.bgm.addEventListener("play", () => {
      this.isPlaying = true;
      this.notifyStatus(true);
    });

    this.bgm.addEventListener("pause", () => {
      this.isPlaying = false;
      this.notifyStatus(false);
    });

    this.bgm.addEventListener("ended", () => {
      if (this.bgm.loop) {
        this.bgm.currentTime = 0;
      }
    });
  }

  play() {
    if (this.isMuted) {
      this.isMuted = false;
    }

    const promise = this.bgm.play();

    if (promise && typeof promise.catch === "function") {
      promise.catch((error) => {
        console.warn("Background music could not start:", error);
      });
    }

    this.isPlaying = true;
    this.notifyStatus(true);
  }

  pause() {
    this.bgm.pause();
    this.isPlaying = false;
    this.notifyStatus(false);
  }

  toggle() {
    if (this.bgm.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, Number(val) || 0));

    if (!this.isMuted) {
      this.bgm.volume = this.volume;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;

    this.bgm.volume = this.isMuted ? 0 : this.volume;

    return this.isMuted;
  }

  /**
   * Plays the supplied touch tone.
   * A fresh clone allows rapid consecutive touches without cutting
   * off the previous sound.
   */
  playChime() {
    if (this.isMuted) return;

    try {
      const sound = this.touch.cloneNode(true);
      sound.volume = this.touchVolume;
      sound.currentTime = 0;

      const promise = sound.play();

      if (promise && typeof promise.catch === "function") {
        promise.catch((error) => {
          console.warn("Touch tone could not play:", error);
        });
      }

      sound.addEventListener("ended", () => {
        sound.remove();
      });
    } catch (error) {
      console.warn("Touch tone error:", error);
    }
  }

  onVisualizerTick(cb) {
    this.visualizerCallbacks = this.visualizerCallbacks || [];
    this.visualizerCallbacks.push(cb);
  }

  triggerVisualizer() {
    if (!this.visualizerCallbacks) return;
    this.visualizerCallbacks.forEach((cb) => {
      try {
        cb();
      } catch (error) {}
    });
  }

  notifyStatus(status) {
    const disc = document.getElementById("vinyl-disc");
    const playBtn = document.getElementById("play-toggle-btn");

    if (disc) {
      disc.classList.toggle("playing", status);
    }

    if (playBtn) {
      playBtn.innerHTML = status
        ? `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`
        : `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>`;
    }
  }
}

window.romanticAudio = new RomanticAudioEngine();
