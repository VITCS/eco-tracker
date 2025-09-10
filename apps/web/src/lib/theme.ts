const THEME_KEY = 'eco_theme';
export type Theme = 'light' | 'dark';

export function getStoredTheme(): Theme | null {
  const t = localStorage.getItem(THEME_KEY);
  return t === 'dark' || t === 'light' ? t : null;
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
}

export function initTheme() {
  const stored = getStoredTheme();
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme: Theme = stored ?? (prefersDark ? 'dark' : 'light');
  applyTheme(theme);
}

export function setTheme(theme: Theme) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

export function toggleTheme() {
  const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  setTheme(current === 'dark' ? 'light' : 'dark');
}

