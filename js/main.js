/* ============================================
   Portfolio — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initScrollAnimations();
  initContactForm();
  highlightActiveNav();
  initResumeModal();  
  initDocModal(); 
});

/* --- Mobile Navigation --- */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('open');
    document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
  });

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* --- Scroll Animations --- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in, .timeline-item');

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* --- Active Nav Link --- */
function highlightActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* --- Contact Form --- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('success-toast');
  const error = document.getElementById('form-error');
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    error?.classList.remove('show');
    toast?.classList.remove('show');

    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    const formData = new FormData(form);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        form.reset();
        toast?.classList.add('show');
        setTimeout(() => toast?.classList.remove('show'), 3000);
      } else {
        error?.classList.add('show');
        setTimeout(() => error?.classList.remove('show'), 5000);
      }
    } catch (err) {
      error?.classList.add('show');
      setTimeout(() => error?.classList.remove('show'), 5000);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

/* --- Resume Modal --- */
function initResumeModal() {
  const btn = document.getElementById('resume-btn');
  const modal = document.getElementById('resume-modal');
  const closeBtn = document.getElementById('resume-close');
  const frame = document.getElementById('resume-frame');

  if (!btn || !modal || !frame) return;

  const resumePath = 'resume/Hima_Nagi_Reddy_Resume.pdf';

  function openModal() {
    frame.src = resumePath;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    frame.src = '';
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
}

/* --- Generic Document Modal (used for research, etc.) --- */
function initDocModal() {
  const triggers = document.querySelectorAll('.doc-trigger');
  const modal = document.getElementById('doc-modal');
  const closeBtn = document.getElementById('doc-close');
  const frame = document.getElementById('doc-frame');
  const downloadLink = document.getElementById('doc-download');
  const newTabLink = document.getElementById('doc-newtab');
  const title = document.getElementById('doc-modal-title');

  if (!triggers.length || !modal || !frame) return;

  function openModal(path, label) {
    frame.src = path;
    downloadLink.href = path;
    newTabLink.href = path;
    if (title) title.textContent = label || 'Document';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    frame.src = '';
    document.body.style.overflow = '';
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const path = trigger.getAttribute('data-doc');
      const label = trigger.textContent.replace('→', '').trim();
      openModal(path, label);
    });
  });

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
}
