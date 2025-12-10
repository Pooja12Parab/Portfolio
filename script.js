const root = document.documentElement;
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.querySelector('.theme-toggle');
const themeToggleText = themeToggle?.querySelector('.theme-toggle__text');
const THEME_STORAGE_KEY = 'pp-preferred-theme';

// Responsive navigation for smaller screens
navToggle?.addEventListener('click', () => {
  const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isExpanded));
  navLinks?.classList.toggle('is-open');
});

navLinks?.querySelectorAll('a').forEach((link) =>
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  })
);

// Theme toggle with persistence
const applyTheme = (theme) => {
  root.dataset.theme = theme;
  if (themeToggle) {
    const isLight = theme === 'light';
    themeToggle.setAttribute('aria-pressed', String(isLight));
    if (themeToggleText) {
      themeToggleText.textContent = isLight ? 'Light' : 'Dark';
    }
  }
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    // Ignore storage errors (e.g., privacy mode)
  }
};

const initThemePreference = () => {
  if (!themeToggle) {
    return;
  }

  let storedTheme = null;
  try {
    storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  } catch (error) {
    storedTheme = null;
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  themeToggle.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
  });
};

initThemePreference();

// Reveal animations respecting reduced motion preferences
const revealables = document.querySelectorAll('[data-reveal]');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealables.forEach((el) => observer.observe(el));
} else {
  revealables.forEach((el) => el.classList.add('is-visible'));
}

// Dynamic footer year
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}
