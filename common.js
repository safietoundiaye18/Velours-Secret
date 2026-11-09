/* ==========================================================
   VELOURS SECRET — common.js
   Code PARTAGÉ par toutes les pages :
   réglages, produits, en-tête, pied de page, panier, favoris.
   Pour changer le menu ou le pied de page : modifie-le ici, une seule fois.
   ========================================================== */

/* ---------- 1. RÉGLAGES FACILES À MODIFIER ---------- */
const CONFIG = {
  // Numéro WhatsApp de la marque, format international sans "+" (221 + 9 chiffres)
  whatsappNumber: '221778679591',
  phoneDisplay: '77 867 95 91',
  email: 'veloursecretlingerie@gmail.com',
  hours: 'Du lundi au samedi, de 9h à 20h',
  instagram: 'https://www.instagram.com/veloursecretlingerie/',
  tiktok: 'https://www.tiktok.com/@lingerieveloursecret8',
  currency: 'FCFA',
  maxQty: 10,   // quantité maximale par article et par commande
  storageKeys: { cart: 'vs_cart', favs: 'vs_favs' }
};

/* ---------- 2. PRODUITS DE DÉMONSTRATION (fictifs) ----------
   Photos : dépose-les dans images/produits/ avec le nom indiqué dans "image".
   Tant que la photo n'existe pas, un motif élégant s'affiche à la place.
   tag peut valoir 'Nouveau', 'Coup de cœur' ou '' (aucun badge). */
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const PRODUCTS = [
  { id: 'p1',  name: 'Ensemble Teranga',          category: 'Lingerie',         price: 18500, sizes: ['S','M','L','XL'],       tag: 'Nouveau',
    story: 'Dentelle fine et détails dorés, l’hospitalité en lingerie.',      image: 'images/produits/teranga.jpg',      c1: '#722F43', c2: '#b0566d' },
  { id: 'p2',  name: 'Nuisette Saly',             category: 'Nuit & Détente',   price: 22000, sizes: ['S','M','L','XL'],       tag: 'Coup de cœur',
    story: 'Satin fluide aux reflets du soleil sur la Petite-Côte.',           image: 'images/produits/saly.jpg',         c1: '#4B1F2D', c2: '#8e3d55' },
  { id: 'p3',  name: 'Body Almadies',             category: 'Lingerie',         price: 15000, sizes: ['S','M','L'],            tag: '',
    story: 'Une coupe sculptée, pensée pour les courbes.',                     image: 'images/produits/almadies.jpg',     c1: '#8a4a3a', c2: '#c48a5a' },
  { id: 'p4',  name: 'Pyjama Gorée',              category: 'Nuit & Détente',   price: 27500, sizes: ['S','M','L','XL','XXL'], tag: 'Nouveau',
    story: 'Douceur et couleurs de l’île, pour des nuits paisibles.',          image: 'images/produits/goree.jpg',        c1: '#b5566a', c2: '#e3a3a8' },
  { id: 'p5',  name: 'Coffret Baobab',            category: 'Coffrets cadeaux', price: 45000, sizes: [],                       tag: 'Coup de cœur',
    story: 'Ensemble + accessoires, dans un écrin bordeaux et or.',            image: 'images/produits/baobab.jpg',       c1: '#5a2335', c2: '#B89452' },
  { id: 'p6',  name: 'Robe de nuit Sine-Saloum',  category: 'Nuit & Détente',   price: 24000, sizes: ['S','M','L','XL'],       tag: '',
    story: 'Légère comme la brise du delta.',                                  image: 'images/produits/sine-saloum.jpg',  c1: '#6b3a5a', c2: '#c27a92' },
  { id: 'p7',  name: 'Foulard de nuit Wax',       category: 'Accessoires',      price: 6500,  sizes: [],                       tag: '',
    story: 'Satin doublé pour protéger vos cheveux avec style.',               image: 'images/produits/foulard-wax.jpg',  c1: '#B89452', c2: '#7a5a28' },
  { id: 'p8',  name: 'Peignoir Lac Rose',         category: 'Nuit & Détente',   price: 32000, sizes: ['M','L','XL'],           tag: 'Nouveau',
    story: 'Un cocon rose poudré pour vos moments à vous.',                    image: 'images/produits/lac-rose.jpg',     c1: '#d49aa8', c2: '#EAD7DC' },
  { id: 'p9',  name: 'Soutien-gorge Médina',      category: 'Lingerie',         price: 12500, sizes: ['S','M','L','XL'],       tag: '',
    story: 'Maintien doux et dentelle délicate, pour tous les jours.',         image: 'images/produits/medina.jpg',       c1: '#7a3347', c2: '#c9788f' },
  { id: 'p10', name: 'Culotte Ngor',              category: 'Lingerie',         price: 7500,  sizes: ['S','M','L','XL','XXL'], tag: '',
    story: 'Coton soyeux et finitions invisibles.',                            image: 'images/produits/ngor.jpg',         c1: '#a0556a', c2: '#e0b0b8' },
  { id: 'p11', name: 'Ensemble Bakel',            category: 'Lingerie',         price: 21000, sizes: ['S','M','L','XL'],       tag: 'Nouveau',
    story: 'Bordeaux profond et broderies dorées.',                            image: 'images/produits/bakel.jpg',        c1: '#4B1F2D', c2: '#a3566c' },
  { id: 'p12', name: 'Nuisette Joal',             category: 'Nuit & Détente',   price: 19500, sizes: ['S','M','L','XL'],       tag: '',
    story: 'Bretelles fines et tombé fluide.',                                 image: 'images/produits/joal.jpg',         c1: '#8e4a5e', c2: '#d9a0aa' },
  { id: 'p13', name: 'Pyjama Casamance',          category: 'Nuit & Détente',   price: 25000, sizes: ['S','M','L','XL','XXL'], tag: 'Coup de cœur',
    story: 'Deux pièces en satin, vert de forêt et or doux.',                  image: 'images/produits/casamance.jpg',    c1: '#3d5a4a', c2: '#B89452' },
  { id: 'p14', name: 'Coffret Teranga Prestige',  category: 'Coffrets cadeaux', price: 62000, sizes: [],                       tag: 'Nouveau',
    story: 'Notre plus bel écrin : ensemble, peignoir et accessoires.',        image: 'images/produits/teranga-prestige.jpg', c1: '#4B1F2D', c2: '#B89452' },
  { id: 'p15', name: 'Coffret Tabaski Douceur',   category: 'Coffrets cadeaux', price: 38000, sizes: [],                       tag: '',
    story: 'Une attention élégante pour célébrer les belles occasions.',       image: 'images/produits/tabaski.jpg',      c1: '#722F43', c2: '#d9be86' },
  { id: 'p16', name: 'Masque de nuit satin',      category: 'Accessoires',      price: 5000,  sizes: [],                       tag: '',
    story: 'Un sommeil réparateur, tout en douceur.',                          image: 'images/produits/masque.jpg',       c1: '#5a2335', c2: '#c27a92' },
  { id: 'p17', name: 'Bonnet satin Cauris',       category: 'Accessoires',      price: 4500,  sizes: [],                       tag: 'Nouveau',
    story: 'Protège vos coiffures pendant la nuit.',                           image: 'images/produits/bonnet.jpg',       c1: '#8a6a30', c2: '#EAD7DC' }
];

