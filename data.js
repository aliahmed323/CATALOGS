// ============================================================
// PHARMEX CATALOGUE — Data Layer
// ============================================================

// ── Master Visual Prompt ────────────────────────────────────
const DEFAULT_MASTER_PROMPT = `You are a world-class pharmaceutical product photographer creating images for a premium healthcare brand catalog. Every image must look like it belongs to the same professional pharmaceutical campaign.

OUTPUT FORMAT — MANDATORY:
Compose the image in a 4:3 LANDSCAPE aspect ratio. The pharmaceutical package must be fully visible with intentional breathing room on all sides. Do not crop any part of the packaging. Position the product with deliberate negative space to allow clean catalog display.

PHOTOGRAPHY STYLE:
Hyper-realistic commercial pharmaceutical advertising photography. Medium-format camera aesthetic (Hasselblad / Phase One). Ultra-sharp product focus, cinematic depth of field (f/2.8–4.0 equivalent). The image must look like a physical photograph taken in a professional studio — not CGI, not illustration, not AI-generated-looking.

LIGHTING:
Shaped studio lighting. Soft-box key light from upper-left at 45°. Subtle fill from opposite side. Rim/hair light to separate the product from background. Soft directional shadows grounded to the surface. Never flat. Never overexposed. Controlled, elegant specular highlights.

IMAGE QUALITY:
8K commercial resolution appearance. Maximum sharpness on the product label and packaging. Background may have shallow depth-of-field artistic blur. Photorealistic.

COMPOSITION:
Art-directed. The product may be positioned slightly left, slightly right, or centered — but always intentional. Supporting pharmaceutical environmental elements may appear subtly out of focus in the background. Generous negative space. The product occupies approximately 55–70% of the frame height.

SURFACE & ENVIRONMENT:
The product rests on an elegant surface — frosted glass, white marble, matte clinical surface, or dark polished surface — depending on the product's therapeutic category and environment direction. Soft, controlled reflection below the product. No harsh mirror effect.

PACKAGE PRESERVATION — CRITICAL (read carefully):
Do NOT redesign, reinterpret, simplify, replace, or modify the pharmaceutical packaging in any way.
Do NOT change the brand name, logo, typography, colors, or layout of the package.
Do NOT invent new packaging or alter dosage, strength, or any printed information.
Do NOT create fictional pharmaceutical claims.
Use the supplied product image as the EXACT reference for the physical package.
Preserve all important package text, branding, logo placement, and proportions exactly.
You are ONLY creating the environment, background, surface, lighting, shadows, and atmosphere around the original package.

VISUAL IDENTITY CONSISTENCY:
This image is part of a single pharmaceutical campaign catalog. The photography language, quality, realism, and sophistication must be consistent with all other images in the catalog. The background, surface, and atmosphere may vary per product, but the overall photographic vocabulary must remain unified.

PRODUCT-SPECIFIC CONTEXT:
Product: [PRODUCT_NAME]
Active Ingredient: [ACTIVE_INGREDIENT]
Strength: [STRENGTH]
Dosage Form: [DOSAGE_FORM]
Pack Size: [PACK_SIZE]
Category: [CATEGORY]
Brand Color: [BRAND_COLOR]

ENVIRONMENT DIRECTION FOR THIS IMAGE:
[ENVIRONMENT_DIRECTION]

Final reminder: 4:3 landscape ratio. Complete package visibility. Preserve all packaging exactly. Create environment only.`;


