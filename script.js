/**
 * Madrassa Darul Falah Chota Lahor - Main Script
 * Handles Dual Language Switching (English / Urdu), RTL adjustments,
 * Navbar Toggle, Review Category Filtering, Form Interactions, and Persistent Storage.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Language Initialization
    const savedLang = localStorage.getItem('site_language') || 'en';
    setLanguage(savedLang);

    // 2. Mobile Navigation Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const mainNav = document.getElementById('main-nav');

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });
    }

    // 3. Close mobile nav on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            }
        });
    });

    // 4. Smooth Active Navigation Highlight on Scroll
    window.addEventListener('scroll', highlightNavOnScroll);
});

/**
 * Switch Site Language between English ('en') and Urdu ('ur')
 * @param {string} lang - 'en' or 'ur'
 */
function setLanguage(lang) {
    const htmlElem = document.documentElement;

    // Set HTML lang & dir attributes
    if (lang === 'ur') {
        htmlElem.setAttribute('lang', 'ur');
        htmlElem.setAttribute('dir', 'rtl');
    } else {
        htmlElem.setAttribute('lang', 'en');
        htmlElem.setAttribute('dir', 'ltr');
    }

    // Save choice in localStorage
    localStorage.setItem('site_language', lang);

    // Update active button state
    const btnEn = document.getElementById('btn-en');
    const btnUr = document.getElementById('btn-ur');

    if (btnEn && btnUr) {
        if (lang === 'en') {
            btnEn.classList.add('active');
            btnUr.classList.remove('active');
        } else {
            btnUr.classList.add('active');
            btnEn.classList.remove('active');
        }
    }

    // Update Image Alt Attributes if available
    document.querySelectorAll('img[data-lang-alt-en]').forEach(img => {
        const altText = lang === 'ur' ? img.getAttribute('data-lang-alt-ur') : img.getAttribute('data-lang-alt-en');
        if (altText) {
            img.setAttribute('alt', altText);
        }
    });

    console.log(`[Darul Falah Website] Language updated to: ${lang.toUpperCase()}`);
}

/**
 * Filter Review Cards by Category
 * @param {string} category - 'all', 'scholars', 'elders', 'parents', 'alumni'
 */
function filterReviews(category) {
    const reviewCards = document.querySelectorAll('.review-card');
    const tabBtns = document.querySelectorAll('.review-tab-btn');

    // Update Active Tab Button State
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(category)) {
            btn.classList.add('active');
        }
    });

    // Show/Hide Cards
    reviewCards.forEach(card => {
        if (category === 'all' || card.classList.contains(`category-${category}`)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Highlight Navigation Links based on Current Scroll Position
 */
function highlightNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 120;
        const sectionId = current.getAttribute('id');
        const navLink = document.querySelector(`.main-nav a[href*="${sectionId}"]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.main-nav a').forEach(a => a.classList.remove('active'));
                navLink.classList.add('active');
            }
        }
    });
}

/**
 * Handle Contact Form Submission Simulation
 */
function handleFormSubmit() {
    const formAlert = document.getElementById('formAlert');
    const currentLang = localStorage.getItem('site_language') || 'en';

    const successMsgEn = "Thank you! Your message has been received successfully. Our administrative team will contact you shortly.";
    const successMsgUr = "شکریہ! آپ کا پیغام کامیابی کے ساتھ موصول ہو گیا ہے۔ ہماری انتظامیہ جلد آپ سے رابطہ کرے گی۔";

    if (formAlert) {
        formAlert.classList.remove('hidden');
        formAlert.classList.add('success');
        formAlert.textContent = currentLang === 'ur' ? successMsgUr : successMsgEn;

        // Reset form after submit
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.reset();
        }

        // Hide alert after 6 seconds
        setTimeout(() => {
            formAlert.classList.add('hidden');
        }, 6000);
    }
}
