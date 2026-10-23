// NEO-BRUTALISM UI SHOWROOM // INTERACTIVE LOGIC

document.addEventListener('DOMContentLoaded', () => {
  // 1. SOUND SYSTEM (Retro Web Audio API synthesizer)
  let soundEnabled = true;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
  }

  function playPopSound(freq = 420, type = 'sine', duration = 0.08) {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  function playSuccessChime() {
    if (!soundEnabled) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      setTimeout(() => playPopSound(freq, 'triangle', 0.12), i * 70);
    });
  }

  // Sound toggle button
  const soundToggleBtn = document.getElementById('soundToggle');
  const soundIcon = document.getElementById('soundIcon');
  const soundStatus = document.getElementById('soundStatus');

  soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
    soundStatus.textContent = soundEnabled ? 'PÅ' : 'AV';
    if (soundEnabled) {
      playPopSound(500);
      showToast('Retro lydeffekter aktivert! 🔊');
    } else {
      showToast('Lydeffekter dempet 🔇');
    }
  });

  // Global tactile sound for all buttons & interactive cards
  document.querySelectorAll('button, .palette-swatch, .card-interactive, .brutal-checkbox').forEach(el => {
    el.addEventListener('click', () => {
      playPopSound(380 + Math.random() * 80);
    });
  });

  // 2. HERO PREVIEW CLICK COUNTER
  let clickCount = 0;
  const clickCountBadge = document.getElementById('clickCountBadge');
  const previewClickTargets = document.querySelectorAll('.preview-click-target');

  previewClickTargets.forEach(btn => {
    btn.addEventListener('click', () => {
      clickCount++;
      clickCountBadge.textContent = clickCount;
      btn.style.transform = 'scale(0.96)';
      setTimeout(() => {
        btn.style.transform = '';
      }, 100);
      playPopSound(480 + clickCount * 20);
      showToast(`Brutalt klikk #${clickCount} registrert! 💥`);
    });
  });

  // 3. LIVE NEO-STYLER SLIDERS & CONTROLS
  const root = document.documentElement;
  const shadowSlider = document.getElementById('shadowSlider');
  const shadowVal = document.getElementById('shadowVal');
  const borderSlider = document.getElementById('borderSlider');
  const borderVal = document.getElementById('borderVal');
  const radiusSlider = document.getElementById('radiusSlider');
  const radiusVal = document.getElementById('radiusVal');
  const resetStylerBtn = document.getElementById('resetStylerBtn');

  shadowSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    root.style.setProperty('--shadow-size', `${val}px`);
    shadowVal.textContent = `${val}px`;
  });

  borderSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    root.style.setProperty('--border-width', `${val}px`);
    borderVal.textContent = `${val}px`;
  });

  radiusSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    root.style.setProperty('--border-radius', `${val}px`);
    radiusVal.textContent = `${val}px`;
  });

  resetStylerBtn.addEventListener('click', () => {
    shadowSlider.value = 5;
    borderSlider.value = 3;
    radiusSlider.value = 8;
    root.style.setProperty('--shadow-size', '5px');
    root.style.setProperty('--border-width', '3px');
    root.style.setProperty('--border-radius', '8px');
    shadowVal.textContent = '5px';
    borderVal.textContent = '3px';
    radiusVal.textContent = '8px';
    showToast('Stil tilbakestilt til standard! ✨');
  });

  // Color Palette Selector
  const paletteSwatches = document.querySelectorAll('.palette-swatch');
  const themeToggle = document.getElementById('themeToggle');
  const palettes = ['cyber', 'bubblegum', 'mint', 'lavender', 'mono'];
  let currentPaletteIndex = 0;

  function setPalette(name) {
    document.body.className = '';
    if (name !== 'cyber') {
      document.body.classList.add(`palette-${name}`);
    }
    paletteSwatches.forEach(swatch => {
      swatch.classList.toggle('active', swatch.dataset.palette === name);
    });
  }

  paletteSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const palette = swatch.dataset.palette;
      setPalette(palette);
      showToast(`Palett endret: ${palette.toUpperCase()} 🎨`);
    });
  });

  themeToggle.addEventListener('click', () => {
    currentPaletteIndex = (currentPaletteIndex + 1) % palettes.length;
    const nextPalette = palettes[currentPaletteIndex];
    setPalette(nextPalette);
    showToast(`Palett: ${nextPalette.toUpperCase()} 🎨`);
  });

  // 4. ACCORDION FAQ
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      // Close other items
      document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.accordion-icon').textContent = '+';
      });

      if (!isActive) {
        item.classList.add('active');
        item.querySelector('.accordion-icon').textContent = '−';
      }
    });
  });

  // 5. TOAST NOTIFICATION SYSTEM
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimer = null;

  function showToast(msg) {
    if (!toast) return;
    toastMessage.textContent = msg;
    toast.classList.remove('hidden');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 2400);
  }

  // Action buttons
  document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = btn.dataset.product || 'Vare';
      playSuccessChime();
      showToast(`Lagt til i handlekurv: ${item} 🛒`);
    });
  });

  document.querySelectorAll('.follow-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isFollowing = btn.classList.contains('btn-yellow');
      if (isFollowing) {
        btn.classList.remove('btn-yellow');
        btn.classList.add('btn-white');
        btn.textContent = 'Følg profil';
        showToast('Følger ikke lenger');
      } else {
        btn.classList.remove('btn-white');
        btn.classList.add('btn-yellow');
        btn.textContent = 'Følger ✓';
        playSuccessChime();
        showToast('Du følger nå Astrid Lind! ⭐');
      }
    });
  });

  // Switch Text Updater
  const featureSwitch = document.getElementById('featureSwitch');
  const switchStateText = document.getElementById('switchStateText');
  if (featureSwitch && switchStateText) {
    featureSwitch.addEventListener('change', (e) => {
      if (e.target.checked) {
        switchStateText.innerHTML = 'Modus: <strong>SUPER BRUTAL</strong>';
        showToast('Modus satt til: SUPER BRUTAL 🔥');
      } else {
        switchStateText.innerHTML = 'Modus: <strong>MYKERE BRUTAL</strong>';
        showToast('Modus satt til: MYKERE BRUTAL ☁️');
      }
    });
  }

  // 6. MODAL INTERACTION
  const modal = document.getElementById('brutalModal');
  const openModalBtn = document.getElementById('heroDemoModalBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalConfirmBtn = document.getElementById('modalConfirmBtn');
  const modalDismissBtn = document.getElementById('modalDismissBtn');

  function openModal() {
    modal.classList.remove('hidden');
    playPopSound(560);
  }

  function closeModal() {
    modal.classList.add('hidden');
    playPopSound(320);
  }

  if (openModalBtn) openModalBtn.addEventListener('click', openModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modalConfirmBtn) {
    modalConfirmBtn.addEventListener('click', () => {
      closeModal();
      playSuccessChime();
      showToast('Kult! Du testet modaldialogen 👍');
    });
  }
  if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // 7. CONFETTI GENERATOR ON CANVAS
  const confettiCanvas = document.getElementById('confettiCanvas');
  const ctx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
  const ctaConfettiBtn = document.getElementById('ctaConfettiBtn');
  let particles = [];
  let confettiAnimId = null;

  function resizeCanvas() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function triggerConfetti() {
    playSuccessChime();
    showToast('WOHOO! Brutal feiring aktivert! 🎉');
    resizeCanvas();

    const colors = ['#ffde59', '#ff6b8b', '#a3e635', '#a78bfa', '#38bdf8', '#000000'];
    particles = [];
    for (let i = 0; i < 140; i++) {
      particles.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        w: Math.random() * 12 + 8,
        h: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.7) * 18,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.35,
        border: Math.random() > 0.4
      });
    }

    if (confettiAnimId) cancelAnimationFrame(confettiAnimId);
    animateConfetti();
  }

  function animateConfetti() {
    if (!ctx) return;
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotSpeed;
      p.vx *= 0.98;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      if (p.border) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctx.restore();
    });

    particles = particles.filter(p => p.y < window.innerHeight + 50);

    if (particles.length > 0) {
      confettiAnimId = requestAnimationFrame(animateConfetti);
    } else {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  if (ctaConfettiBtn) {
    ctaConfettiBtn.addEventListener('click', triggerConfetti);
  }

  // 8. STICKER PAD INTERACTION
  let activeStickerText = '🔥 HOT!';
  const stickerPad = document.getElementById('stickerPad');

  window.setStickerType = function(text) {
    activeStickerText = text;
    showToast(`Valgte sticker: ${text} ✨`);
  };

  window.clearStickerPad = function() {
    if (!stickerPad) return;
    const stickers = stickerPad.querySelectorAll('.placed-sticker');
    stickers.forEach(s => s.remove());
    showToast('Sticker-blokken er tømt 🗑️');
  };

  if (stickerPad) {
    stickerPad.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') return;
      const rect = stickerPad.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const sticker = document.createElement('div');
      sticker.className = 'sticker sticker-pink placed-sticker';
      sticker.textContent = activeStickerText;
      const rot = Math.floor(Math.random() * 24 - 12);
      sticker.style.position = 'absolute';
      sticker.style.left = `${x - 40}px`;
      sticker.style.top = `${y - 15}px`;
      sticker.style.transform = `rotate(${rot}deg)`;
      sticker.style.zIndex = '10';
      sticker.style.cursor = 'grab';

      // Random color
      const colors = ['#ffde59', '#ff6b8b', '#a3e635', '#a78bfa', '#38bdf8'];
      sticker.style.background = colors[Math.floor(Math.random() * colors.length)];

      stickerPad.appendChild(sticker);
      playPopSound(500);
      showToast('Klistremerke satt! 📌');
    });
  }

  // 9. ARCADE SOUNDBOARD SYNTHESIZER
  window.playLaserSound = function() {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
    showToast('⚡ ZAP! Laser fyrt av!');
  };

  window.playCoinSound = function() {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, audioCtx.currentTime);
    osc.frequency.setValueAtTime(1318.51, audioCtx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.25);
    showToast('🪙 Klingeeling! Mynt plukket opp!');
  };

  window.playJumpSound = function() {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.12);
    showToast('🦘 BOING! Hopp utført!');
  };

  window.playPowerupSound = function() {
    playSuccessChime();
    showToast('🍄 Power-Up aktivert!');
  };

  window.playBoomSound = function() {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
    showToast('💣 KABOOM!');
  };

  window.playVictoryChime = function() {
    [523, 659, 784, 1046, 1318].forEach((f, i) => {
      setTimeout(() => playPopSound(f, 'square', 0.14), i * 90);
    });
    showToast('🏆 SEIER! Nivå fullført!');
  };

  // 10. PRICING TOGGLE
  const billingToggle = document.getElementById('pricingBillingToggle');
  const priceTier2 = document.getElementById('priceTier2');
  const priceTier3 = document.getElementById('priceTier3');

  if (billingToggle) {
    billingToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        priceTier2.textContent = 'kr 224';
        priceTier3.textContent = 'kr 674';
        showToast('Årlig fakturering: 25% rabatt aktivert! 🔥');
      } else {
        priceTier2.textContent = 'kr 299';
        priceTier3.textContent = 'kr 899';
        showToast('Månedlig fakturering valgt');
      }
    });
  }

  window.buyPlan = function(plan) {
    playSuccessChime();
    showToast(`✓ Valgte ${plan}-pakken! Klargjør utsjekk.`);
  };
});