/* Tailles momentanément indisponibles (DÉMONSTRATION).
   Format : identifiant du produit → liste de tailles épuisées.
   Pour tout remettre en stock, vide simplement cette liste : const SOLD_OUT = {}; */
const SOLD_OUT = { p1: ['XL'], p4: ['XXL'], p9: ['S'] };
const isSoldOut = (p, size) => (SOLD_OUT[p.id] || []).includes(size);
/* Tailles qu'on peut encore commander pour un produit */
const availableSizes = p => p.sizes.filter(s => !isSoldOut(p, s));

const CATEGORIES = [
  { name: 'Lingerie',         c1: '#722F43', c2: '#b0566d', image: 'images/cat-lingerie.jpg' },
  { name: 'Nuit & Détente',   c1: '#4B1F2D', c2: '#8e3d55', image: 'images/cat-nuit.jpg' },
  { name: 'Coffrets cadeaux', c1: '#5a2335', c2: '#B89452', image: 'images/cat-coffrets.jpg' },
  { name: 'Accessoires',      c1: '#8a6a30', c2: '#d9be86', image: 'images/cat-accessoires.jpg' }
];

/* Adresse de la PAGE d'une catégorie : categorie.html?cat=Lingerie */
const catUrl = name => `categorie.html?cat=${encodeURIComponent(name)}`;

