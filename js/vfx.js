/**
 * ROMANTIC VFX & TOUCH ANIMATION ENGINE (Phone & Desktop Optimized)
 * Falling rose petals with wind physics, touch/click heart explosions,
 * starlight cursor trails, and romantic shockwaves.
 */

class RomanticVfxEngine {
  constructor() {
    this.vfxCanvas = document.getElementById('vfx-canvas');
    this.trailCanvas = document.getElementById('trail-canvas');
    this.vfxCtx = null;
    this.trailCtx = null;

    this.petals = [];
    this.particles = [];
    this.trailParticles = [];
    this.ripples = [];

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.isMobile = window.innerWidth < 768 || ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

    // Wind physics influenced by user touch/cursor velocity
    this.wind = { x: 0.4, y: 1.1 };
    this.lastTouch = { x: this.width / 2, y: this.height / 2, time: Date.now() };

    this.init();
  }

  init() {
    if (!this.vfxCanvas || !this.trailCanvas) return;
    this.vfxCtx = this.vfxCanvas.getContext('2d');
    this.trailCtx = this.trailCanvas.getContext('2d');

    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Create initial romantic petals (mobile gets 20, desktop gets 40)
    const petalCount = this.isMobile ? 20 : 42;
    for (let i = 0; i < petalCount; i++) {
      this.petals.push(this.createPetal(true));
    }

    // Attach interaction listeners
    this.setupListeners();

    // Start animation loop
    requestAnimationFrame(() => this.loop());
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.isMobile = window.innerWidth < 768 || ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

    // High-DPI Sharp Rendering for Retina & AMOLED displays
    this.vfxCanvas.width = this.width * this.dpr;
    this.vfxCanvas.height = this.height * this.dpr;
    this.vfxCanvas.style.width = this.width + 'px';
    this.vfxCanvas.style.height = this.height + 'px';

    this.trailCanvas.width = this.width * this.dpr;
    this.trailCanvas.height = this.height * this.dpr;
    this.trailCanvas.style.width = this.width + 'px';
    this.trailCanvas.style.height = this.height + 'px';

    this.vfxCtx.setTransform(1, 0, 0, 1, 0, 0);
    this.vfxCtx.scale(this.dpr, this.dpr);

    this.trailCtx.setTransform(1, 0, 0, 1, 0, 0);
    this.trailCtx.scale(this.dpr, this.dpr);
  }