// ── Sample Products ─────────────────────────────────────────
const SAMPLE_PRODUCTS = [
  {
    id: 'prod_001',
    name: 'Orange Iron',
    activeIngredient: 'Ferrous Gluconate',
    strength: '300 mg',
    dosageForm: 'Film-coated Tablets',
    packSize: '30 Tablets',
    price: 8500,
    bonus: 10,
    description: 'A premium iron supplement with high bioavailability, formulated for optimal absorption and minimal gastrointestinal side effects.',
    features: [
      'High bioavailability ferrous gluconate',
      'Minimal GI side effects',
      'Suitable for long-term use'
    ],
    category: 'Hematology',
    brandColor: '#C2601A',
    image: null,
    imagePrompt: '',
    environmentDirection: 'Warm clinical environment with amber and terracotta tones. Polished copper-tinted surface. Soft warm backlight suggesting warmth and vitality. Subtle orange botanical elements out of focus in the background.',
    order: 1,
    visible: true
  },
  {
    id: 'prod_002',
    name: 'Crimson Cardio',
    activeIngredient: 'Atorvastatin Calcium',
    strength: '20 mg',
    dosageForm: 'Coated Tablets',
    packSize: '28 Tablets',
    price: 12500,
    bonus: 15,
    description: 'Advanced lipid management therapy combining precise statin action with excellent tolerability for long-term cardiovascular protection.',
    features: [
      'Reduces LDL cholesterol by up to 46%',
      'Once-daily dosing',
      'Proven cardiovascular protection'
    ],
    category: 'Cardiovascular',
    brandColor: '#8B1A1A',
    image: null,
    imagePrompt: '',
    environmentDirection: 'Sophisticated cardiovascular environment. Deep crimson and white color palette. Polished white marble surface with subtle red veining. Clean clinical background with soft red-tinted rim lighting suggesting heart health and vitality.',
    order: 2,
    visible: true
  },
  {
    id: 'prod_003',
    name: 'CalmAid',
    activeIngredient: 'Alprazolam',
    strength: '0.5 mg',
    dosageForm: 'Tablets',
    packSize: '30 Tablets',
    price: 6800,
    bonus: 5,
    description: 'Precision-dosed anxiolytic for the management of anxiety disorders, providing reliable relief while maintaining daily functioning.',
    features: [
      'Rapid onset of anxiolytic effect',
      'Precision-calibrated dosing',
      'Suitable for short-term management'
    ],
    category: 'Neurology',
    brandColor: '#4A6FA5',
    image: null,
    imagePrompt: '',
    environmentDirection: 'Serene, calming environment. Soft lavender and slate-blue tones. Frosted glass surface with ethereal soft light. Minimal composition with plenty of breathing space, conveying tranquility and mental clarity.',
    order: 3,
    visible: true
  },
  {
    id: 'prod_004',
    name: 'GastroGuard Plus',
    activeIngredient: 'Omeprazole',
    strength: '20 mg',
    dosageForm: 'Enteric-coated Capsules',
    packSize: '14 Capsules',
    price: 7200,
    bonus: 12,
    description: 'Premium proton pump inhibitor with sustained release formulation for comprehensive gastric acid control and ulcer healing.',
    features: [
      'Up to 24-hour acid suppression',
      'Enteric-coated for targeted release',
      'Heals erosive esophagitis'
    ],
    category: 'Gastroenterology',
    brandColor: '#2E7D5E',
    image: null,
    imagePrompt: '',
    environmentDirection: 'Clean, cool clinical environment with fresh mint and emerald green tones. White clinical surface with subtle green undertones. Cool overhead light suggesting digestive health and purity.',
    order: 4,
    visible: true
  },
  {
    id: 'prod_005',
    name: 'OsteoMax',
    activeIngredient: 'Calcium Carbonate + Vitamin D3',
    strength: '1250 mg / 400 IU',
    dosageForm: 'Chewable Tablets',
    packSize: '60 Tablets',
    price: 9800,
    bonus: 8,
    description: 'Complete bone health support combining pharmaceutical-grade calcium carbonate with essential vitamin D3 for superior absorption.',
    features: [
      'Optimal calcium-to-D3 ratio',
      'Pleasant chewable format',
      'Supports bone density maintenance'
    ],
    category: 'Orthopedics',
    brandColor: '#5C4B8A',
    image: null,
    imagePrompt: '',
    environmentDirection: 'Strong, structural environment. Warm cream and bone-white palette with subtle purple undertones. Smooth stone or marble surface suggesting strength and solidity. Soft natural daylight.',
    order: 5,
    visible: true
  },
  {
    id: 'prod_006',
    name: 'DermaShield SPF',
    activeIngredient: 'Zinc Oxide + Titanium Dioxide',
    strength: '7% / 5%',
    dosageForm: 'Cream',
    packSize: '50 g Tube',
    price: 14500,
    bonus: 20,
    description: 'Medical-grade broad-spectrum sun protection with mineral filters, designed for sensitive and post-procedure skin.',
    features: [
      'SPF 50+ broad-spectrum protection',
      'Mineral, non-comedogenic formula',
      'Dermatologist tested for sensitive skin'
    ],
    category: 'Dermatology',
    brandColor: '#D4A85C',
    image: null,
    imagePrompt: '',
    environmentDirection: 'Bright, luminous environment suggesting sunshine and skin health. Warm white and sandy gold palette. Light linen or ivory surface. Soft diffused natural daylight from above, mimicking golden hour lighting.',
    order: 6,
    visible: true
  },
  {
    id: 'prod_007',
    name: 'RespiClear',
    activeIngredient: 'Montelukast Sodium',
    strength: '10 mg',
    dosageForm: 'Film-coated Tablets',
    packSize: '28 Tablets',
    price: 11200,
    bonus: 10,
    description: 'Advanced leukotriene receptor antagonist for long-term asthma management and seasonal allergic rhinitis relief.',
    features: [
      'Once-daily prophylactic therapy',
      'Controls exercise-induced bronchoconstriction',
      'Suitable for long-term use'
    ],
    category: 'Pulmonology',
    brandColor: '#1A6B8A',
    image: null,
    imagePrompt: '',
    environmentDirection: 'Airy, breathable environment. Clear sky blue and clean white palette. Polished aqua-tinted frosted surface. Soft cool overhead light suggesting open airways and freedom of breath.',
    order: 7,
    visible: true
  },
  {
    id: 'prod_008',
    name: 'NeuroVital B',
    activeIngredient: 'B1 + B6 + B12 Complex',
    strength: '100 mg / 50 mg / 1000 mcg',
    dosageForm: 'Coated Tablets',
    packSize: '30 Tablets',
    price: 7900,
    bonus: 15,
    description: 'Comprehensive neurotropic vitamin complex supporting peripheral nerve function, energy metabolism, and cognitive health.',
    features: [
      'High-potency neurotropic complex',
      'Supports peripheral nerve health',
      'Enhances energy metabolism'
    ],
    category: 'Neurology',
    brandColor: '#1A4A8A',
    image: null,
    imagePrompt: '',
    environmentDirection: 'Sophisticated deep blue and electric-highlight environment. Navy and cobalt blue tones with subtle electric blue accents. Reflective dark surface suggesting neural pathways and intellectual precision.',
    order: 8,
    visible: true
  }
];


