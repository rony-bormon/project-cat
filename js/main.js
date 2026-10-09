/**
 * MAJESTIC MAINE COON CATS - INTERACTIVE SCRIPTS
 * Plain Vanilla JavaScript with clean event-driven architecture
 */

// Immediate execution to prevent flash of wrong theme (FOUC)
(() => {
  const savedTheme = localStorage.getItem('mmc_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
})();

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initHeaderScroll();
  initMobileMenu();
  initScrollProgressBar();
  initScrollReveal();
  initCountUp();
  initQuickViewModal();
  initLightbox();
  initAccordion();
  initKittenFilters();
  initMultiStepForm();
  initBackToTop();
  initTestimonialsSlider();
});

/* ==========================================================================
   1. Theme Toggle (Dark Luxe default, remembers user preference)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtns = document.querySelectorAll('#themeToggleBtn, .theme-toggle-btn');
  if (!toggleBtns.length) return;

  const updateToggleUI = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mmc_theme', theme);
  };

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      updateToggleUI(nextTheme);
    });
  });
}

/* ==========================================================================
   2. Header Scroll & Navbar Glassmorphism
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let lastScrollY = window.scrollY || window.pageYOffset;
  const scrollThreshold = 100; // minimum scroll before behavior begins
  const deltaThreshold = 5;    // minimum delta to avoid tiny jitter

  const handleScroll = () => {
    const currentScrollY = window.scrollY || window.pageYOffset;

    // When at the very top of page
    if (currentScrollY <= 40) {
      header.classList.remove('header-hidden', 'header-sticky', 'is-sticky', 'scrolled');
      lastScrollY = currentScrollY;
      return;
    }

    const delta = currentScrollY - lastScrollY;

    // Only react if scroll distance is greater than jitter threshold
    if (Math.abs(delta) > deltaThreshold) {
      if (delta > 0 && currentScrollY > scrollThreshold) {
        // Scrolling DOWN -> Hide header
        header.classList.add('header-hidden');
        header.classList.remove('header-sticky', 'is-sticky');
      } else if (delta < 0) {
        // Scrolling UP -> Reveal sticky header with glassmorphism
        header.classList.remove('header-hidden');
        header.classList.add('header-sticky', 'is-sticky', 'scrolled');
      }
    }

    lastScrollY = currentScrollY;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   3. Mobile Drawer & Accordion Submenus
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileToggleBtn');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('mobileBackdrop');
  if (!toggleBtn || !drawer || !backdrop) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', () => {
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  backdrop.addEventListener('click', closeDrawer);

  // Mobile Accordion Sub-items
  const submenuToggles = drawer.querySelectorAll('.mobile-has-submenu > a');
  submenuToggles.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = item.parentElement;
      const sub = parent.querySelector('.mobile-submenu');
      if (sub) {
        sub.classList.toggle('open');
      }
    });
  });
}

/* ==========================================================================
   4. Reading Scroll Progress Bar
   ========================================================================== */
function initScrollProgressBar() {
  const bar = document.getElementById('scrollProgressBar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const progress = (window.scrollY / totalHeight) * 100;
    bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }, { passive: true });
}

/* ==========================================================================
   5. Scroll Reveal with IntersectionObserver
   ========================================================================== */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal-on-scroll');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(t => observer.observe(t));
}

/* ==========================================================================
   6. Animated Count Up for Trust Indicators
   ========================================================================== */
function initCountUp() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetVal = parseInt(el.getAttribute('data-counter'), 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        let startVal = 0;
        const duration = 1600;
        const stepTime = 20;
        const totalSteps = duration / stepTime;
        const increment = targetVal / totalSteps;

        const timer = setInterval(() => {
          startVal += increment;
          if (startVal >= targetVal) {
            el.textContent = `${prefix}${targetVal}${suffix}`;
            clearInterval(timer);
          } else {
            el.textContent = `${prefix}${Math.floor(startVal)}${suffix}`;
          }
        }, stepTime);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(c => observer.observe(c));
}

