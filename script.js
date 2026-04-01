document.addEventListener("DOMContentLoaded", () => {
  
  // 1. STATE MANAGEMENT (Keeping data safe and centralized)
  const state = {
    profileData: null,
    currentScreen: 'home',
    isLoading: true
  };

  // 2. CORE INITIALIZATION
  async function init() {
    try {
      await loadData();
      setupEventListeners();
      setupCursor();
      setupSwipe();
      if (!isMobile()) setupMagneticEffect();
    } catch (error) {
      console.error("Initialization failed:", error);
      renderError("Failed to initialize the portfolio. Please refresh.");
    }
  }

  // 3. SECURE DATA FETCHING (With Fallbacks)
  async function loadData() {
    try {
      const response = await fetch('./profile.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      state.profileData = await response.json();
      state.isLoading = false;
    } catch (error) {
      console.error("JSON Load Error:", error);
      state.isLoading = false;
      // Fallback data so the site doesn't look completely broken if fetch fails
      state.profileData = {
        about: "Data failed to load, but I still build awesome things!",
        skills: ["HTML", "CSS", "JS"],
        projects: []
      };
      renderError("Notice: Using offline fallback data.");
    }
  }

  // 4. SCREEN ROUTING & DOM MANIPULATION
  window.openPage = function(type) {
    const contentArea = document.getElementById("content");
    if (!contentArea || !state.profileData) return;

    let html = "";
    const data = state.profileData;

    // Guard clauses to prevent undefined errors
    switch (type) {
      case "about":
        html = `<h2>About Me</h2><p style="line-height:1.7; color:#d1d5db;">${data.about || "No about info available."}</p>`;
        break;

      case "skills":
        const skillsList = data.skills || [];
        html = `
          <h2>Tech Stack</h2>
          <div class="skills-grid">
            ${skillsList.map(s => `<div class="skill-tag">${escapeHTML(s)}</div>`).join('')}
          </div>
        `;
        break;

      case "projects":
        const projectList = data.projects || [];
        html = `
          <h2>Featured Projects</h2>
          <div class="projects-grid">
            ${projectList.map(p => `
              <div class="project-card">
                <h3>${escapeHTML(p.name)}</h3>
                <p>${escapeHTML(p.desc)}</p>
                <div class="tech-stack">
                  ${(p.tech || []).map(t => `<span class="tech-chip">${escapeHTML(t)}</span>`).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        `;
        break;

      case "experience":
        html = `
          <h2>Experience</h2>
          <div class="project-card">
            <h3>Freelance Educator</h3>
            <p style="color:var(--accent); margin-bottom:10px;">STEM Focus</p>
            <p>${data.experience || "No experience listed."}</p>
          </div>
        `;
        break;

      case "contact":
        const contact = data.contact || {};
        html = `
          <h2>Let's Connect</h2>
          <div class="contact-grid">
            <a href="mailto:${contact.email || ''}" class="contact-card">✉️ Email Me</a>
            <a href="https://${contact.linkedin || '#'}" target="_blank" class="contact-card">🔗 LinkedIn</a>
            <a href="https://${contact.github || '#'}" target="_blank" class="contact-card">💻 GitHub</a>
          </div>
        `;
        break;

      default:
        html = `<h2>404</h2><p>Section not found.</p>`;
    }

    contentArea.innerHTML = html;
    toggleScreen(false);
  };

  window.goBack = function() {
    toggleScreen(true);
  };

  function toggleScreen(showHome) {
    document.getElementById("home").classList.toggle("active", showHome);
    document.getElementById("page").classList.toggle("active", !showHome);
    state.currentScreen = showHome ? 'home' : 'page';
  }

  // 5. EVENT UI POLISH (Cursor, Swipe, Magnetic)
  function setupCursor() {
    const cursor = document.querySelector(".cursor");
    if (!cursor) return;

    document.addEventListener("mousemove", e => {
      // requestAnimationFrame makes cursor movement butter-smooth
      requestAnimationFrame(() => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
      });
    });
  }

  function setupSwipe() {
    let startX = 0;
    document.addEventListener("touchstart", e => { startX = e.touches[0].clientX; });
    document.addEventListener("touchend", e => {
      let endX = e.changedTouches[0].clientX;
      if (endX - startX > 100 && state.currentScreen === 'page') { 
        goBack(); 
      }
    });

    setTimeout(() => {
      const hint = document.getElementById("swipeHint");
      if (hint) hint.style.display = "none";
    }, 3500);
  }

  function setupMagneticEffect() {
    const menuCards = document.querySelectorAll(".menu div");
    menuCards.forEach(card => {
      card.addEventListener("mousemove", e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const moveX = (x - rect.width / 2) * 0.25;
        const moveY = (y - rect.height / 2) * 0.25;

        card.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "translate(0,0) scale(1)";
      });
    });
  }

  // 6. UTILITY HELPERS (Defense against XSS attacks & clean code)
  function isMobile() {
    return window.innerWidth <= 768;
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, match => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[match]));
  }

  function renderError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = "position:fixed; bottom:20px; left:20px; background:#ff4a4a; color:white; padding:10px 20px; border-radius:8px; font-size:14px; z-index:9999;";
    errorDiv.innerText = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
  }

  // Kick off the application
  init();
});
