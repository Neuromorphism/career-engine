// Run before styles load so a saved theme is applied before the first paint.
(() => {
  const key = 'career-engine-theme';
  const preference = window.matchMedia('(prefers-color-scheme: dark)');
  let saved;
  try { saved = localStorage.getItem(key); } catch { /* Theme still works without storage. */ }
  let explicit = saved === 'dark' || saved === 'light';
  function apply(theme) {
    document.documentElement.dataset.theme = theme;
    const dark = theme === 'dark';
    const button = document.querySelector('#theme-toggle');
    if (button) {
      button.textContent = dark ? '☀ Light mode' : '☾ Dark mode';
      button.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} mode`);
      button.setAttribute('aria-pressed', String(dark));
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#191c20' : '#f2efe6');
  }
  apply(explicit ? saved : preference.matches ? 'dark' : 'light');
  document.addEventListener('DOMContentLoaded', () => apply(document.documentElement.dataset.theme));
  document.addEventListener('click', event => {
    if (!event.target.closest('#theme-toggle')) return;
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    explicit = true;
    apply(theme);
    try { localStorage.setItem(key, theme); } catch { /* Keep the selection for this visit. */ }
  });
  preference.addEventListener('change', event => {
    if (!explicit) apply(event.matches ? 'dark' : 'light');
  });
})();
