// BENTO GRID UI // INTERACTIVE SCRIPT

document.addEventListener('DOMContentLoaded', () => {
  // 1. DYNAMIC MOUSE SPOTLIGHT EFFECT
  const cards = document.querySelectorAll('[data-spotlight]');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 2. THEME TOGGLE (Dark / Light)
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const body = document.body;

  function toggleTheme() {
    body.classList.toggle('light-theme');
    const isLight = body.classList.contains('light-theme');
    themeIcon.textContent = isLight ? '🌙' : '☀️';
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // 3. COMMAND MENU (⌘K)
  const cmdModal = document.getElementById('cmdModal');
  const cmdInput = document.getElementById('cmdInput');
  const cmdKeyBtn = document.getElementById('cmdKeyBtn');
  const cmdToggleTheme = document.getElementById('cmdToggleTheme');
  const cmdTriggerWave = document.getElementById('cmdTriggerWave');

  function openCmdModal() {
    cmdModal.classList.remove('hidden');
    cmdInput.value = '';
    setTimeout(() => cmdInput.focus(), 50);
  }

  function closeCmdModal() {
    cmdModal.classList.add('hidden');
  }

  if (cmdKeyBtn) cmdKeyBtn.addEventListener('click', openCmdModal);

  document.addEventListener('keydown', (e) => {
    // ⌘K or Ctrl+K
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdModal.classList.contains('hidden')) {
        openCmdModal();
      } else {
        closeCmdModal();
      }
    }
    // ESC to close
    if (e.key === 'Escape' && !cmdModal.classList.contains('hidden')) {
      closeCmdModal();
    }
  });

  cmdModal.addEventListener('click', (e) => {
    if (e.target === cmdModal) closeCmdModal();
  });

  if (cmdToggleTheme) {
    cmdToggleTheme.addEventListener('click', () => {
      toggleTheme();
      closeCmdModal();
    });
  }

  if (cmdTriggerWave) {
    cmdTriggerWave.addEventListener('click', () => {
      simulateChartWave();
      closeCmdModal();
    });
  }

  // 4. CHART SIMULATION & LIVE COUNTER
  const chartLine = document.querySelector('.chart-line');
  const chartArea = document.querySelector('.chart-area');
  const requestsCounter = document.getElementById('requestsCounter');

  let baseRequests = 4.8;

  function simulateChartWave() {
    const p1 = Math.floor(Math.random() * 60 + 20);
    const p2 = Math.floor(Math.random() * 70 + 30);
    const p3 = Math.floor(Math.random() * 50 + 10);

    const linePath = `M 0,130 Q 80,${p1} 160,${p2} T 320,${p3} T 500,20`;
    const areaPath = `M 0,130 Q 80,${p1} 160,${p2} T 320,${p3} T 500,20 L 500,160 L 0,160 Z`;

    if (chartLine && chartArea) {
      chartLine.setAttribute('d', linePath);
      chartArea.setAttribute('d', areaPath);
    }

    baseRequests += 0.1;
    if (requestsCounter) {
      requestsCounter.textContent = `${baseRequests.toFixed(1)}M`;
    }
  }

  // Auto-pulse chart slightly every 4 seconds
  setInterval(simulateChartWave, 4000);

  // 5. SECURITY TOGGLE INTERACTION
  const shieldToggle = document.getElementById('shieldToggle');
  const securityStatusText = document.getElementById('securityStatusText');
  let isShieldArmed = true;

  if (shieldToggle) {
    shieldToggle.addEventListener('click', () => {
      isShieldArmed = !isShieldArmed;
      if (isShieldArmed) {
        shieldToggle.style.filter = 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.6))';
        securityStatusText.textContent = '256-bit AES Aktiv (Beskyttet)';
        securityStatusText.style.color = 'var(--accent-green)';
      } else {
        shieldToggle.style.filter = 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.6))';
        securityStatusText.textContent = 'Deaktivert (Klikk for å aktivere)';
        securityStatusText.style.color = '#ef4444';
      }
    });
  }

  // 6. COPY CODE BUTTON
  const copyCodeBtn = document.getElementById('copyCodeBtn');
  if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', () => {
      const code = `import { BentoClient } from '@bento/core';

const bento = new BentoClient({
  grid: 'asymmetric',
  spotlight: true,
  latency: 12
});

await bento.optimizeLayout();`;

      navigator.clipboard.writeText(code).then(() => {
        const originalText = copyCodeBtn.textContent;
        copyCodeBtn.textContent = 'Kopiert! ✓';
        copyCodeBtn.style.color = 'var(--accent-green)';
        setTimeout(() => {
          copyCodeBtn.textContent = originalText;
          copyCodeBtn.style.color = '';
        }, 2000);
      });
    });
  }

  // Bento Confirmation Toast
  function showBentoConfirm(msg) {
    let toast = document.getElementById('bentoToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'bentoToast';
      toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: rgba(18, 24, 38, 0.95);
        border: 1px solid #38bdf8;
        color: #f8fafc;
        padding: 14px 22px;
        border-radius: 12px;
        font-family: 'Inter', sans-serif;
        font-size: 0.9rem;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(56, 189, 248, 0.25);
        backdrop-filter: blur(12px);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 10px;
        transition: all 0.2s ease;
      `;
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span style="color: #38bdf8; font-size: 1.1rem;">✓</span> ${msg}`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
    }, 2800);
  }

  // 7. INTERACTIVE ECOSYSTEM CARDS
  document.querySelectorAll('.eco-item').forEach(item => {
    item.addEventListener('click', () => {
      const name = item.querySelector('.eco-name')?.textContent || 'Integrasjon';
      item.style.transform = 'scale(0.95)';
      setTimeout(() => item.style.transform = '', 150);
      showBentoConfirm(`${name}-integrasjon synkronisert i sanntid!`);
    });
  });
});
