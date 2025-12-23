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