/* Adresse de la fiche d'un produit : produit.html?id=p1 */
const productUrl = id => `produit.html?id=${encodeURIComponent(id)}`;

/* Menu principal (modifie ici pour changer le menu de TOUTES les pages) */
const NAV = [
  { label: 'Accueil',          href: 'index.html',                 page: 'home' },
  { label: 'Boutique',         href: 'boutique.html',              page: 'shop' },
  { label: 'Lingerie',         href: catUrl('Lingerie'),           cat: 'Lingerie' },
  { label: 'Nuit & Détente',   href: catUrl('Nuit & Détente'),     cat: 'Nuit & Détente' },
  { label: 'Coffrets cadeaux', href: catUrl('Coffrets cadeaux'),   cat: 'Coffrets cadeaux' },
  { label: 'À propos',         href: 'apropos.html',               page: 'about' }
];

/* Petit objet partagé : les pages y accrochent leurs réactions */
const VS = {
  focusSearch: null,
  onSizeChange: null,   // la fiche produit s'y accroche pour savoir qu'une taille a été choisie
  onFavChange: null,    // idem quand les favoris changent (cœur, tiroir…)
  onCartChange: null    // la page Panier s'y accroche pour se redessiner à chaque changement
};

/* ---------- 3. ICÔNES (SVG simples, style cohérent) ---------- */
const ICONS = {
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  heart: '<path d="M12 20s-7-4.4-9-9.2C1.6 7.4 3.7 4 7 4c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.3 0 5.4 3.4 4 6.8-2 4.8-9 9.2-9 9.2z"/>',
  bag: '<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 016 0v2"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.8 2.8L16 9.5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  chat: '<path d="M4 5h16v11H9l-5 4V5z"/>',
  gift: '<rect x="3" y="9" width="18" height="11" rx="1"/><path d="M12 9v11M3 13h18M12 9c-3 0-5-1-5-3s3-2.5 5 3c2-5.5 5-5 5-3s-2 3-5 3z"/>',
  truck: '<path d="M2 6h11v10H2zM13 10h4l3 3v3h-7z"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  filter: '<path d="M4 6h8M18 6h2M4 12h2M12 12h8M4 18h10M20 18h0"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
  'arrow-up': '<path d="M12 19V5M6 11l6-6 6 6"/>',
  instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r=".6" fill="currentColor"/>',
  tiktok: '<path d="M14 3v11.5a3.5 3.5 0 11-3.5-3.5M14 3c.4 2.6 2 4.2 5 4.5"/>',
  whatsapp: '<path d="M4 20l1.2-4.2A8 8 0 118 18.8L4 20z"/><path d="M9 9c.2 2.2 2.8 5 5.5 5.5l1-1.3-2-1-.8.7c-1-.4-1.8-1.2-2.2-2.2l.7-.8-1-2L9 9z"/>'
};
function iconSVG(name) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
}
function paintIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach(el => { if (!el.firstChild) el.innerHTML = iconSVG(el.dataset.icon); });
}

/* ---------- 4. OUTILS ---------- */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = n => n.toLocaleString('fr-FR').replace(/[  ]/g, ' ') + ' ' + CONFIG.currency;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
const byId = id => PRODUCTS.find(p => p.id === id);

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* stockage indisponible : on continue */ }
}

/* ---------- 5. EN-TÊTE, PIED DE PAGE, TIROIRS (injectés dans chaque page) ---------- */
const pageName = document.body.dataset.page || '';
const urlCat = new URLSearchParams(location.search).get('cat') || '';

function navIsActive(item) {
  // Sur une fiche produit, on met en avant la catégorie du produit
  if (pageName === 'product') {
    const p = byId(new URLSearchParams(location.search).get('id'));
    return !!p && item.cat === p.category;
  }
  // Page catégorie : on met en avant le menu de la catégorie
  if (pageName === 'category') return item.cat === urlCat;
  if (pageName === 'shop') return urlCat ? item.cat === urlCat : item.page === 'shop';
  return !!item.page && item.page === pageName;
}

