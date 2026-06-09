/**
 * Alima CMS Shared JS Utilities
 * Handles core animations, sidebar layouts, and UI components
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Sidebar Collapsing
  initSidebar();
  
  // Initialize Theme System
  initThemeToggle();
  
  // Initialize Profile Menu Dropdown
  initProfileMenu();
  
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

/**
 * 5. Profile Dropdown Menu & Modals
 */
function initProfileMenu() {
  const footer = document.querySelector('.sidebar-footer');
  if (!footer) return;

  // 1. Inject User Symbol and Chevron to the footer if not already present
  const roleEl = footer.querySelector('.user-role');
  if (roleEl && !footer.querySelector('.profile-user-symbol')) {
    roleEl.innerHTML = 'Campus Admin <span class="profile-user-symbol">👤</span>';
  }
  
  if (!footer.querySelector('.profile-chevron')) {
    const chevron = document.createElement('span');
    chevron.className = 'profile-chevron';
    chevron.innerHTML = '▲';
    footer.appendChild(chevron);
  }

  // 2. Create and append the Dropdown Menu inside the footer (which has overflow: visible)
  let dropdown = footer.querySelector('.profile-dropdown');
  if (!dropdown) {
    dropdown = document.createElement('div');
    dropdown.className = 'profile-dropdown';
    dropdown.innerHTML = `
      <div class="profile-dropdown-header" style="padding: 6px 10px; border-bottom: 1px solid var(--border-color-light); margin-bottom: 6px; text-align: left;">
        <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-main);" class="dropdown-username-field">Vijay Aditya K</div>
        <div style="font-size: 0.75rem; color: var(--text-muted);">Campus Admin</div>
      </div>
      <a class="profile-dropdown-item" id="prof-btn-help">
        <i>❓</i> <span>Help Center</span>
      </a>
      <a class="profile-dropdown-item" id="prof-btn-support">
        <i>🛠️</i> <span>Technical Support</span>
      </a>
      <a class="profile-dropdown-item" id="prof-btn-recents">
        <i>⏱️</i> <span>Recent Logs</span>
      </a>
      <hr style="border: none; border-top: 1px solid var(--border-color-light); margin: 4px 0;">
      <a class="profile-dropdown-item" style="color: var(--color-error);" id="prof-btn-signout">
        <i>🚪</i> <span>Sign Out</span>
      </a>
    `;
    footer.appendChild(dropdown);
  }

  // 3. Toggle dropdown on click
  footer.addEventListener('click', (e) => {
    // Prevent toggling if user clicks inside the dropdown items
    if (dropdown.contains(e.target)) return;
    
    dropdown.classList.toggle('active');
    footer.classList.toggle('dropdown-open');
    
    // Update the dropdown username dynamically based on what's in the footer
    const usernameEl = footer.querySelector('.user-name');
    const dropdownUserEl = dropdown.querySelector('.dropdown-username-field');
    if (usernameEl && dropdownUserEl && usernameEl.textContent !== 'Loading...') {
      dropdownUserEl.textContent = usernameEl.textContent;
    }
  });

  // 4. Close dropdown on clicking outside
  document.addEventListener('click', (e) => {
    if (!footer.contains(e.target)) {
      dropdown.classList.remove('active');
      footer.classList.remove('dropdown-open');
    }
  });

  // 5. Button click events inside dropdown
  const btnHelp = dropdown.querySelector('#prof-btn-help');
  const btnSupport = dropdown.querySelector('#prof-btn-support');
  const btnRecents = dropdown.querySelector('#prof-btn-recents');
  const btnSignout = dropdown.querySelector('#prof-btn-signout');

  if (btnHelp) {
    btnHelp.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.remove('active');
      footer.classList.remove('dropdown-open');
      openHelpSupportModal();
    });
  }

  if (btnSupport) {
    btnSupport.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.remove('active');
      footer.classList.remove('dropdown-open');
      openHelpSupportModal(true); // Focus on ticket input
    });
  }

  if (btnRecents) {
    btnRecents.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.remove('active');
      footer.classList.remove('dropdown-open');
      openRecentsModal();
    });
  }

  if (btnSignout) {
    btnSignout.addEventListener('click', async (e) => {
      e.stopPropagation();
      dropdown.classList.remove('active');
      footer.classList.remove('dropdown-open');
      
      // Trigger sign out
      if (typeof window.handleSignOutAction === 'function') {
        window.handleSignOutAction();
      } else if (typeof window.handleLogout === 'function') {
        window.handleLogout();
      } else {
        // Fallback global implementation
        if (confirm("Are you sure you want to sign out?")) {
          const auth = window.firebaseAuth;
          if (auth) {
            try {
              const { signOut } = await import("https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js");
              await signOut(auth);
            } catch (err) {
              console.error(err);
            }
          }
          window.location.href = "login.html";
        }
      }
    });
  }
}