/* ==========================================================================
   7. Quick View Modal for Kitten Cards
   ========================================================================== */
function initQuickViewModal() {
  const modal = document.getElementById('kittenQuickViewModal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.modal-close-btn');
  const nameEl = modal.querySelector('#modalKittenName');
  const detailsEl = modal.querySelector('#modalKittenDetails');
  const priceEl = modal.querySelector('#modalKittenPrice');
  const imgEl = modal.querySelector('#modalKittenImg');
  const applyBtn = modal.querySelector('#modalApplyBtn');

  document.querySelectorAll('[data-kitten-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.kitten-card') || btn.closest('[data-kitten-data]');
      if (!card) return;

      const name = card.dataset.name || 'Maine Coon Kitten';
      const color = card.dataset.color || 'European Lineage';
      const gender = card.dataset.gender || 'Companion';
      const status = card.dataset.status || 'Available';
      const price = card.dataset.price || '$3,200';
      const parents = card.dataset.parents || 'TICA & CFA Registered Champion Parents';
      const img = card.dataset.img || card.querySelector('img')?.src || '';

      if (nameEl) nameEl.textContent = name;
      if (detailsEl) detailsEl.innerHTML = `<strong>Color & Gender:</strong> ${color} (${gender})<br><strong>Status:</strong> ${status}<br><strong>Parents:</strong> ${parents}`;
      if (priceEl) priceEl.textContent = price;
      if (imgEl && img) imgEl.src = img;
      if (applyBtn) applyBtn.href = `application-form.html?kitten=${encodeURIComponent(name)}`;

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
}

/* ==========================================================================
   8. Accessible Lightbox for Galleries
   ========================================================================== */