function headerHTML() {
  const links = NAV.map(n => `<a href="${n.href}" ${n.cat ? `data-cat="${esc(n.cat)}"` : ''} ${n.page ? `data-page="${n.page}"` : ''} ${navIsActive(n) ? 'class="active" aria-current="page"' : ''}>${esc(n.label)}</a>`).join('');
  return `
  <div class="announce">Livraison à Dakar et environs en 24 h (1 000 à 2 000 FCFA) — Contactez-nous pour les autres régions.</div>
  <header class="header" id="header">
    <div class="container header__inner">
      <button class="icon-btn menu-toggle" id="menuToggle" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="mainNav"><span data-icon="menu"></span></button>
      <a href="index.html" class="logo" aria-label="Velours Secret — accueil">
        <!-- Ton logo : images/logo.png (la version texte s'affiche s'il est absent) -->
        <img src="images/logo.png" alt="Logo Velours Secret" class="logo__img" onerror="this.remove()">
        <span class="logo__text"><span class="logo__mark">VS</span><span class="logo__name">Velours Secret</span></span>
      </a>
      <nav class="nav" id="mainNav" aria-label="Navigation principale">${links}</nav>
      <div class="header__actions">
        <button class="icon-btn" id="searchBtn" aria-label="Rechercher"><span data-icon="search"></span></button>
        <button class="icon-btn" id="favBtn" aria-label="Mes favoris"><span data-icon="heart"></span><span class="badge" id="favCount" hidden>0</span></button>
        <button class="icon-btn" id="cartBtn" aria-label="Mon panier"><span data-icon="bag"></span><span class="badge" id="cartCount" hidden>0</span></button>
        <a href="boutique.html" class="btn btn--small btn--primary header__cta">Découvrir la collection</a>
      </div>
    </div>
    <div class="searchbar" id="searchbar" hidden>
      <div class="container">
        <form id="searchForm" role="search">
          <span data-icon="search"></span>
          <input type="search" id="searchInput" placeholder="Rechercher une pièce, un coffret…" aria-label="Rechercher un produit" autocomplete="off">
          <button type="button" class="icon-btn" id="searchClose" aria-label="Fermer la recherche"><span data-icon="x"></span></button>
        </form>
      </div>
    </div>
  </header>`;
}

function footerHTML() {
  return `
  <footer class="footer">
    <div class="wax-band wax-band--gold" aria-hidden="true"></div>
    <div class="container footer__grid">
      <div class="footer__brand">
        <a href="index.html" class="logo logo--light" aria-label="Velours Secret">
          <span class="logo__text"><span class="logo__mark">VS</span><span class="logo__name">Velours Secret</span></span>
        </a>
        <p class="footer__slogan">« La douceur d'être femme, le luxe d'être soi. »</p>
        <div class="socials">
          <a href="${CONFIG.instagram}" target="_blank" rel="noopener" aria-label="Instagram"><span data-icon="instagram"></span></a>
          <a href="${CONFIG.tiktok}" target="_blank" rel="noopener" aria-label="TikTok"><span data-icon="tiktok"></span></a>
          <a href="#" id="footerWa" aria-label="WhatsApp" target="_blank" rel="noopener"><span data-icon="whatsapp"></span></a>
        </div>
      </div>
      <div>
        <h3>Liens rapides</h3>
        <ul>
          <li><a href="index.html">Accueil</a></li>
          <li><a href="boutique.html">Boutique</a></li>
          <li><a href="${catUrl('Lingerie')}">Lingerie</a></li>
          <li><a href="${catUrl('Nuit & Détente')}">Nuit &amp; Détente</a></li>
          <li><a href="${catUrl('Coffrets cadeaux')}">Coffrets cadeaux</a></li>
          <li><a href="${catUrl('Accessoires')}">Accessoires</a></li>
          <li><a href="apropos.html">À propos</a></li>
          <li><a href="favoris.html">Mes favoris</a></li>
          <li><a href="faq.html">FAQ</a></li>
        </ul>
      </div>
      <div>
        <h3>Informations</h3>
        <ul>
          <li><a href="conditions.html">Conditions générales</a></li>
          <li><a href="confidentialite.html">Politique de confidentialité</a></li>
          <li><a href="livraison-echanges.html">Livraison &amp; échanges</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div>
        <h3>Nous écrire</h3>
        <p>Une question, un conseil de taille ? Notre équipe vous répond sur WhatsApp.</p>
        <a href="#" id="footerWa2" class="btn btn--gold btn--small" target="_blank" rel="noopener">Écrire sur WhatsApp</a>
      </div>
    </div>
    <div class="footer__bottom">
      <div class="container">
        <p>Fait avec soin au Sénégal 🇸🇳</p>
        <p>© <span id="year"></span> Velours Secret. Tous droits réservés.</p>
      </div>
    </div>
  </footer>`;
}

