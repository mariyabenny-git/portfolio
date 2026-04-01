// ================= PAGE OPEN =================
  window.openPage = function(type) {
    let html = "";

    if (type === "about") {
      html = `
        <h2 style="font-family:'Playfair Display', serif; font-size: 2rem; color: #fff;">About Me</h2>
        <p style="font-size: 1.1rem; line-height: 1.7; margin-top:15px;">${data.about || ""}</p>
      `;
    }

    if (type === "skills") {
      html = `
        <h2 style="font-family:'Playfair Display', serif; color: #fff;">Tech Stack</h2>
        <div class="skills-grid">
          ${(data.skills || []).map(s => `<div class="skill-tag">${s.name}</div>`).join('')}
        </div>
      `;
    }

    if (type === "projects") {
      html = `
        <h2 style="font-family:'Playfair Display', serif; color: #fff; margin-bottom: 20px;">Featured Work</h2>
        <div class="projects-grid">
          ${(data.projects || []).map(p => `
            <div class="project-card">
              <h3>${p.name}</h3>
              <p>${p.desc}</p>
              <div class="tech-stack">
                ${p.tech.map(t => `<span class="tech-chip">${t}</span>`).join('')}
              </div>
              <a href="${p.link}" target="_blank" style="display:inline-block; margin-top:15px; color:var(--accent); text-decoration:none; font-size:0.9rem;">View Code →</a>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (type === "experience") {
      html = `
        <h2 style="font-family:'Playfair Display', serif; color: #fff;">Experience</h2>
        <div class="project-card" style="margin-top: 20px;">
          <h3>Freelance Educator</h3>
          <p style="color: var(--accent); font-size: 0.9rem; margin-bottom: 10px;">Mathematics & Science</p>
          <p>${data.experience || ""}</p>
        </div>
      `;
    }

    if (type === "contact") {
      html = `
        <h2 style="font-family:'Playfair Display', serif; color: #fff; margin-bottom:20px;">Let's Connect</h2>
        <div class="contact-grid">
          <a href="mailto:${data.contact?.email || ""}" class="contact-card">✉️ Shoot me an Email</a>
          <a href="https://${data.contact?.linkedin || ""}" target="_blank" class="contact-card">🔗 Let's link on LinkedIn</a>
          <a href="https://${data.contact?.github || ""}" target="_blank" class="contact-card">💻 Check my GitHub</a>
        </div>
      `;
    }

    document.getElementById("content").innerHTML = html;
    document.body.classList.add("blur");
    toggleScreen(false);
  };
