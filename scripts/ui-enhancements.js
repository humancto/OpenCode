// UI Enhancement Scripts - Interactive Elements & Micro-interactions
(function() {
  'use strict';

  // Particle System for celebrations and interactions
  class ParticleSystem {
    constructor() {
      this.particles = [];
      this.canvas = null;
      this.ctx = null;
      this.animationId = null;
    }

    init() {
      if (this.canvas) return;
      
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'particle-canvas';
      this.canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
      `;
      document.body.appendChild(this.canvas);
      
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    createBurst(x, y, color = '#00C896', count = 30) {
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const velocity = 3 + Math.random() * 4;
        
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: 1,
          decay: 0.015 + Math.random() * 0.01,
          size: 2 + Math.random() * 3,
          color
        });
      }
      
      if (!this.animationId) {
        this.animate();
      }
    }

    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.particles = this.particles.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.98;
        particle.vy *= 0.98;
        particle.vy += 0.1; // gravity
        particle.life -= particle.decay;
        
        if (particle.life <= 0) return false;
        
        this.ctx.save();
        this.ctx.globalAlpha = particle.life;
        this.ctx.fillStyle = particle.color;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = particle.color;
        
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
        
        return true;
      });
      
      if (this.particles.length > 0) {
        this.animationId = requestAnimationFrame(() => this.animate());
      } else {
        this.animationId = null;
      }
    }

    clear() {
      this.particles = [];
      if (this.ctx) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }

  // Typing Indicator Animation
  class TypingIndicator {
    constructor() {
      this.indicators = new Map();
      this.container = null;
    }

    init() {
      this.container = document.createElement('div');
      this.container.className = 'typing-indicators';
      this.container.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 20px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 1000;
      `;
      document.body.appendChild(this.container);
    }

    addUser(userId, userName) {
      if (this.indicators.has(userId)) return;
      
      const indicator = document.createElement('div');
      indicator.className = 'typing-indicator';
      indicator.innerHTML = `
        <span class="typing-user">${userName}</span>
        <span class="typing-dots">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </span>
      `;
      
      indicator.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: rgba(22, 27, 34, 0.9);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(48, 54, 61, 0.5);
        border-radius: 20px;
        animation: slideInLeft 0.3s ease-out;
      `;
      
      this.container.appendChild(indicator);
      this.indicators.set(userId, indicator);
      
      // Auto-remove after timeout
      setTimeout(() => this.removeUser(userId), 3000);
    }

    removeUser(userId) {
      const indicator = this.indicators.get(userId);
      if (indicator) {
        indicator.style.animation = 'slideOutLeft 0.3s ease-out';
        setTimeout(() => {
          indicator.remove();
          this.indicators.delete(userId);
        }, 300);
      }
    }
  }

  // Cursor Trail Effect
  class CursorTrail {
    constructor() {
      this.trails = [];
      this.mouseX = 0;
      this.mouseY = 0;
      this.isActive = false;
    }

    init() {
      document.addEventListener('mousemove', (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        
        if (this.isActive && Math.random() > 0.8) {
          this.createTrail();
        }
      });

      // Activate on editor focus
      const editorContainer = document.getElementById('firepad-container');
      if (editorContainer) {
        editorContainer.addEventListener('mouseenter', () => {
          this.isActive = true;
        });
        
        editorContainer.addEventListener('mouseleave', () => {
          this.isActive = false;
        });
      }
    }

    createTrail() {
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: radial-gradient(circle, rgba(0, 200, 150, 0.8), transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        left: ${this.mouseX}px;
        top: ${this.mouseY}px;
        animation: trailFade 1s ease-out forwards;
      `;
      
      document.body.appendChild(trail);
      
      setTimeout(() => trail.remove(), 1000);
    }
  }

  // Success Animation Handler
  class SuccessAnimator {
    constructor(particleSystem) {
      this.particleSystem = particleSystem;
    }

    celebrate(element) {
      if (!element) return;
      
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Create particle burst
      this.particleSystem.createBurst(centerX, centerY, '#00D9A3', 40);
      
      // Add success pulse animation
      element.classList.add('success-pulse');
      setTimeout(() => element.classList.remove('success-pulse'), 1000);
      
      // Play sound effect (if available)
      this.playSuccessSound();
    }

    playSuccessSound() {
      // Create a simple success tone using Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  }

  // Live Activity Indicator
  class ActivityIndicator {
    constructor() {
      this.indicator = null;
      this.pulseInterval = null;
    }

    init() {
      this.indicator = document.createElement('div');
      this.indicator.className = 'activity-indicator';
      this.indicator.innerHTML = `
        <div class="activity-dot"></div>
        <span class="activity-text">Live</span>
      `;
      
      this.indicator.style.cssText = `
        position: fixed;
        top: 70px;
        right: 20px;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        background: rgba(0, 217, 163, 0.1);
        border: 1px solid rgba(0, 217, 163, 0.3);
        border-radius: 20px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s;
      `;
      
      document.body.appendChild(this.indicator);
    }

    show() {
      this.indicator.style.opacity = '1';
      
      if (!this.pulseInterval) {
        this.pulseInterval = setInterval(() => {
          const dot = this.indicator.querySelector('.activity-dot');
          dot.style.animation = 'none';
          setTimeout(() => {
            dot.style.animation = 'pulse 1s ease-in-out';
          }, 10);
        }, 2000);
      }
    }

    hide() {
      this.indicator.style.opacity = '0';
      
      if (this.pulseInterval) {
        clearInterval(this.pulseInterval);
        this.pulseInterval = null;
      }
    }
  }

  // Initialize all enhancements
  function initializeEnhancements() {
    // Add necessary CSS for animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInLeft {
        from {
          transform: translateX(-100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOutLeft {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(-100%);
          opacity: 0;
        }
      }
      
      @keyframes trailFade {
        from {
          transform: scale(1) translate(-50%, -50%);
          opacity: 1;
        }
        to {
          transform: scale(0) translate(-50%, -50%);
          opacity: 0;
        }
      }
      
      .typing-dots {
        display: inline-flex;
        gap: 3px;
      }
      
      .typing-dots .dot {
        width: 8px;
        height: 8px;
        background: #00C896;
        border-radius: 50%;
        animation: typingBounce 1.4s ease-in-out infinite;
      }
      
      .typing-dots .dot:nth-child(2) {
        animation-delay: 0.2s;
      }
      
      .typing-dots .dot:nth-child(3) {
        animation-delay: 0.4s;
      }
      
      @keyframes typingBounce {
        0%, 60%, 100% {
          transform: translateY(0);
        }
        30% {
          transform: translateY(-10px);
        }
      }
      
      .typing-user {
        color: #8B949E;
        font-size: 12px;
        font-weight: 500;
      }
      
      .success-pulse {
        animation: successPulse 1s ease-out;
      }
      
      @keyframes successPulse {
        0% {
          box-shadow: 0 0 0 0 rgba(0, 217, 163, 0.7);
        }
        50% {
          box-shadow: 0 0 0 20px rgba(0, 217, 163, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(0, 217, 163, 0);
        }
      }
      
      .activity-dot {
        width: 8px;
        height: 8px;
        background: #00D9A3;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(0, 217, 163, 0.5);
      }
      
      .activity-text {
        color: #00D9A3;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    `;
    document.head.appendChild(style);

    // Initialize components
    const particleSystem = new ParticleSystem();
    particleSystem.init();

    const typingIndicator = new TypingIndicator();
    typingIndicator.init();

    const cursorTrail = new CursorTrail();
    cursorTrail.init();

    const successAnimator = new SuccessAnimator(particleSystem);
    
    const activityIndicator = new ActivityIndicator();
    activityIndicator.init();

    // Expose to global scope for other scripts to use
    window.UIEnhancements = {
      particles: particleSystem,
      typing: typingIndicator,
      cursor: cursorTrail,
      success: successAnimator,
      activity: activityIndicator
    };

    // Hook into existing events
    hookIntoExistingEvents();
  }

  function hookIntoExistingEvents() {
    // Enhance run button
    const runBtn = document.getElementById('run-btn');
    if (runBtn) {
      runBtn.addEventListener('click', () => {
        setTimeout(() => {
          if (window.UIEnhancements && window.UIEnhancements.success) {
            window.UIEnhancements.success.celebrate(runBtn);
          }
        }, 100);
      });
    }

    // Enhance share button
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        if (window.UIEnhancements && window.UIEnhancements.particles) {
          const rect = shareBtn.getBoundingClientRect();
          window.UIEnhancements.particles.createBurst(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            '#007ACC',
            20
          );
        }
      });
    }

    // Show activity indicator when connected
    setTimeout(() => {
      if (window.UIEnhancements && window.UIEnhancements.activity) {
        window.UIEnhancements.activity.show();
      }
    }, 1000);

    // Simulate typing indicators (for demo)
    if (window.location.hash) {
      setTimeout(() => {
        if (window.UIEnhancements && window.UIEnhancements.typing) {
          // This would normally be triggered by real-time events
          // window.UIEnhancements.typing.addUser('demo_user', 'John Doe');
        }
      }, 3000);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEnhancements);
  } else {
    initializeEnhancements();
  }
})();