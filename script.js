/* script.js — portfolio interactions */
(() => {
  // Basic DOM helpers
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Project data — extend this array to add more projects
  const projects = [
    {
      id: "p1",
      title: "Student Portfolio Site",
      category: "web",
      short: "A responsive portfolio template built with HTML, CSS and vanilla JS.",
      long: "Full responsive portfolio with sections for projects, skills, and contact. Focused on accessibility and clean design. Includes modal previews and project filtering.",
      tags: ["HTML","CSS","JavaScript"],
      url: "#"
    },
    {
      id: "p2",
      title: "Interactive To-do App",
      category: "code",
      short: "A small SPA with localStorage persistence.",
      long: "Task CRUD, filtering, and keyboard accessibility. Uses modular JS and localStorage for persistence.",
      tags: ["JavaScript","LocalStorage"],
      url: "#"
    },
    {
      id: "p3",
      title: "UI Case Study — Dashboard",
      category: "ui",
      short: "Design system and prototypes for a student dashboard.",
      long: "Wireframes, high-fidelity mockups and interactive prototype demonstrating data visualisation components and responsive behavior.",
      tags: ["Figma","Design"],
      url: "#"
    },
    {
      id: "p4",
      title: "Mini Blog Engine",
      category: "web",
      short: "Static blog generator templates and build scripts.",
      long: "A simple static site generator that compiles markdown to HTML, with templating and RSS support.",
      tags: ["Node","Static"],
      url: "#"
    },
    {
      id: "p5",
      title: "Algorithm Visualizer",
      category: "code",
      short: "Visualize sorting algorithms and search.",
      long: "Educational visualizations to teach algorithm steps with animation controls and step-through debugging.",
      tags: ["Algorithms","Visualization"],
      url: "#"
    },
    {
      id: "p6",
      title: "Design Tokens Library",
      category: "ui",
      short: "Shared tokens for colors, spacing & typography.",
      long: "Organised design token system exported for CSS variables, JSON and platform-specific formats.",
      tags: ["Design","Tokens"],
      url: "#"
    }
  ];

  // DOM nodes
  const projectsGrid = $("#projects-grid");
  const filters = $$(".filter");
  const modal = $("#project-modal");
  const modalBody = $("#modal-body");
  const modalClose = $("#modal-close");
  const modalBackdrop = $("#modal-backdrop");
  const themeToggle = $("#theme-toggle");
  const yearEl = $("#year");
  const mobileMenu = $("#mobile-menu");
  const openMenu = $("#open-menu");
  const mobileLinks = $$(".mobile-link");
  const form = $("#contact-form");
  const formStatus = $("#form-status");
  const sendMsgBtn = $("#send-msg");

  // Fill current year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Render projects
  function renderProjects(list){
    projectsGrid.innerHTML = "";
    if (!list.length) {
      projectsGrid.innerHTML = "<p style='color:var(--muted)'>No projects found.</p>";
      return;
    }
    list.forEach(p => {
      const card = document.createElement("article");
      card.className = "project-card";
      card.setAttribute("tabindex", "0");
      card.innerHTML = `
        <div>
          <div class="project-hero" aria-hidden="true">
            <div style="padding:0.4rem;">
              <div class="project-title">${escapeHtml(p.title)}</div>
              <div class="project-desc">${escapeHtml(p.short)}</div>
            </div>
          </div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:.8rem;">
          <div style="font-size:.85rem; color:var(--muted)">${p.tags.join(" · ")}</div>
          <div style="display:flex; gap:.5rem;">
            <button class="btn-outline btn-view" data-id="${p.id}">View</button>
            <a class="btn-ghost" href="${p.url}" target="_blank" rel="noreferrer">Open</a>
          </div>
        </div>
      `;
      projectsGrid.appendChild(card);
    });
  }

  function escapeHtml(s = "") {
    return String(s).replace(/[&<>"']/g, function(m) {
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m];
    });
  }

  // Setup filter handlers
  filters.forEach(btn => {
    btn.addEventListener("click", (e) => {
      filters.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      if (f === "all") renderProjects(projects);
      else renderProjects(projects.filter(p => p.category === f));
      // rebind view buttons
      bindViewButtons();
    });
  });

  // Bind view buttons to open modal
  function bindViewButtons(){
    $$(".btn-view").forEach(b => {
      if (b.dataset.bound) return;
      b.addEventListener("click", () => {
        const id = b.dataset.id;
        openProjectModal(id);
      });
      b.dataset.bound = "1";
    });
  }

  // Modal functions
  function openProjectModal(id){
    const p = projects.find(x => x.id === id);
    if (!p) return;
    modalBody.innerHTML = `
      <h3>${escapeHtml(p.title)}</h3>
      <p style="color:var(--muted)">${escapeHtml(p.long)}</p>
      <p style="margin:.5rem 0;"><strong>Tags:</strong> ${p.tags.map(t => `<span style="margin-right:.5rem">${escapeHtml(t)}</span>`).join("")}</p>
      <div style="display:flex; gap:.5rem; margin-top:1rem;">
        <a class="btn-primary" href="${p.url}" target="_blank" rel="noreferrer">Open Project</a>
        <button class="btn-outline" id="modal-close-cta">Close</button>
      </div>
    `;
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = 'hidden';

    // close handlers inside modal
    $("#modal-close-cta")?.addEventListener("click", closeModal);
  }
  function closeModal(){
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = '';
  }
  modalClose?.addEventListener("click", closeModal);
  modalBackdrop?.addEventListener("click", closeModal);
  // close with Escape
  document.addEventListener("keydown", (e)=> {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
  });

  // Theme toggle (persist in localStorage)
  function applyTheme(dark){
    if (dark) document.documentElement.style.setProperty('--bg','linear-gradient(180deg,#01050a 0%, #071022 60%)');
    // simple visual toggle: change body background brightness
    document.body.dataset.theme = dark ? 'dark' : 'light';
    themeToggle.setAttribute('aria-pressed', String(Boolean(dark)));
    themeToggle.textContent = dark ? '☀️' : '🌙';
    localStorage.setItem('prefersDark', dark ? '1' : '0');
  }
  themeToggle.addEventListener('click', () => {
    const current = localStorage.getItem('prefersDark') === '1';
    applyTheme(!current);
  });
  // initial
  applyTheme(localStorage.getItem('prefersDark') === '1');

  // Mobile menu
  openMenu.addEventListener("click", () => {
    const open = mobileMenu.getAttribute("aria-hidden") === "false";
    mobileMenu.setAttribute("aria-hidden", String(open));
    mobileMenu.style.display = open ? "none" : "block";
  });
  mobileLinks.forEach(l => l.addEventListener("click", () => mobileMenu.style.display = "none"));

  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if (href === "#" || href === "#0") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // Contact form simulation (no real send)
  form.addEventListener("submit", e => {
    e.preventDefault();
    simulateSend();
  });
  sendMsgBtn.addEventListener("click", simulateSend);

  function simulateSend(){
    const name = $("#name").value.trim();
    const email = $("#email").value.trim();
    const msg = $("#message").value.trim();
    if (!name || !email || !msg) {
      formStatus.textContent = "Please fill all fields.";
      return;
    }
    sendMsgBtn.disabled = true;
    formStatus.textContent = "Sending...";
    // simulate a network action
    setTimeout(()=> {
      formStatus.textContent = "Message sent! I'll reply to " + email + " shortly.";
      form.reset();
      sendMsgBtn.disabled = false;
    }, 900);
  }

  // Initialize
  renderProjects(projects);
  bindViewButtons();

  // Accessibility: make project cards open on Enter
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement && document.activeElement.classList.contains('project-card')) {
      const btn = document.activeElement.querySelector('.btn-view');
      if (btn) btn.click();
    }
  });

  // Small utility: lazy attr for external resume (placeholder)
  const resumeLink = document.getElementById('download-resume');
  if (resumeLink) {
    // If you have a real resume file, set the href here. For demo, keep '#'
    // resumeLink.href = '/assets/Ruppesh_Resume.pdf';
  }

})();