function drawersHTML() {
  return `
  <div class="overlay" id="overlay" hidden></div>
  <aside class="drawer" id="cartDrawer" aria-label="Panier" aria-hidden="true">
    <div class="drawer__head"><h2>Mon panier</h2><button class="icon-btn" data-close aria-label="Fermer le panier"><span data-icon="x"></span></button></div>
    <div class="drawer__body" id="cartBody"></div>
    <div class="drawer__foot" id="cartFoot" hidden>
      <dl class="totals">
        <div><dt>Sous-total</dt><dd id="cartSubtotal">0 FCFA</dd></div>
        <div><dt>Livraison</dt><dd>1 000 à 2 000 FCFA</dd></div>
        <div class="totals__total"><dt>Total estimé (hors livraison)</dt><dd id="cartTotal">0 FCFA</dd></div>
      </dl>
      <a href="#" class="btn btn--whatsapp btn--block" id="cartWa" target="_blank" rel="noopener"><span data-icon="whatsapp"></span> Envoyer ma commande sur WhatsApp</a>
      <a href="panier.html" class="btn btn--primary btn--block">Voir mon panier</a>
      <button class="btn btn--ghost btn--block" data-close>Continuer mes achats</button>
      <p class="drawer__note">Aucun paiement en ligne : la commande se confirme avec notre équipe.</p>
    </div>
  </aside>
  <aside class="drawer" id="favDrawer" aria-label="Favoris" aria-hidden="true">
    <div class="drawer__head"><h2>Mes favoris</h2><button class="icon-btn" data-close aria-label="Fermer les favoris"><span data-icon="x"></span></button></div>
    <div class="drawer__body" id="favBody"></div>
  </aside>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>
  <button class="to-top" id="toTop" aria-label="Retour en haut de page" hidden><span data-icon="arrow-up"></span></button>`;
}

function mount(id, html) {
  const el = document.getElementById(id);
  if (el) el.outerHTML = html;
}
mount('site-header', headerHTML());
mount('site-footer', footerHTML());
mount('site-drawers', drawersHTML());

/* ---------- 6. ÉTAT : PANIER & FAVORIS (enregistrés dans le navigateur) ---------- */
let cart = load(CONFIG.storageKeys.cart, []);   // [{id, size, qty}]
let favs = load(CONFIG.storageKeys.favs, []);   // [id, id...]
cart = cart.filter(l => byId(l.id));            // retire ce qui n'existe plus
cart.forEach(l => { l.qty = Math.min(CONFIG.maxQty, Math.max(1, Math.floor(+l.qty) || 1)); });   // quantité toujours valide
favs = favs.filter(id => byId(id));
const selectedSize = {};                        // taille choisie par produit (partagée grille + favoris)

