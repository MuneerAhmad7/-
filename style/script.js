/**
 * Madrassa Darul Falah Chota Lahor Swabi - Client-Side JavaScript
 * Dual-Language Toggle Engine (English / Urdu RTL)
 * Interactive Navigation Drawer, Number Counters, & Review Filtering
 */

document.addEventListener('DOMContentLoaded', () => {
  initLanguageEngine();
  initMobileNavigation();
  initAnimatedCounters();
  initReviewTabFilters();
  initFormHandlers();
});

/* --------------------------------------------------------------------------
   1. Dual Language Engine (English / Urdu RTL + Persistence)
   -------------------------------------------------------------------------- */
function initLanguageEngine() {
  const langToggleBtn = document.getElementById('langToggleBtn');
  const savedLang = localStorage.getItem('madrassa_lang') || 'en';

  // Apply saved language setting on load
  setLanguage(savedLang);

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const currentLang = document.documentElement.getAttribute('lang') || 'en';
      const newLang = currentLang === 'en' ? 'ur' : 'en';
      setLanguage(newLang);
      localStorage.setItem('madrassa_lang', newLang);
    });
  }
}

function setLanguage(lang) {
  const htmlEl = document.documentElement;
  
  if (lang === 'ur') {
    htmlEl.setAttribute('lang', 'ur');
    htmlEl.setAttribute('dir', 'rtl');
  } else {
    htmlEl.setAttribute('lang', 'en');
    htmlEl.setAttribute('dir', 'ltr');
  }

  // Update Toggle Button Labels
  const btnEnText = document.querySelector('.btn-lang-text-en');
  const btnUrText = document.querySelector('.btn-lang-text-ur');
  if (btnEnText && btnUrText) {
    if (lang === 'ur') {
      btnEnText.style.display = 'inline';
      btnUrText.style.display = 'none';
    } else {
      btnEnText.style.display = 'none';
      btnUrText.style.display = 'inline';
    }
  }
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation Toggle Drawer
   -------------------------------------------------------------------------- */
function initMobileNavigation() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navbarMenu = document.getElementById('navbarMenu');

  if (mobileToggle && navbarMenu) {
    mobileToggle.addEventListener('click', () => {
      navbarMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileToggle.contains(e.target) && !navbarMenu.contains(e.target)) {
        navbarMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      }
    });
  }
}

/* --------------------------------------------------------------------------
   3. Animated Number Counter (Intersection Observer)
   -------------------------------------------------------------------------- */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (counters.length === 0) return;

  const observerOptions = {
    threshold: 0.5
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // 2 seconds
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = target / steps;

        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.innerText = target.toLocaleString() + '+';
            clearInterval(timer);
          } else {
            counter.innerText = Math.ceil(current).toLocaleString() + '+';
          }
        }, stepTime);

        observer.unobserve(counter);
      }
    });
  }, observerOptions);

  counters.forEach(counter => counterObserver.observe(counter));
}

/* --------------------------------------------------------------------------
   4. Scholar & Community Reviews Filter Engine
   -------------------------------------------------------------------------- */
function initReviewTabFilters() {
  const tabBtns = document.querySelectorAll('.reviews-tabs .tab-btn');
  const reviewCards = document.querySelectorAll('.review-card');

  if (tabBtns.length === 0 || reviewCards.length === 0) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      reviewCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. Interactive Form Handlers
   -------------------------------------------------------------------------- */
function initFormHandlers() {
  const contactForm = document.getElementById('contactForm');
  const admissionForm = document.getElementById('admissionForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const lang = document.documentElement.getAttribute('lang');
      const msg = lang === 'ur' 
        ? 'شکریہ! آپ کا پیغام کامیابی کے ساتھ ارسال کر دیا گیا ہے۔ انتظامیہ جلد آپ سے رابطہ کرے گی۔' 
        : 'Thank you! Your message has been sent successfully. Administration will respond shortly.';
      alert(msg);
      contactForm.reset();
    });
  }

  if (admissionForm) {
    admissionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const lang = document.documentElement.getAttribute('lang');
      const msg = lang === 'ur'
        ? 'مبارک ہو! آپ کا آن لائن داخلہ فارم موصول ہو گیا ہے۔ برائے مہربانی دستاویزات کے ساتھ مدرسہ تشریف لائیں۔'
        : 'Success! Your online admission form has been received. Please visit campus with documents.';
      alert(msg);
      admissionForm.reset();
    });
  }
}
