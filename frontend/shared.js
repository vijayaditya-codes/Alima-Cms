/**
 * Alima CMS Shared JS Utilities
 * Handles core animations, sidebar layouts, and UI components
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Sidebar Collapsing
  initSidebar();
  
  // Initialize Theme System
  initThemeToggle();
  
  // Page load fade-in check
  document.body.classList.add('loaded');
});

/**
 * 1. Sidebar Management
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

  setupMobileMenu(sidebar);
}

function setupMobileMenu(sidebar) {
  const existingTrigger = document.querySelector('.mobile-menu-trigger');
  if (existingTrigger) {
    existingTrigger.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });
    return;
  }

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
    box-shadow: var(--shadow-hover);
    cursor: pointer;
    z-index: 999;
    display: none;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
  `;

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

  document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('mobile-open') && !sidebar.contains(e.target) && e.target !== mobileBtn) {
      sidebar.classList.remove('mobile-open');
    }
  });
}

/**
 * 2. Toast Notifications System
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

  static show(title, message, type = 'info', duration = 4000) {
    const container = this.getContainer();
    const toast = document.createElement('div');
    toast.className = `alima-toast toast-${type}`;
    
    let icon = '✨';
    if (type === 'success') icon = '✓';
    else if (type === 'warning') icon = '⚠';
    else if (type === 'error') icon = '✕';
    else if (type === 'info') icon = 'ℹ';
    
    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-msg">${message}</div>
      </div>
      <button class="toast-close">&times;</button>
    `;

    container.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    const dismissToast = () => {
      toast.style.transform = 'translateX(120%) scale(0.9)';
      toast.style.opacity = '0';
      setTimeout(() => {
        toast.remove();
        if (container.children.length === 0) {
          container.remove();
        }
      }, 200);
    };

    closeBtn.addEventListener('click', dismissToast);
    const autoDismiss = setTimeout(dismissToast, duration);
    
    toast.addEventListener('mouseenter', () => clearTimeout(autoDismiss));
  }
}

window.AlimaToast = AlimaToast;

/**
 * 3. Firestore Activity Logger Helper
 */
async function logActivity(action) {
  try {
    const db = window.firebaseDb;
    const auth = window.firebaseAuth;
    if (!db || !auth || !auth.currentUser) return;
    
    // Dynamic import to avoid module issues in non-module files
    const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js");
    await addDoc(collection(db, "activity"), {
      ownerUid: auth.currentUser.uid,
      action: action,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}

window.logActivity = logActivity;

/**
 * 4. Theme System Management
 */
function initThemeToggle() {
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn, #theme-btn, #theme-toggle');
  
  // Set initial icon state on all buttons
  updateThemeIcon();

  toggleBtns.forEach(btn => {
    // Avoid double bindings
    if (btn.dataset.themeBound) return;
    btn.dataset.themeBound = 'true';
    
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleTheme();
    });
  });
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('alima-theme', isDark ? 'dark' : 'light');
  updateThemeIcon();
  
  // Update canvas particles if they exist
  if (window.initCanvasParticles) {
    window.initCanvasParticles();
  }
}

function updateThemeIcon() {
  const isDark = document.documentElement.classList.contains('dark');
  
  const moonIcons = document.querySelectorAll('#moon-icon, .moon-icon');
  const sunIcons = document.querySelectorAll('#sun-icon, .sun-icon');
  
  moonIcons.forEach(icon => {
    icon.style.display = isDark ? 'block' : 'none';
  });
  
  sunIcons.forEach(icon => {
    icon.style.display = isDark ? 'none' : 'block';
  });
}

// Bind to window for global scope accessibility
window.initThemeToggle = initThemeToggle;
window.toggleTheme = toggleTheme;
window.updateThemeIcon = updateThemeIcon;
