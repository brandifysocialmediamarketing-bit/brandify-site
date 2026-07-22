// ============================================
//  BRANDIFY - Contact page form
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const WA_NUMBER = '918140924369';
  const form = document.getElementById('contactForm');
  const success = document.getElementById('contactSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const phone = (data.get('phone') || '').toString().trim();
    const message = (data.get('message') || '').toString().trim();

    const note =
      `Hi Brandify Social Media Marketing!\n\n` +
      `*Name:* ${name}\n` +
      `*Email:* ${email}\n` +
      `*Phone:* ${phone}\n` +
      (message ? `*Message:* ${message}\n` : '') +
      `\nI'd like to know how you can help grow my brand.`;

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(note)}`;
    window.open(url, '_blank');

    form.style.display = 'none';
    if (success) success.style.display = 'block';
  });
});
