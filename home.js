/* ==========================================================
   VELOURS SECRET — home.js
   Ce qui est propre à la page d'accueil.
   (Le panier, les favoris, le menu… sont dans common.js)
   ========================================================== */

/* Catégories : chaque carte ouvre la page de la catégorie (categorie.html) */
function renderCategories() {
  $('#catGrid').innerHTML = CATEGORIES.map(c => `
    <a href="${catUrl(c.name)}" class="cat-card reveal">
      <div class="visual" style="--c1:${c.c1};--c2:${c.c2}"></div>
      <img src="${c.image}" alt="Univers ${esc(c.name)}" loading="lazy" onerror="this.remove()">
      <div class="cat-card__body">
        <h3>${esc(c.name)}</h3>
        <span class="cat-card__link">Découvrir</span>
      </div>
    </a>`).join('');
}

/* Sélection : les 8 premières pièces du catalogue */
function renderFeatured() {
  $('#productGrid').innerHTML = PRODUCTS.slice(0, 8).map(productCard).join('');
}

/* Newsletter : validation visuelle (aucun envoi réel) */
$('#newsletterForm').addEventListener('submit', e => {
  e.preventDefault();
  const input = $('#nlEmail'), msg = $('#nlMsg');
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
  input.classList.toggle('invalid', !ok);
  msg.className = 'form-msg ' + (ok ? 'ok' : 'err');
  msg.textContent = ok ? 'Merci ! (Démonstration : votre e-mail n’a pas été enregistré.)' : 'Merci de saisir une adresse e-mail valide.';
  if (ok) input.value = '';
});

renderCategories();
renderFeatured();
observeReveals();
