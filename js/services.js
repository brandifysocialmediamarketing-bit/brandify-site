// ============================================
//  BRANDIFY - Services Page JavaScript
//  SPEED OPTIMIZED (No heavy GSAP dependency)
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. STICKY NAVBAR ---
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // --- 2. HAMBURGER MENU ---
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // --- 3. NATIVE SPEED-OPTIMIZED SCROLL REVEAL ---
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); 
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    
    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.scroll-reveal').forEach(el => el.classList.add('visible'));
  }

  // --- 4. DYNAMIC NAV & SIMPLE FADE ANIMATIONS ---
  const qnPills = document.querySelectorAll('.qn-pill');
  const svcBlocks = document.querySelectorAll('.svc-detail');
  const listContainer = document.querySelector('.svc-detail-list');

  if (qnPills.length && svcBlocks.length && listContainer) {
    let activeId = qnPills[0].getAttribute('href').substring(1);

    // Initial load: show only the first block
    qnPills[0].classList.add('active');
    svcBlocks.forEach(b => {
      if (b.id !== activeId) {
        b.classList.remove('active');
        b.classList.add('leaving');
      } else {
        b.classList.add('active');
        b.classList.remove('leaving');
      }
    });

    qnPills.forEach(pill => {
      pill.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        if (targetId === activeId) return; // Prevent double click

        // 1. Hide the old block using simple fade-out
        const oldBlock = document.getElementById(activeId);
        if (oldBlock) {
          oldBlock.classList.remove('active');
          oldBlock.classList.add('leaving');
        }

        // 2. Set active pill
        qnPills.forEach(p => p.classList.remove('active'));
        this.classList.add('active');

        // 3. Show the new block using simple fade-in
        const newBlock = document.getElementById(targetId);
        if (newBlock) {
          newBlock.classList.remove('leaving');
          newBlock.classList.add('active');
        }

        activeId = targetId;
      });
    });
  }

  // --- 5. FAQ ACCORDION ---
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      item.classList.toggle('open', !isOpen);
      a.style.maxHeight = !isOpen ? a.scrollHeight + 'px' : null;
    });
  });

  // --- 6. CUSTOM MAGNETIC CURSOR ---
  const cursorDot  = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (cursorDot && cursorRing && !isTouchDevice) {
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let ringX = mouseX, ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    function animateRing() {
      const ease = 0.10;
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateRing);
    }
    requestAnimationFrame(animateRing);

    document.querySelectorAll('a, button, .qn-pill, .faq-q').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('cursor-hover');
        cursorRing.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('cursor-hover');
        cursorRing.classList.remove('cursor-hover');
      });
    });
  }

});

// ============================================
//  POPUP MODALS + RIPPLE + EMAILJS SEND
// ============================================

(function() {

  const EMAIL_TO = 'brandifysocialmediamarketing@gmail.com';

  function formDataToText(form) {
    const data = new FormData(form);
    const lines = [];
    const seen = {};
    for (const [key, val] of data.entries()) {
      if (!val) continue;
      if (seen[key]) {
        seen[key] += ', ' + val;
        const idx = lines.findIndex(l => l.startsWith(key + ':'));
        if (idx !== -1) lines[idx] = `${key}: ${seen[key]}`;
      } else {
        seen[key] = val;
        lines.push(`${key}: ${val}`);
      }
    }
    return lines.join('\n');
  }

  const EMAILJS_SERVICE_ID  = 'service_0n24thl';   
  const EMAILJS_TEMPLATE_ID = 'template_eq3qq45';  
  const EMAILJS_PUBLIC_KEY  = '5zpk8ydbxSxs4WROV';   

  async function sendEmail(subject, body) {
    const submitBtn = document.querySelector('.modal-overlay.open .form-submit');
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = 'Sending… <i class="fa fa-spinner fa-spin"></i>'; }

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { to_email : EMAIL_TO, subject : subject, message : body, reply_to : '' },
        EMAILJS_PUBLIC_KEY
      );
      return { ok: true };
    } catch (err) {
      console.error('EmailJS error:', err);
      return { ok: false };
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalText; }
    }
  }

  function openModal(id) {
    document.getElementById(id).classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(id) {
    document.getElementById(id).classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });
  document.getElementById('closeConsultation')?.addEventListener('click', () => closeModal('consultationModal'));
  document.getElementById('closeQuote')?.addEventListener('click', () => closeModal('quoteModal'));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal('consultationModal');
      closeModal('quoteModal');
    }
  });

  ['consultationBtn', 'consultationBtn2'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', () => openModal('consultationModal'));
  });

  document.querySelectorAll('.quote-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const service = btn.dataset.service || 'General';
      document.getElementById('quoteServiceName').textContent = service;
      document.getElementById('quoteServiceInput').value = service;
      document.getElementById('quoteSuccess').style.display = 'none';
      document.getElementById('quoteForm').style.display = 'flex';
      openModal('quoteModal');
    });
  });

  document.getElementById('consultationForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formText = formDataToText(this);
    const body = `NEW FREE CONSULTATION REQUEST\n${'='.repeat(40)}\n\n` + formText + `\n\n${'='.repeat(40)}\nSent from Brandify Services Page`;
    const result = await sendEmail('New Free Consultation Request – Brandify', body);
    if (result.ok) {
      this.style.display = 'none';
      document.getElementById('consultSuccess').style.display = 'block';
      setTimeout(() => {
        closeModal('consultationModal');
        this.reset();
        this.style.display = 'flex';
        document.getElementById('consultSuccess').style.display = 'none';
      }, 4000);
    } else {
      alert('Something went wrong. Please try again or contact us directly on WhatsApp.');
    }
  });

  document.getElementById('quoteForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const service = document.getElementById('quoteServiceInput').value;
    const body = `NEW QUOTE REQUEST – ${service.toUpperCase()}\n${'='.repeat(40)}\n\n` + formDataToText(this) + `\n\n${'='.repeat(40)}\nSent from Brandify Services Page`;
    const result = await sendEmail(`New Quote Request: ${service} – Brandify`, body);
    if (result.ok) {
      this.style.display = 'none';
      document.getElementById('quoteSuccess').style.display = 'block';
      setTimeout(() => {
        closeModal('quoteModal');
        this.reset();
        this.style.display = 'flex';
        document.getElementById('quoteSuccess').style.display = 'none';
      }, 4000);
    } else {
      alert('Something went wrong. Please try again or contact us directly on WhatsApp.');
    }
  });

  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn-primary, .btn-outline');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });

})();