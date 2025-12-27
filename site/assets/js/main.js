const mobileMenuBtn = document.querySelector('[data-mobile-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.getAttribute('data-open') === 'true';
    const nextOpen = !isOpen;
    mobileMenu.setAttribute('data-open', String(nextOpen));
    mobileMenu.classList.toggle('hidden', !nextOpen);
    mobileMenuBtn.setAttribute('aria-expanded', String(nextOpen));
  });
}

const revealEls = Array.from(document.querySelectorAll('[data-reveal]'));

if (revealEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.remove('opacity-0', 'translate-y-3');
        entry.target.classList.add('opacity-100', 'translate-y-0');
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.15 }
  );

  for (const el of revealEls) observer.observe(el);
}

const yearEl = document.querySelector('[data-year]');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const lightboxModal = document.querySelector('[data-lightbox-modal]');
if (lightboxModal) {
  const imgEl = lightboxModal.querySelector('[data-lightbox-image]');
  const captionEl = lightboxModal.querySelector('[data-lightbox-caption]');
  const closeEls = Array.from(lightboxModal.querySelectorAll('[data-lightbox-close]'));
  const openers = Array.from(document.querySelectorAll('[data-lightbox]'));
  let lastActiveEl;

  const open = (src, caption) => {
    if (!imgEl) return;
    lastActiveEl = document.activeElement;
    imgEl.src = src;
    imgEl.alt = caption || 'Gallery image';
    if (captionEl) captionEl.textContent = caption || '';
    lightboxModal.classList.remove('hidden');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('overflow-hidden');
  };

  const close = () => {
    if (!imgEl) return;
    lightboxModal.classList.add('hidden');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('overflow-hidden');
    imgEl.src = '';
    if (captionEl) captionEl.textContent = '';
    if (lastActiveEl && typeof lastActiveEl.focus === 'function') lastActiveEl.focus();
    lastActiveEl = undefined;
  };

  openers.forEach((a) =>
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const href = a.getAttribute('href') || '';
      const caption = a.getAttribute('data-caption') || '';
      open(href, caption);
    })
  );

  closeEls.forEach((el) => el.addEventListener('click', close));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.getAttribute('aria-hidden') === 'false') close();
  });
}

const testimonialSlider = document.querySelector('[data-testimonials-slider]');
if (testimonialSlider) {
  const slides = Array.from(testimonialSlider.querySelectorAll('[data-t-slide]'));
  const dots = Array.from(testimonialSlider.querySelectorAll('[data-t-dot]'));
  const prevBtn = testimonialSlider.querySelector('[data-t-prev]');
  const nextBtn = testimonialSlider.querySelector('[data-t-next]');
  const intervalMs = Number(testimonialSlider.getAttribute('data-interval-ms') || '6500');
  let idx = 0;
  let timerId;

  const setActive = (nextIdx) => {
    if (!slides.length) return;
    idx = (nextIdx + slides.length) % slides.length;

    slides.forEach((el, i) => {
      el.classList.toggle('hidden', i !== idx);
    });

    dots.forEach((el, i) => {
      el.classList.toggle('bg-brandNavy', i === idx);
      el.classList.toggle('bg-brandNavy/30', i !== idx);
    });
  };

  const stop = () => {
    if (timerId) window.clearInterval(timerId);
    timerId = undefined;
  };

  const start = () => {
    stop();
    if (slides.length <= 1) return;
    timerId = window.setInterval(() => setActive(idx + 1), intervalMs);
  };

  prevBtn?.addEventListener('click', () => {
    setActive(idx - 1);
    start();
  });
  nextBtn?.addEventListener('click', () => {
    setActive(idx + 1);
    start();
  });

  dots.forEach((d, i) =>
    d.addEventListener('click', () => {
      setActive(i);
      start();
    })
  );

  testimonialSlider.addEventListener('mouseenter', stop);
  testimonialSlider.addEventListener('mouseleave', start);
  testimonialSlider.addEventListener('focusin', stop);
  testimonialSlider.addEventListener('focusout', start);

  setActive(0);
  start();
}

const slider = document.querySelector('[data-hero-slider]');
if (slider) {
  const slides = Array.from(slider.querySelectorAll('[data-slide]'));
  const dots = Array.from(slider.querySelectorAll('[data-dot]'));
  const prevBtn = slider.querySelector('[data-prev]');
  const nextBtn = slider.querySelector('[data-next]');
  const intervalMs = Number(slider.getAttribute('data-interval-ms') || '4500');
  let idx = 0;
  let timerId;

  const setActive = (nextIdx) => {
    idx = (nextIdx + slides.length) % slides.length;

    slides.forEach((el, i) => {
      el.classList.toggle('opacity-100', i === idx);
      el.classList.toggle('opacity-0', i !== idx);
    });

    dots.forEach((el, i) => {
      el.classList.toggle('bg-white', i === idx);
      el.classList.toggle('bg-white/40', i !== idx);
    });
  };

  const stop = () => {
    if (timerId) window.clearInterval(timerId);
    timerId = undefined;
  };

  const start = () => {
    stop();
    if (slides.length <= 1) return;
    timerId = window.setInterval(() => setActive(idx + 1), intervalMs);
  };

  prevBtn?.addEventListener('click', () => {
    setActive(idx - 1);
    start();
  });
  nextBtn?.addEventListener('click', () => {
    setActive(idx + 1);
    start();
  });

  dots.forEach((d, i) =>
    d.addEventListener('click', () => {
      setActive(i);
      start();
    })
  );

  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);
  slider.addEventListener('focusin', stop);
  slider.addEventListener('focusout', start);

  setActive(0);
  start();
}

// Back to Top Button
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.remove('hidden');
    } else {
      backToTopBtn.classList.add('hidden');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Enhanced Form Submission with AJAX
const contactForm = document.querySelector('form[action="send_quote.php"]');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner inline-block mr-2"></span>Sending...';
    contactForm.classList.add('form-loading');
    
    const formData = new FormData(contactForm);
    
    try {
      const response = await fetch('send_quote.php', {
        method: 'POST',
        body: formData
      });
      
      const text = await response.text();
      
      if (response.ok) {
        // Show success message
        contactForm.innerHTML = `
          <div class="success-message text-center p-8">
            <svg class="mx-auto h-16 w-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <h3 class="mt-4 text-xl font-semibold text-brandGreen">Thank you for your inquiry!</h3>
            <p class="mt-2 text-black/70">We've received your request and will contact you within 24 hours.</p>
            <a href="index.html" class="mt-6 inline-flex items-center justify-center rounded-md bg-brandOrange px-6 py-3 text-sm font-semibold text-white hover:brightness-95">
              Back to Homepage
            </a>
          </div>
        `;
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      alert('There was an error sending your request. Please call us directly at +91-9113311263 or email husnaengconst@outlook.com');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      contactForm.classList.remove('form-loading');
    }
  });
}

// Page Load Animation
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 300);
  }
});
