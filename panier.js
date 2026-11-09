/* ==========================================================
   VELOURS SECRET — panier.js
   Page Panier : panier.html
   Le panier lui-même (cart, addToCart, renderCart…) est dans common.js.
   Ici, on ne fait que l'AFFICHER en grand et préparer le message WhatsApp.
   ========================================================== */
(function () {
  const $lines = $('#cartLines');
  let clearArmed = false, clearTimer;   // « Vider le panier » demande une 2e confirmation
  let suggestKey = '';                  // pour ne redessiner les suggestions que si le panier change vraiment

  const plural = (n, word) => `${n} ${word}${n > 1 ? 's' : ''}`;
  // Une ligne est « indisponible » si sa taille est devenue épuisée depuis l'ajout
  const unavailable = l => !!l.size && isSoldOut(byId(l.id), l.size);

  // Informations facultatives saisies par la cliente (non enregistrées)
  const extra = () => ({ name: $('#fName').value.trim(), place: $('#fPlace').value.trim(), note: $('#fNote').value.trim() });
  const updateWaLink = () => { $('#pgWa').href = waLink(cartMessage(extra())); };

  /* ==========================================================
     AFFICHAGE (appelé à chaque changement du panier, grâce à VS.onCartChange)
     ========================================================== */
  function render() {
    // On retient le bouton qui avait le focus, pour le lui rendre après le dessin (clavier)
    const a = document.activeElement;
    const focusSel = a && a.matches && a.matches('#cartLines [data-qty]') ? `[data-qty="${a.dataset.qty}"][data-i="${a.dataset.i}"]` : '';

    const count = cart.reduce((n, l) => n + l.qty, 0);
    $('#cartEmpty').hidden = cart.length > 0;
    $('#cartLayout').hidden = cart.length === 0;
    $('#cartIntro').textContent = cart.length
      ? `${plural(count, 'article')} dans votre panier. Vérifiez-les, puis envoyez votre commande sur WhatsApp.`
      : 'Rien pour le moment, mais cela ne durera pas !';
    $('#emptyTabs').innerHTML = CATEGORIES.map(c => `<a href="${catUrl(c.name)}">${esc(c.name)}</a>`).join('');

    if (cart.length) {
      $lines.innerHTML = cart.map((l, i) => {
        const p = byId(l.id), bad = unavailable(l);
        return `<li class="cart-line ${bad ? 'cart-line--warn' : ''}">
          ${thumb(p)}
          <div class="cart-line__body">
            <h3><a href="${productUrl(p.id)}">${esc(p.name)}</a></h3>
            <p class="cart-line__meta">${esc(p.category)}${l.size ? ' · Taille ' + l.size : ''}</p>
            <p class="cart-line__unit">${money(p.price)} l’unité</p>
            ${bad ? `<p class="cart-line__warn">Cette taille est momentanément indisponible. <a href="${productUrl(p.id)}">Choisir une autre taille</a></p>` : ''}
            <div class="cart-line__row">
              <div class="qty qty--lg" role="group" aria-label="Quantité de ${esc(p.name)}">
                <button type="button" data-qty="-1" data-i="${i}" aria-label="Diminuer la quantité" ${l.qty <= 1 ? 'disabled' : ''}>−</button>
                <span aria-live="polite">${l.qty}</span>
                <button type="button" data-qty="1" data-i="${i}" aria-label="Augmenter la quantité" ${l.qty >= CONFIG.maxQty ? 'disabled' : ''}>+</button>
              </div>
              <span class="cart-line__total">${money(p.price * l.qty)}</span>
            </div>
            <button type="button" class="line__remove" data-remove="${i}" aria-label="Retirer ${esc(p.name)} du panier">Retirer du panier</button>
          </div>
        </li>`;
      }).join('');

      $('#sumCount').textContent = `Sous-total (${plural(count, 'article')})`;
      $('#pgSubtotal').textContent = money(subtotal());
      $('#pgTotal').textContent = money(subtotal());

      // Avertissement + blocage de la commande si une taille n'est plus disponible
      const blocked = cart.some(unavailable);
      const alertBox = $('#cartAlert');
      alertBox.hidden = !blocked;
      alertBox.textContent = blocked ? 'Une ou plusieurs tailles ne sont plus disponibles. Retirez-les ou choisissez une autre taille pour commander.' : '';
      $('#pgWa').classList.toggle('is-disabled', blocked);
      $('#pgWa').setAttribute('aria-disabled', blocked);
      updateWaLink();

      if (focusSel) {
        const again = $(focusSel, $lines);
        if (again && !again.disabled) again.focus();
        else { const other = $(`[data-i="${a.dataset.i}"][data-qty]:not(:disabled)`, $lines); if (other) other.focus(); }
      }
    }
    renderSuggestions();
  }

  /* Suggestions : pièces pas encore dans le panier (accessoires et coffrets d'abord) */
  function renderSuggestions() {
    const key = cart.map(l => l.id).sort().join(',');
    if (key === suggestKey) return;
    suggestKey = key;
    const inCart = new Set(cart.map(l => l.id));
    const rank = p => (p.category === 'Accessoires' ? 0 : p.category === 'Coffrets cadeaux' ? 1 : 2);
    const list = PRODUCTS.filter(p => !inCart.has(p.id)).sort((x, y) => rank(x) - rank(y)).slice(0, 4);
    $('#suggestGrid').innerHTML = list.map(productCard).join('');
    $('#cartSuggest').hidden = list.length === 0;
    observeReveals();
  }

  /* ==========================================================
     ACTIONS
     (+ / − / Retirer sont gérés par common.js : il modifie le panier puis rappelle render)
     ========================================================== */

  // Commander : on construit le message au moment du clic, avec les infos saisies
  $('#pgWa').addEventListener('click', e => {
    if (!cart.length || cart.some(unavailable)) { e.preventDefault(); return; }
    updateWaLink();
  });
  ['#fName', '#fPlace', '#fNote'].forEach(sel => $(sel).addEventListener('input', updateWaLink));

  // Vider le panier : 1er clic = on demande, 2e clic = on vide
  const clearBtn = $('#clearCart');
  clearBtn.addEventListener('click', () => {
    if (!clearArmed) {
      clearArmed = true;
      clearBtn.textContent = 'Cliquez encore pour confirmer';
      clearTimer = setTimeout(resetClear, 4000);
      return;
    }
    resetClear();
    cart.length = 0;
    save(CONFIG.storageKeys.cart, cart);
    renderCart();
    toast('Votre panier a été vidé');
  });
  function resetClear() { clearArmed = false; clearTimeout(clearTimer); clearBtn.textContent = 'Vider le panier'; }

  /* ==========================================================
     DÉMARRAGE
     ========================================================== */
  VS.onCartChange = render;
  render();
  paintIcons();
  observeReveals();
})();
