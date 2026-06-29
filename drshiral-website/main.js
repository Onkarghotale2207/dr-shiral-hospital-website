// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 2000);
});

// ===== MOBILE NAV =====
function toggleMobileNav() {
  document.getElementById('mobile-nav').classList.toggle('open');
  document.querySelector('.hamburger').classList.toggle('active');
}
function closeMobileNav() {
  document.getElementById('mobile-nav').classList.remove('open');
  document.querySelector('.hamburger').classList.remove('active');
}

// ===== HEADER SCROLL EFFECT =====
window.addEventListener('scroll', () => {
  const header = document.getElementById('site-header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ===== PARTICLE BACKGROUND =====
(function() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2 + 1;
      this.opacity = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) {
    particles.push(new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.15 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animationId = requestAnimationFrame(animate);
  }
  animate();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });
})();

// ===== THREE.JS 3D HOSPITAL BUILDING =====
(function() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas || !window.THREE) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const ambientLight = new THREE.AmbientLight(0x00d4ff, 0.3);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0x00d4ff, 1, 100);
  pointLight.position.set(5, 10, 5);
  scene.add(pointLight);
  const purpleLight = new THREE.PointLight(0xa855f7, 0.8, 100);
  purpleLight.position.set(-5, 5, -5);
  scene.add(purpleLight);

  const hospitalGroup = new THREE.Group();

  const buildingGeo = new THREE.BoxGeometry(4, 6, 3);
  const buildingMat = new THREE.MeshPhongMaterial({
    color: 0x1e3a5f,
    transparent: true,
    opacity: 0.8,
    emissive: 0x00d4ff,
    emissiveIntensity: 0.1
  });
  const building = new THREE.Mesh(buildingGeo, buildingMat);
  hospitalGroup.add(building);

  const edges = new THREE.EdgesGeometry(buildingGeo);
  const lineMat = new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.6 });
  const wireframe = new THREE.LineSegments(edges, lineMat);
  hospitalGroup.add(wireframe);

  for (let floor = 0; floor < 4; floor++) {
    for (let col = 0; col < 3; col++) {
      const windowGeo = new THREE.PlaneGeometry(0.6, 0.8);
      const windowMat = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.4 + Math.random() * 0.4,
        side: THREE.DoubleSide
      });
      const windowMesh = new THREE.Mesh(windowGeo, windowMat);
      windowMesh.position.set(-1.2 + col * 1.2, -2 + floor * 1.3, 1.51);
      hospitalGroup.add(windowMesh);
    }
  }

  const crossV = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 1.2, 0.3),
    new THREE.MeshBasicMaterial({ color: 0x00d4ff, emissive: 0x00d4ff, emissiveIntensity: 0.5 })
  );
  crossV.position.set(0, 3.8, 0);
  hospitalGroup.add(crossV);

  const crossH = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.3, 0.3),
    new THREE.MeshBasicMaterial({ color: 0x00d4ff, emissive: 0x00d4ff, emissiveIntensity: 0.5 })
  );
  crossH.position.set(0, 3.8, 0);
  hospitalGroup.add(crossH);

  const platformGeo = new THREE.CylinderGeometry(5, 5, 0.2, 32);
  const platformMat = new THREE.MeshPhongMaterial({
    color: 0x0f172a,
    transparent: true,
    opacity: 0.6,
    emissive: 0x00d4ff,
    emissiveIntensity: 0.05
  });
  const platform = new THREE.Mesh(platformGeo, platformMat);
  platform.position.y = -3.2;
  hospitalGroup.add(platform);

  const ringGeo = new THREE.TorusGeometry(4, 0.05, 8, 64);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.3 });
  const ring1 = new THREE.Mesh(ringGeo, ringMat);
  ring1.rotation.x = Math.PI / 2;
  ring1.position.y = 0;
  hospitalGroup.add(ring1);

  const ring2 = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.2 }));
  ring2.rotation.x = Math.PI / 2;
  ring2.position.y = 1;
  ring2.scale.set(1.2, 1.2, 1.2);
  hospitalGroup.add(ring2);

  scene.add(hospitalGroup);
  camera.position.set(8, 4, 8);
  camera.lookAt(0, 0, 0);

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  let frameCount = 0;
  function animate() {
    requestAnimationFrame(animate);
    frameCount++;
    hospitalGroup.rotation.y += 0.002;
    hospitalGroup.rotation.x = mouseY * 0.1;
    hospitalGroup.rotation.z = mouseX * 0.05;
    ring1.rotation.z += 0.01;
    ring2.rotation.z -= 0.008;
    hospitalGroup.children.forEach((child, i) => {
      if (child.geometry && child.geometry.type === 'PlaneGeometry') {
        child.material.opacity = 0.3 + Math.sin(frameCount * 0.05 + i) * 0.3;
      }
    });
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

// ===== GSAP SCROLL ANIMATIONS =====
if (window.gsap) {
  gsap.registerPlugin(ScrollTrigger);

  // Reveal animations
  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Hero content animation
  gsap.from('.hero-badge', { opacity: 0, y: 20, duration: 0.6, delay: 2.5 });
  gsap.from('.hero-h1', { opacity: 0, y: 30, duration: 0.8, delay: 2.7 });
  gsap.from('.hero-sub', { opacity: 0, y: 20, duration: 0.6, delay: 2.9 });
  gsap.from('.hero-ctas', { opacity: 0, y: 20, duration: 0.6, delay: 3.1 });
  gsap.from('.hero-stats', { opacity: 0, y: 20, duration: 0.6, delay: 3.3 });
}

// ===== ANIMATED COUNTERS =====
function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  const duration = 2000;
  const start = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(easeProgress * target);

    if (target >= 1000) {
      element.textContent = (current / 1000).toFixed(0) + 'K';
    } else {
      element.textContent = current;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target >= 1000 ? (target / 1000) + 'K' : target;
    }
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('.counter-value');
      counters.forEach(counter => {
        if (!counter.classList.contains('counted')) {
          counter.classList.add('counted');
          animateCounter(counter);
        }
      });
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats, .trust-grid').forEach(el => counterObserver.observe(el));

// ===== SERVICE CARD TILT EFFECT =====
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  });
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== PRELOAD IMAGES =====
const images = document.querySelectorAll('img[loading="lazy"]');
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  });
  images.forEach(img => imageObserver.observe(img));
}
