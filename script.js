/* ===========================================
   FH6 AI Livery Generator — Engine
   AI Simulation · Particles · Interactions
   =========================================== */

// ─── 1. Particle System ───
class ParticleEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    // Create particles
    const count = Math.min(80, Math.floor(window.innerWidth / 12));
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const p of this.particles) {
      p.pulse += 0.02;
      const pulseAlpha = p.alpha * (0.5 + 0.5 * Math.sin(p.pulse));

      // Mouse interaction
      const dx = this.mouseX - p.x;
      const dy = this.mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        const force = (200 - dist) / 200 * 0.02;
        p.vx -= dx * force;
        p.vy -= dy * force;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

      // Draw
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(0, 251, 255, ${pulseAlpha})`;
      this.ctx.fill();

      // Draw connections
      for (const other of this.particles) {
        if (other === p) continue;
        const dx2 = p.x - other.x;
        const dy2 = p.y - other.y;
        const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        if (dist2 < 120) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(other.x, other.y);
          this.ctx.strokeStyle = `rgba(0, 251, 255, ${0.04 * (1 - dist2 / 120)})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// ─── 2. AI Generator Engine ───
class AILiveryEngine {
  constructor() {
    this.isGenerating = false;
    this.generatedCount = 0;
    this.results = [];

    this.styles = [
      'Tokyo Drift', 'Initial D', 'Cyberpunk', 'JDM Street',
      'Liberty Walk', 'GT Racing', 'Sakura Neon', 'Anime Itasha',
      'Midnight Club', 'Euro Tuner', 'Rally Cross', 'VIP Style'
    ];

    this.cars = [
      { name: 'Nissan GT-R R35', class: 'S1 900' },
      { name: 'Mazda RX-7 FD', class: 'A 800' },
      { name: 'Toyota Supra MK5', class: 'S1 900' },
      { name: 'Subaru WRX STI', class: 'A 800' },
      { name: 'Honda NSX-R', class: 'S1 900' },
      { name: 'Nissan Silvia S15', class: 'B 700' },
    ];

    this.carSilhouettes = ['🏎️', '🚗', '🏁', '💨', '🔥', '⚡'];
    this.palettes = [
      ['#ff0055', '#00fbff', '#ffffff', '#000000'],
      ['#ff6b00', '#ffe600', '#ffffff', '#1a1a1a'],
      ['#7b2ff7', '#ff0055', '#00fbff', '#0a0a0a'],
      ['#00ff88', '#00fbff', '#ffffff', '#050505'],
      ['#ff0055', '#7b2ff7', '#ff6b00', '#000000'],
      ['#ffffff', '#00fbff', '#ff0055', '#111111'],
    ];
  }

  async generate(prompt, style, car) {
    if (this.isGenerating) return;
    this.isGenerating = true;

    // Simulate AI generation scan
    const scanBar = document.querySelector('.scan-fill');
    const scanContainer = document.querySelector('.ai-scan-bar');
    const genBtn = document.querySelector('.btn-generate');

    genBtn.disabled = true;
    genBtn.innerHTML = '<span class="spinner"></span> Generating...';
    scanContainer.classList.add('active');

    // Progressive scan animation
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      await this.sleep(40 + Math.random() * 30);
      const progress = (i / steps) * 100;
      scanBar.style.width = `${progress}%`;
    }

    // Generate livery data
    const styleWords = style.toLowerCase().split(' ');
    const palette = this.palettes[Math.floor(Math.random() * this.palettes.length)];
    const sil = this.carSilhouettes[Math.floor(Math.random() * this.carSilhouettes.length)];
    this.generatedCount++;

    const livery = {
      id: `livery-${Date.now()}`,
      name: this.generateLiveryName(style, car),
      style: style,
      car: car.name,
      carClass: car.class,
      palette: palette,
      silhouette: sil,
      score: Math.floor(Math.random() * 30) + 70,
      popularity: Math.floor(Math.random() * 500) + 100,
      description: `AI-generated ${style} livery concept for the ${car.name}. Features a ${palette[0]}-${palette[1]} gradient with striking neon accents and aggressive vinyl layout inspired by ${style} aesthetics.`,
      prompt: `${style} livery for ${car.name} — ${palette[0]} base with ${palette[1]} accents, ${palette[2]} racing stripes, aggressive stance, widebody kit, neon underglow, ${Math.random() > 0.5 ? 'carbon fiber details' : 'chrome highlights'}, Forza Horizon 6`,
      promptHint: this.generatePromptHint(style),
    };

    this.results.unshift(livery);
    this.isGenerating = false;

    // Reset UI
    genBtn.disabled = false;
    genBtn.innerHTML = '⚡ Generate Livery';
    scanBar.style.width = '0%';
    scanContainer.classList.remove('active');

    return livery;
  }

  generateLiveryName(style, car) {
    const prefixes = ['Neon', 'Cyber', 'Midnight', 'Vapor', 'Ghost', 'Crimson', 'Shadow', 'Phantom', 'Storm', 'Blitz'];
    const suffixes = ['Kaido', 'Racer', 'Knight', 'Fury', 'Strike', 'Drift', 'Burst', 'Rebel', 'Sprint', 'Blade'];
    const p = prefixes[Math.floor(Math.random() * prefixes.length)];
    const s = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${p} ${s}`;
  }

  generatePromptHint(style) {
    const hints = {
      'Tokyo Drift': `Forza Horizon 6 Tokyo Drift style — neon reflections on wet streets, drifting silhouette, Japanese kanji decals`,
      'Initial D': `Eurobeat-inspired racing livery, tofu delivery aesthetics, mountain pass cornering, retro Japanese sports car`,
      'Cyberpunk': `Cyberpunk 2077 inspired — holographic paint, circuit board patterns, neon city reflections, futuristic decals`,
      'JDM Street': `Authentic Japanese domestic market street style — work wheels, low stance, subtle body kit, period-correct decals`,
      'Liberty Walk': `Aggressive widebody Liberty Walk kit — rivet flares, race spec, slammed stance, track day warrior`,
      'GT Racing': `Gran Turismo inspired racing livery — manufacturer colors, race number board, sponsor decals, motorsport grade`,
      'Sakura Neon': `Cherry blossom season Tokyo — soft pink gradients with neon accents, floral decals, spring atmosphere`,
      'Anime Itasha': `Full anime wrap — character illustrations, vibrant colors, Japanese pop culture, otaku aesthetic`,
      'Midnight Club': `Underground street racing — dark color schemes, hidden neon, urban camouflage, night runner`,
      'Euro Tuner': `European tuning culture — clean lines, subtle widebody, performance-oriented, autobahn inspired`,
      'Rally Cross': `Rally championship inspired — mud-splattered, sponsor heavy, functional aero, off-road aggression`,
      'VIP Style': `Japanese VIP luxury — deep dish wheels, air suspension, chrome accents, executive class`,
    };
    return hints[style] || `${style} inspired livery for Forza Horizon 6 — custom paint, vinyl graphics, racing details`;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ─── 3. UI Controller ───
class UIController {
  constructor() {
    this.engine = new AILiveryEngine();
    this.selectedStyle = 'Tokyo Drift';
    this.selectedCar = this.engine.cars[0];
    this.uploadedImage = null;
    this.init();
  }

  init() {
    this.initParticles();
    this.initScrollReveal();
    this.initNavigation();
    this.initGenerator();
    this.initCards();
    this.initModals();
    this.initHUD();
    this.initSmoothScroll();
  }

  initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
      new ParticleEngine(canvas);
    }
  }

  getLiveryImage(style) {
    const map = {
      'Tokyo Drift': 'assets/liveries/supra-meet.jpg',
      'Initial D': 'assets/liveries/skyline-civic.jpg',
      'Cyberpunk': 'assets/liveries/tuned-car.jpg',
      'JDM Street': 'assets/liveries/r32-skyline.jpg',
      'Liberty Walk': 'assets/liveries/jdm-lineup.jpg',
      'GT Racing': 'assets/liveries/car-gathering.jpg',
      'Sakura Neon': 'assets/liveries/skyline-civic.jpg',
      'Anime Itasha': 'assets/liveries/supra-meet.jpg',
      'Midnight Club': 'assets/liveries/tuned-car.jpg',
      'Euro Tuner': 'assets/liveries/car-gathering.jpg',
      'Rally Cross': 'assets/liveries/jdm-lineup.jpg',
      'VIP Style': 'assets/liveries/r32-skyline.jpg',
    };
    return map[style] || 'assets/liveries/supra-meet.jpg';
  }

  initScrollReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
      .forEach(el => observer.observe(el));
  }

  initNavigation() {
    // Nav scroll effect
    window.addEventListener('scroll', () => {
      const nav = document.querySelector('.nav');
      if (window.scrollY > 100) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });

    // Mobile toggle
    const toggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (toggle && navLinks) {
      toggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        toggle.classList.toggle('open');
      });

      // Close on link click
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('open');
          toggle.classList.remove('open');
        });
      });
    }
  }

  initGenerator() {
    // Style pills
    document.querySelectorAll('.style-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.style-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.selectedStyle = pill.dataset.style;
      });
    });

    // Car selector
    document.querySelectorAll('.car-option').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.car-option').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        const idx = parseInt(opt.dataset.index);
        this.selectedCar = this.engine.cars[idx] || this.engine.cars[0];
      });
    });

    // Upload zone
    const uploadZone = document.querySelector('.upload-zone');
    const uploadInput = document.getElementById('image-upload');
    if (uploadInput && uploadZone) {
      uploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const preview = document.createElement('img');
            preview.className = 'upload-preview';
            preview.src = event.target.result;
            this.uploadedImage = event.target.result;

            // Remove old preview
            const oldPreview = uploadZone.querySelector('.upload-preview');
            if (oldPreview) oldPreview.remove();

            uploadZone.classList.add('has-image');
            uploadZone.querySelector('.upload-icon').textContent = '✅';
            uploadZone.querySelector('h4').textContent = 'Image Ready';
            uploadZone.querySelector('p').textContent = file.name;
            uploadZone.appendChild(preview);
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Generate button
    const genBtn = document.querySelector('.btn-generate');
    if (genBtn) {
      genBtn.addEventListener('click', () => this.handleGenerate());
    }

    // Randomize button
    const randomBtn = document.querySelector('.btn-ghost');
    if (randomBtn) {
      randomBtn.addEventListener('click', () => {
        const randomStyle = this.engine.styles[Math.floor(Math.random() * this.engine.styles.length)];
        const randomCar = this.engine.cars[Math.floor(Math.random() * this.engine.cars.length)];
        document.querySelectorAll('.style-pill').forEach(p => {
          p.classList.toggle('active', p.dataset.style === randomStyle);
        });
        document.querySelectorAll('.car-option').forEach(o => {
          o.classList.toggle('active', parseInt(o.dataset.index) === this.engine.cars.indexOf(randomCar));
        });
        this.selectedStyle = randomStyle;
        this.selectedCar = randomCar;
        this.showToast('🎲 Randomized! Try generating now');
      });
    }

    // Prompt input random fill
    const promptInput = document.getElementById('prompt-input');
    if (promptInput) {
      const examplePrompts = [
        'Neon drift car with cyberpunk city reflections, cherry blossoms floating in the air',
        'Aggressive widebody race car with carbon fiber accents, racing stripes, track day',
        'Sakura themed wrap with holographic gradients, Japanese characters, floral patterns',
        'Midnight black with glowing neon underglow, street racing aesthetic, JDM style',
        'Eurobeat-inspired retro racer, white body, classic sponsor decals, mountain pass'
      ];
      promptInput.placeholder = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
    }
  }

  async handleGenerate() {
    const promptInput = document.getElementById('prompt-input');
    const prompt = promptInput ? (promptInput.value || promptInput.placeholder) : 'Custom FH6 livery design';

    const livery = await this.engine.generate(prompt, this.selectedStyle, this.selectedCar);
    if (livery) {
      this.addResultCard(livery);
      this.showToast('✅ Livery generated! Scroll down to see it');
    }
  }

  addResultCard(livery) {
    const grid = document.querySelector('.results-grid');
    if (!grid) return;

    const card = document.createElement('div');
    card.className = 'result-card reveal';
    card.style.animationDelay = '0.1s';
    const svg = this.getLiveryImage(livery.style);
    card.innerHTML = `
      <div class="card-preview" style="background-image:url('${svg}');background-size:cover;background-position:center">
        <div class="preview-glow"></div>
        <div class="neon-stripes"></div>
        <div class="car-silhouette" style="display:none">${livery.silhouette}</div>
        <div style="position:absolute;bottom:16px;left:16px;right:16px;display:flex;gap:4px">
          ${livery.palette.map(c => `<span style="width:24px;height:24px;border-radius:4px;background:${c};border:1px solid rgba(255,255,255,0.1)"></span>`).join('')}
        </div>
      </div>
      <div class="card-info">
        <div class="card-name">${livery.name}</div>
        <div class="card-tags">
          <span class="card-tag">${livery.style}</span>
          <span class="card-tag">${livery.car}</span>
        </div>
        <div class="card-stats">
          <span class="stat">⭐ ${livery.score}</span>
          <span class="stat">❤️ ${livery.popularity}</span>
          <span class="stat">🏎️ ${livery.carClass}</span>
        </div>
        <div class="card-actions">
          <button class="card-btn copy-prompt" data-prompt="${livery.prompt}">📋 Copy Prompt</button>
          <button class="card-btn view-details" data-id="${livery.id}">🔍 Details</button>
          <button class="card-btn save-livery" data-id="${livery.id}">💾 Save</button>
        </div>
      </div>
    `;

    // Animate in
    grid.prepend(card);

    // Trigger reveal animation
    requestAnimationFrame(() => {
      card.classList.add('active');
    });

    // Card action handlers
    card.querySelector('.copy-prompt').addEventListener('click', (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(livery.prompt).then(() => {
        this.showToast('📋 Prompt copied to clipboard!');
      });
    });

    card.querySelector('.view-details').addEventListener('click', (e) => {
      e.stopPropagation();
      this.openModal(livery);
    });

    card.querySelector('.save-livery').addEventListener('click', (e) => {
      e.stopPropagation();
      this.showToast('💾 Livery saved to your collection');
    });
  }

  initCards() {
    // Pre-populate with example cards
    const exampleStyles = ['Tokyo Drift', 'Cyberpunk', 'JDM Street', 'Sakura Neon', 'Liberty Walk', 'GT Racing'];
    const exampleCars = [
      { name: 'Nissan GT-R R35', class: 'S1 900' },
      { name: 'Mazda RX-7 FD', class: 'A 800' },
      { name: 'Toyota Supra MK5', class: 'S1 900' },
      { name: 'Subaru WRX STI', class: 'A 800' },
      { name: 'Honda NSX-R', class: 'S1 900' },
      { name: 'Nissan Silvia S15', class: 'B 700' },
    ];

    const examples = [
      { name: 'Neon Kaido', style: 'Tokyo Drift', car: exampleCars[1], score: 96, pop: 2847 },
      { name: 'Cyber Phantom', style: 'Cyberpunk', car: exampleCars[0], score: 94, pop: 2134 },
      { name: 'Midnight Rebel', style: 'JDM Street', car: exampleCars[4], score: 92, pop: 1892 },
      { name: 'Sakura Storm', style: 'Sakura Neon', car: exampleCars[2], score: 91, pop: 1654 },
      { name: 'Ghost Blade', style: 'Liberty Walk', car: exampleCars[5], score: 89, pop: 1421 },
      { name: 'Blitz Sprint', style: 'GT Racing', car: exampleCars[3], score: 88, pop: 1238 },
    ];

    const grid = document.querySelector('.results-grid');
    if (!grid) return;

    // Clear skeleton placeholders
    grid.innerHTML = '';

    examples.forEach((ex, i) => {
      const pal = this.engine.palettes[i % this.engine.palettes.length];
      const sil = this.engine.carSilhouettes[i % this.engine.carSilhouettes.length];
      const card = document.createElement('div');
      card.className = 'result-card reveal';
      card.style.transitionDelay = `${i * 0.1}s`;
    const svg = this.getLiveryImage(ex.style);
      card.innerHTML = `
        <div class="card-preview" style="background-image:url('${svg}');background-size:cover;background-position:center">
          <div class="preview-glow"></div>
          <div class="neon-stripes"></div>
          <div class="car-silhouette" style="display:none">${sil}</div>
          <div style="position:absolute;bottom:16px;left:16px;right:16px;display:flex;gap:4px">
            ${pal.map(c => `<span style="width:24px;height:24px;border-radius:4px;background:${c};border:1px solid rgba(255,255,255,0.1)"></span>`).join('')}
          </div>
        </div>
        <div class="card-info">
          <div class="card-name">${ex.name}</div>
          <div class="card-tags">
            <span class="card-tag">${ex.style}</span>
            <span class="card-tag">${ex.car.name}</span>
          </div>
          <div class="card-stats">
            <span class="stat">⭐ ${ex.score}</span>
            <span class="stat">❤️ ${ex.pop}</span>
            <span class="stat">🏎️ ${ex.car.class}</span>
          </div>
          <div class="card-actions">
            <button class="card-btn copy-prompt">📋 Copy Prompt</button>
            <button class="card-btn view-details">🔍 Preview</button>
            <button class="card-btn save-livery">💾 Save</button>
          </div>
        </div>
      `;

      card.querySelector('.copy-prompt').addEventListener('click', (e) => {
        e.stopPropagation();
        const promptText = `${ex.style} livery concept for ${ex.car.name} — custom paint, vinyl graphics, neon accents, Forza Horizon 6 style`;
        navigator.clipboard.writeText(promptText).then(() => {
          this.showToast('📋 Prompt copied!');
        });
      });

      card.querySelector('.view-details').addEventListener('click', (e) => {
        e.stopPropagation();
        this.openModal({
          name: ex.name,
          style: ex.style,
          car: ex.car.name,
          carClass: ex.car.class,
          palette: pal,
          silhouette: sil,
          score: ex.score,
          popularity: ex.pop,
          description: `An AI-generated ${ex.style.toLowerCase()} masterpiece for the ${ex.car.name}. This bold design pushes the boundaries of Forza Horizon 6 customization with striking color contrasts and aggressive vinyl layouts.`,
          prompt: `Generate a ${ex.style.toLowerCase()} livery for ${ex.car.name} — trending on #FH6Livery, viral design, community favorite`
        });
      });

      card.querySelector('.save-livery').addEventListener('click', (e) => {
        e.stopPropagation();
        this.showToast('💾 Livery saved!');
      });

      grid.appendChild(card);
    });
  }

  initModals() {
    const overlay = document.querySelector('.modal-overlay');
    const closeBtn = document.querySelector('.modal-close');

    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('open');
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        overlay.classList.remove('open');
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          overlay.classList.remove('open');
        }
      });
    }
  }

  openModal(livery) {
    const overlay = document.querySelector('.modal-overlay');
    if (!overlay) return;

    const preview = overlay.querySelector('.modal-preview');
    const name = overlay.querySelector('.modal-details h2');
    const desc = overlay.querySelector('.modal-details .modal-desc');
    const palette = overlay.querySelector('.modal-palette');
    const promptArea = overlay.querySelector('.modal-prompt');

    if (preview) {
      preview.innerHTML = `
        <div class="modal-glow"></div>
        <div style="font-size:5rem;opacity:0.3">${livery.silhouette || '🏎️'}</div>
        <div style="position:absolute;bottom:24px;left:24px;right:24px;display:flex;gap:6px;justify-content:center">
          ${(livery.palette || ['#ff0055', '#00fbff']).map(c =>
            `<span style="width:36px;height:36px;border-radius:6px;background:${c};border:1px solid rgba(255,255,255,0.15)"></span>`
          ).join('')}
        </div>
      `;
    }

    if (name) name.textContent = `${livery.name} • ${livery.style}`;
    if (desc) desc.textContent = livery.description;
    if (promptArea) {
      const promptText = livery.prompt || `Generate a ${livery.style} livery for ${livery.car}`;
      promptArea.value = promptText;
    }

    if (palette) {
      palette.innerHTML = '';
      (livery.palette || ['#ff0055', '#00fbff', '#ffffff', '#000000']).forEach(c => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.background = c;
        palette.appendChild(swatch);
      });
    }

    overlay.classList.add('open');
  }

  initHUD() {
    // Animate HUD status
    const statusEl = document.querySelector('.hud-status');
    if (statusEl) {
      const statuses = ['SYSTEM ONLINE', 'AI ENGINE READY', 'MODEL ACTIVE', 'NETWORK STABLE'];
      let idx = 0;
      setInterval(() => {
        idx = (idx + 1) % statuses.length;
        statusEl.childNodes.forEach(n => {
          if (n.nodeType === 3 && n.textContent.trim()) {
            n.textContent = ` ${statuses[idx]} `;
          }
        });
      }, 4000);
    }
  }

  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }
}

// ─── 4. Document Ready ───
document.addEventListener('DOMContentLoaded', () => {
  new UIController();
});
