/* ==========================================================
   VELOURS SECRET — favoris.js
   Page Favoris : favoris.html
   Les favoris eux-mêmes (favs, toggleFav…) sont dans common.js.
   Ici, on ne fait que les AFFICHER en grand.
   ========================================================== */
(function () {
  const plural = (n, word) => `${n} ${word}${n > 1 ? 's' : ''}`;

  /* Pièces affichées sur la page. Quand on retire un cœur, la carte RESTE
     (cœur vide) jusqu'au prochain chargement : on peut le remettre en cas d'erreur. */
  const shown = [...favs];
  let gridKey = null;
  let suggestKey = null;
  let clearArmed = false, clearTimer;

  const list = () => {
    favs.forEach(id => { if (!shown.includes(id)) shown.push(id); });
    return shown.filter(id => byId(id));
  };

  function render() {
    const ids = list();
    const n = favs.length;
    $('#favEmpty').hidden = ids.length > 0;
    $('#favContent').hidden = ids.length === 0;
    $('#favTabs').innerHTML = CATEGORIES.map(c => `<a href="${catUrl(c.name)}">${esc(c.name)}</a>`).join('');

    $('#favIntro').textContent = n
      ? `${plural(n, 'pièce')} que vous aimez. Choisissez une taille, puis ajoutez au panier.`
      : 'Les pièces que vous aimerez apparaîtront ici.';
    $('#favCount2').textContent = n ? plural(n, 'pièce') + ' en favori' + (n > 1 ? 's' : '') : 'Plus aucun favori';

    // On ne redessine la grille que si la liste change (pour garder tailles choisies et focus)
    const key = ids.join(',');
    if (key !== gridKey) {
      gridKey = key;
      $('#favGrid').innerHTML = ids.map(id => productCard(byId(id))).join('');
      observeReveals();
    }
    $('#favShare').hidden = n === 0;
    $('#favShare').href = waLink(shareMessage());
    renderSuggestions(ids);
  }

  function shareMessage() {
    const lines = favs.map(id => { const p = byId(id); return `• ${p.name} — ${money(p.price)}`; });
    return `Bonjour Velours Secret 🌸\nVoici mes pièces préférées :\n${lines.join('\n')}\n\nPouvez-vous me conseiller (tailles, disponibilité) ?\n(Message généré depuis la maquette du site)`;
  }

  /* Suggestions : pièces pas encore aimées (coups de cœur d'abord) */
  function renderSuggestions(ids) {
    const key = ids.join(',');
    if (key === suggestKey) return;
    suggestKey = key;
    const taken = new Set(ids);
    const rank = p => (p.tag === 'Coup de cœur' ? 0 : p.tag === 'Nouveau' ? 1 : 2);
    const picks = PRODUCTS.filter(p => !taken.has(p.id)).sort((a, b) => rank(a) - rank(b)).slice(0, 4);
    $('#suggestEyebrow').textContent = ids.length ? 'Pour compléter' : 'Pour vous inspirer';
    $('#suggestTitle').textContent = ids.length ? 'Elles pourraient aussi vous plaire' : 'Nos coups de cœur';
    $('#suggestGrid').innerHTML = picks.map(productCard).join('');
    $('#favSuggest').hidden = picks.length === 0;
    observeReveals();
  }

  // Vider : 1er clic = on demande, 2e clic = on vide
  const clearBtn = $('#favClear');
  function resetClear() { clearArmed = false; clearTimeout(clearTimer); clearBtn.textContent = 'Vider mes favoris'; }
  clearBtn.addEventListener('click', () => {
    if (!clearArmed) {
      clearArmed = true;
      clearBtn.textContent = 'Cliquez encore pour confirmer';
      clearTimer = setTimeout(resetClear, 4000);
      return;
    }
    resetClear();
    favs.length = 0; shown.length = 0;
    save(CONFIG.storageKeys.favs, favs);
    renderFavs();
    $$('.product__fav[data-fav]').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
    render();
    toast('Vos favoris ont été vidés');
  });

  VS.onFavChange = render;
  render();
  paintIcons();
  observeReveals();
})();
