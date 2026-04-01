document.addEventListener("DOMContentLoaded", () => {
  let data = {};

  // ================= DATA LOAD =================
  fetch('./profile.json')
    .then(res => res.json())
    .then(json => {
      data = json;
    })
    .catch(err => {
      console.error("JSON Load Error. Tip: Use Live Server to avoid CORS blocks!", err);
    });

  // ================= PAGE OPEN =================
  window.openPage = function(type) {
    let html = "";

    if (type === "about") {
      html = `<h2>About Me</h2><p style="line-height:1.7; color:#d1d5db;">${data.about || ""}</p>`;
    }

    if (type === "skills") {
      html = `
        <h2>Tech Stack</h2>
        <div class="skills-grid">
          ${(data.skills || []).map(s => `<div class="skill-tag">${s}</div>`).join('')}
        </div>
      `;
    }

    if (type === "projects") {
      html = `
        <h2>Featured Projects</h2>
        <div class="projects-grid">
          ${(data.projects || []).map(p => `
            <div class="project-card">
              <h3>${p.name}</h3>
              <p>${p.desc}</p>
              <div class="tech-stack">
                ${(p.tech || []).map(t => `<span class="tech-chip">${t}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (type === "experience") {
      html = `
        <h2>Experience</h2>
        <div class="project-card">
          <h3>Freelance Educator</h3>
          <p style="color:var(--accent); margin-bottom:10px;">STEM Focus</p>
          <p>${data.experience || ""}</p>
        </div>
      `;
    }

    if (type === "contact") {
      html = `
        <h2>Let's Connect</h2>
        <div class="contact-grid">
          <a href="mailto:${data.contact?.email || ""}" class="contact-card">✉️ Email Me</a>
          <a href="https://${data.contact?.linkedin || ""}" target="_blank" class="contact-card">🔗 LinkedIn</a>
          <a href="https://${data.contact?.github || ""}" target="_blank" class="contact-card">💻 GitHub</a>
        </div>
      `;
    }

    document.getElementById("content").innerHTML = html;
    toggleScreen(false);
  };

  window.goBack = function() {
    toggleScreen(true);
  };

  function toggleScreen(showHome) {
    document.getElementById("home").classList.toggle("active", showHome);
    document.getElementById("page").classList.toggle("active", !showHome);
  }

  // ================= CUSTOM CURSOR =================
  const cursor = document.querySelector(".cursor");
  document.addEventListener("mousemove", e => {
    if (!cursor) return;
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });

  // ================= SWIPE TO GO BACK (MOBILE) =================
  let startX = 0;
  document.addEventListener("touchstart", e => { startX = e.touches[0].clientX; });
  document.addEventListener("touchend", e => {
    let endX = e.changedTouches[0].clientX;
    if (endX - startX > 100) { goBack(); }
  });

  // Auto hide swipe hint
  setTimeout(() => {
    const hint = document.getElementById("swipeHint");
    if (hint) hint.style.display = "none";
  }, 3500);

  // ================= MAGNETIC MENU EFFECT =================
  const isMobile = window.innerWidth <= 768;
  const menuCards = document.querySelectorAll(".menu div");

  if (!isMobile) {
    menuCards.forEach(card => {
      card.addEventListener("mousemove", e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const moveX = (x - centerX) * 0.25;
        const moveY = (y - centerY) * 0.25;

        card.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "translate(0,0) scale(1)";
      });
    });
  }
});
