/* ============================================
   ANANDITA PORTFOLIO — script.js
   ============================================ */

/* ========== THEME TOGGLE ========== */
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme === 'light') {
  document.documentElement.setAttribute('data-theme', 'light');
  themeToggle.textContent = '🌙';
}
themeToggle.addEventListener('click', () => {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  if (isLight) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'dark');
    themeToggle.textContent = '💡';
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
    themeToggle.textContent = '🌙';
  }
});

/* ========== TERMINAL PRELOADER ========== */
window.addEventListener('load', () => {
  const lines = [
    "neurolink_established: true",
    "booting_core_modules...",
    "resolving_dependencies...",
    "> System initialized. Load profile... Anandita."
  ];
  const termElement = document.getElementById('term-text');
  let lineIdx = 0;
  let charIdx = 0;
  
  function typeWriter() {
    if (lineIdx < lines.length) {
      if (charIdx < lines[lineIdx].length) {
        let currentText = termElement.textContent;
        termElement.textContent = currentText + lines[lineIdx].charAt(charIdx);
        charIdx++;
        setTimeout(typeWriter, 25);
      } else {
        termElement.textContent += "\n";
        lineIdx++;
        charIdx = 0;
        setTimeout(typeWriter, 150);
      }
    } else {
      setTimeout(() => {
        document.getElementById('preloader').style.opacity = '0';
        document.getElementById('preloader').style.visibility = 'hidden';
        
        const mainW = document.getElementById('main-wrapper');
        mainW.style.visibility = 'visible';
        mainW.style.transition = 'opacity 1.5s ease-in-out';
        mainW.style.opacity = '1';
        
        setTimeout(() => {
          if (window.initGSAP) window.initGSAP();
        }, 100);
      }, 1000);
    }
  }
  setTimeout(typeWriter, 300);
});

/* ========== CUSTOM NEURAL CURSOR ========== */
const dot = document.getElementById('cursor-dot');
const spotlight = document.getElementById('cursor-spotlight');
const cvs = document.getElementById('neural-canvas');
const ctx = cvs.getContext('2d');
let width, height;

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  cvs.width = width;
  cvs.height = height;
}
window.addEventListener('resize', resize);
resize();

const mouse = { x: width/2, y: height/2 };
const particles = [];
for (let i=0; i<30; i++) {
  particles.push({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 1,
    vy: (Math.random() - 0.5) * 1
  });
}

window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  dot.style.left = mouse.x + 'px';
  dot.style.top = mouse.y + 'px';
  spotlight.style.left = mouse.x + 'px';
  spotlight.style.top = mouse.y + 'px';
});

document.querySelectorAll('a, button, .draggable').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