// ── Storage Keys ─────────────────────────────────────────────
const STORAGE_KEYS = {
  PRODUCTS: 'pharmex_products',
  MASTER_PROMPT: 'pharmex_master_prompt',
  CATALOG_TITLE: 'pharmex_catalog_title',
  CATALOG_SUBTITLE: 'pharmex_catalog_subtitle',
  ADMIN_PIN: 'pharmex_admin_pin',
};


// ── Data API ─────────────────────────────────────────────────
const DataAPI = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      this.saveProducts(SAMPLE_PRODUCTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.MASTER_PROMPT)) {
      localStorage.setItem(STORAGE_KEYS.MASTER_PROMPT, DEFAULT_MASTER_PROMPT);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATALOG_TITLE)) {
      localStorage.setItem(STORAGE_KEYS.CATALOG_TITLE, 'PharmEx Catalogue');
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATALOG_SUBTITLE)) {
      localStorage.setItem(STORAGE_KEYS.CATALOG_SUBTITLE, '2025 Product Portfolio');
    }
  },

  getProducts() {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) return [];
    try {
      return JSON.parse(raw).sort((a, b) => a.order - b.order);
    } catch {
      return [];
    }
  },

  getVisibleProducts() {
    return this.getProducts().filter(p => p.visible !== false);
  },

  saveProducts(products) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },

  getProduct(id) {
    return this.getProducts().find(p => p.id === id);
  },

  addProduct(product) {
    const products = this.getProducts();
    const maxOrder = products.reduce((m, p) => Math.max(m, p.order || 0), 0);
    const newProduct = {
      id: 'prod_' + Date.now(),
      name: '',
      activeIngredient: '',
      strength: '',
      dosageForm: '',
      packSize: '',
      price: 0,
      bonus: 0,
      description: '',
      features: [],
      category: '',
      brandColor: '#4A6FA5',
      image: null,
      imagePrompt: '',
      environmentDirection: '',
      order: maxOrder + 1,
      visible: true,
      ...product
    };
    products.push(newProduct);
    this.saveProducts(products);
    return newProduct;
  },

  updateProduct(id, updates) {
    const products = this.getProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    products[idx] = { ...products[idx], ...updates };
    this.saveProducts(products);
    return products[idx];
  },

  deleteProduct(id) {
    const products = this.getProducts().filter(p => p.id !== id);
    this.saveProducts(products);
  },

  reorderProducts(orderedIds) {
    const products = this.getProducts();
    orderedIds.forEach((id, idx) => {
      const p = products.find(pr => pr.id === id);
      if (p) p.order = idx + 1;
    });
    this.saveProducts(products);
  },

  getMasterPrompt() {
    return localStorage.getItem(STORAGE_KEYS.MASTER_PROMPT) || DEFAULT_MASTER_PROMPT;
  },

  saveMasterPrompt(prompt) {
    localStorage.setItem(STORAGE_KEYS.MASTER_PROMPT, prompt);
  },

  getCatalogTitle() {
    return localStorage.getItem(STORAGE_KEYS.CATALOG_TITLE) || 'PharmEx Catalogue';
  },

  getCatalogSubtitle() {
    return localStorage.getItem(STORAGE_KEYS.CATALOG_SUBTITLE) || '2025 Product Portfolio';
  },

  saveCatalogMeta(title, subtitle) {
    localStorage.setItem(STORAGE_KEYS.CATALOG_TITLE, title);
    localStorage.setItem(STORAGE_KEYS.CATALOG_SUBTITLE, subtitle);
  },

  buildAIPrompt(product) {
    let prompt = this.getMasterPrompt();
    prompt = prompt
      .replace('[PRODUCT_NAME]', product.name || '')
      .replace('[ACTIVE_INGREDIENT]', product.activeIngredient || '')
      .replace('[STRENGTH]', product.strength || '')
      .replace('[DOSAGE_FORM]', product.dosageForm || '')
      .replace('[PACK_SIZE]', product.packSize || '')
      .replace('[CATEGORY]', product.category || '')
      .replace('[BRAND_COLOR]', product.brandColor || '')
      .replace('[ENVIRONMENT_DIRECTION]', product.environmentDirection || 
        `Create a clean, sophisticated pharmaceutical environment appropriate for ${product.category || 'a premium pharmaceutical product'}. Use neutral clinical tones with subtle brand color accents matching ${product.brandColor || 'the product brand color'}.`);
    return prompt;
  },

  exportCatalog() {
    return {
      products: this.getProducts(),
      masterPrompt: this.getMasterPrompt(),
      catalogTitle: this.getCatalogTitle(),
      catalogSubtitle: this.getCatalogSubtitle(),
      exportedAt: new Date().toISOString()
    };
  },

  importCatalog(data) {
    if (data.products) this.saveProducts(data.products);
    if (data.masterPrompt) this.saveMasterPrompt(data.masterPrompt);
    if (data.catalogTitle) localStorage.setItem(STORAGE_KEYS.CATALOG_TITLE, data.catalogTitle);
    if (data.catalogSubtitle) localStorage.setItem(STORAGE_KEYS.CATALOG_SUBTITLE, data.catalogSubtitle);
  }
};
