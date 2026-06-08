document.addEventListener('DOMContentLoaded', () => {
    initPortfolio();
});

async function initPortfolio() {
    try {
        const response = await fetch('./profile.json');
        if (!response.ok) throw new Error('Failed to load profile mapping configuration.');
        const data = await response.json();

        renderProfile(data);
        renderSkills(data.skills);
        renderProjects(data.projects);
    } catch (error) {
        console.error('Core Engine Error:', error);
        document.getElementById('name').textContent = "Error loading profile.";
    }
}

function renderProfile(data) {
    document.getElementById('avatar').src = data.avatar;
    document.getElementById('name').textContent = data.name;
    document.getElementById('title').textContent = data.title;
    document.getElementById('bio').textContent = data.bio;

    const socialsContainer = document.getElementById('socials');
    socialsContainer.innerHTML = Object.entries(data.socials)
        .map(([platform, url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${platform.toUpperCase()}</a>`)
        .join('');
}

function renderSkills(skills) {
    const grid = document.getElementById('skills-grid');
    grid.innerHTML = skills.map(skill => `<span class="skill-badge">${skill}</span>`).join('');
}

function renderProjects(projects) {
    const grid = document.getElementById('projects-grid');
    grid.innerHTML = projects.map(proj => `
        <article class="project-item">
            <h3>${proj.title}</h3>
            <p>${proj.description}</p>
            <div class="project-tags">
                ${proj.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </article>
    `).join('');
}