function initLightbox() {
  const lightbox = document.getElementById('accessibleLightbox');
  if (!lightbox) return;

  const imgEl = lightbox.querySelector('.lightbox-img');
  const captionEl = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.modal-close-btn');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  let counterEl = lightbox.querySelector('.lightbox-counter');

  // Dynamically insert counter badge if not already in markup
  if (!counterEl && captionEl) {
    counterEl = document.createElement('div');
    counterEl.className = 'lightbox-counter';
    captionEl.parentNode.insertBefore(counterEl, captionEl);
  }

  let galleryItems = [];
  let currentIndex = 0;
  let lastActiveElement = null;

  // Preload helper for instant transitions
  const preloadImage = (url) => {
    if (!url) return;
    const img = new Image();
    img.src = url;
  };

  const updateLightbox = (index) => {
    if (!galleryItems || galleryItems.length === 0) return;

    // Circular looping
    if (index < 0) index = galleryItems.length - 1;
    if (index >= galleryItems.length) index = 0;
    currentIndex = index;

    const currentItem = galleryItems[currentIndex];
    const imgSrc = currentItem.getAttribute('data-full') || currentItem.querySelector('img')?.src;
    const caption = currentItem.getAttribute('data-caption') || currentItem.querySelector('img')?.alt || '';

    // Smooth subtle crossfade
    if (imgEl) {
      imgEl.classList.add('fade-out');
      setTimeout(() => {
        imgEl.src = imgSrc;
        imgEl.alt = caption;
        imgEl.classList.remove('fade-out');
      }, 140);
    }

    if (captionEl) {
      captionEl.textContent = caption;
    }

    // Update Counter badge (e.g. 1 / 10)
    if (counterEl) {
      if (galleryItems.length > 1) {
        counterEl.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
        counterEl.style.display = 'inline-block';
      } else {
        counterEl.style.display = 'none';
      }
    }

    // Toggle navigation button visibility if only 1 item in gallery
    const hasMultiple = galleryItems.length > 1;
    if (prevBtn) prevBtn.style.display = hasMultiple ? 'flex' : 'none';
    if (nextBtn) nextBtn.style.display = hasMultiple ? 'flex' : 'none';

    // Preload adjacent images for instantaneous next/previous clicks
    if (hasMultiple) {
      const nextIdx = (currentIndex + 1) % galleryItems.length;
      const prevIdx = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      const nextSrc = galleryItems[nextIdx].getAttribute('data-full') || galleryItems[nextIdx].querySelector('img')?.src;
      const prevSrc = galleryItems[prevIdx].getAttribute('data-full') || galleryItems[prevIdx].querySelector('img')?.src;
      preloadImage(nextSrc);
      preloadImage(prevSrc);
    }
  };

  const openLightbox = (items, startIndex, triggerEl) => {
    galleryItems = items;
    lastActiveElement = triggerEl || document.activeElement;
    updateLightbox(startIndex);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lightbox.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  };

  // 1. Grouped galleries with [data-gallery-group]
  document.querySelectorAll('[data-gallery-group]').forEach(group => {
    const items = Array.from(group.querySelectorAll('.gallery-item, .cattery-gallery-item, .certificate-card, [data-lightbox]'));
    items.forEach((item, idx) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(items, idx, item);
      });
      // Keyboard Enter / Space support
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', item.getAttribute('data-caption') || 'View image full size');
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(items, idx, item);
        }
      });
    });
  });

  // 2. Standalone [data-lightbox] items outside any [data-gallery-group]
  document.querySelectorAll('[data-lightbox]').forEach(item => {
    if (item.closest('[data-gallery-group]')) return;
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const allStandalone = Array.from(document.querySelectorAll('[data-lightbox]')).filter(el => !el.closest('[data-gallery-group]'));
      const idx = allStandalone.indexOf(item);
      openLightbox(allStandalone, idx >= 0 ? idx : 0, item);
    });
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', item.getAttribute('data-caption') || 'View image full size');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const allStandalone = Array.from(document.querySelectorAll('[data-lightbox]')).filter(el => !el.closest('[data-gallery-group]'));
        const idx = allStandalone.indexOf(item);
        openLightbox(allStandalone, idx >= 0 ? idx : 0, item);
      }
    });
  });

  // Close & navigation button listeners
  if (closeBtn) closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });
  if (prevBtn) prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    updateLightbox(currentIndex - 1);
  });
  if (nextBtn) nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    updateLightbox(currentIndex + 1);
  });

  // Click outside image on backdrop closes modal
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('modal-backdrop')) {
      closeLightbox();
    }
  });

  // Keyboard navigation: Left/Right arrows and Escape
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      updateLightbox(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      updateLightbox(currentIndex + 1);
    }
  });

  // Mobile / Tablet Touch Swipe gestures
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Horizontal swipe threshold: 45px
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        updateLightbox(currentIndex + 1); // Swiped Left -> Next Image
      } else {
        updateLightbox(currentIndex - 1); // Swiped Right -> Previous Image
      }
    } else if (deltaY > 90 && Math.abs(deltaY) > Math.abs(deltaX)) {
      // Swiped down -> Close lightbox
      closeLightbox();
    }
  }, { passive: true });
}

/* ==========================================================================
   9. Accessible Accordion with Live Search
   ========================================================================== */
