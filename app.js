// ============================================================
// PHARMEX — App Controller (Visual Redesign)
// ============================================================

/* Toast ──────────────────────────────────────────────────── */
const Toast = {
  container: null,
  init() { this.container = document.getElementById('toast-container'); },
  show(msg, type = 'info', ms = 3200) {
    if (!this.container) this.init();
    const t = document.createElement('div');
    t.className = `toast toast--${type}`;
    const icons = {
      success: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="7" cy="7" r="6"/><path d="M4.5 7l2 2 3-3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      error:   `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="7" cy="7" r="6"/><path d="M5 5l4 4M9 5l-4 4" stroke-linecap="round"/></svg>`,
      info:    `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="7" cy="7" r="6"/><path d="M7 7v3M7 4.5v.5" stroke-linecap="round"/></svg>`,
    };
    t.innerHTML = `${icons[type]||icons.info}<span>${msg}</span>`;
    this.container.appendChild(t);
    setTimeout(() => {
      t.classList.add('leaving');
      setTimeout(() => t.remove(), 400);
    }, ms);
  }
};

/* App ────────────────────────────────────────────────────── */
const App = {
  init() {
    DataAPI.init();
    Toast.init();
    this.updateCatalogMeta();
    this.renderFiltered();
    this.bindEvents();
  },

  /* ── Render ─────────────────────── */
  renderFiltered() {
    const q = (document.getElementById('catalog-search')?.value || '').trim().toLowerCase();
    let prods = DataAPI.getVisibleProducts();

    if (q) {
      prods = prods.filter(p =>
        (p.name||'').toLowerCase().includes(q) ||
        (p.activeIngredient||'').toLowerCase().includes(q) ||
        (p.description||'').toLowerCase().includes(q)
      );
    }
    CatalogRenderer.renderCatalog(prods);
  },

  /* Alias used by admin */
  refreshCatalog() {
    this.renderFiltered();
  },

  /* ── Catalog meta ────────────────────────────────────── */
  updateCatalogMeta() {
    const title    = DataAPI.getCatalogTitle();
    const subtitle = DataAPI.getCatalogSubtitle();
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('catalog-title',    title);
    set('catalog-subtitle', subtitle);
    set('header-catalog-name', title);
    document.title = title;
  },

  /* ── Bind all events ─────────────────────────────────── */
  bindEvents() {
    // Admin trigger
    document.getElementById('admin-trigger')
      ?.addEventListener('click', () => AdminPanel.open());

    // Admin overlay backdrop close
    document.getElementById('admin-overlay')
      ?.addEventListener('click', e => { if (e.target.id === 'admin-overlay') AdminPanel.close(); });

    // Search (debounced)
    const search = document.getElementById('catalog-search');
    if (search) {
      let timer;
      search.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => this.renderFiltered(), 200);
      });
    }

    // Keyboard: Escape
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      if (document.getElementById('prompt-modal')?.classList.contains('is-open')) {
        AdminPanel.closeMasterPromptEditor();
      } else if (document.getElementById('edit-modal')?.classList.contains('is-open')) {
        AdminPanel.closeModal('edit-modal');
      } else if (AdminPanel.isOpen) {
        AdminPanel.close();
      }
    });
  }
};

/* Boot ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => App.init());
