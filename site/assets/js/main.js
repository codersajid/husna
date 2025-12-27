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

// Client-side routing for smooth navigation
class SmoothRouter {
  constructor() {
    this.currentPage = window.location.pathname;
    this.init();
  }

  init() {
    // Handle navigation clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      
      const href = link.getAttribute('href');
      
      // Skip external links, anchors, and special links
      if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }
      
      // Only handle internal HTML pages
      if (href.endsWith('.html')) {
        e.preventDefault();
        this.navigate(href);
      }
    });

    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.page) {
        this.loadPage(e.state.page, false);
      }
    });
  }

  async navigate(page) {
    // Show loading state
    this.showLoading();
    
    try {
      await this.loadPage(page, true);
    } catch (error) {
      console.error('Navigation failed:', error);
      // Fallback to regular navigation
      window.location.href = page;
    }
  }

  async loadPage(page, pushState = true) {
    const response = await fetch(page);
    if (!response.ok) throw new Error('Page not found');
    
    const html = await response.text();
    
    // Parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Update the page content
    const newMain = doc.querySelector('main');
    const currentMain = document.querySelector('main');
    
    if (newMain && currentMain) {
      currentMain.innerHTML = newMain.innerHTML;
      
      // Update page title
      const newTitle = doc.querySelector('title');
      if (newTitle) {
        document.title = newTitle.textContent;
      }
      
      // Update active nav state
      this.updateActiveNav(page);
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Re-initialize page-specific functionality
      this.reinitPage();
      
      // Update browser history
      if (pushState) {
        history.pushState({ page }, '', page);
      }
      
      this.currentPage = page;
    }
    
    this.hideLoading();
  }

  updateActiveNav(currentPage) {
    // Remove active states
    document.querySelectorAll('nav a').forEach(link => {
      link.classList.remove('text-brandOrange', 'font-semibold');
      link.classList.add('text-black/70');
    });
    
    // Add active state to current page
    const pageName = currentPage.split('/').pop().replace('.html', '');
    const activeLink = document.querySelector(`nav a[href="${currentPage}"], nav a[href="${pageName}.html"]`);
    
    if (activeLink) {
      activeLink.classList.remove('text-black/70');
      activeLink.classList.add('text-brandOrange', 'font-semibold');
    }
  }

  showLoading() {
    // Show a subtle loading indicator
    const loader = document.createElement('div');
    loader.id = 'nav-loader';
    loader.className = 'fixed top-0 left-0 right-0 h-1 bg-brandOrange z-50';
    loader.innerHTML = '<div class="h-full bg-brandOrange animate-pulse"></div>';
    document.body.appendChild(loader);
  }

  hideLoading() {
    const loader = document.getElementById('nav-loader');
    if (loader) {
      loader.remove();
    }
  }

  reinitPage() {
    // Re-initialize reveal animations
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

    // Re-initialize other components
    initBackToTop();
    initContactForm();
    initSliders();
  }
}

// Initialize functions for re-use
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    const toggleBtn = () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.remove('hidden');
      } else {
        backToTopBtn.classList.add('hidden');
      }
    };

    window.addEventListener('scroll', toggleBtn);
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    toggleBtn();
  }
}

function initContactForm() {
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      contactForm.classList.add('form-loading');
      
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());
      
      try {
        const response = await fetch('send_quote.php', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          alert('Thank you for your inquiry! We will contact you soon.');
          contactForm.reset();
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        alert('There was an error sending your request. Please call us directly at +91-9113311263 or email husnaengconst@outlook.com');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        contactForm.classList.remove('form-loading');
      }
    });
  }
}

function initSliders() {
  // Hero slider
  const heroSlider = document.querySelector('[data-hero-slider]');
  if (heroSlider) {
    const slides = Array.from(heroSlider.querySelectorAll('[data-slide]'));
    const dots = Array.from(heroSlider.querySelectorAll('[data-dot]'));
    const prevBtn = heroSlider.querySelector('[data-prev]');
    const nextBtn = heroSlider.querySelector('[data-next]');
    let currentSlide = 0;
    let interval;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('opacity-25', i === index);
        slide.classList.toggle('opacity-0', i !== index);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('bg-white', i === index);
        dot.classList.toggle('bg-white/40', i !== index);
      });
      currentSlide = index;
    };

    const nextSlide = () => {
      showSlide((currentSlide + 1) % slides.length);
    };

    const prevSlide = () => {
      showSlide((currentSlide - 1 + slides.length) % slides.length);
    };

    const startAutoPlay = () => {
      const intervalMs = parseInt(heroSlider.dataset.intervalMs) || 5000;
      interval = setInterval(nextSlide, intervalMs);
    };

    const stopAutoPlay = () => {
      clearInterval(interval);
    };

    prevBtn?.addEventListener('click', () => {
      prevSlide();
      stopAutoPlay();
      startAutoPlay();
    });

    nextBtn?.addEventListener('click', () => {
      nextSlide();
      stopAutoPlay();
      startAutoPlay();
    });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        showSlide(i);
        stopAutoPlay();
        startAutoPlay();
      });
    });

    showSlide(0);
    startAutoPlay();
  }

  // Testimonial slider
  const testimonialSlider = document.querySelector('[data-testimonial-slider]');
  if (testimonialSlider) {
    const slides = Array.from(testimonialSlider.querySelectorAll('[data-slide]'));
    const dots = Array.from(testimonialSlider.querySelectorAll('[data-dot]'));
    let currentSlide = 0;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('opacity-100', i === index);
        slide.classList.toggle('opacity-0', i !== index);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('bg-brandOrange', i === index);
        dot.classList.toggle('bg-brandGray', i !== index);
      });
      currentSlide = index;
    };

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => showSlide(i));
    });

    showSlide(0);
  }
}

// Initialize smooth routing
const router = new SmoothRouter();

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

// Initialize all components on page load
document.addEventListener('DOMContentLoaded', () => {
  initBackToTop();
  initContactForm();
  initSliders();
});