function initAccordion() {
  const accordions = document.querySelectorAll('.accordion');
  accordions.forEach(acc => {
    const items = acc.querySelectorAll('.accordion-item');
    items.forEach(item => {
      const header = item.querySelector('.accordion-header');
      if (!header) return;
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close others in same accordion
        items.forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    });
  });

  // Optional Live Search Filter for FAQ
  const searchInput = document.getElementById('faqSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      document.querySelectorAll('.accordion-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
}

/* ==========================================================================
   10. Kitten Filter Chips & Sorter (Available Kittens page)
   ========================================================================== */
function initKittenFilters() {
  const filterChips = document.querySelectorAll('.filter-chips .chip');
  const cards = document.querySelectorAll('.kitten-card');
  const sortSelect = document.getElementById('kittenSortSelect');
  if (!filterChips.length || !cards.length) return;

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.getAttribute('data-filter') || 'all';

      cards.forEach(card => {
        const gender = (card.getAttribute('data-gender') || '').toLowerCase();
        const status = (card.getAttribute('data-status') || '').toLowerCase();
        const color = (card.getAttribute('data-color') || '').toLowerCase();
        const pattern = (card.getAttribute('data-pattern') || '').toLowerCase();

        let match = false;
        if (filter === 'all') {
          match = true;
        } else if (filter === 'available') {
          match = status.includes('available') || status.includes('ready now') || !status.includes('reserved');
        } else if (filter === 'reserved') {
          match = status.includes('reserved');
        } else if (filter === 'ready') {
          match = status.includes('ready now') || status.includes('ready');
        } else if (filter === 'female') {
          match = gender.includes('female');
        } else if (filter === 'male') {
          match = gender.includes('male');
        } else if (filter === 'smoke') {
          match = color.includes('smoke') || pattern.includes('smoke') || color.includes('shaded');
        } else if (filter === 'tabby') {
          match = color.includes('tabby') || pattern.includes('tabby');
        }

        card.style.display = match ? '' : 'none';
      });

      // Update visibility of litter sections if all cards inside are hidden
      document.querySelectorAll('.litter-section').forEach(sec => {
        const secCards = sec.querySelectorAll('.kitten-card');
        if (secCards.length > 0) {
          const anyVisible = Array.from(secCards).some(c => c.style.display !== 'none');
          sec.style.display = anyVisible ? '' : 'none';
        }
      });
    });
  });

  // Mini thumbnail switcher on kitten cards
  document.querySelectorAll('.kitten-card').forEach(card => {
    const mainImg = card.querySelector('.kitten-thumb');
    const miniThumbs = card.querySelectorAll('.mini-photo-thumb');
    if (!mainImg || !miniThumbs.length) return;

    miniThumbs.forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        e.stopPropagation();
        miniThumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        mainImg.src = thumb.src;
        mainImg.alt = thumb.alt || mainImg.alt;
        const mainLightbox = card.querySelector('[data-lightbox]');
        if (mainLightbox) {
          mainLightbox.setAttribute('data-full', thumb.getAttribute('data-full') || thumb.src);
        }
      });
    });
  });

  // Special Placement (Eira) Gallery Slider with auto-play, prev/next controls, dots, and lightbox
  const eiraGallery = document.getElementById('eiraPlacementGallery');
  if (eiraGallery) {
    const mainPhotoWrap = document.getElementById('eiraMainPhotoWrap');
    const mainPhoto = document.getElementById('eiraMainPhoto');
    const dots = Array.from(eiraGallery.querySelectorAll('#eiraSliderDots .dot'));
    const prevBtn = document.getElementById('eiraSlidePrev');
    const nextBtn = document.getElementById('eiraSlideNext');

    const eiraPhotos = [
      {
        src: 'images/eira-pale-black-silver.webp',
        caption: 'Eira, pale black silver Maine Coon female, available now at Majestic Maine Coon Cats in Canton, Georgia'
      },
      {
        src: 'images/IMG_5195.webp',
        caption: 'Eira · Soft fluffy fur and majestic look'
      },
      {
        src: 'images/IMG_4477.webp',
        caption: 'Eira · Posing gracefully as a kitten'
      }
    ];

    let currentIndex = 0;
    let autoPlayTimer = null;

    const showSlide = (idx) => {
      currentIndex = (idx + eiraPhotos.length) % eiraPhotos.length;
      const photo = eiraPhotos[currentIndex];

      if (mainPhoto && photo.src) {
        mainPhoto.src = photo.src;
        mainPhoto.alt = photo.caption;
      }
      if (mainPhotoWrap) {
        mainPhotoWrap.setAttribute('data-full', photo.src);
        mainPhotoWrap.setAttribute('data-caption', photo.caption);
      }

      dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
    };

    // Dot click
    dots.forEach((dot, i) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        showSlide(i);
        resetAutoPlay();
      });
    });

    // Prev / Next button clicks
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showSlide(currentIndex - 1);
        resetAutoPlay();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showSlide(currentIndex + 1);
        resetAutoPlay();
      });
    }

    // Auto-slide functionality (every 4.5s)
    const startAutoPlay = () => {
      stopAutoPlay();
      autoPlayTimer = setInterval(() => {
        showSlide(currentIndex + 1);
      }, 4500);
    };

    const stopAutoPlay = () => {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
    };

    const resetAutoPlay = () => {
      stopAutoPlay();
      startAutoPlay();
    };

    // Pause auto-slide when hovering over the gallery
    eiraGallery.addEventListener('mouseenter', stopAutoPlay);
    eiraGallery.addEventListener('mouseleave', startAutoPlay);

    // Initial start
    startAutoPlay();
  }
}