function drawNeural() {
  ctx.clearRect(0, 0, width, height);
  const color = document.documentElement.getAttribute('data-theme') === 'light' ? 'rgba(124,92,252,' : 'rgba(0,240,255,';
  
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if(p.x < 0 || p.x > width) p.vx *= -1;
    if(p.y < 0 || p.y > height) p.vy *= -1;
    
    // Connect to mouse
    const dx = p.x - mouse.x;
    const dy = p.y - mouse.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < 180) {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(mouse.x, mouse.y);
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      ctx.strokeStyle = isLight ? `rgba(124,92,252, ${1 - dist/180})` : `rgba(0,240,255, ${1 - dist/180})`;
      if(!isLight && Math.random() > 0.8) ctx.strokeStyle = `rgba(176,38,255, ${1 - dist/180})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  });
  requestAnimationFrame(drawNeural);
}
drawNeural();

/* ========== GSAP ANIMATIONS ========== */
window.initGSAP = function() {
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Deck of Cards Stacking Effect
    const cards = gsap.utils.toArray('.project-card');
    cards.forEach((card, i) => {
      if (i !== cards.length - 1) {
        gsap.to(card, {
          scale: 0.9 + (0.02 * i),
          opacity: 0.5,
          scrollTrigger: {
            trigger: card,
            start: "top 15vh",
            endTrigger: ".projects-grid",
            end: "bottom bottom",
            scrub: true
          }
        });
      }
      gsap.from(card, {
        y: 80, opacity: 0, scale: 0.8, duration: 0.7,
        scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none reverse" }
      });
    });

    // Laser Beam Timeline
    gsap.to('#laser-beam', {
      height: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: "#achievements-wrap",
        start: "top center",
        end: "bottom center",
        scrub: true
      }
    });

    // Achievement List Reveal
    const achs = gsap.utils.toArray('.achievement-card');
    achs.forEach((ach) => {
      gsap.from(ach, {
        x: -50, opacity: 0, duration: 0.6,
        scrollTrigger: {
          trigger: ach,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });
    });
  }
};

/* ========== NAVBAR: scroll & active link ========== */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Scroll-to-top visibility
  if (window.scrollY > 400) scrollTopBtn.classList.add('visible');
  else scrollTopBtn.classList.remove('visible');

  // Active nav link highlight
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
  });
});

scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ========== HAMBURGER MENU ========== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ========== SMOOTH SCROLL: all anchor links ========== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ========== INTERSECTION OBSERVER: reveal on scroll ========== */
const revealElements = document.querySelectorAll(
  '.about-card, .result-card, .contact-card, .contact-form-wrap'
);
revealElements.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
          // Trigger the fill bars on result cards
          const fill = entry.target.querySelector('.sem-fill');
          if (fill) {
            const width = fill.style.width;
            fill.style.width = '0';
            setTimeout(() => { fill.style.width = width; }, 50);
          }
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealElements.forEach(el => observer.observe(el));

/* ========== COUNTER ANIMATION ========== */
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = target + '+';
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current);
        }
      }, 16);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

/* ========== DRAG & DROP: Projects ========== */
const projectsGrid = document.getElementById('projects-grid');
let dragSrc = null;

document.querySelectorAll('.draggable').forEach(card => {
  card.addEventListener('dragstart', function (e) {
    dragSrc = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
  });
  card.addEventListener('dragend', function () {
    this.classList.remove('dragging');
    document.querySelectorAll('.draggable').forEach(c => c.classList.remove('drag-over'));
  });
  card.addEventListener('dragover', function (e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
  });
  card.addEventListener('dragenter', function () {
    if (this !== dragSrc) this.classList.add('drag-over');
  });
  card.addEventListener('dragleave', function () {
    this.classList.remove('drag-over');
  });
  card.addEventListener('drop', function (e) {
    e.stopPropagation();
    if (dragSrc !== this) {
      // Swap positions
      const allCards = [...projectsGrid.children];
      const srcIdx = allCards.indexOf(dragSrc);
      const tgtIdx = allCards.indexOf(this);
      if (srcIdx < tgtIdx) {
        projectsGrid.insertBefore(dragSrc, this.nextSibling);
      } else {
        projectsGrid.insertBefore(dragSrc, this);
      }
    }
    this.classList.remove('drag-over');
    return false;
  });
});

/* ========== 3D SKILLS GLOBE (Three.js) ========== */
(function initGlobe() {
  const canvas = document.getElementById('skills-globe');
  const GLOBE_SIZE = Math.min(window.innerWidth < 600 ? 260 : 360, 360);
  canvas.width = GLOBE_SIZE;
  canvas.height = GLOBE_SIZE;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(GLOBE_SIZE, GLOBE_SIZE);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 2.8;

  // Globe sphere
  const geo = new THREE.SphereGeometry(1, 48, 48);
  const mat = new THREE.MeshPhongMaterial({
    color: 0xF3F0FF,
    transparent: true,
    opacity: 0.18,
    shininess: 80,
    wireframe: false
  });
  const globe = new THREE.Mesh(geo, mat);
  scene.add(globe);

  // Wireframe overlay
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xC8B6FF,
    wireframe: true,
    transparent: true,
    opacity: 0.12
  });
  const wire = new THREE.Mesh(new THREE.SphereGeometry(1.01, 24, 24), wireMat);
  scene.add(wire);

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambient);
  const dirLight = new THREE.DirectionalLight(0x7C5CFC, 1.2);
  dirLight.position.set(3, 3, 5);
  scene.add(dirLight);
  const pointLight = new THREE.PointLight(0xFF6B9D, 0.8, 10);
  pointLight.position.set(-3, -2, 2);
  scene.add(pointLight);

  // Skills nodes
  const skills = [
    { label: 'Python',     color: 0xFF6B6B, size: 0.075 },
    { label: 'JavaScript', color: 0xFFD93D, size: 0.075 },
    { label: 'TypeScript', color: 0x4FC3F7, size: 0.065 },
    { label: 'C++',        color: 0xA29BFE, size: 0.06  },
    { label: 'React',      color: 0x00CEC9, size: 0.08  },
    { label: 'Node.js',    color: 0x55EFC4, size: 0.07  },
    { label: 'Flask',      color: 0xFD79A8, size: 0.065 },
    { label: 'Vue.js',     color: 0xFDCB6E, size: 0.065 },
    { label: 'Git',        color: 0x6C5CE7, size: 0.07  },
    { label: 'Firebase',   color: 0xE17055, size: 0.065 },
    { label: 'Streamlit',  color: 0xFF9F43, size: 0.065 },
    { label: 'MediaPipe',  color: 0x1DD1A1, size: 0.065 },
    { label: 'TF.js',      color: 0xFF9F43, size: 0.065 },
    { label: 'MediaPipe',  color: 0x1DD1A1, size: 0.065 },
  ];

  const skillGroup = new THREE.Group();
  scene.add(skillGroup);

  // Fibonacci sphere point distribution
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  skills.forEach((sk, i) => {
    const theta = Math.acos(1 - (2 * (i + 0.5)) / skills.length);
    const phi = 2 * Math.PI * i / goldenRatio;

    const x = Math.sin(theta) * Math.cos(phi);
    const y = Math.sin(theta) * Math.sin(phi);
    const z = Math.cos(theta);

    // Main sphere
    const geo = new THREE.SphereGeometry(sk.size, 16, 16);
    const mat = new THREE.MeshPhongMaterial({ color: sk.color, shininess: 120, emissive: sk.color, emissiveIntensity: 0.2 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);

    // Glow ring
    const ringGeo = new THREE.TorusGeometry(sk.size * 1.5, sk.size * 0.15, 8, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: sk.color, transparent: true, opacity: 0.35 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(x, y, z);
    ring.lookAt(0, 0, 0);

    skillGroup.add(mesh);
    skillGroup.add(ring);

    // Line to center
    const lineMat = new THREE.LineBasicMaterial({ color: sk.color, transparent: true, opacity: 0.2 });
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(x, y, z)
    ]);
    const line = new THREE.Line(lineGeo, lineMat);
    skillGroup.add(line);

    // Text Label Sprite
    const canvasTxt = document.createElement('canvas');
    canvasTxt.width = 256; 
    canvasTxt.height = 128;
    const ctxTxt = canvasTxt.getContext('2d');
    ctxTxt.font = '800 28px "Outfit", sans-serif'; 
    ctxTxt.textAlign = 'center';
    ctxTxt.textBaseline = 'middle';
    ctxTxt.fillStyle = '#ffffff';
    ctxTxt.shadowColor = '#' + sk.color.toString(16).padStart(6, '0');
    ctxTxt.shadowBlur = 10;
    ctxTxt.fillText(sk.label, 128, 64);
    
    const texture = new THREE.CanvasTexture(canvasTxt);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    
    const distT = 1.18; // Float slightly above the node
    sprite.position.set(x * distT, y * distT, z * distT);
    sprite.scale.set(0.5, 0.25, 1); // 2:1 aspect ratio match
    skillGroup.add(sprite);
  });

  // Orbit ring
  const orbitGeo = new THREE.TorusGeometry(1.18, 0.006, 8, 80);
  const orbitMat = new THREE.MeshBasicMaterial({ color: 0xC8B6FF, transparent: true, opacity: 0.4 });
  const orbit1 = new THREE.Mesh(orbitGeo, orbitMat);
  orbit1.rotation.x = Math.PI / 4;
  scene.add(orbit1);
  const orbit2 = orbit1.clone();
  orbit2.rotation.x = -Math.PI / 3;
  orbit2.rotation.y = Math.PI / 5;
  scene.add(orbit2);

  // Mouse drag interaction
  let isDragging = false;
  let prevX = 0, prevY = 0;
  let autoRotate = true;
  let velX = 0, velY = 0;

  canvas.addEventListener('mousedown', e => {
    isDragging = true;
    autoRotate = false;
    prevX = e.clientX;
    prevY = e.clientY;
    velX = 0; velY = 0;
  });
  canvas.addEventListener('touchstart', e => {
    isDragging = true;
    autoRotate = false;
    prevX = e.touches[0].clientX;
    prevY = e.touches[0].clientY;
    velX = 0; velY = 0;
  }, { passive: true });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.clientX - prevX;
    const dy = e.clientY - prevY;
    velX = dy * 0.008;
    velY = dx * 0.008;
    skillGroup.rotation.x += velX;
    skillGroup.rotation.y += velY;
    globe.rotation.x += velX * 0.3;
    globe.rotation.y += velY * 0.3;
    prevX = e.clientX;
    prevY = e.clientY;
  });
  window.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - prevX;
    const dy = e.touches[0].clientY - prevY;
    velX = dy * 0.008;
    velY = dx * 0.008;
    skillGroup.rotation.x += velX;
    skillGroup.rotation.y += velY;
    globe.rotation.x += velX * 0.3;
    globe.rotation.y += velY * 0.3;
    prevX = e.touches[0].clientX;
    prevY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    setTimeout(() => { autoRotate = true; }, 2000);
  });
  window.addEventListener('touchend', () => {
    isDragging = false;
    setTimeout(() => { autoRotate = true; }, 2000);
  });

  // Animation loop
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    if (autoRotate) {
      skillGroup.rotation.y += 0.004;
      skillGroup.rotation.x += 0.001;
      velX *= 0.95;
      velY *= 0.95;
    } else if (!isDragging) {
      skillGroup.rotation.y += velY;
      skillGroup.rotation.x += velX;
      velX *= 0.92;
      velY *= 0.92;
    }

    // Pulse orbit rings
    orbit1.rotation.z += 0.003;
    orbit2.rotation.z -= 0.002;

    // Glow pulse
    pointLight.intensity = 0.6 + 0.4 * Math.sin(time * 2);

    renderer.render(scene, camera);
  }
  animate();
})();



/* ========== CONTACT FORM ========== */
document.getElementById('contact-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const btn = document.getElementById('send-btn');
  btn.textContent = 'Sending... ⏳';
  btn.disabled = true;
  const formData = new FormData(this);

  fetch("https://formsubmit.co/ajax/ananditaindurkhya02@gmail.com", {
    method: "POST",
    headers: { 
      'Accept': 'application/json'
    },
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    btn.textContent = 'Send Message ✉️';
    btn.disabled = false;
    this.reset();
    const success = document.getElementById('form-success');
    success.textContent = "✅ Message sent! I'll get back to you soon.";
    success.classList.add('show');
    setTimeout(() => success.classList.remove('show'), 5000);
  })
  .catch(error => {
    console.error("Email send error:", error);
    btn.textContent = 'Send Message ✉️';
    btn.disabled = false;
    const success = document.getElementById('form-success');
    success.textContent = "❌ Failed to send. Please email me directly.";
    success.style.color = "#ff6b6b"; 
    success.style.background = "rgba(255, 107, 107, 0.1)";
    success.classList.add('show');
    setTimeout(() => success.classList.remove('show'), 5000);
  });
});

/* ========== HOVER PARALLAX on hero visual ========== */
document.addEventListener('mousemove', e => {
  const chips = document.querySelectorAll('.floating-chip');
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;
  chips.forEach((chip, i) => {
    const factor = (i % 2 === 0 ? 1 : -1) * 8;
    chip.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
  });
});