/* ---------- 7. NOTIFICATION DISCRÈTE ---------- */
let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ---------- 8. WHATSAPP ---------- */
function waLink(text) {
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
const subtotal = () => cart.reduce((s, l) => s + byId(l.id).price * l.qty, 0);
/* extra (facultatif) : { name, place, note } saisis sur la page Panier */
function cartMessage(extra = {}) {
  const lines = cart.map(l => {
    const p = byId(l.id);
    return `• ${p.name}${l.size ? ' (taille ' + l.size + ')' : ''} × ${l.qty} = ${money(p.price * l.qty)}`;
  });
  const infos = [
    extra.name  ? `Nom : ${extra.name}` : '',
    extra.place ? `Quartier / ville : ${extra.place}` : '',
    extra.note  ? `Note : ${extra.note}` : ''
  ].filter(Boolean);
  return `Bonjour Velours Secret 🌸\nVoici ma commande :\n${lines.join('\n')}\n\nSous-total : ${money(subtotal())}\nLivraison : 1 000 à 2 000 FCFA selon la zone\nTotal estimé (hors livraison) : ${money(subtotal())}` +
    (infos.length ? `\n\nMes informations :\n${infos.join('\n')}` : '') +
    `\n(Message généré depuis la maquette du site)`;
}

/* ---------- 9. CARTE PRODUIT (utilisée sur l'accueil et la boutique) ---------- */
function sizeChips(p, extraClass = '') {
  if (!p.sizes.length) return '';
  return `<div class="product__sizes ${extraClass}" role="group" aria-label="Tailles disponibles pour ${esc(p.name)}">
    ${p.sizes.map(s => {
      const out = isSoldOut(p, s);
      return `<button type="button" class="size ${selectedSize[p.id] === s ? 'active' : ''}" data-size="${s}" data-id="${p.id}" aria-pressed="${selectedSize[p.id] === s}" ${out ? 'disabled aria-label="Taille ' + s + ' indisponible"' : ''}>${s}</button>`;
    }).join('')}
  </div>`;
}

function productCard(p) {
  const isFav = favs.includes(p.id);
  const tag = p.tag ? `<span class="product__tag ${p.tag === 'Coup de cœur' ? 'product__tag--love' : ''}">${esc(p.tag)}</span>` : '';
  return `
  <article class="product reveal">
    <div class="product__media">
      <div class="visual" style="--c1:${p.c1};--c2:${p.c2}"></div>
      <span class="product__demo">Visuel démo</span>
      <img src="${p.image}" alt="${esc(p.name)} — ${esc(p.category)}" loading="lazy" onerror="this.remove()">
      <!-- Lien invisible : toute la photo ouvre la fiche (le clavier utilise le nom et le bouton) -->
      <a class="product__link" href="${productUrl(p.id)}" tabindex="-1" aria-hidden="true"></a>
      ${tag}
      <button class="product__fav ${isFav ? 'active' : ''}" data-fav="${p.id}" aria-label="${isFav ? 'Retirer des' : 'Ajouter aux'} favoris : ${esc(p.name)}" aria-pressed="${isFav}">${iconSVG('heart')}</button>
    </div>
    <div class="product__body">
      <h3 class="product__name"><a href="${productUrl(p.id)}">${esc(p.name)}</a></h3>
      <p class="product__story">${esc(p.story)}</p>
      ${sizeChips(p)}
      <p class="product__price">${money(p.price)}</p>
      <div class="product__actions">
        <button class="btn btn--primary" data-add="${p.id}">Ajouter au panier</button>
        <a class="btn btn--ghost" href="${productUrl(p.id)}">Voir le produit</a>
      </div>
    </div>
  </article>`;
}

/* ---------- 10. PANIER ---------- */
function addToCart(id, qty = 1) {
  const p = byId(id);
  let size = '';
  if (p.sizes.length) {
    size = selectedSize[id];
    if (!size) { toast('Choisissez d’abord une taille 🌸'); return; }
    if (isSoldOut(p, size)) { toast('Cette taille est indisponible pour le moment'); return; }
  }
  const line = cart.find(l => l.id === id && l.size === size);
  const already = line ? line.qty : 0;
  if (already >= CONFIG.maxQty) { toast(`Maximum ${CONFIG.maxQty} par article : écrivez-nous pour plus 🌸`); return; }
  const add = Math.min(qty, CONFIG.maxQty - already);
  if (line) line.qty += add; else cart.push({ id, size, qty: add });
  save(CONFIG.storageKeys.cart, cart);
  renderCart();
  toast(add < qty ? `Quantité limitée à ${CONFIG.maxQty} pour ${p.name}` : `${p.name}${add > 1 ? ' × ' + add : ''} ajouté au panier ✓`);
}

function thumb(p) {
  return `<div class="line__thumb"><div class="visual" style="--c1:${p.c1};--c2:${p.c2}"></div><img src="${p.image}" alt="" onerror="this.remove()"></div>`;
}

function renderCart() {
  const count = cart.reduce((n, l) => n + l.qty, 0);
  const badge = $('#cartCount');
  badge.textContent = count; badge.hidden = count === 0;

  const body = $('#cartBody'), foot = $('#cartFoot');
  if (!cart.length) {
    body.innerHTML = `<div class="drawer-empty">${iconSVG('bag')}<h3>Votre panier est vide</h3><p>Laissez-vous tenter par une pièce qui vous ressemble.</p><a href="boutique.html" class="btn btn--primary">Découvrir la boutique</a></div>`;
    foot.hidden = true;
    if (VS.onCartChange) VS.onCartChange();
    return;
  }
  body.innerHTML = cart.map((l, i) => {
    const p = byId(l.id);
    return `<div class="line">
      ${thumb(p)}
      <div>
        <h4><a href="${productUrl(p.id)}">${esc(p.name)}</a></h4>
        <p class="line__meta">${l.size ? 'Taille ' + l.size + ' · ' : ''}${money(p.price)}</p>
        <div class="line__row">
          <div class="qty">
            <button data-qty="-1" data-i="${i}" aria-label="Diminuer la quantité">−</button>
            <span aria-live="polite">${l.qty}</span>
            <button data-qty="1" data-i="${i}" aria-label="Augmenter la quantité" ${l.qty >= CONFIG.maxQty ? 'disabled' : ''}>+</button>
          </div>
          <span class="line__price">${money(p.price * l.qty)}</span>
        </div>
        <button class="line__remove" data-remove="${i}">Supprimer</button>
      </div>
    </div>`;
  }).join('');
  foot.hidden = false;
  $('#cartSubtotal').textContent = money(subtotal());
  $('#cartTotal').textContent = money(subtotal());
  $('#cartWa').href = waLink(cartMessage());
  if (VS.onCartChange) VS.onCartChange();
}

/* ---------- 11. FAVORIS ---------- */
function toggleFav(id) {
  const p = byId(id);
  if (favs.includes(id)) { favs = favs.filter(f => f !== id); toast('Retiré des favoris'); }
  else { favs.push(id); toast(`${p.name} ajouté aux favoris ♥`); }
  save(CONFIG.storageKeys.favs, favs);
  renderFavs();
  // Met à jour tous les cœurs visibles sans tout redessiner
  $$('.product__fav[data-fav]').forEach(b => {
    const on = favs.includes(b.dataset.fav);
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', on);
  });
  if (VS.onFavChange) VS.onFavChange();   // la fiche produit met à jour son bouton
}

function renderFavs() {
  const badge = $('#favCount');
  badge.textContent = favs.length; badge.hidden = favs.length === 0;

  const body = $('#favBody');
  if (!favs.length) {
    body.innerHTML = `<div class="drawer-empty">${iconSVG('heart')}<h3>Aucun favori pour l’instant</h3><p>Touchez le cœur d’une pièce pour la retrouver ici.</p><a href="boutique.html" class="btn btn--primary">Parcourir la boutique</a></div>`;
    return;
  }
  body.innerHTML = favs.map(id => {
    const p = byId(id);
    return `<div class="line">
      ${thumb(p)}
      <div>
        <h4><a href="${productUrl(p.id)}">${esc(p.name)}</a></h4>
        <p class="line__meta">${esc(p.category)} · ${money(p.price)}</p>
        ${sizeChips(p)}
        <div class="line__row">
          <button class="btn btn--primary btn--small" data-add="${p.id}">Ajouter au panier</button>
        </div>
        <button class="line__remove" data-unfav="${p.id}">Retirer</button>
      </div>
    </div>`;
  }).join('') + `<a href="favoris.html" class="btn btn--ghost btn--block drawer__all">Voir tous mes favoris</a>`;
}

/* ---------- 12. TIROIRS, PANNEAUX & MENU MOBILE ---------- */
const overlay = $('#overlay');
function showOverlay() {
  overlay.hidden = false;
  requestAnimationFrame(() => overlay.classList.add('show'));
  document.body.style.overflow = 'hidden';
}
function openPanel(target) {
  const el = typeof target === 'string' ? $(target) : target;
  closeAll();
  el.classList.add('open');
  if (el.classList.contains('drawer')) el.setAttribute('aria-hidden', 'false');
  showOverlay();
}
function closeAll() {
  $$('.drawer').forEach(d => { d.classList.remove('open'); d.setAttribute('aria-hidden', 'true'); });
  $$('.filters, .sheet').forEach(f => f.classList.remove('open'));   // panneau de filtres, guide des tailles
  $('#mainNav').classList.remove('open');
  document.body.classList.remove('menu-open');
  $('#menuToggle').setAttribute('aria-expanded', 'false');
  overlay.classList.remove('show');
  setTimeout(() => { if (!overlay.classList.contains('show')) overlay.hidden = true; }, 300);
  document.body.style.overflow = '';
}

/* ---------- 13. APPARITION AU DÉFILEMENT ---------- */
let io;
function observeReveals() {
  if (!('IntersectionObserver' in window)) { $$('.reveal').forEach(e => e.classList.add('in')); return; }
  io = io || new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .12 });
  $$('.reveal:not(.in)').forEach(el => io.observe(el));
}

