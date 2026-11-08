// ===== Data =====
let DATA = window.__PROFILE_DATA || {};

// ===== Theme =====
const THEME_KEY = 'aryankonde-theme';
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = localStorage.getItem(THEME_KEY) || (prefersDark ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', initialTheme);

const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);
});

// ===== Smooth scroll for nav links =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // update active state
      document.querySelectorAll('.site-nav a').forEach(el => el.classList.remove('active'));
      a.classList.add('active');
    }
  });
});

// ===== Intersection observer for active nav highlight =====
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        document.querySelectorAll('.site-nav a').forEach(el => el.classList.remove('active'));
        const link = document.querySelector(`.site-nav a[href="#${id}"]`);
        if (link) link.classList.add('active');
      }
    });
  },
  { threshold: 0.35, rootMargin: '-40px 0px -60% 0px' }
);
document.querySelectorAll('section[id]').forEach(sec => observer.observe(sec));

// ===== Experience =====
function renderExperience() {
  const experienceEl = document.querySelector('.experience-list');
  if (experienceEl && DATA.experience) {
    experienceEl.innerHTML = DATA.experience.map(exp => `
    <div class="experience-item">
      <div>
        <div class="exp-date">${exp.period}</div>
        <div class="exp-meta">${exp.type} · ${exp.location}</div>
      </div>
      <div>
        <div class="exp-company">${exp.company}</div>
        <div class="exp-role">${exp.role}</div>
        <ul class="exp-desc">
          ${exp.description.map(d => `<li>${d}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');
  }
}

// ===== Projects =====
function renderProjects() {
  const projectsEl = document.querySelector('.project-grid');
  if (projectsEl && DATA.projects) {
    projectsEl.innerHTML = DATA.projects.map(p => `
    <article class="project-card">
      <div class="project-top">
        ${p.link ? `
        <a href="${p.link}" target="_blank" rel="noopener noreferrer" class="project-link" title="Open on GitHub">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          Source
        </a>` : `<span class="project-private">Source not public</span>`}
      </div>
      <h3 class="project-title">${p.name}</h3>
      <div class="project-meta">
        <span>${p.period}</span>
        ${p.tags.slice(0, 3).map(t => `<span class="tag${getTagClass(t)}">${escapeHtml(t)}</span>`).join('')}
      </div>
      <p class="project-desc">${escapeHtml(p.description)}</p>
      ${p.outcomes && p.outcomes.length ? `
        <div class="project-outcomes">
          <div class="project-outcomes-title">Outcomes</div>
          <ul>
            ${p.outcomes.map(o => `<li>${escapeHtml(o)}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    </article>
  `).join('');
  }
}

function getTagClass(tag) {
  const t = tag.toLowerCase();
  if (t.includes('aih') || t.includes('winner')) return ' winner';
  if (t.includes('ai') || t.includes('nlp') || t.includes('ml') || t.includes('deep')) return ' tag-ai';
  return '';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ===== Certifications =====
function renderCerts() {
  const certEl = document.querySelector('.cert-grid');
  if (certEl && DATA.certifications) {
    const initials = (str) => str.match(/[A-Z]+/g)?.join('').slice(0, 2) || str.charAt(0).toUpperCase();
    certEl.innerHTML = DATA.certifications.map(c => `
    <div class="cert-card">
      <div class="cert-icon">${initials(c.name)}</div>
      <div class="cert-body">
        <div class="cert-name">${escapeHtml(c.name)}</div>
        <div class="cert-issuer">${escapeHtml(c.issuer)}</div>
        <span class="cert-date">Issued ${c.issued}${c.expires ? ' · Expires ' + c.expires : ''}</span>
        ${c.credential ? `<span class="cert-credential">Credential: ${escapeHtml(c.credential)}</span>` : ''}
      </div>
    </div>
  `).join('');
  }
}

// ===== Contact modal =====
const modal = document.getElementById('contact-modal');
const backdrop = document.getElementById('modal-backdrop');
const openBtn = document.getElementById('open-contact');
const closeBtn = document.getElementById('modal-close');
const copyEmailBtn = document.getElementById('copy-email');
const openMailtoBtn = document.getElementById('open-mailto');

// Email obfuscation setup
const emailMask = document.getElementById('email-mask');
const emailCharSpans = emailMask.querySelectorAll('.char');
let realEmail = DATA.profile?.email || 'aryankonde114@gmail.com';

function maskEmail(email) {
  // Remove domain part for obfuscation
  const [local, domain] = email.split('@');
  const maskedLocal = local.replace(/./g, '•').padEnd(Math.max(local.length, 6), '•');
  return { mask: maskedLocal + '@' + domain.replace(/./g, '•'), localPart: local, domain: domain };
}

const maskState = maskEmail(realEmail);
function rebuildMask() {
  emailMask.innerHTML = '';
  const full = maskState.mask;
  const visibleLocalLen = 3; // show first 3 chars of local part for trust
  const [localMasked, domainMasked] = full.split('@');
  const localVis = localMasked.slice(0, visibleLocalLen);
  const localHidden = localMasked.slice(visibleLocalLen);
  const localChars = localVis.split('').map(c => c).concat(localHidden.split('').map(() => '•'));
  const domainChars = domainMasked.split('').map(() => '•');
  const allChars = [...localChars, '@', ...domainChars];
  allChars.forEach(ch => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = ch;
    span.addEventListener('mouseenter', () => span.classList.add('hovered'));
    span.addEventListener('mouseleave', () => span.classList.remove('hovered'));
    emailMask.appendChild(span);
  });
}
rebuildMask();

// Click to reveal
emailMask.addEventListener('click', () => {
  if (emailMask.classList.contains('unmasked')) {
    // re-mask
    rebuildMask();
    emailMask.classList.remove('unmasked');
    emailMask.setAttribute('aria-label', 'Obfuscated email. Click to reveal.');
    return;
  }
  // reveal: replace • with real chars
  emailMask.innerHTML = '';
  const full = realEmail;
  full.split('').forEach(ch => {
    const span = document.createElement('span');
    span.className = 'char revealed';
    span.textContent = ch;
    span.addEventListener('mouseenter', () => span.classList.add('hovered'));
    span.addEventListener('mouseleave', () => span.classList.remove('hovered'));
    emailMask.appendChild(span);
  });
  emailMask.classList.add('unmasked');
  emailMask.setAttribute('aria-label', 'Email address revealed. Click to re-mask.');
});

// Copy email
copyEmailBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(realEmail).catch(() => {
    // fallback
    const ta = document.createElement('textarea');
    ta.value = realEmail;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
  const btn = copyEmailBtn;
  const original = btn.textContent;
  btn.textContent = 'Copied!';
  setTimeout(() => { btn.textContent = original; }, 1800);
});

// Open mailto
openMailtoBtn.addEventListener('click', () => {
  window.location.href = `mailto:${realEmail}`;
});

// ===== Contact form → mailto compose =====
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const fd = new FormData(contactForm);
  const name = (fd.get('name') || '').toString().trim();
  const from = (fd.get('email') || '').toString().trim();
  const msg = (fd.get('message') || '').toString().trim();
  const subject = `Collaboration inquiry from ${name}`;
  const body = `${msg}\n\n—\n${name}\n${from}`;
  window.location.href = `mailto:${realEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

// Modal controls
function openModal() {
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  closeBtn.focus();
}
function closeModal() {
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
openBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);
modal.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ===== Reveal on scroll =====
function initReveal() {
  const revealEls = document.querySelectorAll('.project-card, .cert-card, .skill-category, .experience-item, .awards-card, .timeline-item, .volunteer-item');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    revealObserver.observe(el);
  });
}
initReveal();

// ===== Data load + render =====
function renderAll() {
  renderExperience();
  renderProjects();
  renderCerts();
  initReveal();
  if (DATA.profile?.email && DATA.profile.email !== realEmail) {
    realEmail = DATA.profile.email;
    rebuildMask();
  }
}
if (!DATA.experience) {
  // data.js absent (e.g. opened via a protocol blocking sync scripts) — try fetch
  fetch('assets/data.json')
    .then(r => r.json())
    .then(d => { DATA = d; renderAll(); })
    .catch(err => console.error('Could not load profile data:', err));
} else {
  renderAll();
}

// ===== Stats from GitHub (fetch on load) =====
async function fetchGitHubStats() {
  try {
    const res = await fetch('https://api.github.com/users/aryankonde');
    const data = await res.json();
    if (data && data.public_repos) {
      const statLabels = document.querySelectorAll('.stat-label');
      const followersEl = document.querySelector('.stat-num');
      if (followersEl) followersEl.textContent = data.followers || 0;
      const repoStat = document.querySelector('.stat-row .stat:nth-child(2) .stat-num');
      if (repoStat) repoStat.textContent = data.public_repos;
    }
  } catch (e) {
    // silently fall back to static data
  }
}
fetchGitHubStats();
