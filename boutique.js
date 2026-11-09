/* ==========================================================
   VELOURS SECRET — boutique.js
   Catalogue : recherche, filtres (catégorie, prix, taille), tri, « Voir plus ».
   Les produits viennent de common.js (liste PRODUCTS).
   ========================================================== */
(function () {
  const PAGE_SIZE = 8; // nombre de produits affichés à chaque fois

  // Tranches de prix (min inclus, max exclu)
  const PRICE_RANGES = [
    { id: '',   label: 'Tous les prix',        min: 0,     max: Infinity },
    { id: 'p1', label: 'Moins de 10 000 FCFA', min: 0,     max: 10000 },
    { id: 'p2', label: '10 000 à 20 000 FCFA', min: 10000, max: 20000 },
    { id: 'p3', label: '20 000 à 30 000 FCFA', min: 20000, max: 30000 },
    { id: 'p4', label: 'Plus de 30 000 FCFA',  min: 30000, max: Infinity }
  ];

  /* ----- État de la page ----- */
  const state = { q: '', cat: '', price: '', sizes: [], sort: 'new', shown: PAGE_SIZE };
  let prevShown = 0;

  const els = {
    grid: $('#shopGrid'), empty: $('#shopEmpty'), count: $('#resultCount'), chips: $('#activeFilters'),
    loadWrap: $('#loadWrap'), loadMore: $('#loadMore'), loadInfo: $('#loadInfo'),
    sort: $('#sortSelect'), search: $('#shopSearch'), searchClear: $('#searchClear'),
    filters: $('#filters'), body: $('#filtersBody'), badge: $('#filterBadge'),
    apply: $('#filterApply'), crumb: $('#crumb')
  };

  /* Lecture de l'adresse : boutique.html?cat=Lingerie&q=satin */
  const params = new URLSearchParams(location.search);
  const catParam = params.get('cat');
  if (CATEGORIES.some(c => c.name === catParam)) state.cat = catParam;
  state.q = (params.get('q') || '').trim();

  /* ----- Outils ----- */
  // Enlève majuscules et accents pour que « nuisette » trouve « Nuisette », « gore » trouve « Gorée »
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const plural = (n, word) => `${n} ${word}${n > 1 ? 's' : ''}`;

  function matches(p) {
    if (state.cat && p.category !== state.cat) return false;
    if (state.price) {
      const r = PRICE_RANGES.find(x => x.id === state.price);
      if (p.price < r.min || p.price >= r.max) return false;
    }
    if (state.sizes.length && !p.sizes.some(s => state.sizes.includes(s))) return false;
    if (state.q) {
      const hay = norm(`${p.name} ${p.category} ${p.story}`);
      if (!norm(state.q).split(/\s+/).every(w => hay.includes(w))) return false;
    }
    return true;
  }

  function sorted(list) {
    const order = new Map(PRODUCTS.map((p, i) => [p.id, i]));
    const copy = [...list];
    if (state.sort === 'asc')  return copy.sort((a, b) => a.price - b.price);
    if (state.sort === 'desc') return copy.sort((a, b) => b.price - a.price);
    // « Nouveautés » : les pièces marquées Nouveau d'abord, puis l'ordre du catalogue
    return copy.sort((a, b) => ((b.tag === 'Nouveau') - (a.tag === 'Nouveau')) || (order.get(a.id) - order.get(b.id)));
  }

  /* ----- Construction des filtres (une seule fois) ----- */
  function buildFilters() {
    const catCount = name => PRODUCTS.filter(p => p.category === name).length;
    els.body.innerHTML = `
      <fieldset class="fgroup">
        <legend>Catégorie</legend>
        <label class="fopt"><input type="radio" name="cat" value=""><span>Toutes</span><small>${PRODUCTS.length}</small></label>
        ${CATEGORIES.map(c => `<label class="fopt"><input type="radio" name="cat" value="${esc(c.name)}"><span>${esc(c.name)}</span><small>${catCount(c.name)}</small></label>`).join('')}
      </fieldset>
      <fieldset class="fgroup">
        <legend>Prix</legend>
        ${PRICE_RANGES.map(r => `<label class="fopt"><input type="radio" name="price" value="${r.id}"><span>${r.label}</span></label>`).join('')}
      </fieldset>
      <fieldset class="fgroup">
        <legend>Taille</legend>
        <div class="fsizes">
          ${SIZES.map(s => `<button type="button" class="fchip" data-size="${s}" aria-pressed="false">${s}</button>`).join('')}
        </div>
        <p class="fnote">Les coffrets et accessoires n’ont pas de taille : ils sont masqués si vous choisissez une taille.</p>
      </fieldset>`;
  }

  // Met les cases cochées en accord avec l'état
  function syncControls() {
    $$('input[name=cat]', els.body).forEach(i => { i.checked = i.value === state.cat; });
    $$('input[name=price]', els.body).forEach(i => { i.checked = i.value === state.price; });
    $$('.fchip', els.body).forEach(b => {
      const on = state.sizes.includes(b.dataset.size);
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on);
    });
    els.search.value = state.q;
    els.searchClear.hidden = !state.q;
    els.sort.value = state.sort;
  }

  /* ----- Affichage ----- */
  function skeletons(n) {
    return Array.from({ length: n }, () =>
      `<div class="skeleton" aria-hidden="true"><div class="skeleton__img"></div><div class="skeleton__body"><span></span><span></span><span></span></div></div>`).join('');
  }

  function activeFilters() {
    const list = [];
    if (state.cat) list.push({ label: state.cat, remove: () => { state.cat = ''; } });
    if (state.price) list.push({ label: PRICE_RANGES.find(r => r.id === state.price).label, remove: () => { state.price = ''; } });
    state.sizes.forEach(s => list.push({ label: `Taille ${s}`, remove: () => { state.sizes = state.sizes.filter(x => x !== s); } }));
    if (state.q) list.push({ label: `« ${state.q} »`, remove: () => { state.q = ''; } });
    return list;
  }

  function renderCrumb() {
    els.crumb.innerHTML = state.cat
      ? `<a href="index.html">Accueil</a><span>/</span><a href="boutique.html">Boutique</a><span>/</span><span aria-current="page">${esc(state.cat)}</span>`
      : `<a href="index.html">Accueil</a><span>/</span><span aria-current="page">Boutique</span>`;
    document.title = (state.cat ? `${state.cat} — ` : '') + 'Notre boutique — Velours Secret';
  }

  function render(append = false) {
    const list = sorted(PRODUCTS.filter(matches));
    const total = list.length;

    if (append) {
      els.grid.insertAdjacentHTML('beforeend', list.slice(prevShown, state.shown).map(productCard).join(''));
    } else {
      els.grid.innerHTML = list.slice(0, state.shown).map(productCard).join('');
    }
    prevShown = Math.min(state.shown, total);
    els.grid.removeAttribute('aria-busy');

    // Compteur
    els.count.textContent = plural(total, 'produit');
    els.apply.textContent = total ? `Voir ${plural(total, 'produit')}` : 'Aucun produit';

    // Liste vide / bouton « Voir plus »
    els.empty.hidden = total > 0;
    const remaining = total - prevShown;
    els.loadWrap.hidden = remaining <= 0;
    els.loadInfo.textContent = `Vous en voyez ${prevShown} sur ${total}`;
    els.loadMore.textContent = `Voir plus (${remaining} restant${remaining > 1 ? 's' : ''})`;

    // Filtres actifs (pastilles)
    const act = activeFilters();
    els.chips.innerHTML = act.map((a, i) =>
      `<span class="chip">${esc(a.label)}<button type="button" data-chip="${i}" aria-label="Retirer le filtre ${esc(a.label)}"><span data-icon="x"></span></button></span>`).join('');
    paintIcons(els.chips);
    els.chips._items = act;

    // Pastille sur le bouton « Filtres » (mobile)
    const nbFilters = (state.cat ? 1 : 0) + (state.price ? 1 : 0) + state.sizes.length;
    els.badge.textContent = nbFilters; els.badge.hidden = nbFilters === 0;

    renderCrumb();
    VS.setActiveNav(state.cat);
    observeReveals();
  }

  /* Garde l'adresse à jour (catégorie + recherche) pour pouvoir partager le lien */
  function syncUrl() {
    try {
      const p = new URLSearchParams();
      if (state.cat) p.set('cat', state.cat);
      if (state.q) p.set('q', state.q);
      const s = p.toString();
      history.replaceState(null, '', location.pathname + (s ? '?' + s : ''));
    } catch { /* certains navigateurs bloquent cela en ouvrant le fichier directement : sans importance */ }
  }

  function update() {
    state.shown = PAGE_SIZE;
    prevShown = 0;
    syncUrl();
    syncControls();
    render(false);
  }

  function resetAll() {
    state.q = ''; state.cat = ''; state.price = ''; state.sizes = [];
    update();
  }

  /* ----- Événements ----- */
  els.body.addEventListener('change', e => {
    const input = e.target;
    if (input.name === 'cat')   state.cat = input.value;
    if (input.name === 'price') state.price = input.value;
    update();
  });

  els.body.addEventListener('click', e => {
    const chip = e.target.closest('.fchip');
    if (!chip) return;
    const s = chip.dataset.size;
    state.sizes = state.sizes.includes(s) ? state.sizes.filter(x => x !== s) : [...state.sizes, s];
    update();
  });

  els.chips.addEventListener('click', e => {
    const b = e.target.closest('[data-chip]');
    if (!b) return;
    els.chips._items[+b.dataset.chip].remove();
    update();
  });

  let searchTimer;
  els.search.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { state.q = els.search.value.trim(); update(); }, 150);
  });
  els.searchClear.addEventListener('click', () => { state.q = ''; update(); els.search.focus(); });

  els.sort.addEventListener('change', () => { state.sort = els.sort.value; update(); });

  els.loadMore.addEventListener('click', () => {
    state.shown += PAGE_SIZE;
    render(true);
  });

  $('#filterReset').addEventListener('click', resetAll);
  $('#emptyReset').addEventListener('click', resetAll);

  // Panneau de filtres sur mobile
  $('#filterOpen').addEventListener('click', () => openPanel(els.filters));
  $('#filterClose').addEventListener('click', closeAll);
  els.apply.addEventListener('click', closeAll);

  // La loupe de l'en-tête amène sur le champ de recherche de la page
  VS.focusSearch = () => {
    els.search.scrollIntoView({ behavior: 'smooth', block: 'center' });
    els.search.focus({ preventScroll: true });
  };

  /* ----- Démarrage : petit état de chargement puis affichage ----- */
  buildFilters();
  syncControls();
  els.grid.setAttribute('aria-busy', 'true');
  els.grid.innerHTML = skeletons(PAGE_SIZE);
  setTimeout(() => render(false), 350);
})();