/* ---------- 14. ÉVÉNEMENTS COMMUNS ---------- */
document.addEventListener('click', e => {
  const t = e.target;

  // Pages pas encore créées : message clair plutôt qu'un lien cassé
  const soon = t.closest('[data-soon]');
  if (soon) {
    e.preventDefault();
    closeAll();
    toast(`« ${soon.dataset.soon} » sera créée à une prochaine étape ✨`);
    return;
  }

  const size = t.closest('.size');
  if (size) {
    const { id, size: s } = size.dataset;
    selectedSize[id] = s;
    $$(`.size[data-id="${id}"]`).forEach(b => {
      const on = b.dataset.size === s; b.classList.toggle('active', on); b.setAttribute('aria-pressed', on);
    });
    if (VS.onSizeChange) VS.onSizeChange(id, s);
    return;
  }

  const add = t.closest('[data-add]');       if (add) return addToCart(add.dataset.add);
  const fav = t.closest('.product__fav');    if (fav) return toggleFav(fav.dataset.fav);
  const unfav = t.closest('[data-unfav]');   if (unfav) return toggleFav(unfav.dataset.unfav);

  const q = t.closest('[data-qty]');
  if (q) {
    const l = cart[+q.dataset.i]; if (!l) return;
    l.qty = Math.min(CONFIG.maxQty, l.qty + +q.dataset.qty);
    if (l.qty < 1) cart.splice(+q.dataset.i, 1);
    save(CONFIG.storageKeys.cart, cart); return renderCart();
  }
  const rm = t.closest('[data-remove]');
  if (rm) { cart.splice(+rm.dataset.remove, 1); save(CONFIG.storageKeys.cart, cart); return renderCart(); }

  if (t.closest('[data-close]') || t === overlay) closeAll();
  if (t.closest('#mainNav a')) closeAll();   // referme le menu mobile après un clic
});

