// Minimal enhancements can be added here when needed
function updateThemeButton(button, theme) {
  if (!button) return;
  button.textContent = theme === 'light' ? '☀' : '🌙';
}

function getSavedTheme() {
  try {
    const stored = localStorage.getItem('hotel-veda-theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  } catch {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeButton(document.getElementById('theme-switch'), theme);
  try { localStorage.setItem('hotel-veda-theme', theme); } catch (e) {}
}

document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('.nav-toggle');
  toggles.forEach((btn) => {
    const header = btn.closest('.site-header');
    const nav = header ? (header.querySelector('#site-nav') || header.querySelector('nav.nav')) : null;
    if (!nav) return;
    btn.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (nav.classList.contains('open')) {
          nav.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  });

  const themeBtn = document.getElementById('theme-switch');
  const initialTheme = getSavedTheme();
  setTheme(initialTheme);
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const nextTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      setTheme(nextTheme);
    });
  }
});

