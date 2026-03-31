function updateThemeButton(button, theme) {
  if (!button) return;
  button.textContent = theme === 'light' ? '🌙' : '☀';
  button.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
}

function getSavedTheme() {
  try {
    const stored = localStorage.getItem('hotel-veda-theme');
    if (stored === 'light' || stored === 'dark') return stored;
  } catch (error) {
    // ignore localStorage errors
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeButton(document.getElementById('theme-switch'), theme);
  try {
    localStorage.setItem('hotel-veda-theme', theme);
  } catch (error) {
    // localStorage may be unavailable in private mode
  }
}

function updateYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach((link) => {
    const href = link.getAttribute('href');
    const isHome = currentPage === 'index.html' && href === 'index.html';
    const isActive = href === currentPage || isHome;
    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function initRevealAnimations() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
    });

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('visible'));
  }
}

function initTabs() {
  document.querySelectorAll('.info-tabs').forEach((tabGroup) => {
    const buttons = Array.from(tabGroup.querySelectorAll('[role="tab"]'));
    const panels = buttons
      .map((button) => document.getElementById(button.dataset.panel))
      .filter(Boolean);

    if (!buttons.length || !panels.length) return;

    function setActiveButton(activeButton) {
      buttons.forEach((button) => {
        const isActive = button === activeButton;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-selected', isActive ? 'true' : 'false');
        button.setAttribute('tabindex', isActive ? '0' : '-1');

        const panel = document.getElementById(button.dataset.panel);
        if (panel) {
          panel.hidden = !isActive;
        }
      });
    }

    buttons.forEach((button) => {
      button.addEventListener('click', () => setActiveButton(button));
    });

    const activeButton = buttons.find((button) => button.classList.contains('active')) || buttons[0];
    setActiveButton(activeButton);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-toggle').forEach((btn) => {
    const header = btn.closest('.site-header');
    const nav = header ? header.querySelector('#site-nav') : null;
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

  setTheme(getSavedTheme());
  updateYear();
  setActiveNavLink();
  initRevealAnimations();
  initTabs();

  const themeBtn = document.getElementById('theme-switch');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const nextTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      setTheme(nextTheme);
    });
  }
});