function openHelpSupportModal(focusTicket = false) {
  // Check if modal already exists
  let modalOverlay = document.getElementById('alima-help-support-modal');
  if (modalOverlay) {
    modalOverlay.classList.add('active');
    const inputMsg = modalOverlay.querySelector('#support-ticket-msg');
    if (focusTicket && inputMsg) {
      setTimeout(() => inputMsg.focus(), 100);
    }
    return;
  }

  modalOverlay = document.createElement('div');
  modalOverlay.className = 'alima-modal-overlay active';
  modalOverlay.id = 'alima-help-support-modal';
  modalOverlay.style.zIndex = '2100';
  modalOverlay.innerHTML = `
    <div class="alima-modal" style="max-width: 500px; text-align: left;">
      <div class="modal-header">
        <h3 style="font-size: 1.35rem; font-weight: 700; color: var(--text-main);">Help & Technical Support</h3>
        <button class="modal-close" onclick="document.getElementById('alima-help-support-modal').classList.remove('active')">&times;</button>
      </div>
      <div class="modal-body" style="display: flex; flex-direction: column; gap: 16px;">
        <p style="color: var(--text-muted); font-size: 0.9rem;">Welcome to Alima Help Desk! Need help configuring university subdomains, layouts, or integrations?</p>
        
        <div style="background: var(--bg-surface); border: 1px solid var(--border-color-light); border-radius: var(--radius-standard); padding: 16px;">
          <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 8px; color: var(--text-main);">📚 Documentation Guides</h4>
          <ul style="list-style: none; padding-left: 0; font-size: 0.85rem; display: flex; flex-direction: column; gap: 6px;">
            <li><a href="#" style="color: var(--color-primary); text-decoration: none;" id="help-link-start">📖 Quick Start & Campus Deployments</a></li>
            <li><a href="#" style="color: var(--color-primary); text-decoration: none;" id="help-link-builder">📖 Drag & Drop Page Builder Tutorial</a></li>
            <li><a href="#" style="color: var(--color-primary); text-decoration: none;" id="help-link-plugins">📖 Integrating Custom Website Plugins</a></li>
          </ul>
        </div>

        <div style="background: var(--bg-surface); border: 1px solid var(--border-color-light); border-radius: var(--radius-standard); padding: 16px;">
          <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 8px; color: var(--text-main);">💬 Submit Support Ticket</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">Our university IT team is active 24/7 to resolve database issues or publishing pipelines.</p>
          <div style="display: flex; gap: 8px;">
            <input type="text" id="support-ticket-msg" class="alima-input" placeholder="What can we help you with?" style="font-size: 0.85rem; padding: 8px 12px;">
            <button class="alima-btn btn-primary btn-sm" id="support-ticket-submit" style="white-space: nowrap;">Submit Ticket</button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modalOverlay);

  // Setup click listeners inside
  modalOverlay.querySelector('#help-link-start').addEventListener('click', (e) => {
    e.preventDefault();
    AlimaToast.show('Knowledge Base', 'Downloading "Quick Start Guide.pdf" to local directory...', 'success');
  });
  modalOverlay.querySelector('#help-link-builder').addEventListener('click', (e) => {
    e.preventDefault();
    AlimaToast.show('Knowledge Base', 'Loading "Page Builder Tutorial V1" documentation modal...', 'info');
  });
  modalOverlay.querySelector('#help-link-plugins').addEventListener('click', (e) => {
    e.preventDefault();
    AlimaToast.show('Knowledge Base', 'Accessing "Custom Plugins API documentation"...', 'info');
  });

  const submitBtn = modalOverlay.querySelector('#support-ticket-submit');
  const inputMsg = modalOverlay.querySelector('#support-ticket-msg');
  submitBtn.addEventListener('click', async () => {
    const msg = inputMsg.value.trim();
    if (!msg) {
      AlimaToast.show('Validation Error', 'Please describe your request before submitting.', 'warning');
      return;
    }
    
    // Log activity
    if (typeof window.logActivity === 'function') {
      await window.logActivity(`Submitted support ticket: "${msg.slice(0, 30)}..."`);
    }

    AlimaToast.show('Ticket Submitted', 'Ticket successfully created. IT support will email you shortly.', 'success');
    inputMsg.value = '';
    modalOverlay.classList.remove('active');
  });

  if (focusTicket && inputMsg) {
    setTimeout(() => inputMsg.focus(), 100);
  }
}

async function openRecentsModal() {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'alima-modal-overlay active';
  overlay.id = 'alima-recents-modal';
  overlay.style.zIndex = '2100';
  overlay.innerHTML = `
    <div class="alima-modal" style="max-width: 460px; text-align: left;">
      <div class="modal-header">
        <h3 style="font-size: 1.3rem; font-weight: 700; color: var(--text-main);">Recent Workspace Actions</h3>
        <button class="modal-close" onclick="document.getElementById('alima-recents-modal').remove()">&times;</button>
      </div>
      <div class="modal-body">
        <div id="modal-recents-list" style="display: flex; flex-direction: column; gap: 12px;">
          <div class="shimmer-skeleton" style="height: 40px; border-radius: var(--radius-standard);"></div>
          <div class="shimmer-skeleton" style="height: 40px; border-radius: var(--radius-standard);"></div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Fetch from Firestore
  try {
    const auth = window.firebaseAuth;
    const db = window.firebaseDb;
    if (!auth || !auth.currentUser || !db) {
      document.getElementById('modal-recents-list').innerHTML = '<div style="text-align: center; color: var(--text-muted); font-size: 0.85rem;">Authentication required.</div>';
      return;
    }
    
    const { collection, query, where, getDocs } = await import("https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js");
    const q = query(collection(db, "activity"), where("ownerUid", "==", auth.currentUser.uid));
    const snap = await getDocs(q);
    
    const list = document.getElementById('modal-recents-list');
    list.innerHTML = '';
    
    if (snap.empty) {
      list.innerHTML = '<div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 12px 0;">No workspace logs tracked yet.</div>';
      return;
    }
    
    const logs = [];
    snap.forEach(d => logs.push(d.data()));
    logs.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    logs.slice(0, 5).forEach(log => {
      const item = document.createElement('div');
      item.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding-bottom:8px; border-bottom:1px solid var(--border-color-light); font-size:0.85rem;';
      const dateStr = new Date(log.timestamp).toLocaleTimeString(undefined, {hour: '2-digit', minute:'2-digit'});
      item.innerHTML = `
        <span style="font-weight:600; color:var(--text-main);">${log.action}</span>
        <span style="color:var(--text-muted);">${dateStr}</span>
      `;
      list.appendChild(item);
    });
    
  } catch (err) {
    console.error(err);
    document.getElementById('modal-recents-list').innerHTML = '<div style="text-align: center; color: var(--color-error); font-size: 0.85rem;">Failed to retrieve logs.</div>';
  }
}

window.initProfileMenu = initProfileMenu;
window.openHelpSupportModal = openHelpSupportModal;
window.openRecentsModal = openRecentsModal;
// End of file
