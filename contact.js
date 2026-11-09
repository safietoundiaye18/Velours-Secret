/* ==========================================================
   VELOURS SECRET — contact.js
   Page Contact : les coordonnées viennent de CONFIG (common.js).
   ========================================================== */
const ctWa = $('#ctWa');
ctWa.href = waLink('Bonjour Velours Secret 🌸 J’ai une question.');
ctWa.textContent = CONFIG.phoneDisplay;
const ctMail = $('#ctMail');
ctMail.href = `mailto:${CONFIG.email}`;
ctMail.textContent = CONFIG.email;
$('#ctHours').textContent = CONFIG.hours;
$('#ctIg').href = CONFIG.instagram;
$('#ctTt').href = CONFIG.tiktok;

/* Le formulaire prépare un message WhatsApp (aucune donnée n'est stockée) */
$('#contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = $('#cName').value.trim();
  const msg = $('#cMsg').value.trim();
  const status = $('#cMsgStatus');
  if (!msg) {
    status.className = 'form-msg err';
    status.textContent = 'Écrivez votre message avant d’envoyer.';
    $('#cMsg').focus();
    return;
  }
  const text = `Bonjour Velours Secret 🌸${name ? `\nJe m’appelle ${name}.` : ''}\n${msg}`;
  window.open(waLink(text), '_blank', 'noopener');
  status.className = 'form-msg ok';
  status.textContent = 'WhatsApp s’ouvre avec votre message prêt à envoyer.';
});
observeReveals();
