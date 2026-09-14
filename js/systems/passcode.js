/**
 * Passcode System (Optimized & Cinematic Timing)
 * Smooth, lightweight entrance screen with gentle romantic animations,
 * zero input lag on typing, and graceful unlock/error pacing.
 */

'use strict';

class PasscodeSystem {
  constructor() {
    this.screen = document.getElementById('passcode-screen');
    this.card = this.screen?.querySelector('.passcode__card');
    this.inputs = Array.from(this.screen?.querySelectorAll('.passcode__input') || []);
    this.form = this.screen?.querySelector('.passcode__form');
    this.feedback = this.screen?.querySelector('.passcode__feedback');
    this.badge = this.screen?.querySelector('.passcode__badge');
    this.submitBtn = document.getElementById('passcode-unlock-btn');
    
    const cfg = window.CONFIG?.passcode || {};
    this.targetCode = String(cfg.code || '1234');
    this.hint = cfg.hint || '1234';
    this.isSubmitting = false;
  }

  run() {
    return new Promise((resolve) => {
      if (!this.screen) {
        resolve();
        return;
      }

      this._setupInputs();
      this._setupEvents(resolve);
      this._animateEntrance();
    });
  }

  _animateEntrance() {
    if (!this.card) return;

    // Initial state
    gsap.set(this.screen, { display: 'flex', opacity: 1, visibility: 'visible' });
    gsap.set(this.card, { opacity: 0, y: 30, scale: 0.96 });

    // Slower, graceful card entrance (1.4s)
    gsap.to(this.card, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.4,
      ease: 'power3.out',
      delay: 0.15,
      onComplete: () => {
        if (this.inputs[0]) {
          this.inputs[0].focus();
        }
      }
    });

    // Badge subtle slow glow breathing (3s cycle)
    if (this.badge) {
      gsap.to(this.badge, {
        boxShadow: '0 0 28px rgba(196, 81, 138, 0.45), 0 0 45px rgba(120, 64, 200, 0.2)',
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }
  }

  _setupInputs() {
    this.inputs.forEach((input, index) => {
      // Keydown handling (Backspace, Arrows, Enter) - Pure instant, NO heavy animations
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace') {
          if (!input.value && index > 0) {
            e.preventDefault();
            this.inputs[index - 1].value = '';
            this.inputs[index - 1].focus();
          } else {
            input.value = '';
          }
          this._clearFeedback();
        } else if (e.key === 'ArrowLeft' && index > 0) {
          e.preventDefault();
          this.inputs[index - 1].focus();
        } else if (e.key === 'ArrowRight' && index < this.inputs.length - 1) {
          e.preventDefault();
          this.inputs[index + 1].focus();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          this._tryUnlock();
        }
      });

      // Input event - Fast, lightweight typing with zero scale bounce
      input.addEventListener('input', () => {
        const val = input.value.replace(/[^0-9]/g, '');
        input.value = val ? val[val.length - 1] : '';

        if (input.value) {
          this.inputs[index].classList.add('has-value');

          // Auto-advance to next input
          if (index < this.inputs.length - 1) {
            this.inputs[index + 1].focus();
          } else {
            // Last input filled: slight delay (350ms) so user can see 4th digit comfortably
            setTimeout(() => this._tryUnlock(), 350);
          }
        } else {
          this.inputs[index].classList.remove('has-value');
        }
        this._clearFeedback();
      });

      // Focus / Blur styling
      input.addEventListener('focus', () => {
        input.select();
        input.classList.add('is-focused');
      });

      input.addEventListener('blur', () => {
        input.classList.remove('is-focused');
      });

      // Paste support (pasting full 4 digit code)
      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text').trim();
        const digits = text.replace(/[^0-9]/g, '').slice(0, 4);
        if (digits) {
          digits.split('').forEach((d, i) => {
            if (this.inputs[i]) {
              this.inputs[i].value = d;
              this.inputs[i].classList.add('has-value');
            }
          });
          if (digits.length >= 4) {
            this.inputs[3].focus();
            setTimeout(() => this._tryUnlock(), 350);
          } else if (this.inputs[digits.length]) {
            this.inputs[digits.length].focus();
          }
        }
      });
    });
  }

  _setupEvents(resolve) {
    this._resolvePromise = resolve;

    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this._tryUnlock();
      });
    }

    if (this.submitBtn) {
      this.submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this._tryUnlock();
      });
    }
  }

  _getCurrentCode() {
    return this.inputs.map(i => i.value).join('');
  }

  _clearFeedback() {
    if (this.feedback) {
      this.feedback.textContent = '';
      this.feedback.className = 'passcode__feedback';
    }
    this.inputs.forEach(i => i.classList.remove('is-invalid', 'is-valid'));
  }

  _tryUnlock() {
    if (this.isSubmitting) return;

    const entered = this._getCurrentCode();
    const isCorrect = (this.targetCode === '' || entered === this.targetCode);

    if (isCorrect && entered.length === this.targetCode.length) {
      this._onSuccess();
    } else {
      this._onError();
    }
  }