/* ==========================================================================
   11. Multi-Step Form with Live Validation
   ========================================================================== */
function initMultiStepForm() {
  const form = document.getElementById('adoptionApplicationForm');
  if (!form) return;

  const steps = form.querySelectorAll('.form-step-content');
  const progressFill = document.getElementById('stepProgressFill');
  const stepIndicators = form.querySelectorAll('.form-step-item');
  const nextBtns = form.querySelectorAll('[data-step-next]');
  const prevBtns = form.querySelectorAll('[data-step-prev]');
  const successState = document.getElementById('formSuccessState');
  let currentStep = 1;
  const totalSteps = steps.length;

  const updateStepView = (stepNum) => {
    steps.forEach((s, idx) => {
      s.style.display = (idx + 1 === stepNum) ? 'block' : 'none';
    });

    stepIndicators.forEach((ind, idx) => {
      if (idx + 1 < stepNum) {
        ind.classList.add('completed');
        ind.classList.remove('active');
      } else if (idx + 1 === stepNum) {
        ind.classList.add('active');
        ind.classList.remove('completed');
      } else {
        ind.classList.remove('active', 'completed');
      }
    });

    if (progressFill) {
      const percent = ((stepNum - 1) / (totalSteps - 1)) * 100;
      progressFill.style.width = `${percent}%`;
    }
  };

  const validateStep = (stepEl) => {
    let isValid = true;
    const requiredInputs = stepEl.querySelectorAll('[required]');
    requiredInputs.forEach(input => {
      const group = input.closest('.form-group');
      if (!input.value.trim()) {
        isValid = false;
        if (group) group.classList.add('has-error');
      } else {
        if (group) group.classList.remove('has-error');
      }
    });
    return isValid;
  };

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentStepEl = steps[currentStep - 1];
      if (validateStep(currentStepEl)) {
        if (currentStep < totalSteps) {
          currentStep++;
          updateStepView(currentStep);
        }
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateStepView(currentStep);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const currentStepEl = steps[currentStep - 1];
    if (validateStep(currentStepEl)) {
      form.style.display = 'none';
      if (successState) successState.style.display = 'block';
    }
  });

  updateStepView(1);
}

/* ==========================================================================
   12. Back To Top Button
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   13. Testimonials Carousel / Slider (Autoplay + Pause on hover)
   ========================================================================== */
function initTestimonialsSlider() {
  const slider = document.querySelector('.testimonials-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.testimonial-slide');
  if (slides.length <= 1) return;

  let current = 0;
  let interval;

  const showSlide = (idx) => {
    slides.forEach((s, i) => {
      s.style.display = (i === idx) ? 'block' : 'none';
    });
  };

  const nextSlide = () => {
    current = (current + 1) % slides.length;
    showSlide(current);
  };

  const startAuto = () => {
    interval = setInterval(nextSlide, 7000);
  };

  const stopAuto = () => {
    clearInterval(interval);
  };

  showSlide(0);
  startAuto();

  slider.addEventListener('mouseenter', stopAuto);
  slider.addEventListener('mouseleave', startAuto);
}

