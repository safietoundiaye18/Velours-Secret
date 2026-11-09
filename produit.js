/* ==========================================================
   VELOURS SECRET — produit.js
   Fiche produit : produit.html?id=p1
   Les produits viennent de common.js (liste PRODUCTS).
   ========================================================== */
(function () {
  const MAX_QTY = CONFIG.maxQty;   // quantité maximale par commande (réglage dans common.js)

  /* ----- Quel produit ? (lu dans l'adresse : ?id=p1) ----- */
  const id = new URLSearchParams(location.search).get('id');
  const p = byId(id);
  const crumb = $('#crumb');

  if (!p) {
    // Adresse invalide : message clair au lieu d'une page vide
    crumb.innerHTML = '<a href="index.html">Accueil</a><span>/</span><a href="boutique.html">Boutique</a>';
    $('#pdpMissing').hidden = false;
    document.title = 'Pièce introuvable — Velours Secret';
    return;
  }

  /* ----- État de la page ----- */
  let qty = 1;
  const hasSizes = p.sizes.length > 0;
  const canBuy = !hasSizes || availableSizes(p).length > 0;   // false si toutes les tailles sont épuisées

  /* ==========================================================
     1. TEXTES : titre, fil d'Ariane, description
     ========================================================== */
  document.title = `${p.name} — Velours Secret`;
  $('meta[name=description]').content = `${p.name} : ${p.story} ${money(p.price)}. Velours Secret, ${p.category.toLowerCase()}.`;

  crumb.innerHTML = `<a href="index.html">Accueil</a><span>/</span><a href="boutique.html">Boutique</a><span>/</span><a href="${catUrl(p.category)}">${esc(p.category)}</a><span>/</span><span aria-current="page">${esc(p.name)}</span>`;

  /* Description provisoire par catégorie.
     ⚠️ À remplacer par les vraies informations (matières, entretien, contenu des coffrets)
     avant la mise en ligne. Pour une description propre à un produit, ajoute un champ
     "description" dans PRODUCTS (common.js) : il sera utilisé à la place. */
  const DESCRIPTIONS = {
    'Lingerie': {
      intro: 'Pensée pour accompagner vos courbes avec douceur, cette pièce de lingerie allie élégance et confort au quotidien. Inspirée par la Teranga, l’art de l’accueil, elle vous donne simplement envie de prendre soin de vous.',
      points: ['Coupe pensée pour le confort', 'Finitions soignées', 'À choisir selon votre tour de poitrine et de bassin (voir le guide des tailles)']
    },
    'Nuit & Détente': {
      intro: 'Pour des nuits paisibles et des matins tout en douceur. Cette pièce a été imaginée comme un cocon : légère, agréable à porter, avec la grâce qui fait toute la différence, même à la maison.',
      points: ['Pensée pour le confort de la nuit et de la détente', 'Tombé fluide et agréable', 'À choisir selon votre silhouette (voir le guide des tailles)']
    },
    'Coffrets cadeaux': {
      intro: 'Un écrin bordeaux et or pour offrir (ou s’offrir) un vrai moment de douceur. Mariage, anniversaire, Tabaski ou simple attention : le coffret est prêt à être offert.',
      points: ['Présentation soignée, prête à offrir', 'Contenu exact du coffret : à préciser', 'Personnalisation possible : à découvrir avec notre équipe']
    },
    'Accessoires': {
      intro: 'Le petit détail qui change tout. Un accessoire doux et pratique, pour protéger, parfaire et prolonger le confort de vos nuits.',
      points: ['Pensé pour le confort au quotidien', 'Format unique, sans taille à choisir', 'Se glisse facilement dans un coffret cadeau']
    }
  };
  const desc = DESCRIPTIONS[p.category] || { intro: '', points: [] };

  /* ==========================================================
     2. AFFICHAGE DES INFORMATIONS
     ========================================================== */
  $('#pCat').textContent = p.category;
  $('#pName').textContent = p.name;
  $('#pStory').textContent = p.story;
  $('#pPrice').textContent = money(p.price);

  if (p.tag) {
    const tag = $('#pTag');
    tag.textContent = p.tag; tag.hidden = false;
    if (p.tag === 'Coup de cœur') tag.classList.add('product__tag--love');
  }

  // Disponibilité (donnée de démonstration : on ne promet pas de stock réel)
  const someOut = hasSizes && availableSizes(p).length < p.sizes.length;
  const avail = $('#pAvail');
  if (!canBuy) {
    avail.className = 'pdp__avail pdp__avail--out';
    avail.innerHTML = '<span class="dot" aria-hidden="true"></span>Momentanément indisponible';
  } else {
    avail.innerHTML = `<span class="dot" aria-hidden="true"></span>Disponible${someOut ? ' — certaines tailles sont épuisées (barrées)' : ''} <small>· à confirmer par notre équipe</small>`;
  }

  // Description détaillée
  $('#pDesc').innerHTML = `
    <p>${esc(p.story)} ${esc(desc.intro)}</p>
    <ul class="acc__list">${desc.points.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
    <p class="acc__ref">Référence : ${esc(p.id.toUpperCase())}</p>
    <p class="demo-note">Description provisoire : matières et entretien à préciser avant la mise en ligne.</p>`;

  /* ==========================================================
     3. TAILLES
     Les boutons utilisent la classe « size » : common.js gère le clic
     et mémorise le choix dans selectedSize[id].
     ========================================================== */
  const sizeBlock = $('#sizeBlock');
  if (hasSizes) {
    $('#pSizes').innerHTML = p.sizes.map(s => {
      const out = isSoldOut(p, s);   // taille épuisée : bouton barré et désactivé
      return `<button type="button" class="size" data-id="${p.id}" data-size="${s}" aria-pressed="false" ${out ? `disabled aria-label="Taille ${s} indisponible"` : ''}>${s}</button>`;
    }).join('');
    $('#sizeGuideBtn').addEventListener('click', openGuide);
  } else {
    // Coffrets et accessoires : pas de taille
    $('#sizeLabel').textContent = 'Taille';
    $('#pSizes').innerHTML = '<p class="pdp__nosize">Taille unique : rien à choisir 🌸</p>';
    $('#sizeGuideBtn').hidden = true;
  }

  function chosenSize() { return hasSizes ? (selectedSize[p.id] || '') : ''; }

  VS.onSizeChange = (pid) => {
    if (pid !== p.id) return;
    $('#sizeError').hidden = true;
    refresh();
  };

  /* ==========================================================
     4. QUANTITÉ
     ========================================================== */
  function setQty(n) {
    qty = Math.min(MAX_QTY, Math.max(1, n));
    $('#qtyValue').textContent = qty;
    $('#qtyMinus').disabled = qty <= 1;
    $('#qtyPlus').disabled = qty >= MAX_QTY;
    refresh();
  }
  $('#qtyMinus').addEventListener('click', () => setQty(qty - 1));
  $('#qtyPlus').addEventListener('click', () => setQty(qty + 1));

  /* ==========================================================
     5. COMMANDE WHATSAPP
     ========================================================== */
  function orderMessage() {
    const size = chosenSize();
    return [
      'Bonjour Velours Secret 🌸',
      'Je souhaite commander :',
      `• Produit : ${p.name}`,
      size ? `• Taille : ${size}` : null,
      `• Quantité : ${qty}`,
      `• Prix unitaire : ${money(p.price)}`,
      `• Total : ${money(p.price * qty)}`,
      '',
      'Livraison : 1 000 à 2 000 FCFA selon la zone',
      '(Message généré depuis la maquette du site)'
    ].filter(l => l !== null).join('\n');
  }

  // Si une taille est nécessaire mais pas encore choisie, on l'indique gentiment
  function needSize() {
    if (hasSizes && !chosenSize()) {
      $('#sizeError').hidden = false;
      const first = $('#pSizes .size:not(:disabled)');
      if (first) first.focus();
      return true;
    }
    return false;
  }

  $('#waBtn').addEventListener('click', e => {
    if (!canBuy || needSize()) { e.preventDefault(); return; }
    $('#waBtn').href = waLink(orderMessage());   // message à jour au moment du clic
  });

  $('#addBtn').addEventListener('click', () => {
    if (!canBuy || needSize()) return;
    addToCart(p.id, qty);
  });

  /* ==========================================================
     6. FAVORIS
     ========================================================== */
  const favBtn = $('#pFav');
  function paintFav() {
    const on = favs.includes(p.id);
    favBtn.classList.toggle('active', on);
    favBtn.setAttribute('aria-pressed', on);
    $('#pFavText').textContent = on ? 'Dans mes favoris' : 'Ajouter aux favoris';
  }
  favBtn.addEventListener('click', () => toggleFav(p.id));
  VS.onFavChange = paintFav;   // reste à jour même si on retire le favori depuis le tiroir

  /* ==========================================================
     7. MISE À JOUR : total, boutons
     ========================================================== */
  function refresh() {
    $('#pTotal').textContent = money(p.price * qty);
    $('#waBtn').href = waLink(orderMessage());
  }

  if (!canBuy) {
    // Tout est épuisé : on désactive la commande, mais on laisse la question possible
    $('#waBtn').classList.add('is-disabled'); $('#waBtn').setAttribute('aria-disabled', 'true');
    $('#addBtn').disabled = true;
  }

  /* ==========================================================
     8. GALERIE : image principale + miniatures
     Les photos se déposent dans images/produits/ :
       teranga.jpg  (principale), teranga-2.jpg, teranga-3.jpg (autres vues).
     Seules les photos qui existent s'affichent. Sans aucune photo,
     on montre 3 motifs de démonstration pour voir la mise en page.
     ========================================================== */
  const SLOTS = 3;
  const gMain = $('#galleryMain'), gImg = $('#gImg'), gVisual = $('#gVisual'), gDemo = $('#gDemo'), gThumbs = $('#gThumbs');
  let slides = [];   // [{ src, variant }]
  let current = 0;

  function slotUrls() {
    const dot = p.image.lastIndexOf('.');
    const base = p.image.slice(0, dot), ext = p.image.slice(dot);
    return [p.image, ...Array.from({ length: SLOTS - 1 }, (_, i) => `${base}-${i + 2}${ext}`)];
  }

  // Motif de remplacement : 3 variantes de couleurs pour distinguer les vues
  function paintVisual(el, variant) {
    const [a, b] = variant === 1 ? [p.c2, p.c1] : variant === 2 ? [p.c1, '#29252A'] : [p.c1, p.c2];
    el.style.setProperty('--c1', a); el.style.setProperty('--c2', b);
  }

  function show(i) {
    current = (i + slides.length) % slides.length;
    const s = slides[current];
    paintVisual(gVisual, s.variant);
    if (s.src) { gImg.src = s.src; gImg.alt = `${p.name} — ${p.category}, vue ${current + 1} sur ${slides.length}`; gImg.hidden = false; }
    else { gImg.hidden = true; gImg.removeAttribute('src'); }
    gDemo.hidden = !!s.src;
    $$('.gallery__thumb', gThumbs).forEach((b, k) => b.setAttribute('aria-current', k === current ? 'true' : 'false'));
  }

  function buildThumbs() {
    gThumbs.hidden = slides.length < 2;
    gThumbs.innerHTML = slides.map((s, i) => `
      <button type="button" class="gallery__thumb" data-i="${i}" aria-label="Voir la vue ${i + 1} sur ${slides.length}">
        <div class="visual" style="--c1:${i === 1 ? p.c2 : p.c1};--c2:${i === 1 ? p.c1 : i === 2 ? '#29252A' : p.c2}"></div>
        ${s.src ? `<img src="${s.src}" alt="" loading="lazy">` : ''}
      </button>`).join('');
  }
  gThumbs.addEventListener('click', e => {
    const b = e.target.closest('.gallery__thumb');
    if (b) show(+b.dataset.i);
  });

  // Balayage du doigt sur mobile : image suivante / précédente
  let touchX = null;
  gMain.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  gMain.addEventListener('touchend', e => {
    if (touchX === null || slides.length < 2) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 45) show(current + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  // On affiche d'abord le motif, puis on vérifie quelles photos existent
  slides = [{ src: null, variant: 0 }];
  show(0);
  Promise.all(slotUrls().map(u => new Promise(ok => {
    const im = new Image();
    im.onload = () => ok(true); im.onerror = () => ok(false); im.src = u;
  }))).then(found => {
    const urls = slotUrls();
    if (found[0]) slides = urls.filter((_, i) => found[i]).map(src => ({ src, variant: 0 }));
    else slides = Array.from({ length: SLOTS }, (_, i) => ({ src: null, variant: i }));   // mode démo
    buildThumbs();
    show(0);
  });

  /* ==========================================================
     9. GUIDE DES TAILLES (panneau)
     ========================================================== */
  function openGuide() {
    openPanel('#sizeGuide');
    $('#sgClose').focus();
  }
  $('#sgWa').href = waLink(`Bonjour Velours Secret 🌸 Pouvez-vous m’aider à choisir ma taille pour « ${p.name} » ?`);

  /* ==========================================================
     10. PRODUITS SIMILAIRES
     Même catégorie d'abord, puis on complète avec d'autres pièces (4 au total).
     ========================================================== */
  const same = PRODUCTS.filter(x => x.id !== p.id && x.category === p.category);
  const others = PRODUCTS.filter(x => x.id !== p.id && x.category !== p.category);
  const similar = [...same, ...others].slice(0, 4);
  if (similar.length) {
    $('#similarGrid').innerHTML = similar.map(productCard).join('');
    $('#similar').hidden = false;
  }

  /* ==========================================================
     DÉMARRAGE
     ========================================================== */
  $('#pdpLayout').hidden = false;
  setQty(1);
  paintFav();
  paintIcons();
  observeReveals();
})();