h
  _onError() {
    if (this.feedback) {
      this.feedback.textContent = `Wrong secret code ♡ Hint: ${this.hint}`;
      this.feedback.className = 'passcode__feedback passcode__feedback--error';
    }

    this.inputs.forEach(input => {
      input.classList.add('is-invalid');
    });

    // Slower, graceful romantic sway (duration 0.16s per sway, total ~0.96s)
    const inputsContainer = this.screen.querySelector('.passcode__inputs');
    if (inputsContainer) {
      gsap.fromTo(inputsContainer,
        { x: -10 },
        {
          x: 10,
          duration: 0.16,
          repeat: 3,
          yoyo: true,
          ease: 'sine.inOut',
          onComplete: () => {
            gsap.set(inputsContainer, { x: 0 });
            // Generous delay (1.4s) so user has time to read the hint before reset
            setTimeout(() => {
              this.inputs.forEach(i => {
                i.value = '';
                i.classList.remove('has-value', 'is-invalid');
              });
              if (this.inputs[0]) this.inputs[0].focus();
            }, 1400);
          }
        }
      );
    }
  }

  _onSuccess() {
    this.isSubmitting = true;

    if (this.feedback) {
      this.feedback.textContent = 'Access granted. Welcome to my universe... ♡';
      this.feedback.className = 'passcode__feedback passcode__feedback--success';
    }

    this.inputs.forEach(input => {
      input.classList.add('is-valid');
      input.blur();
    });

    // Slower badge pulse (0.8s)
    if (this.badge) {
      gsap.to(this.badge, {
        scale: 1.22,
        backgroundColor: 'rgba(196, 81, 138, 0.25)',
        borderColor: '#c4518a',
        boxShadow: '0 0 35px rgba(255, 110, 180, 0.8)',
        duration: 0.8,
        ease: 'power2.out'
      });
    }

    // Sparkle particles burst (gentle float)
    this._burstSparkles();

    // Slower, cinematic transition out (1.3s delay + 1.1s smooth fade)
    gsap.timeline({
      delay: 1.3,
      onComplete: () => {
        gsap.to(this.screen, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete: () => {
            this.screen.style.display = 'none';
            if (this._resolvePromise) this._resolvePromise();
          }
        });
      }
    })
    .to(this.card, {
      scale: 0.95,
      y: -15,
      opacity: 0,
      duration: 1.1,
      ease: 'power2.inOut'
    });
  }

  _burstSparkles() {
    const container = this.screen;
    if (!container) return;

    const count = 18; // Optimized count
    const rect = this.card ? this.card.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height * 0.45;

    const symbols = ['✦', '♡', '✧', '⋆'];
    const colors = ['#ff79b0', '#e8b8d0', '#ffffff', '#c4518a'];

    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'passcode__sparkle';
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.color = colors[Math.floor(Math.random() * colors.length)];
      el.style.fontSize = `${12 + Math.random() * 14}px`;
      el.style.left = `${originX}px`;
      el.style.top = `${originY}px`;
      container.appendChild(el);

      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const distance = 70 + Math.random() * 140;
      const destX = Math.cos(angle) * distance;
      const destY = Math.sin(angle) * distance;

      // Slower, graceful floating motion (1.8s - 2.5s)
      gsap.to(el, {
        x: destX,
        y: destY,
        opacity: 0,
        scale: 0.4,
        rotation: (Math.random() - 0.5) * 180,
        duration: 1.8 + Math.random() * 0.7,
        ease: 'power1.out',
        onComplete: () => el.remove()
      });
    }
  }
}

window.PasscodeSystem = PasscodeSystem;
