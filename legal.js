/* ==========================================================
   VELOURS SECRET — legal.js
   Pages légales : les textes sont dans les fichiers HTML.
   Ici, on branche seulement les liens WhatsApp (class="js-wa").
   ========================================================== */
$$('.js-wa').forEach(a => { a.href = waLink('Bonjour Velours Secret 🌸 J’ai une question.'); });
