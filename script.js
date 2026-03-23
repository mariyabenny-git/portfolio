// ================= DATA LOAD =================
let data = {};

fetch('./profile.json')
  .then(res => res.json())
  .then(json => {
    data = json;

    document.getElementById("name").innerText = data.name || "";
    document.getElementById("title").innerText = data.title || "";
  })
  .catch(err => {
    console.error("JSON Load Error:", err);
  });


// ================= PAGE OPEN =================
function openPage(type) {

  let html = "";

  if (type === "about") {
    html = `<h2>ABOUT</h2><p>${data.about || ""}</p>`;
  }

  if (type === "skills") {
    html = `<h2>SKILLS</h2>
      ${(data.skills || []).map(s => `<p>${s}</p>`).join('')}`;
  }

  if (type === "projects") {
    html = `<h2>PROJECTS</h2>
      ${(data.projects || []).map(p => `<p>${p.name} - ${p.desc}</p>`).join('')}`;
  }

  if (type === "experience") {
    html = `<h2>EXPERIENCE</h2><p>${data.experience || ""}</p>`;
  }

  if (type === "contact") {
    html = `
      <h2>CONTACT</h2>
      <div class="contact-grid">
        <a href="mailto:${data.contact?.email || ""}" class="contact-card">✉️ ${data.contact?.email || ""}</a>
        <a href="https://${data.contact?.linkedin || ""}" target="_blank" class="contact-card">🔗 LinkedIn</a>
        <a href="https://${data.contact?.github || ""}" target="_blank" class="contact-card">💻 GitHub</a>
      </div>
    `;
  }

  document.getElementById("content").innerHTML = html;

  document.body.classList.add("blur");

  document.getElementById("home").classList.remove("active");
  document.getElementById("page").classList.add("active");
}


// ================= BACK =================
function goBack() {
  document.body.classList.remove("blur");

  document.getElementById("page").classList.remove("active");
  document.getElementById("home").classList.add("active");
}


// ================= CUSTOM CURSOR =================
const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", e => {
  if (!cursor) return;
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});


// ================= MOBILE SWIPE BACK =================
let startX = 0;

document.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

document.addEventListener("touchend", e => {
  let endX = e.changedTouches[0].clientX;

  if (endX - startX > 100) {
    goBack();
  }
});


// ================= MAGNETIC EFFECT =================
const isMobile = window.innerWidth <= 768;

const cards = document.querySelectorAll(".menu div");

if (!isMobile) {
  cards.forEach(card => {

    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const moveX = (x - centerX) * 0.25;
      const moveY = (y - centerY) * 0.25;

      card.style.transform = `
        translate(${moveX}px, ${moveY}px)
        rotateX(${-(y - centerY) / 10}deg)
        rotateY(${(x - centerX) / 10}deg)
        scale(1.03)
      `;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translate(0,0) scale(1)";
    });

  });
}

cards.forEach(card => {

  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const moveX = (x - centerX) * 0.25;
    const moveY = (y - centerY) * 0.25;

    card.style.transform = `
      translate(${moveX}px, ${moveY}px)
      rotateX(${-(y - centerY) / 10}deg)
      rotateY(${(x - centerX) / 10}deg)
      scale(1.03)
    `;

    card.style.setProperty('--x', x + 'px');
    card.style.setProperty('--y', y + 'px');
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translate(0,0) rotateX(0) rotateY(0) scale(1)";
  });

});
// ================= SWIPE HINT AUTO HIDE =================
setTimeout(() => {
  const hint = document.getElementById("swipeHint");
  if (hint) hint.style.display = "none";
}, 3000);
