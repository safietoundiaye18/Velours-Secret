/* ==========================================================
   VELOURS SECRET — categorie.js
   Page Catégorie : categorie.html?cat=Lingerie
   Les produits et les catégories viennent de common.js.
   ========================================================== */
(function () {

  /* ----- Textes de chaque catégorie -----
     Pour changer un texte, modifie simplement la phrase ci-dessous.
     La clé doit être EXACTEMENT le nom de la catégorie dans CATEGORIES (common.js). */
  const INFO = {
    'Lingerie': {
      intro: 'Dentelle, satin et douceur : une lingerie pensée pour se sentir belle pour soi, sous le wax comme sous le boubou. Des pièces confortables, aux noms qui rappellent nos lieux préférés : Almadies, Médina, Gorée…',
      tipTitle: 'Bien choisir sa taille',
      tip: 'Chaque fiche contient un guide des tailles. Entre deux tailles, choisissez la plus grande pour plus de confort, ou demandez conseil à notre équipe.'
    },
    'Nuit & Détente': {
      intro: 'Pour les nuits de Dakar comme pour les dimanches à la maison : nuisettes, pyjamas et pièces de détente, légers et fluides, pour se reposer avec élégance.',
      tipTitle: 'Le confort avant tout',
      tip: 'Une pièce de nuit doit se faire oublier. Dites-nous si vous la préférez ample ou près du corps : nous vous aiderons à choisir.'
    },
    'Coffrets cadeaux': {
      intro: 'Offrir, c’est la Teranga en cadeau. Pour un mariage, une naissance, un anniversaire ou une fête en famille, nos coffrets sont prêts à être offerts, dans leur écrin bordeaux et or.',
      tipTitle: 'Un cadeau qui vous ressemble',
      tip: 'Message personnalisé, composition sur mesure : ces options sont à confirmer. Écrivez-nous sur WhatsApp pour savoir ce qui est possible.'
    },
    'Accessoires': {
      intro: 'Les petits détails qui font les grandes douceurs : des accessoires pour prolonger le confort de vos nuits et prendre soin de vous.',
      tipTitle: 'Une idée de cadeau',
      tip: 'Un accessoire est une jolie attention à petit prix. Pensez aussi à nos coffrets cadeaux pour offrir un moment complet.'
    }
  };

  const plural = (n, word) => `${n} ${word}${n > 1 ? 's' : ''}`;
  const ORDER_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

  /* ----- Quelle catégorie ? (lue dans l'adresse : ?cat=Lingerie) ----- */
  const name = new URLSearchParams(location.search).get('cat');
  const cat = CATEGORIES.find(c => c.name === name);
  const crumb = $('#crumb');

  // Liens vers toutes les catégories (menu de la page)
  const tabsHTML = current => [
    ...CATEGORIES.map(c => `<a href="${catUrl(c.name)}" ${c.name === current ? 'class="active" aria-current="page"' : ''}>${esc(c.name)}</a>`),
    '<a href="boutique.html">Toute la boutique</a>'
  ].join('');

  /* ----- Catégorie inconnue : message clair ----- */
  if (!cat) {
    crumb.innerHTML = '<a href="index.html">Accueil</a><span>/</span><span aria-current="page">Catégories</span>';
    $('#catTitle').textContent = 'Nos univers';
    $('#catIntro').textContent = 'Lingerie, nuit & détente, coffrets et accessoires : choisissez votre univers.';
    $('#missingTabs').innerHTML = tabsHTML('');
    $('#catMissing').hidden = false;
    document.title = 'Nos univers — Velours Secret';
    paintIcons();
    return;
  }

  const info = INFO[cat.name] || { intro: '', tipTitle: 'Un conseil ?', tip: 'Notre équipe est là pour vous aider.' };
  const inCat = PRODUCTS.filter(p => p.category === cat.name);

  /* ==========================================================
     1. EN-TÊTE DE LA PAGE
     ========================================================== */
  document.title = `${cat.name} — Velours Secret`;
  $('meta[name=description]').content = `${cat.name} : ${info.intro}`.slice(0, 160);
  crumb.innerHTML = `<a href="index.html">Accueil</a><span>/</span><a href="boutique.html">Boutique</a><span>/</span><span aria-current="page">${esc(cat.name)}</span>`;
  $('#catTitle').textContent = cat.name;
  $('#catIntro').textContent = info.intro;
  $('#catHead').style.setProperty('--glow', cat.c2);   // petite lueur aux couleurs de la catégorie

  $('#catTabs').innerHTML = tabsHTML(cat.name);
  $('#shopLink').href = `boutique.html?cat=${encodeURIComponent(cat.name)}`;

  /* ==========================================================
     2. FILTRE PAR TAILLE + TRI
     ========================================================== */
  const state = { size: '', sort: 'new' };

  // Tailles qui existent dans cette catégorie (rien pour les coffrets/accessoires sans taille)
  const sizes = ORDER_SIZES.filter(s => inCat.some(p => p.sizes.includes(s)));
  const sizeBox = $('#sizeFilter');
  if (sizes.length) {
    sizeBox.innerHTML = '<span class="pill-row__label">Taille :</span>' +
      sizes.map(s => `<button type="button" class="pill" data-size-filter="${s}" aria-pressed="false">${s}</button>`).join('');
    sizeBox.hidden = false;
    sizeBox.addEventListener('click', e => {
      const b = e.target.closest('[data-size-filter]');
      if (!b) return;
      state.size = state.size === b.dataset.sizeFilter ? '' : b.dataset.sizeFilter;   // 2e clic = on enlève
      render();
    });
  }

  $('#catSort').addEventListener('change', e => { state.sort = e.target.value; render(); });
  $('#catEmptyReset').addEventListener('click', () => { state.size = ''; render(); });

  function sorted(list) {
    const order = new Map(PRODUCTS.map((p, i) => [p.id, i]));
    const copy = [...list];
    if (state.sort === 'asc')  return copy.sort((a, b) => a.price - b.price);
    if (state.sort === 'desc') return copy.sort((a, b) => b.price - a.price);
    // « Nouveautés » : les pièces marquées Nouveau d'abord, puis l'ordre du catalogue
    return copy.sort((a, b) => ((b.tag === 'Nouveau') - (a.tag === 'Nouveau')) || (order.get(a.id) - order.get(b.id)));
  }

  /* ==========================================================
     3. AFFICHAGE DES PRODUITS
     ========================================================== */
  function render() {
    // Une taille épuisée ne compte pas comme « disponible »
    const list = sorted(inCat.filter(p => !state.size || (p.sizes.includes(state.size) && !isSoldOut(p, state.size))));

    $('#catProducts').innerHTML = list.map(productCard).join('');
    $('#catEmpty').hidden = list.length > 0;
    $('#catCount').textContent = plural(list.length, 'pièce') + (state.size ? ` en taille ${state.size}` : '');

    $$('[data-size-filter]', sizeBox).forEach(b => {
      const on = b.dataset.sizeFilter === state.size;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on);
    });
    observeReveals();
  }

  /* ==========================================================
     4. CONSEIL + AUTRES UNIVERS
     ========================================================== */
  $('#tipTitle').textContent = info.tipTitle;
  $('#tipText').textContent = info.tip;
  $('#tipWa').href = waLink(`Bonjour Velours Secret 🌸 J’ai une question sur la catégorie « ${cat.name} ».`);

  // Les 3 autres catégories, avec les mêmes cartes que l'accueil
  $('#otherGrid').innerHTML = CATEGORIES.filter(c => c.name !== cat.name).map(c => `
    <a href="${catUrl(c.name)}" class="cat-card reveal">
      <div class="visual" style="--c1:${c.c1};--c2:${c.c2}"></div>
      <img src="${c.image}" alt="Univers ${esc(c.name)}" loading="lazy" onerror="this.remove()">
      <div class="cat-card__body">
        <h3>${esc(c.name)}</h3>
        <span class="cat-card__link">Découvrir</span>
      </div>
    </a>`).join('');

  /* ==========================================================
     DÉMARRAGE
     ========================================================== */
  $('#catContent').hidden = false;
  $('#otherCats').hidden = false;
  render();
  paintIcons();
  observeReveals();
})();
