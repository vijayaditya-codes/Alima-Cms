/**
 * Alima CMS Shared JS Utilities
 * Handles core animations, sidebar layouts, and UI components
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Sidebar Collapsing
  initSidebar();
  
  // Initialize Stat Count-ups for elements with data-count-to
  initStatCountUps();
  
  // Page load fade-in check
  document.body.classList.add('loaded');
});

/**
 * ==========================================================================
 * 1. Sidebar Management
 * ==========================================================================
 */
function initSidebar() {
  const sidebar = document.querySelector('.alima-sidebar');
  const mainContent = document.querySelector('.alima-main-content');
  const toggleBtn = document.querySelector('.sidebar-toggle');
  
  if (!sidebar) return;

  // Restore state from localStorage
  const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
  if (isCollapsed) {
    sidebar.classList.add('collapsed');
    if (mainContent) mainContent.classList.add('sidebar-collapsed');
  }

  // Toggle button click handler
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      if (mainContent) mainContent.classList.toggle('sidebar-collapsed');
      
      const collapsed = sidebar.classList.contains('collapsed');
      localStorage.setItem('sidebar-collapsed', collapsed);
    });
  }

  // Create & setup mobile navigation menu trigger dynamically if not exists
  setupMobileMenu(sidebar);
}

function setupMobileMenu(sidebar) {
  // Check if mobile trigger exists, if not create one in header/main area
  const existingTrigger = document.querySelector('.mobile-menu-trigger');
  if (existingTrigger) {
    existingTrigger.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });
    return;
  }

  // Create a floating mobile menu button if view is mobile
  const mobileBtn = document.createElement('button');
  mobileBtn.className = 'mobile-menu-trigger';
  mobileBtn.innerHTML = '☰';
  mobileBtn.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 24px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--gradient-primary);
    border: none;
    color: white;
    font-size: 1.5rem;
    box-shadow: var(--shadow-purple);
    cursor: pointer;
    z-index: 999;
    display: none;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
  `;

  // Inject responsive style rule for the trigger
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 768px) {
      .mobile-menu-trigger {
        display: flex !important;
      }
      .mobile-menu-trigger:active {
        transform: scale(0.9);
      }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(mobileBtn);

  mobileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('mobile-open');
  });

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('mobile-open') && !sidebar.contains(e.target) && e.target !== mobileBtn) {
      sidebar.classList.remove('mobile-open');
    }
  });
}

/**
 * ==========================================================================
 * 2. Toast Notifications System
 * ==========================================================================
 */
class AlimaToast {
  static getContainer() {
    let container = document.querySelector('.alima-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'alima-toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  /**
   * Show a toast notification
   * @param {string} title - The title of the notification
   * @param {string} message - Description message
   * @param {'success'|'warning'|'error'|'info'} type - Type of toast
   * @param {number} duration - Delay in milliseconds before auto-close
   */
  static show(title, message, type = 'info', duration = 4000) {
    const container = this.getContainer();
    const toast = document.createElement('div');
    toast.className = `alima-toast toast-${type}`;
    
    // Choose icons
    let icon = '✨';
    if (type === 'success') icon = '✓';
    else if (type === 'warning') icon = '⚠';
    else if (type === 'error') icon = '✕';
    
    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-msg">${message}</div>
      </div>
      <button class="toast-close">&times;</button>
    `;

    container.appendChild(toast);

    // Close button event
    const closeBtn = toast.querySelector('.toast-close');
    const dismissToast = () => {
      toast.style.transform = 'translateX(120%) scale(0.9)';
      toast.style.opacity = '0';
      setTimeout(() => {
        toast.remove();
        // Remove container if empty
        if (container.children.length === 0) {
          container.remove();
        }
      }, 300);
    };

    closeBtn.addEventListener('click', dismissToast);

    // Auto dismiss timer
    const autoDismiss = setTimeout(dismissToast, duration);
    
    // Pause auto dismiss on hover
    toast.addEventListener('mouseenter', () => clearTimeout(autoDismiss));
    toast.addEventListener('mouseleave', () => {
      setTimeout(dismissToast, duration / 2);
    });
  }
}

// Attach to window for global access
window.AlimaToast = AlimaToast;

/**
 * ==========================================================================
 * 3. Count-Up Stat Animation
 * ==========================================================================
 */