  createPetal(randomY = false) {
    const colors = [
      'rgba(255, 64, 110, ',
      'rgba(255, 105, 140, ',
      'rgba(230, 0, 70, ',
      'rgba(255, 182, 193, '
    ];
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -30,
      size: Math.random() * (this.isMobile ? 10 : 13) + 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 1.3 + 0.7,
      speedX: Math.random() * 1.0 - 0.5,
      angle: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      flip: Math.random() * Math.PI,
      flipSpeed: Math.random() * 0.04 + 0.01,
      opacity: Math.random() * 0.45 + 0.45
    };
  }

  setupListeners() {
    // Pointermove / Touchmove
    window.addEventListener('pointermove', (e) => {
      this.handleMove(e.clientX, e.clientY);
    }, { passive: true });

    // Touch tap or click
    window.addEventListener('pointerdown', (e) => {
      // Avoid triggering bursts on interactive inputs or sliders
      if (e.target && (e.target.tagName === 'INPUT' || e.target.closest('#music-player'))) {
        return;
      }
      const burstCount = this.isMobile ? 12 : 18;
      this.createHeartBurst(e.clientX, e.clientY, burstCount);
      this.createRipple(e.clientX, e.clientY);

      if (window.romanticAudio) {
        window.romanticAudio.playChime();
      }
    }, { passive: true });
  }

  handleMove(x, y) {
    const now = Date.now();
    const dt = Math.max(1, now - this.lastTouch.time);
    const dx = x - this.lastTouch.x;
    const dy = y - this.lastTouch.y;
    const speed = Math.sqrt(dx * dx + dy * dy) / dt;

    // Adjust wind slightly based on gesture
    this.wind.x = 0.4 + Math.min(Math.max(dx * 0.015, -2), 2);

    // Stardust trail
    const count = this.isMobile ? Math.min(2, Math.floor(speed) + 1) : Math.min(4, Math.floor(speed * 2) + 1);
    for (let i = 0; i < count; i++) {
      this.trailParticles.push({
        x: x + (Math.random() - 0.5) * 12,
        y: y + (Math.random() - 0.5) * 12,
        size: Math.random() * 3 + 1.2,
        speedX: (Math.random() - 0.5) * 1.0,
        speedY: (Math.random() - 0.5) * 1.0 - 0.4,
        life: 1.0,
        decay: Math.random() * 0.035 + 0.025,
        color: Math.random() > 0.35 ? '#ff3366' : '#ffd166',
        isHeart: Math.random() > 0.7
      });
    }

    this.lastTouch = { x, y, time: now };
  }

  createHeartBurst(x, y, count = 15) {
    const colors = ['#ff2a6d', '#ff5983', '#ff85a1', '#fda085', '#ffffff', '#ffd166'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * (this.isMobile ? 4.5 : 6) + 1.8;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.2,
        size: Math.random() * (this.isMobile ? 12 : 16) + 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.08,
        life: 1.0,
        decay: Math.random() * 0.022 + 0.016,
        type: Math.random() > 0.35 ? 'heart' : 'sparkle'
      });
    }
  }

  createRipple(x, y) {
    this.ripples.push({
      x,
      y,
      radius: 4,
      maxRadius: this.isMobile ? 45 : 65,
      opacity: 0.75,
      speed: 2.0
    });
  }

  drawHeart(ctx, x, y, size, color, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = color;

    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(0, topCurveHeight);
    ctx.bezierCurveTo(-size / 2, -topCurveHeight, -size, size / 3, 0, size);
    ctx.bezierCurveTo(size, size / 3, size / 2, -topCurveHeight, 0, topCurveHeight);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawSparkle(ctx, x, y, size, color, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.shadowBlur = 6;
    ctx.shadowColor = color;

    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.lineTo(size, 0);
      ctx.lineTo(size * 0.25, size * 0.25);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  loop() {
    this.vfxCtx.clearRect(0, 0, this.width, this.height);
    this.trailCtx.clearRect(0, 0, this.width, this.height);

    // 1. Petals
    for (let i = 0; i < this.petals.length; i++) {
      const p = this.petals[i];
      p.x += p.speedX + this.wind.x;
      p.y += p.speedY;
      p.angle += p.rotationSpeed;
      p.flip += p.flipSpeed;

      if (p.y > this.height + 30) {
        Object.assign(p, this.createPetal());
      }
      if (p.x > this.width + 30) p.x = -20;
      if (p.x < -30) p.x = this.width + 20;

      this.vfxCtx.save();
      this.vfxCtx.translate(p.x, p.y);
      this.vfxCtx.rotate(p.angle);
      this.vfxCtx.scale(Math.sin(p.flip), 1);

      this.vfxCtx.beginPath();
      this.vfxCtx.fillStyle = p.color + p.opacity + ')';
      this.vfxCtx.shadowColor = 'rgba(255, 51, 102, 0.4)';
      this.vfxCtx.shadowBlur = 4;
      this.vfxCtx.ellipse(0, 0, p.size * 0.75, p.size * 1.3, Math.PI / 4, 0, Math.PI * 2);
      this.vfxCtx.fill();
      this.vfxCtx.restore();
    }

    // 2. Exploding Heart & Star Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.07;
      p.vx *= 0.98;
      p.rotation += p.rotSpeed;
      p.life -= p.decay;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.vfxCtx.save();
      this.vfxCtx.translate(p.x, p.y);
      this.vfxCtx.rotate(p.rotation);
      if (p.type === 'heart') {
        this.drawHeart(this.vfxCtx, 0, 0, p.size * p.life, p.color, p.life);
      } else {
        this.drawSparkle(this.vfxCtx, 0, 0, p.size * p.life, p.color, p.life);
      }
      this.vfxCtx.restore();
    }

    // 3. Shockwave Ripples
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i];
      r.radius += r.speed;
      r.opacity -= 0.03;

      if (r.opacity <= 0 || r.radius >= r.maxRadius) {
        this.ripples.splice(i, 1);
        continue;
      }

      this.vfxCtx.save();
      this.vfxCtx.beginPath();
      this.vfxCtx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      this.vfxCtx.strokeStyle = `rgba(255, 51, 102, ${r.opacity})`;
      this.vfxCtx.lineWidth = 1.5;
      this.vfxCtx.shadowBlur = 6;
      this.vfxCtx.shadowColor = '#ff3366';
      this.vfxCtx.stroke();
      this.vfxCtx.restore();
    }

    // 4. Stardust Trail
    for (let i = this.trailParticles.length - 1; i >= 0; i--) {
      const t = this.trailParticles[i];
      t.x += t.speedX;
      t.y += t.speedY;
      t.life -= t.decay;

      if (t.life <= 0) {
        this.trailParticles.splice(i, 1);
        continue;
      }

      if (t.isHeart) {
        this.drawHeart(this.trailCtx, t.x, t.y, t.size * 1.8 * t.life, t.color, t.life * 0.8);
      } else {
        this.trailCtx.save();
        this.trailCtx.beginPath();
        this.trailCtx.arc(t.x, t.y, t.size * t.life, 0, Math.PI * 2);
        this.trailCtx.fillStyle = t.color;
        this.trailCtx.globalAlpha = t.life;
        this.trailCtx.shadowBlur = 6;
        this.trailCtx.shadowColor = t.color;
        this.trailCtx.fill();
        this.trailCtx.restore();
      }
    }

    this.wind.x += (0.4 - this.wind.x) * 0.02;
    requestAnimationFrame(() => this.loop());
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.romanticVfx = new RomanticVfxEngine();
});
