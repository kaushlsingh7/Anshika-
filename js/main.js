/**
 * ROMANTIC INTERACTION & UI LOGIC (Phone & Desktop Enhanced)
 * Curtain unveils, 3D card tilts (touch & mouse & gyro), interactive wax-seal envelope,
 * lightbox modal, audio controls, and love shower counter.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Entrance Curtain Gate
  const entranceGate = document.getElementById('entrance-gate');
  const enterBtn = document.getElementById('enter-btn');
  const pulsingHeart = document.getElementById('pulsing-heart-intro');

  function openCurtain() {
    if (!entranceGate) return;
    entranceGate.classList.add('unveiled');

    // Start background music
    if (window.romanticAudio) {
      window.romanticAudio.play();
    }

    // Launch celebratory heart burst from center
    if (window.romanticVfx) {
      window.romanticVfx.createHeartBurst(window.innerWidth / 2, window.innerHeight / 2, 30);
    }
  }

  if (enterBtn) enterBtn.addEventListener('click', openCurtain);
  if (pulsingHeart) pulsingHeart.addEventListener('click', openCurtain);

  // 2. Music Player Controls
  const playToggleBtn = document.getElementById('play-toggle-btn');
  const muteToggleBtn = document.getElementById('mute-toggle-btn');
  const volumeSlider = document.getElementById('volume-slider');

  if (playToggleBtn) {
    playToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.romanticAudio) {
        window.romanticAudio.toggle();
      }
    });
  }

  if (muteToggleBtn) {
    muteToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.romanticAudio) {
        const isMuted = window.romanticAudio.toggleMute();
        muteToggleBtn.innerHTML = isMuted
          ? `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`
          : `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
      }
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      e.stopPropagation();
      if (window.romanticAudio) {
        window.romanticAudio.setVolume(parseFloat(e.target.value));
      }
    });
  }

  // 3. Header Scroll Effect
  const header = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 40) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }
  }, { passive: true });

  // 4. Interactive 3D Card Tilt (Mouse & Phone Touch Drag)
  const cards = document.querySelectorAll('.gallery-card-3d');
  cards.forEach(card => {
    const inner = card.querySelector('.gallery-card-inner');
    const shine = card.querySelector('.card-shine');

    const handleTilt = (clientX, clientY) => {
      const rect = card.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      if (inner) {
        inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      }

      if (shine) {
        const px = (x / rect.width) * 100;
        const py = (y / rect.height) * 100;
        shine.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255, 255, 255, 0.35) 0%, transparent 60%)`;
      }
    };

    card.addEventListener('pointermove', (e) => {
      handleTilt(e.clientX, e.clientY);
    });

    card.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches.length > 0) {
        handleTilt(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    card.addEventListener('pointerleave', () => {
      if (inner) inner.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    });

    card.addEventListener('touchend', () => {
      if (inner) inner.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    }, { passive: true });
  });

  // 5. Phone Gyroscope Ambient Tilt for Hero Card
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (e) => {
      const heroCard = document.querySelector('.hero-main-card');
      if (heroCard && e.gamma !== null && e.beta !== null) {
        const tiltX = Math.max(-12, Math.min(12, e.gamma * 0.3));
        const tiltY = Math.max(-12, Math.min(12, (e.beta - 40) * 0.25));
        heroCard.style.transform = `rotateY(${tiltX}deg) rotateX(${-tiltY}deg)`;
      }
    }, { passive: true });
  }

  // 6. Interactive Wax-Sealed Envelope
  const envelope = document.getElementById('wax-envelope');
  if (envelope) {
    envelope.addEventListener('click', (e) => {
      envelope.classList.toggle('opened');
      const rect = envelope.getBoundingClientRect();
      if (window.romanticVfx) {
        window.romanticVfx.createHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 22);
      }
      if (window.romanticAudio) {
        window.romanticAudio.playChime();
      }
    });
  }

  // 7. Lightbox Modal Logic
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxPoem = document.getElementById('lightbox-poem');
  const lightboxNote = document.getElementById('lightbox-note');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const lightboxHeartBtn = document.getElementById('lightbox-heart-btn');
  const lightboxHeartCount = document.getElementById('lightbox-heart-count');

  let currentModalLikes = 284;

  window.openLightbox = function(imgSrc, title, poem, note) {
    if (!lightbox) return;
    lightboxImg.src = imgSrc;
    lightboxTitle.textContent = title;
    lightboxPoem.textContent = poem;
    lightboxNote.textContent = note;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (window.romanticAudio) {
      window.romanticAudio.playChime();
    }
  };

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  if (lightboxHeartBtn) {
    lightboxHeartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentModalLikes++;
      if (lightboxHeartCount) lightboxHeartCount.textContent = currentModalLikes;
      const rect = lightboxHeartBtn.getBoundingClientRect();
      if (window.romanticVfx) {
        window.romanticVfx.createHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 18);
      }
      if (window.romanticAudio) {
        window.romanticAudio.playChime();
      }
    });
  }

  // 8. Interactive Love Shower Trigger Button
  const heartBlastTrigger = document.getElementById('heart-blast-trigger');
  const sentCountDisplay = document.getElementById('hearts-sent-count');
  let heartsSent = 1314;

  if (heartBlastTrigger) {
    heartBlastTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      heartsSent += 7;
      if (sentCountDisplay) sentCountDisplay.textContent = heartsSent.toLocaleString();

      const rect = heartBlastTrigger.getBoundingClientRect();
      if (window.romanticVfx) {
        window.romanticVfx.createHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 30);
      }
      if (window.romanticAudio) {
        window.romanticAudio.playChime();
      }
    });
  }

  // 9. Individual Gallery Card Like Buttons
  const likeButtons = document.querySelectorAll('.reaction-btn');
  likeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const countSpan = btn.querySelector('.reaction-count');
      if (countSpan) {
        let count = parseInt(countSpan.textContent, 10);
        countSpan.textContent = count + 1;
      }
      const rect = btn.getBoundingClientRect();
      if (window.romanticVfx) {
        window.romanticVfx.createHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 16);
      }
      if (window.romanticAudio) {
        window.romanticAudio.playChime();
      }
    });
  });
});