function animateCountUp(element) {
  const target = parseFloat(element.getAttribute('data-count-to'));
  const duration = parseInt(element.getAttribute('data-count-duration') || '1500', 10);
  const prefix = element.getAttribute('data-count-prefix') || '';
  const suffix = element.getAttribute('data-count-suffix') || '';
  const decimals = parseInt(element.getAttribute('data-count-decimals') || '0', 10);
  
  let startTimestamp = null;
  
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    
    // Easing function outQuad
    const easedProgress = progress * (2 - progress);
    const currentValue = easedProgress * target;
    
    element.innerHTML = prefix + currentValue.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + suffix;
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.innerHTML = prefix + target.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + suffix;
    }
  };
  
  window.requestAnimationFrame(step);
}
window.animateCountUp = animateCountUp;

function initStatCountUps() {
  const elements = document.querySelectorAll('[data-count-to]');
  if (elements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCountUp(entry.target);
        observer.unobserve(entry.target); // Animate only once
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}

/**
 * ==========================================================================
 * 4. Success Action Visual Effects: Confetti & Checkmark Ripple
 * ==========================================================================
 */
class AlimaEffects {
  /**
   * Triggers a confetti burst on the viewport
   */
  static triggerConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 10001;
    `;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const colors = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#3b82f6'];
    const particles = [];
    
    // Generate particles
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height + 20,
        vx: (Math.random() - 0.5) * 20,
        vy: -Math.random() * 20 - 10,
        radius: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.5,
        opacity: 1
      });
    }
    
    function updateConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotationSpeed;
        p.opacity = Math.max(0, p.opacity - 0.015);
        
        if (p.opacity > 0) {
          active = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          
          // Draw rect representing confetti
          ctx.fillRect(-p.radius, -p.radius / 2, p.radius * 2, p.radius);
          ctx.restore();
        }
      });
      
      if (active) {
        requestAnimationFrame(updateConfetti);
      } else {
        canvas.remove();
      }
    }
    
    updateConfetti();
  }

  /**
   * Triggers a checkmark ripple overlay from a trigger element
   * @param {HTMLElement} triggerEl
   */
  static triggerCheckmarkRipple(triggerEl) {
    const rect = triggerEl.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 10px;
      height: 10px;
      background: radial-gradient(circle, rgba(124,58,237,0.1) 0%, rgba(6,182,212,0.05) 50%, rgba(10,10,26,0) 100%);
      border: 2px solid var(--color-primary);
      border-radius: 50%;
      transform: translate(-50%, -50%) scale(0);
      pointer-events: none;
      z-index: 10001;
      opacity: 1;
      transition: all 0.6s cubic-bezier(0.1, 0.8, 0.3, 1);
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    const icon = document.createElement('div');
    icon.innerHTML = '✓';
    icon.style.cssText = `
      color: var(--color-success);
      font-size: 2rem;
      font-weight: 800;
      opacity: 0;
      transform: scale(0.5);
      transition: all 0.4s var(--transition-spring);
    `;
    overlay.appendChild(icon);
    document.body.appendChild(overlay);

    // Forces reflow to trigger CSS transitions
    overlay.offsetWidth;

    overlay.style.width = '120px';
    overlay.style.height = '120px';
    overlay.style.transform = 'translate(-50%, -50%) scale(1)';
    overlay.style.background = 'rgba(13, 13, 31, 0.95)';
    overlay.style.boxShadow = 'var(--shadow-hover)';
    overlay.style.backdropFilter = 'blur(16px)';
    
    setTimeout(() => {
      icon.style.opacity = '1';
      icon.style.transform = 'scale(1.2)';
    }, 150);

    setTimeout(() => {
      overlay.style.opacity = '0';
      overlay.style.transform = 'translate(-50%, -50%) scale(1.1)';
      setTimeout(() => overlay.remove(), 300);
    }, 1000);
  }
}

window.AlimaEffects = AlimaEffects;

/**
 * ==========================================================================
 * 5. Floating Particle Background
 * ==========================================================================
 */
function initParticleBackground(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;

  // Set sizing
  function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const particles = [];
  const particleCount = Math.min(60, Math.floor((canvas.width * canvas.height) / 15000));
  const maxDistance = 120;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? '#7c3aed' : '#06b6d4'
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      // Bounce at boundaries
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.45;
      ctx.fill();
    });

    // Draw connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          
          // Gradients between purple and cyan for lines
          const alpha = (1 - dist / maxDistance) * 0.12;
          ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(draw);
  }

  draw();

  // Cleanup handler in case layout re-renders
  return {
    destroy: () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    }
  };
}

window.initParticleBackground = initParticleBackground;
