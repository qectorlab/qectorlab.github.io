/* QECTOR — shared navigation JS */
document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.group;
      const target = btn.dataset.tab;
      document.querySelectorAll(`[data-group="${group}"]`).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll(`[data-panel="${group}"]`).forEach(panel => {
        panel.classList.toggle('active', panel.dataset.id === target);
      });
    });
  });

  // Mark active nav link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
});
