// ============================================================
// PHARMEX CATALOGUE — Admin Panel
// ============================================================

const AdminPanel = {
  isOpen: false,
  currentProductId: null,
  dragSrcId: null,

  // ── Open / Close ─────────────────────────────────────────
  open() {
    this.isOpen = true;
    const overlay = document.getElementById('admin-overlay');
    overlay.classList.add('is-open');
    document.body.classList.add('no-scroll');
    this.renderProductList();
  },

  close() {
    this.isOpen = false;
    document.getElementById('admin-overlay').classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    this.closeModal('edit-modal');
    this.closeModal('prompt-modal');
  },

  // ── Modal Helpers ─────────────────────────────────────────
  openModal(id) {
    document.getElementById(id).classList.add('is-open');
  },

  closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('is-open');
    if (id === 'edit-modal') this.currentProductId = null;
  },

  // ── Render Product List ──────────────────────────────────
  renderProductList() {
    const products = DataAPI.getProducts();
    const list = document.getElementById('admin-product-list');
    const title = DataAPI.getCatalogTitle();
    const subtitle = DataAPI.getCatalogSubtitle();

    document.getElementById('admin-catalog-title-input').value = title;
    document.getElementById('admin-catalog-subtitle-input').value = subtitle;

    // Stats
    const visible = products.filter(p => p.visible !== false).length;
    const maxPrice = products.reduce((m, p) => Math.max(m, p.price || 0), 0);
    document.getElementById('stat-total').textContent = products.length;
    document.getElementById('stat-visible').textContent = visible;
    document.getElementById('stat-max-price').textContent = maxPrice ? Number(maxPrice).toLocaleString() : '—';

    if (!products.length) {
      list.innerHTML = `<div style="text-align:center;padding:40px 20px;color:#5A5752;font-size:0.875rem">No products yet. Click "Add Product" to begin.</div>`;
      return;
    }

    list.innerHTML = products.map(p => `
      <div class="admin-product-item ${!p.visible ? 'admin-product-item--hidden' : ''}" 
           data-id="${p.id}" draggable="true">
        <span class="drag-handle" title="Drag to reorder">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" opacity="0.5">
            <rect x="4" y="4" width="8" height="1.5" rx="0.75"/>
            <rect x="4" y="7.25" width="8" height="1.5" rx="0.75"/>
            <rect x="4" y="10.5" width="8" height="1.5" rx="0.75"/>
          </svg>
        </span>
        <div class="admin-product-item__thumb">
          ${p.image 
            ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover"/>`
            : `<div style="width:100%;height:100%;background:${p.brandColor || '#4A6FA5'}20;display:flex;align-items:center;justify-content:center;font-size:18px;color:${p.brandColor || '#4A6FA5'};font-family:Georgia,serif">${(p.name||'?').charAt(0)}</div>`
          }
        </div>
        <div class="admin-product-item__info">
          <div class="admin-product-item__name">${p.name || 'Untitled'}</div>
          <div class="admin-product-item__meta">${[p.category, p.strength, p.dosageForm].filter(Boolean).join(' · ') || 'No details'}</div>
        </div>
        <div class="admin-product-item__price">
          ${p.price ? `${Number(p.price).toLocaleString()} IQD` : '—'}
          ${p.bonus ? `<br><span style="font-size:0.75rem;color:#5CC9A2;font-weight:600">+${p.bonus}% bonus</span>` : ''}
        </div>
        <div class="admin-product-item__actions">
          <button class="btn btn-icon" onclick="AdminPanel.copyAIPrompt('${p.id}')" title="Copy AI Prompt">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="4.5" y="4.5" width="8" height="8.5" rx="1.5"/><path d="M2.5 9V2.5A1 1 0 013.5 1.5H10"/>
            </svg>
          </button>
          <button class="btn btn-icon" onclick="AdminPanel.toggleVisibility('${p.id}')" title="${p.visible !== false ? 'Hide' : 'Show'} product">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
              ${p.visible !== false 
                ? '<path d="M1 7C2.5 4 4.5 2.5 7 2.5s4.5 1.5 6 4.5C11.5 10 9.5 11.5 7 11.5S2.5 10 1 7z"/><circle cx="7" cy="7" r="2"/>'
                : '<path d="M1 7C2.5 4 4.5 2.5 7 2.5s4.5 1.5 6 4.5C11.5 10 9.5 11.5 7 11.5S2.5 10 1 7z" stroke-dasharray="3 2"/><line x1="2" y1="2" x2="12" y2="12" stroke-linecap="round"/>'
              }
            </svg>
          </button>
          <button class="btn btn-icon" onclick="AdminPanel.editProduct('${p.id}')" title="Edit product">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9.5 2.5l2 2-7 7H2.5v-2l7-7z" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="btn btn-icon danger" onclick="AdminPanel.deleteProduct('${p.id}')" title="Delete product">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M2.5 3.5h9M5 3.5V2.5h4v1M5.5 6.5v4M8.5 6.5v4"/>
              <path d="M3.5 3.5l1 9h5l1-9" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    `).join('');

    this.initDragReorder();
  },

  // ── Edit Product Modal ───────────────────────────────────
  editProduct(id) {
    const product = id ? DataAPI.getProduct(id) : null;
    this.currentProductId = id || null;

    const p = product || {
      name: '', activeIngredient: '', strength: '', dosageForm: '', packSize: '',
      price: '', bonus: '', description: '', features: [], category: '',
      brandColor: '#4A6FA5', image: null, environmentDirection: '', visible: true
    };

    const featuresStr = (p.features || []).join('\n');
    const modalTitle = id ? 'Edit Product' : 'Add Product';
    document.getElementById('edit-modal-title').textContent = modalTitle;

    document.getElementById('edit-form-body').innerHTML = `
      <div class="admin-form">
        <div class="admin-form__section">
          <p class="admin-form__section-title">Product Identity</p>
          <div class="form-group">
            <label class="form-label">Product Name <span class="form-label__required">*</span></label>
            <input class="form-input" type="text" id="field-name" value="${this.esc(p.name)}" placeholder="e.g. Orange Iron">
          </div>
          <div class="admin-form__row">
            <div class="form-group">
              <label class="form-label">Active Ingredient</label>
              <input class="form-input" type="text" id="field-ingredient" value="${this.esc(p.activeIngredient)}" placeholder="e.g. Ferrous Gluconate">
            </div>
            <div class="form-group">
              <label class="form-label">Category</label>
              <input class="form-input" type="text" id="field-category" value="${this.esc(p.category)}" placeholder="e.g. Hematology">
            </div>
          </div>
          <div class="admin-form__row">
            <div class="form-group">
              <label class="form-label">Strength</label>
              <input class="form-input" type="text" id="field-strength" value="${this.esc(p.strength)}" placeholder="e.g. 300 mg">
            </div>
            <div class="form-group">
              <label class="form-label">Dosage Form</label>
              <input class="form-input" type="text" id="field-dosage" value="${this.esc(p.dosageForm)}" placeholder="e.g. Film-coated Tablets">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Pack Size</label>
            <input class="form-input" type="text" id="field-packsize" value="${this.esc(p.packSize)}" placeholder="e.g. 30 Tablets">
          </div>
        </div>

        <div class="admin-form__section">
          <p class="admin-form__section-title">Pricing</p>
          <div class="admin-form__row">
            <div class="form-group">
              <label class="form-label">Price (IQD)</label>
              <input class="form-input" type="number" id="field-price" value="${p.price || ''}" placeholder="e.g. 8500" min="0">
            </div>
            <div class="form-group">
              <label class="form-label">Bonus (%)</label>
              <input class="form-input" type="number" id="field-bonus" value="${p.bonus || ''}" placeholder="e.g. 10" min="0" max="100">
            </div>
          </div>
        </div>

        <div class="admin-form__section">
          <p class="admin-form__section-title">Description & Features</p>
          <div class="form-group">
            <label class="form-label">Short Description</label>
            <textarea class="form-textarea" id="field-description" rows="3" placeholder="Brief product description...">${this.esc(p.description)}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Key Features</label>
            <p class="form-hint">One feature per line, maximum 4</p>
            <textarea class="form-textarea form-textarea--tall" id="field-features" rows="4" placeholder="High bioavailability&#10;Once-daily dosing&#10;Suitable for long-term use">${this.esc(featuresStr)}</textarea>
          </div>
        </div>

        <div class="admin-form__section">
          <p class="admin-form__section-title">Visual & AI</p>
          <div class="admin-form__row">
            <div class="form-group">
              <label class="form-label">Brand Color</label>
              <input class="form-input" type="color" id="field-brand-color" value="${p.brandColor || '#4A6FA5'}" style="height:42px;padding:4px 8px;cursor:pointer">
            </div>
            <div class="form-group">
              <label class="form-label">Hex Value</label>
              <input class="form-input" type="text" id="field-brand-color-text" value="${p.brandColor || '#4A6FA5'}" placeholder="#4A6FA5">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">AI Environment Direction</label>
            <p class="form-hint">Describes the visual scene for this product's AI image prompt</p>
            <textarea class="form-textarea" id="field-env-direction" rows="3" placeholder="e.g. Warm clinical environment with amber and terracotta tones...">${this.esc(p.environmentDirection)}</textarea>
          </div>
        </div>

        <div class="admin-form__section">
          <p class="admin-form__section-title">Product Image</p>
          <div class="upload-zone ${p.image ? 'upload-zone--has-image' : ''}" id="upload-zone-main" onclick="AdminPanel.triggerImageUpload()">
            ${p.image ? `
              <img src="${p.image}" alt="Product image" class="upload-zone__preview" id="image-preview" data-uploaded="false">
              <div class="upload-zone__preview-overlay">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="white" stroke-width="1.5">
                  <path d="M3 12v3h3L15 6l-3-3-9 9z"/>
                </svg>
                Replace Image
              </div>
            ` : `
              <div class="upload-zone__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="3"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
              </div>
              <p class="upload-zone__title">Upload Product Image</p>
              <p class="upload-zone__subtitle">Drag & drop or click to select<br>PNG, JPG, WEBP — max 10MB</p>
            `}
          </div>
          <input type="file" id="image-file-input" accept="image/*" style="display:none" onchange="AdminPanel.handleImageUpload(event)">
          ${p.image ? `
          <div style="display:flex;gap:8px;margin-top:8px;">
            <button type="button" class="btn btn-ghost btn--sm" onclick="AdminPanel.triggerImageUpload()">Replace Image</button>
            <button type="button" class="btn btn-ghost btn--sm" onclick="AdminPanel.removeImage()" style="color:#E84040">Remove</button>
          </div>` : ''}
        </div>

        <div class="admin-form__section">
          <p class="admin-form__section-title">Visibility</p>
          <label style="display:flex;align-items:center;gap:10px;cursor:pointer">
            <input type="checkbox" id="field-visible" ${p.visible !== false ? 'checked' : ''} 
                   style="width:16px;height:16px;accent-color:#B8924A;cursor:pointer">
            <span style="font-size:0.875rem;color:var(--color-admin-ink)">Visible in catalog</span>
          </label>
        </div>
      </div>`;

    // Color picker sync
    setTimeout(() => {
      const colorPicker = document.getElementById('field-brand-color');
      const colorText = document.getElementById('field-brand-color-text');
      if (colorPicker && colorText) {
        colorPicker.addEventListener('input', () => { colorText.value = colorPicker.value; });
        colorText.addEventListener('input', () => {
          if (/^#[0-9A-Fa-f]{6}$/.test(colorText.value)) colorPicker.value = colorText.value;
        });
      }
      this.initDropZone('upload-zone-main');
    }, 50);

    this.openModal('edit-modal');
  },

  // ── Save Product ─────────────────────────────────────────
  saveProduct() {
    const name = document.getElementById('field-name')?.value.trim();
    if (!name) { Toast.show('Product name is required.', 'error'); return; }

    const featuresRaw = document.getElementById('field-features')?.value || '';
    const features = featuresRaw.split('\n').map(f => f.trim()).filter(Boolean).slice(0, 4);

    const imagePreview = document.getElementById('image-preview');
    const currentProduct = this.currentProductId ? DataAPI.getProduct(this.currentProductId) : null;
    let image = currentProduct?.image || null;
    if (imagePreview && imagePreview.dataset.uploaded === 'true') {
      image = imagePreview.src;
    } else if (imagePreview && imagePreview.src && !imagePreview.src.includes('data:image/svg')) {
      image = imagePreview.src;
    }

    const data = {
      name,
      activeIngredient: document.getElementById('field-ingredient')?.value.trim() || '',
      strength: document.getElementById('field-strength')?.value.trim() || '',
      dosageForm: document.getElementById('field-dosage')?.value.trim() || '',
      packSize: document.getElementById('field-packsize')?.value.trim() || '',
      price: parseFloat(document.getElementById('field-price')?.value) || 0,
      bonus: parseFloat(document.getElementById('field-bonus')?.value) || 0,
      description: document.getElementById('field-description')?.value.trim() || '',
      features,
      category: document.getElementById('field-category')?.value.trim() || '',
      brandColor: document.getElementById('field-brand-color')?.value || '#4A6FA5',
      environmentDirection: document.getElementById('field-env-direction')?.value.trim() || '',
      image,
      visible: document.getElementById('field-visible')?.checked !== false
    };

    if (this.currentProductId) {
      DataAPI.updateProduct(this.currentProductId, data);
      Toast.show('Product updated successfully.', 'success');
    } else {
      DataAPI.addProduct(data);
      Toast.show('Product added to catalog.', 'success');
    }

    this.closeModal('edit-modal');
    this.renderProductList();
    App.refreshCatalog();
  },

  // ── Image Handling ───────────────────────────────────────
  triggerImageUpload() {
    document.getElementById('image-file-input')?.click();
  },

  handleImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { Toast.show('Image must be under 10MB.', 'error'); return; }

    const reader = new FileReader();
    reader.onload = (e) => {
      const zone = document.getElementById('upload-zone-main');
      if (!zone) return;
      zone.classList.add('upload-zone--has-image');
      zone.innerHTML = `
        <img src="${e.target.result}" alt="Product image" class="upload-zone__preview" id="image-preview" data-uploaded="true">
        <div class="upload-zone__preview-overlay">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="white" stroke-width="1.5">
            <path d="M3 12v3h3L15 6l-3-3-9 9z"/>
          </svg>
          Replace Image
        </div>`;
    };
    reader.readAsDataURL(file);
  },

  removeImage() {
    const zone = document.getElementById('upload-zone-main');
    if (!zone) return;
    zone.classList.remove('upload-zone--has-image');
    zone.innerHTML = `
      <div class="upload-zone__icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="3"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="M21 15l-5-5L5 21"/>
        </svg>
      </div>
      <p class="upload-zone__title">Upload Product Image</p>
      <p class="upload-zone__subtitle">Drag & drop or click to select<br>PNG, JPG, WEBP — max 10MB</p>`;
    if (this.currentProductId) {
      DataAPI.updateProduct(this.currentProductId, { image: null });
    }
  },

  initDropZone(zoneId) {
    const zone = document.getElementById(zoneId);
    if (!zone) return;
    zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const file = e.dataTransfer?.files?.[0];
      if (file && file.type.startsWith('image/')) {
        AdminPanel.handleImageUpload({ target: { files: [file] } });
      }
    });
  },

  // ── Copy AI Prompt ───────────────────────────────────────
  copyAIPrompt(id) {
    const product = DataAPI.getProduct(id);
    if (!product) return;
    const prompt = DataAPI.buildAIPrompt(product);
    navigator.clipboard.writeText(prompt).then(() => {
      Toast.show('AI prompt copied to clipboard!', 'success');
    }).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = prompt;
      ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      Toast.show('AI prompt copied!', 'success');
    });
  },

  // ── Toggle Visibility ────────────────────────────────────
  toggleVisibility(id) {
    const product = DataAPI.getProduct(id);
    if (!product) return;
    DataAPI.updateProduct(id, { visible: !product.visible });
    this.renderProductList();
    App.refreshCatalog();
  },

  // ── Delete Product ───────────────────────────────────────
  deleteProduct(id) {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    DataAPI.deleteProduct(id);
    this.renderProductList();
    App.refreshCatalog();
    Toast.show('Product deleted.', 'info');
  },

  // ── Master Prompt Editor ─────────────────────────────────
  openMasterPromptEditor() {
    document.getElementById('master-prompt-textarea').value = DataAPI.getMasterPrompt();
    this.openModal('prompt-modal');
  },

  closeMasterPromptEditor() {
    this.closeModal('prompt-modal');
  },

  saveMasterPrompt() {
    const val = document.getElementById('master-prompt-textarea')?.value.trim();
    if (!val) { Toast.show('Prompt cannot be empty.', 'error'); return; }
    DataAPI.saveMasterPrompt(val);
    this.closeMasterPromptEditor();
    Toast.show('Master prompt saved.', 'success');
  },

  resetMasterPrompt() {
    if (!confirm('Reset the master prompt to the default?')) return;
    DataAPI.saveMasterPrompt(DEFAULT_MASTER_PROMPT);
    document.getElementById('master-prompt-textarea').value = DEFAULT_MASTER_PROMPT;
    Toast.show('Master prompt reset.', 'info');
  },

  // ── Catalog Settings ─────────────────────────────────────
  saveCatalogSettings() {
    const title = document.getElementById('admin-catalog-title-input')?.value.trim();
    const subtitle = document.getElementById('admin-catalog-subtitle-input')?.value.trim();
    DataAPI.saveCatalogMeta(title, subtitle);
    App.updateCatalogMeta();
    Toast.show('Catalog settings saved.', 'success');
  },

  // ── Export / Import ──────────────────────────────────────
  exportData() {
    const data = DataAPI.exportCatalog();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pharmex-catalog-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    Toast.show('Catalog exported.', 'success');
  },

  importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          if (!confirm('This will replace all current catalog data. Continue?')) return;
          DataAPI.importCatalog(data);
          this.renderProductList();
          App.refreshCatalog();
          App.updateCatalogMeta();
          Toast.show('Catalog imported successfully.', 'success');
        } catch { Toast.show('Invalid catalog file.', 'error'); }
      };
      reader.readAsText(file);
    };
    input.click();
  },

  // ── Drag-to-Reorder ──────────────────────────────────────
  initDragReorder() {
    const list = document.getElementById('admin-product-list');
    const items = list?.querySelectorAll('.admin-product-item');
    if (!items?.length) return;

    items.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        this.dragSrcId = item.dataset.id;
        item.style.opacity = '0.4';
        e.dataTransfer.effectAllowed = 'move';
      });
      item.addEventListener('dragend', () => {
        item.style.opacity = '';
        list.querySelectorAll('.admin-product-item').forEach(r => r.style.outline = '');
      });
      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        list.querySelectorAll('.admin-product-item').forEach(r => r.style.outline = '');
        item.style.outline = '2px solid rgba(184,146,74,0.5)';
        e.dataTransfer.dropEffect = 'move';
      });
      item.addEventListener('dragleave', () => { item.style.outline = ''; });
      item.addEventListener('drop', (e) => {
        e.preventDefault();
        item.style.outline = '';
        if (this.dragSrcId === item.dataset.id) return;
        const rows = [...list.querySelectorAll('.admin-product-item')];
        const srcIndex = rows.findIndex(r => r.dataset.id === this.dragSrcId);
        const destIndex = rows.findIndex(r => r.dataset.id === item.dataset.id);
        const orderedIds = rows.map(r => r.dataset.id);
        orderedIds.splice(srcIndex, 1);
        orderedIds.splice(destIndex, 0, this.dragSrcId);
        DataAPI.reorderProducts(orderedIds);
        this.renderProductList();
        App.refreshCatalog();
      });
    });
  },

  // ── Utility ──────────────────────────────────────────────
  esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
};