$('#menuToggle').addEventListener('click', () => {
  const nav = $('#mainNav');
  const open = !nav.classList.contains('open');
  closeAll();
  if (open) {
    nav.classList.add('open');
    document.body.classList.add('menu-open');
    $('#menuToggle').setAttribute('aria-expanded', 'true');
    showOverlay();
  }
});
$('#cartBtn').addEventListener('click', () => {
  if (pageName === 'cart') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }   // déjà sur la page Panier
  openPanel('#cartDrawer');
});
$('#favBtn').addEventListener('click', () => {
  if (pageName === 'favs') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }   // déjà sur la page Favoris
  openPanel('#favDrawer');
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeAll(); closeSearch(); } });

/* Recherche de l'en-tête :
   - sur la boutique, elle met le champ de recherche de la page au premier plan ;
   - ailleurs, elle ouvre une barre qui renvoie vers la boutique avec les résultats. */
const searchbar = $('#searchbar'), searchInput = $('#searchInput');
function closeSearch() {
  if (searchbar.hidden) return;
  searchbar.hidden = true; searchInput.value = '';
}
$('#searchBtn').addEventListener('click', () => {
  if (VS.focusSearch) { VS.focusSearch(); return; }
  if (searchbar.hidden) { searchbar.hidden = false; searchInput.focus(); } else closeSearch();
});
$('#searchClose').addEventListener('click', closeSearch);
$('#searchForm').addEventListener('submit', e => {
  e.preventDefault();
  const term = searchInput.value.trim();
  location.href = 'boutique.html' + (term ? '?q=' + encodeURIComponent(term) : '');
});

/* Met en surbrillance le bon lien du menu (utilisé par la boutique quand on change de catégorie) */
VS.setActiveNav = cat => {
  $$('#mainNav a').forEach(a => {
    const on = cat ? a.dataset.cat === cat : a.dataset.page === 'shop';
    a.classList.toggle('active', on);
    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
};

/* Retour en haut */
const toTop = $('#toTop');
window.addEventListener('scroll', () => { toTop.hidden = window.scrollY < 600; }, { passive: true });
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- 15. DÉMARRAGE COMMUN ---------- */
$('#year').textContent = new Date().getFullYear();
['#footerWa', '#footerWa2'].forEach(s => { $(s).href = waLink('Bonjour Velours Secret 🌸 J’ai une question.'); });
renderCart();
renderFavs();
paintIcons();
