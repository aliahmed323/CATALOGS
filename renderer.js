// ============================================================
// PHARMEX — Catalog Renderer (Visual Redesign)
// ============================================================

const CatalogRenderer = {

  // ── Cinematic placeholder SVG ────────────────────────────
  getPlaceholder(product) {
    const c  = product.brandColor || '#4A6FA5';
    const c2 = c + '30';
    const c3 = c + '12';
    const init = (product.name || 'Rx').split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();
    const cat  = (product.category || 'PHARMACEUTICAL').toUpperCase();
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <radialGradient id="A" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="${c}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${c}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="B" cx="70%" cy="75%" r="55%">
      <stop offset="0%" stop-color="${c}" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="${c}" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="45"/></filter>
    <filter id="blur2"><feGaussianBlur stdDeviation="28"/></filter>
  </defs>
  <rect width="800" height="600" fill="#0A0B14"/>
  <rect width="800" height="600" fill="url(#A)"/>
  <rect width="800" height="600" fill="url(#B)"/>
  <circle cx="180" cy="150" r="220" fill="${c2}" filter="url(#blur)"/>
  <circle cx="640" cy="480" r="180" fill="${c3}" filter="url(#blur)"/>
  <rect x="316" y="165" width="168" height="270" rx="13" fill="none" stroke="${c}" stroke-width="1" stroke-opacity="0.25"/>
  <rect x="328" y="177" width="144" height="213" rx="9" fill="${c}" fill-opacity="0.1"/>
  <rect x="342" y="195" width="116" height="8" rx="4" fill="${c}" fill-opacity="0.3"/>
  <rect x="342" y="211" width="88" height="5" rx="2.5" fill="${c}" fill-opacity="0.18"/>
  <text x="400" y="314" font-family="Georgia,serif" font-size="56" font-weight="300" fill="${c}" fill-opacity="0.65" text-anchor="middle" dominant-baseline="middle">${init}</text>
  <text x="400" y="468" font-family="Georgia,serif" font-size="11" fill="${c}" fill-opacity="0.4" text-anchor="middle" letter-spacing="6">${cat}</text>
</svg>`)}`;
  },

  // ── Format price ─────────────────────────────────────────
  fmt(n) {
    if (!n && n !== 0) return '—';
    return Number(n).toLocaleString('en-US');
  },

  // ── Render one product frame ─────────────────────────────
  renderCard(p) {
    const img     = p.image || this.getPlaceholder(p);
    const hasPrice  = p.price && Number(p.price) > 0;
    const hasBonus  = p.bonus && Number(p.bonus) > 0;
    const features  = (p.features || []).slice(0, 3);

    // Build specs string with consistent formatting
    const specParts = [p.strength, p.dosageForm, p.packSize].filter(Boolean);
    const specsHTML = specParts.map((s, i) =>
      `<span class="pf__specs-val">${s}</span>` +
      (i < specParts.length - 1 ? '<span class="pf__specs-dot"></span>' : '')
    ).join('');

    return `
    <article class="pf" data-id="${p.id}" style="--brand:${p.brandColor || '#4A6FA5'}">
      <div class="pf__image">
        <img class="pf__img" src="${img}" alt="${p.name || ''}" loading="lazy" decoding="async">
      </div>
      <div class="pf__info">
        <h2 class="pf__name">${p.name || 'Untitled'}</h2>
        ${p.activeIngredient ? `<p class="pf__ingredient">${p.activeIngredient}</p>` : ''}
        
        ${features.length ? `
        <ul class="pf__features">
          ${features.map(f => `<li class="pf__feature">${f}</li>`).join('')}
        </ul>` : ''}
        
        <div class="pf__spacer"></div>

        ${specsHTML ? `<div class="pf__specs">${specsHTML}</div>` : ''}
        
        <div class="pf__commerce">
          ${hasPrice ? `
          <div class="pf__price">
            <span class="pf__price-lbl">Price</span>
            <div class="pf__price-num">
              ${this.fmt(p.price)}
              <span class="pf__price-cur">IQD</span>
            </div>
          </div>` : '<div class="pf__price" style="opacity:0.3"><span class="pf__price-num" style="font-size:1.1rem">—</span></div>'}
          ${hasBonus ? `
          <div class="pf__bonus">
            <span class="pf__bonus-lbl">Bonus</span>
            <span class="pf__bonus-val">+${p.bonus}%</span>
          </div>` : ''}
        </div>
      </div>
    </article>`;
  },

  // ── Render full grid ─────────────────────────────────────
  renderCatalog(products) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    if (!products || products.length === 0) {
      grid.innerHTML = `
        <div class="catalog-empty">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <rect x="6" y="6" width="44" height="44" rx="8" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3"/>
            <path d="M20 28h16M28 20v16" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
          <p class="catalog-empty__title">No products in catalog</p>
          <p class="catalog-empty__sub">Open administration to add your first product.</p>
        </div>`;
      return;
    }

    let html = '';
    // Group into chunks of 4 for the 2x2 clusters
    for (let i = 0; i < products.length; i += 4) {
      const chunk = products.slice(i, i + 4);
      html += `<div class="product-cluster">`;
      html += chunk.map(p => this.renderCard(p)).join('');
      html += `</div>`;
    }

    grid.innerHTML = html;
    this.initObserver();
  },

  // ── IntersectionObserver entrance ───────────────────────
  initObserver() {
    const cards = document.querySelectorAll('.pf');
    if (!cards.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });
    cards.forEach(c => io.observe(c));
  },

  // ── Update one card in place ─────────────────────────────
  updateCard(product) {
    const el = document.querySelector(`.pf[data-id="${product.id}"]`);
    if (!el) return;
    const tmp = document.createElement('div');
    tmp.innerHTML = this.renderCard(product);
    const updated = tmp.firstElementChild;
    updated.classList.add('visible');
    el.replaceWith(updated);
  }
};
