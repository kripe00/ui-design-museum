// UI DESIGN MUSEUM // INTERACTIVE LOGIC FOR 10 DESIGN STYLES

document.addEventListener('DOMContentLoaded', () => {
  // 1. INTEL DATABASE FOR THE 10 STYLES
  const styleIntelData = {
    skeuo: {
      name: '🪵 Skeuomorphism',
      era: 'Klassisk æra: 2007 – 2012 (Steve Jobs / Scott Forstall)',
      desc: 'Etterligner fysiske materialer som sydd lær, treverk, børstet metall og blanke glassknapper. Hjalp brukerne å forstå berøringsskjermer ved å overføre fysiske referanser til pikslene.',
      css: 'background: linear-gradient(#3d2c1d, #24170d); box-shadow: inset 0 1px 0 rgba(255,255,255,0.2), 0 15px 35px rgba(0,0,0,0.8);'
    },
    flat: {
      name: '📄 Flat Design',
      era: 'Reaksjonsæra: 2012 – 2015 (Windows Phone / iOS 7)',
      desc: 'En kompromissløs motreaksjon til skeuomorphism. Alt av skygger, gradienter og skråkanter ble fjernet til fordel for 100% flate farger, geometriske former og skarp digital typografi.',
      css: 'background: #0072c6; border: none; box-shadow: none; border-radius: 0px;'
    },
    material: {
      name: '📐 Material Design',
      era: 'Moderne Google-standard: 2014 – Nåtid',
      desc: 'Inspirert av fysisk papir og blekk. Gjeninnførte rasjonell dybde ved hjelp av heving (elevation 1–5), subtile myke skygger og flytende klikkbølger (ripples) som sprer seg fra trykkpunktet.',
      css: 'box-shadow: 0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12); border-radius: 12px;'
    },
    neumorphic: {
      name: '🪨 Neumorphism (Soft UI)',
      era: 'Dribbble-sensasjon: 2019 – 2021',
      desc: 'Elementene ser ut som de er formpresset eller ekstrudert direkte ut av bakgrunnen. Alt har nøyaktig samme fargetone, og formen skapes av to myke motstående skygger (en lys og en mørk).',
      css: 'background: #e0e5ec; box-shadow: 14px 14px 28px #b8b9be, -14px -14px 28px #ffffff;'
    },
    glass: {
      name: '🪟 Glassmorphism',
      era: 'Moderne OS: 2020 – Nåtid (macOS Big Sur & Windows 11)',
      desc: 'Bygget rundt translucens og frostet glass. Bruker CSS backdrop-filter: blur() sammen med halvgjennomsiktig hvit/farget bakgrunn og en 1px lys kantglød som lar bakgrunnsfarger skinne igjennom.',
      css: 'background: rgba(255,255,255,0.12); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.25);'
    },
    neobrutal: {
      name: '🥊 Neo-Brutalism (Neubrutalism)',
      era: 'Designrevolusjon: 2021 – Nåtid (Figma, Gumroad)',
      desc: 'Kraftige kontraster, tykke sorte 3px-rammer, og 100% ugjennomsiktige harde skygger uten blur. Fargerike neontoner, asymmetriske klistremerker og en taktil fysisk nedtrykk-effekt ved klikk.',
      css: 'border: 3.5px solid #000; box-shadow: 6px 6px 0px #000; background: #ffde59;'
    },
    clay: {
      name: '🧸 Claymorphism (3D Puff/Leire)',
      era: 'Metaverse & Barneapper: 2021 – Nåtid',
      desc: 'Super-avrundede, oppblåste 3D-former som minner om fargerik lekedeig, marshmallows eller puter. Skapes av en kombinasjon av ytre myk skygge og to innvendige lyse/mørke skygger.',
      css: 'border-radius: 35px; box-shadow: 18px 18px 36px rgba(0,0,0,0.15), inset 8px 8px 16px rgba(255,255,255,0.85);'
    },
    bento: {
      name: '🍱 Bento Grid UI',
      era: 'Tech-gullalder: 2023 – Nåtid (Apple, Linear, Raycast)',
      desc: 'Inspirert av japanske matbokser. Asymmetriske rutenett med mørk grafittbakgrunn, 1px subtile rammer, interaktiv spotlight-glød som følger musepekeren, og datatette mikrowidgets.',
      css: 'background: rgba(18,24,38,0.9); border: 1px solid rgba(255,255,255,0.1); border-radius: 22px; backdrop-filter: blur(12px);'
    },
    minimal: {
      name: '🏛️ Swiss Style (International Minimalist)',
      era: 'Tidløs: 1950-tallet → Moderne Kunst & Luksusweb',
      desc: 'Total eliminering av støy. Monokrom fargepalett (nesten utelukkende sort og hvitt), enorme mengder negativt rom (whitespace), et strengt grid, og ordet selv som det primære designelementet.',
      css: 'background: #ffffff; color: #000000; border: 1.5px solid #000000; border-radius: 0px; box-shadow: none;'
    },
    cyberpunk: {
      name: '🕹️ Cyberpunk / Retro-Futurism / Y2K',
      era: 'Sci-Fi & Gaming: 2000s Y2K → 2077',
      desc: 'Mørk skjerm med glødende neon-cyan og magenta aksenter, polygonale avskjærte hjørner (clip-path), scanline-teksturer, monospace terminalskrift og en følelse av en fremtidig HUD-skjerm.',
      css: 'clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px)); border: 1px solid #00f3ff; box-shadow: 0 0 25px rgba(0,243,255,0.25);'
    }
  };

  // 2. METAMORPHOSIS CONTROLS
  const morphButtons = document.querySelectorAll('.morph-btn');
  const targetWidget = document.getElementById('targetWidget');
  const currentStyleLabel = document.getElementById('currentStyleLabel');
  const intelTitle = document.getElementById('intelTitle');
  const intelEra = document.getElementById('intelEra');
  const intelDescription = document.getElementById('intelDescription');
  const intelCss = document.getElementById('intelCss');

  function applyStyle(styleKey) {
    // Remove all style-* classes
    targetWidget.className = 'target-widget';
    targetWidget.classList.add(`style-${styleKey}`);

    // Update active button
    morphButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.style === styleKey);
    });

    // Update intel card
    const data = styleIntelData[styleKey];
    if (data) {
      currentStyleLabel.textContent = `Stil: ${data.name.toUpperCase()}`;
      intelTitle.textContent = data.name;
      intelEra.textContent = data.era;
      intelDescription.textContent = data.desc;
      intelCss.innerHTML = `<code>${data.css}</code>`;
    }
  }

  morphButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const styleKey = btn.dataset.style;
      applyStyle(styleKey);
    });
  });

  // 3. WIDGET PLAYBACK INTERACTION
  const widgetPlayBtn = document.getElementById('widgetPlayBtn');
  let isPlaying = false;

  if (widgetPlayBtn) {
    widgetPlayBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      widgetPlayBtn.textContent = isPlaying ? '⏸ Pause' : '▶ Spill av';
      widgetPlayBtn.style.transform = 'scale(0.96)';
      setTimeout(() => widgetPlayBtn.style.transform = '', 100);
    });
  }

  // 4. MATERIAL RIPPLE EFFECT
  document.querySelectorAll('.ripple-target').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(255, 255, 255, 0.4)';
      ripple.style.transform = 'scale(0)';
      ripple.style.animation = 'rippleAnim 0.6s linear';
      ripple.style.pointerEvents = 'none';

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Inject ripple keyframes if not present
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    @keyframes rippleAnim {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(styleTag);
});
