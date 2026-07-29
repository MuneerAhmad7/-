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
  initAdminAuth();
  initAdminGalleryUpload();
  loadDynamicGalleryAndTicker();
  initStudentProfilePortal();
  initAdminResultsManagement();
  initResultsSearch();
  initXLSXUpload();
});

/* --------------------------------------------------------------------------
   0. Admin Authentication Engine (Hidden by default, Requires Login)
   -------------------------------------------------------------------------- */
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'darulfalah2026';

function initAdminAuth() {
  const isAuth = localStorage.getItem('madrassa_admin_auth') === 'true';

  if (isAuth) {
    document.body.classList.add('admin-authenticated');
  } else {
    document.body.classList.remove('admin-authenticated');
  }

  // Update UI Elements based on login state
  updateAdminUI(isAuth);

  // Attach Admin Login Forms
  const modalLoginForm = document.getElementById('adminModalLoginForm');
  const pageLoginForm = document.getElementById('adminPageLoginForm');
  const quickDemoBtns = document.querySelectorAll('.btn-quick-admin-demo');

  if (modalLoginForm) {
    modalLoginForm.addEventListener('submit', (e) => handleAdminLogin(e, modalLoginForm));
  }

  if (pageLoginForm) {
    pageLoginForm.addEventListener('submit', (e) => handleAdminLogin(e, pageLoginForm));
  }

  // Quick 1-Click Demo Login for Testing
  quickDemoBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.setItem('madrassa_admin_auth', 'true');
      document.body.classList.add('admin-authenticated');
      const isUr = document.documentElement.getAttribute('lang') === 'ur';
      alert(isUr ? 'ایڈمن لاگ ان کاملا فعال ہو گیا ہے۔' : 'Admin Login successfully activated!');
      window.location.href = window.location.pathname.includes('/sections/') ? 'admin-portal.html' : 'sections/admin-portal.html';
    });
  });

  // Attach Modal Toggles
  const loginModalBtn = document.getElementById('adminLoginTrigger');
  const modalBackdrop = document.getElementById('adminLoginModal');
  const modalClose = document.getElementById('modalCloseBtn');
  const logoutBtn = document.querySelectorAll('.adminLogoutBtn');

  if (loginModalBtn && modalBackdrop) {
    loginModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modalBackdrop.classList.add('active');
    });
  }

  if (modalClose && modalBackdrop) {
    modalClose.addEventListener('click', () => {
      modalBackdrop.classList.remove('active');
    });
  }

  logoutBtn.forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.removeItem('madrassa_admin_auth');
      document.body.classList.remove('admin-authenticated');
      const isUr = document.documentElement.getAttribute('lang') === 'ur';
      alert(isUr ? 'آپ لاگ آؤٹ ہو چکے ہیں۔' : 'You have logged out.');
      window.location.href = window.location.pathname;
    });
  });

  // Load Admin Data Tables if on admin-portal.html
  loadAdminPortalDashboard();
}

function handleAdminLogin(e, form) {
  return handleAdminLoginDirect(e, form);
}

window.handleAdminLoginDirect = function(e, form) {
  if (e && e.preventDefault) e.preventDefault();

  if (!form) {
    form = document.getElementById('adminPageLoginForm') || document.getElementById('adminModalLoginForm');
  }

  if (!form) return false;

  const userEl = form.querySelector('.admin-user-input') || 
                 form.querySelector('input[type="text"]') || 
                 document.getElementById('adminUserField');

  const passEl = form.querySelector('.admin-pass-input') || 
                 form.querySelector('input[type="password"]') || 
                 document.getElementById('adminPassField');

  const userInput = userEl ? userEl.value.trim() : '';
  const passInput = passEl ? passEl.value.trim() : '';

  // Get or create inline error container
  let errorBox = form.parentNode.querySelector('#adminLoginErrorDisplay') || form.querySelector('.admin-login-error-msg');
  if (!errorBox) {
    errorBox = document.createElement('div');
    errorBox.className = 'admin-login-error-msg';
    errorBox.style.cssText = 'background: #fee2e2; border: 2px solid #ef4444; color: #991b1b; padding: 0.9rem; border-radius: var(--radius-sm); margin-top: 1.2rem; font-size: 0.9rem; text-align: center; font-weight: 700;';
    form.appendChild(errorBox);
  }
  errorBox.style.display = 'none';

  const isUr = document.documentElement.getAttribute('lang') === 'ur';

  // 1. Check for empty username
  if (!userInput) {
    const reasonMsg = isUr 
      ? '❌ لاگ ان ناکام: برائے مہربانی اپنا یوزر نیم درج کریں۔ (یوزر نیم: admin)' 
      : '❌ Login Failed: Username field is empty. Please enter "admin".';
    errorBox.innerHTML = reasonMsg;
    errorBox.style.display = 'block';
    alert(reasonMsg);
    if (userEl) userEl.focus();
    return false;
  }

  // 2. Check for empty password
  if (!passInput) {
    const reasonMsg = isUr 
      ? '❌ لاگ ان ناکام: برائے مہربانی اپنا پاس ورڈ درج کریں۔ (پاس ورڈ: darulfalah2026)' 
      : '❌ Login Failed: Password field is empty. Please enter "darulfalah2026".';
    errorBox.innerHTML = reasonMsg;
    errorBox.style.display = 'block';
    alert(reasonMsg);
    if (passEl) passEl.focus();
    return false;
  }

  // 3. Check for incorrect username
  if (userInput.toLowerCase() !== ADMIN_USER.toLowerCase()) {
    const reasonMsg = isUr 
      ? `❌ لاگ ان ناکام: درج ذیل یوزر نیم ('${userInput}') غلط ہے۔ درست یوزر نیم 'admin' ہے۔` 
      : `❌ Login Failed: Invalid Username ('${userInput}'). Correct username is 'admin'.`;
    errorBox.innerHTML = reasonMsg;
    errorBox.style.display = 'block';
    alert(reasonMsg);
    if (userEl) userEl.focus();
    return false;
  }

  // 4. Check for incorrect password
  if (passInput !== ADMIN_PASS) {
    const reasonMsg = isUr 
      ? `❌ لاگ ان ناکام: پاس ورڈ غلط ہے! درج کردہ پاس ورڈ: '${passInput}'۔ درست پاس ورڈ 'darulfalah2026' ہے۔` 
      : `❌ Login Failed: Incorrect Password ('${passInput}'). Correct password is 'darulfalah2026'.`;
    errorBox.innerHTML = reasonMsg;
    errorBox.style.display = 'block';
    alert(reasonMsg);
    if (passEl) passEl.focus();
    return false;
  }

  // 5. Successful Authentication
  localStorage.setItem('madrassa_admin_auth', 'true');
  document.body.classList.add('admin-authenticated');
  
  const modalBackdrop = document.getElementById('adminLoginModal');
  if (modalBackdrop) modalBackdrop.classList.remove('active');

  updateAdminUI(true);

  const successMsg = isUr 
    ? '✓ مبارک ہو! ایڈمن لاگ ان کامیاب ہو گیا۔' 
    : '✓ Success! Admin Login successful.';
  
  alert(successMsg);
  window.location.href = window.location.pathname;
  return false;
};

function updateAdminUI(isAuth) {
  const uploadCard = document.getElementById('adminUploadCardSection');
  const lockCard = document.getElementById('adminLockCardSection');
  const adminTopLink = document.getElementById('adminPortalTopLink');
  const isSubdir = window.location.pathname.includes('/sections/');

  if (adminTopLink) {
    if (isAuth) {
      adminTopLink.href = isSubdir ? 'admin-dashboard.html' : 'sections/admin-dashboard.html';
      adminTopLink.innerHTML = `<i class="fa-solid fa-user-gear"></i> <span class="lang-en">Admin Dashboard</span><span class="lang-ur">ایڈمن ڈیش بورڈ</span>`;
      adminTopLink.style.borderColor = 'var(--gold)';
      adminTopLink.style.background = 'rgba(212, 175, 55, 0.2)';
    } else {
      adminTopLink.href = isSubdir ? 'admin-portal.html' : 'sections/admin-portal.html';
      adminTopLink.innerHTML = `<i class="fa-solid fa-lock"></i> <span class="lang-en">Admin Portal</span><span class="lang-ur">ایڈمن پورٹل</span>`;
    }
  }

  if (uploadCard && lockCard) {
    if (isAuth) {
      uploadCard.style.display = 'block';
      lockCard.style.display = 'none';
      document.body.classList.add('admin-session-active');
    } else {
      uploadCard.style.display = 'none';
      lockCard.style.display = 'block';
      document.body.classList.remove('admin-session-active');
    }
  }
}

function loadAdminPortalDashboard() {
  const studentsTableBody = document.getElementById('adminStudentsTableBody');
  const resultsTableBody = document.getElementById('adminResultsTableBody');

  // 1. Render Registered Students Table
  if (studentsTableBody) {
    const students = JSON.parse(localStorage.getItem('madrassa_student_profiles') || '[]');
    if (students.length === 0) {
      studentsTableBody.innerHTML = `<tr><td colspan="5" style="text-anchor: center;">کوئی نیا طالب علم رجسٹر نہیں ہوا۔ / No student registered yet.</td></tr>`;
    } else {
      let rowsHtml = '';
      students.forEach(s => {
        rowsHtml += `
          <tr>
            <td><strong>${s.rollNo}</strong></td>
            <td>${s.nameUr} (${s.nameEn})</td>
            <td>${s.fatherUr}</td>
            <td>${s.dept}</td>
            <td>${s.phone}</td>
          </tr>
        `;
      });
      studentsTableBody.innerHTML = rowsHtml;
    }
  }

  // 2. Render Published Results Table
  if (resultsTableBody) {
    const results = JSON.parse(localStorage.getItem('madrassa_exam_results') || '[]');
    if (results.length === 0) {
      resultsTableBody.innerHTML = `<tr><td colspan="5" style="text-anchor: center;">کوئی رزلٹ شائع نہیں ہوا۔ / No exam result published yet.</td></tr>`;
    } else {
      let rowsHtml = '';
      results.forEach(r => {
        rowsHtml += `
          <tr>
            <td><strong>${r.rollNo}</strong></td>
            <td>${r.nameUr}</td>
            <td>${r.dept}</td>
            <td>${r.marks}</td>
            <td><span class="grade-badge-mumtaz">${r.gradeUr}</span></td>
          </tr>
        `;
      });
      resultsTableBody.innerHTML = rowsHtml;
    }
  }
}

/* --------------------------------------------------------------------------
   6. Admin Gallery & Section Image Upload Engine (Delete + Target Sections)
   -------------------------------------------------------------------------- */
window.submitAdminPhotoUpload = function(e) {
  if (e && e.preventDefault) e.preventDefault();

  const fileInput = document.getElementById('photoFileInput');
  const previewImg = document.getElementById('imagePreviewImg');
  const titleUr = document.getElementById('photoTitleUr') ? document.getElementById('photoTitleUr').value.trim() : 'نئی تصویر';
  const titleEn = document.getElementById('photoTitleEn') ? document.getElementById('photoTitleEn').value.trim() : 'New Image';
  const category = document.getElementById('photoCategory') ? document.getElementById('photoCategory').value : 'campus';
  const targetSection = document.getElementById('targetSection') ? document.getElementById('targetSection').value : 'gallery';

  if (!fileInput || !fileInput.files || !fileInput.files[0]) {
    const isUr = document.documentElement.getAttribute('lang') === 'ur';
    alert(isUr ? 'برائے مہربانی اپ لوڈ کرنے کے لیے تصویر منتخب کریں۔' : 'Please select or drag an image file first.');
    return false;
  }

  const reader = new FileReader();
  reader.onload = (evt) => {
    const imageSrc = evt.target.result;
    const photoId = Date.now();
    const isSubdir = window.location.pathname.includes('/sections/');
    const linkPath = isSubdir ? `gallery.html?photoId=${photoId}` : `sections/gallery.html?photoId=${photoId}`;

    const newItem = {
      id: photoId,
      titleEn: titleEn,
      titleUr: titleUr,
      category: category,
      targetSection: targetSection,
      imageSrc: imageSrc,
      date: new Date().toLocaleDateString()
    };

    // 1. Save to Custom Gallery Array
    const existing = JSON.parse(localStorage.getItem('madrassa_custom_gallery') || '[]');
    existing.unshift(newItem);
    localStorage.setItem('madrassa_custom_gallery', JSON.stringify(existing));

    // 2. Save to Target Section Image Override
    const sectionMap = JSON.parse(localStorage.getItem('madrassa_section_images') || '{}');
    sectionMap[targetSection] = imageSrc;
    localStorage.setItem('madrassa_section_images', JSON.stringify(sectionMap));

    // 3. Auto Push Interconnected Announcement Ticker ("تازہ ترین خبر")
    const existingTicker = JSON.parse(localStorage.getItem('madrassa_custom_ticker') || '[]');
    existingTicker.unshift({
      id: photoId,
      textEn: `📸 New Photo Published: "${titleEn}" (${targetSection.toUpperCase()}) - View Photo`,
      textUr: `📸 تازہ ترین خبر: تصویر "${titleUr}" شائع کر دی گئی ہے - تصویر دیکھیں`,
      link: linkPath
    });
    localStorage.setItem('madrassa_custom_ticker', JSON.stringify(existingTicker));

    const isUr = document.documentElement.getAttribute('lang') === 'ur';
    alert(isUr 
      ? `مبارک ہو! تصویر کامیابی کے ساتھ "${targetSection}" سیکشن اور گیلری میں شائع ہو گئی ہے۔` 
      : `Photo successfully published to ${targetSection} section and main website!`);

    const form = document.getElementById('adminPhotoUploadForm');
    if (form) form.reset();
    if (previewImg) previewImg.style.display = 'none';
    
    // Dynamically apply images immediately
    applyCustomSectionImages();
    loadDynamicGalleryAndTicker();
  };
  reader.readAsDataURL(fileInput.files[0]);
  return false;
};

function deleteGalleryImage(id) {
  const isUr = document.documentElement.getAttribute('lang') === 'ur';
  if (!confirm(isUr ? 'کیا آپ اس تصویر کو حذف کرنا چاہتے ہیں؟' : 'Are you sure you want to delete this photo?')) {
    return;
  }

  let items = JSON.parse(localStorage.getItem('madrassa_custom_gallery') || '[]');
  items = items.filter(item => item.id !== id && item.id != id);
  localStorage.setItem('madrassa_custom_gallery', JSON.stringify(items));
  
  const el = document.getElementById(`custom-img-${id}`);
  if (el) el.remove();

  alert(isUr ? 'تصویر کامیابی سے حذف ہو گئی۔' : 'Photo deleted successfully.');
  loadDynamicGalleryAndTicker();
}

function applyCustomSectionImages() {
  const sectionMap = JSON.parse(localStorage.getItem('madrassa_section_images') || '{}');
  
  // 1. Hero Banner Background
  if (sectionMap.hero) {
    const heroBg = document.querySelector('.hero-section');
    if (heroBg) heroBg.style.backgroundImage = `linear-gradient(rgba(7, 59, 37, 0.82), rgba(3, 24, 15, 0.92)), url(${sectionMap.hero})`;
  }

  // 2. Department & Facilities Section Images
  Object.keys(sectionMap).forEach(key => {
    const elements = document.querySelectorAll(`[data-section-img="${key}"]`);
    elements.forEach(el => {
      if (el.tagName === 'IMG') {
        el.src = sectionMap[key];
      } else {
        el.style.backgroundImage = `url(${sectionMap[key]})`;
      }
    });
  });
}

function loadDynamicGalleryAndTicker() {
  // Apply section image overrides dynamically across website
  applyCustomSectionImages();

  // 1. Render custom photos into .gallery-grid
  const galleryGrid = document.querySelector('.gallery-grid');
  const customGallery = JSON.parse(localStorage.getItem('madrassa_custom_gallery') || '[]');
  const isAuth = localStorage.getItem('madrassa_admin_auth') === 'true';

  if (galleryGrid && customGallery.length > 0) {
    customGallery.forEach(item => {
      let itemEl = document.getElementById(`custom-img-${item.id}`);
      if (!itemEl) {
        itemEl = document.createElement('div');
        itemEl.className = 'gallery-item';
        itemEl.id = `custom-img-${item.id}`;
        itemEl.setAttribute('data-category', item.category);
        galleryGrid.prepend(itemEl);
      }

      const deleteBtnHtml = isAuth 
        ? `<button onclick="deleteGalleryImage(${item.id})" class="btn-delete-img" style="position: absolute; top: 10px; right: 10px; z-index: 10; background: #ef4444; color: #fff; border: none; padding: 0.35rem 0.7rem; border-radius: 4px; font-size: 0.78rem; cursor: pointer; font-weight:700;">
             <i class="fa-solid fa-trash"></i> Delete / حذف
           </button>` 
        : '';

      itemEl.innerHTML = `
        ${deleteBtnHtml}
        <img src="${item.imageSrc}" class="gallery-img" alt="${item.titleEn}">
        <div class="gallery-overlay">
          <h4 class="lang-en">${item.titleEn}</h4>
          <h4 class="lang-ur">${item.titleUr}</h4>
          <span style="font-size: 0.75rem; color: var(--gold-light); margin-top: 0.3rem;">Section: ${item.targetSection ? item.targetSection.toUpperCase() : 'GALLERY'}</span>
        </div>
      `;
    });
  }

  // 2. Check for URL deep linking (e.g. ?photoId=123)
  const urlParams = new URLSearchParams(window.location.search);
  const targetPhotoId = urlParams.get('photoId');
  if (targetPhotoId) {
    setTimeout(() => {
      const targetCard = document.getElementById(`custom-img-${targetPhotoId}`);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetCard.style.border = '4px solid var(--gold)';
        targetCard.style.boxShadow = '0 0 25px var(--gold)';
      }
    }, 400);
  }

  // 3. Render dynamic news items into Ticker Marquee ("تازہ ترین خبر")
  const tickerTextEn = document.querySelector('.ticker-text .lang-en');
  const tickerTextUr = document.querySelector('.ticker-text .lang-ur');
  const customTicker = JSON.parse(localStorage.getItem('madrassa_custom_ticker') || '[]');

  if (customTicker.length > 0) {
    let extraEn = '';
    let extraUr = '';

    customTicker.slice(0, 4).forEach(item => {
      extraEn += ` | <a href="${item.link}" style="color: var(--gold-light); font-weight:700; text-decoration: underline;">${item.textEn}</a>`;
      extraUr += ` | <a href="${item.link}" style="color: var(--gold-light); font-weight:700; text-decoration: underline;">${item.textUr}</a>`;
    });

    if (tickerTextEn && !tickerTextEn.innerHTML.includes('📸')) {
      tickerTextEn.innerHTML = extraEn + ' ' + tickerTextEn.innerHTML;
    }
    if (tickerTextUr && !tickerTextUr.innerHTML.includes('📸')) {
      tickerTextUr.innerHTML = extraUr + ' ' + tickerTextUr.innerHTML;
    }
  }
}

function initAdminGalleryUpload() {
  const form = document.getElementById('adminPhotoUploadForm');
  const dropzone = document.getElementById('imageDropzone');
  const fileInput = document.getElementById('photoFileInput');
  const previewImg = document.getElementById('imagePreviewImg');

  if (!fileInput) return;

  // Handle Drag and Drop Previews
  if (dropzone) {
    dropzone.addEventListener('click', (e) => {
      if (e.target.tagName !== 'INPUT') {
        fileInput.click();
      }
    });

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--gold-dark)';
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.style.borderColor = 'var(--gold)';
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--gold)';
      if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        handleFilePreview(fileInput.files[0]);
      }
    });
  }

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) {
      handleFilePreview(fileInput.files[0]);
    }
  });

  function handleFilePreview(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (previewImg) {
        previewImg.src = e.target.result;
        previewImg.style.display = 'block';
      }
    };
    reader.readAsDataURL(file);
  }

  if (form) {
    form.addEventListener('submit', (e) => submitAdminPhotoUpload(e));
  }
}

    const isUr = document.documentElement.getAttribute('lang') === 'ur';
    alert(isUr 
      ? 'مبارک ہو! تصویر گیلری میں شامل کر دی گئی ہے اور "تازہ ترین خبر" میں خودکار لنک تخلیق ہو گیا ہے۔' 
      : 'Success! Photo added to Gallery and automated link created in Latest Announcements News Ticker!');

    uploadForm.reset();
    if (previewImg) previewImg.style.display = 'none';
    currentImageData = null;

    // Refresh dynamic gallery display if on gallery page
    loadDynamicGalleryAndTicker();
  });
}

function loadDynamicGalleryAndTicker() {
  // Apply section image overrides
  applyCustomSectionImages();

  // 1. Render custom photos into .gallery-grid
  const galleryGrid = document.querySelector('.gallery-grid');
  const customGallery = JSON.parse(localStorage.getItem('madrassa_custom_gallery') || '[]');
  const isAuth = localStorage.getItem('madrassa_admin_auth') === 'true';

  if (galleryGrid && customGallery.length > 0) {
    customGallery.forEach(item => {
      // Check if already rendered
      let itemEl = document.getElementById(`custom-img-${item.id}`);
      if (!itemEl) {
        itemEl = document.createElement('div');
        itemEl.className = 'gallery-item';
        itemEl.id = `custom-img-${item.id}`;
        itemEl.setAttribute('data-category', item.category);
        galleryGrid.prepend(itemEl);
      }

      const deleteBtnHtml = isAuth 
        ? `<button onclick="deleteGalleryImage(${item.id})" class="btn-delete-img" style="position: absolute; top: 10px; right: 10px; z-index: 10; background: #ef4444; color: #fff; border: none; padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer;">
             <i class="fa-solid fa-trash"></i> Delete / حذف کریں
           </button>` 
        : '';

      itemEl.innerHTML = `
        ${deleteBtnHtml}
        <img src="${item.imageSrc}" class="gallery-img" alt="${item.titleEn}">
        <div class="gallery-overlay">
          <h4 class="lang-en">${item.titleEn}</h4>
          <h4 class="lang-ur">${item.titleUr}</h4>
          <span style="font-size: 0.75rem; color: var(--gold-light); margin-top: 0.3rem;">Target: ${item.targetSection || 'Gallery'}</span>
        </div>
      `;
    });
  }

  // 2. Render dynamic news items into Ticker Marquee ("تازہ ترین خبر")
  const tickerTextEn = document.querySelector('.ticker-text .lang-en');
  const tickerTextUr = document.querySelector('.ticker-text .lang-ur');
  const customTicker = JSON.parse(localStorage.getItem('madrassa_custom_ticker') || '[]');

  if (customTicker.length > 0) {
    let extraEn = '';
    let extraUr = '';

    customTicker.slice(0, 3).forEach(item => {
      extraEn += ` | <a href="${item.link}" style="color: var(--gold-light); font-weight:700;">${item.textEn}</a>`;
      extraUr += ` | <a href="${item.link}" style="color: var(--gold-light); font-weight:700;">${item.textUr}</a>`;
    });

    if (tickerTextEn && !tickerTextEn.innerHTML.includes('📸')) {
      tickerTextEn.innerHTML = extraEn + ' ' + tickerTextEn.innerHTML;
    }
    if (tickerTextUr && !tickerTextUr.innerHTML.includes('📸')) {
      tickerTextUr.innerHTML = extraUr + ' ' + tickerTextUr.innerHTML;
    }
  }
}

/* --------------------------------------------------------------------------
   7. Student Profile Creation Engine (Pre-Admission Registration)
   -------------------------------------------------------------------------- */
function initStudentProfilePortal() {
  const studentForm = document.getElementById('studentProfileForm');
  const profileCard = document.getElementById('studentProfileCard');

  if (!studentForm) return;

  studentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameUr = document.getElementById('stdNameUr').value.trim();
    const nameEn = document.getElementById('stdNameEn').value.trim();
    const fatherUr = document.getElementById('stdFatherUr').value.trim();
    const fatherEn = document.getElementById('stdFatherEn').value.trim();
    const cnic = document.getElementById('stdCnic').value.trim();
    const dept = document.getElementById('stdDept').value;
    const phone = document.getElementById('stdPhone').value.trim();

    // Auto-generate unique Roll Number
    const count = (JSON.parse(localStorage.getItem('madrassa_student_profiles') || '[]')).length + 1001;
    const rollNo = `MDF-2026-${count}`;

    const studentData = {
      id: Date.now(),
      rollNo: rollNo,
      nameUr: nameUr,
      nameEn: nameEn,
      fatherUr: fatherUr,
      fatherEn: fatherEn,
      cnic: cnic,
      dept: dept,
      phone: phone,
      regDate: new Date().toLocaleDateString()
    };

    // Save to LocalStorage
    const profiles = JSON.parse(localStorage.getItem('madrassa_student_profiles') || '[]');
    profiles.unshift(studentData);
    localStorage.setItem('madrassa_student_profiles', JSON.stringify(profiles));

    // Also auto-generate initial default result for testing
    const results = JSON.parse(localStorage.getItem('madrassa_exam_results') || '[]');
    results.unshift({
      rollNo: rollNo,
      nameUr: nameUr,
      nameEn: nameEn,
      fatherUr: fatherUr,
      fatherEn: fatherEn,
      dept: dept,
      term: 'Annual Examination 2026 / سالانہ امتحان ۲۰۲۶',
      marks: '945 / 1000',
      gradeUr: 'ممتاز (Excellent)',
      statusUr: 'کامیاب (Passed)',
      hifzDora: '30 Paras Complete',
      tajweedMarks: '98 / 100'
    });
    localStorage.setItem('madrassa_exam_results', JSON.stringify(results));

    // Render Student ID Card Summary
    if (profileCard) {
      profileCard.innerHTML = `
        <div style="background: var(--bg-surface); border: 2px solid var(--gold); padding: 2rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-md); margin-top: 2rem;">
          <div style="text-align: center; border-bottom: 2px stroke var(--gold); padding-bottom: 1rem; margin-bottom: 1rem;">
            <h3 style="color: var(--primary); font-family: var(--font-ur);">طالب علم رجسٹریشن کارڈ / Student Registration Card</h3>
            <span style="background: var(--primary); color: var(--gold); padding: 0.3rem 1rem; border-radius: var(--radius-full); font-weight: 700; font-size: 1.1rem;">
              ROLL NO: ${rollNo}
            </span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div><strong>اسم طالب علم:</strong> ${nameUr} (${nameEn})</div>
            <div><strong>والد کا نام:</strong> ${fatherUr} (${fatherEn})</div>
            <div><strong>مطلوبہ شعبہ:</strong> ${dept.toUpperCase()}</div>
            <div><strong>فون نمبر:</strong> ${phone}</div>
          </div>
          <p style="margin-top: 1rem; color: #047857; font-weight: 700; text-anchor: center;">
            ✓ آپ کی پرائل کامیابی کے ساتھ رجسٹر ہو گئی ہے۔ اپنا رول نمبر (${rollNo}) رزلٹ سیکشن میں رزلٹ دیکھنے کے لیے استعمال کریں۔
          </p>
        </div>
      `;
    }

    const isUr = document.documentElement.getAttribute('lang') === 'ur';
    alert(isUr 
      ? `مبارک ہو! آپ کا طالب علم پروفائل رجسٹر ہو گیا ہے۔ آپ کا رول نمبر ہے: ${rollNo}`
      : `Success! Student Profile Registered. Your Roll No is: ${rollNo}`);

    studentForm.reset();
  });
}

/* --------------------------------------------------------------------------
   8. Admin Results Upload Engine
   -------------------------------------------------------------------------- */
function initAdminResultsManagement() {
  const resultForm = document.getElementById('adminResultForm');
  if (!resultForm) return;

  resultForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const rollNo = document.getElementById('resRollNo').value.trim().toUpperCase();
    const nameUr = document.getElementById('resNameUr').value.trim();
    const fatherUr = document.getElementById('resFatherUr').value.trim();
    const dept = document.getElementById('resDept').value;
    const term = document.getElementById('resTerm').value.trim();
    const marks = document.getElementById('resMarks').value.trim();
    const gradeUr = document.getElementById('resGradeUr').value;
    const statusUr = document.getElementById('resStatusUr').value;

    const newResult = {
      rollNo: rollNo,
      nameUr: nameUr,
      nameEn: nameUr,
      fatherUr: fatherUr,
      fatherEn: fatherUr,
      dept: dept,
      term: term,
      marks: marks,
      gradeUr: gradeUr,
      statusUr: statusUr
    };

    const results = JSON.parse(localStorage.getItem('madrassa_exam_results') || '[]');
    results.unshift(newResult);
    localStorage.setItem('madrassa_exam_results', JSON.stringify(results));

    const isSubdir = window.location.pathname.includes('/sections/');
    const resultLink = isSubdir ? `results.html?rollNo=${rollNo}` : `sections/results.html?rollNo=${rollNo}`;

    // Auto push announcement to news ticker ("تازہ ترین خبر")
    const existingTicker = JSON.parse(localStorage.getItem('madrassa_custom_ticker') || '[]');
    existingTicker.unshift({
      id: Date.now(),
      textEn: `🎓 Exam Results Declared for Roll No ${rollNo} (${nameUr}) - View Marksheet`,
      textUr: `🎓 تازہ ترین خبر: رول نمبر ${rollNo} (${nameUr}) کے امتحانی نتائج کا اعلان کر دیا گیا ہے - رزلٹ دیکھیں`,
      link: resultLink
    });
    localStorage.setItem('madrassa_custom_ticker', JSON.stringify(existingTicker));

    const isUr = document.documentElement.getAttribute('lang') === 'ur';
    alert(isUr 
      ? 'رزلٹ کامیابی سے اپ لوڈ ہو گیا ہے اور "تازہ ترین خبر" میں خودکار اعلان نشر ہو گیا ہے!' 
      : 'Result uploaded successfully and automated link published to News Ticker!');

    resultForm.reset();
  });
}

/* --------------------------------------------------------------------------
   9. Public Student Results Search & Marksheet Certificate Generator
   -------------------------------------------------------------------------- */
function initResultsSearch() {
  const searchForm = document.getElementById('resultsSearchForm');
  const displayContainer = document.getElementById('marksheetResultDisplay');

  if (!searchForm || !displayContainer) return;

  // Auto-search if URL parameter ?rollNo=... exists (e.g. from ticker link)
  const urlParams = new URLSearchParams(window.location.search);
  const targetRoll = urlParams.get('rollNo');
  if (targetRoll) {
    const inputEl = document.getElementById('searchQuery');
    if (inputEl) {
      inputEl.value = targetRoll;
      setTimeout(() => {
        searchForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }, 300);
    }
  }

  // Insert default sample exam results if none exist
  if (!localStorage.getItem('madrassa_exam_results')) {
    const defaultResults = [
      {
        rollNo: 'MDF-2026-1001',
        nameUr: 'محمد بلال خان',
        nameEn: 'Muhammad Bilal Khan',
        fatherUr: 'طارق محمود خان',
        fatherEn: 'Tariq Mahmood Khan',
        dept: 'تحفیظ القرآن والتجوید (Hifz-ul-Quran)',
        term: 'Annual Examination 2026 / سالانہ امتحان ۲۰۲۶',
        marks: '985 / 1000',
        gradeUr: 'ممتاز (Excellent)',
        statusUr: 'کامیاب فارغ التحصیل (Passed)',
        tajweedMarks: '99 / 100'
      },
      {
        rollNo: 'MDF-2026-1002',
        nameUr: 'عبداللہ سواتی',
        nameEn: 'Abdullah Swati',
        fatherUr: 'انجینیئر شہاب الدین',
        fatherEn: 'Engr. Shahabuddin',
        dept: 'درسِ نظامی (عالمیہ / Alim Degree)',
        term: 'Final Board Exam 2026 / وفاق المدارس امتحان',
        marks: '920 / 1000',
        gradeUr: 'جید جداً (Very Good)',
        statusUr: 'کامیاب (Passed)'
      }
    ];
    localStorage.setItem('madrassa_exam_results', JSON.stringify(defaultResults));
  }

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.getElementById('searchQuery').value.trim().toLowerCase();

    if (!query) {
      alert('برائے مہربانی اپنا رول نمبر یا نام درج کریں۔ / Please enter Roll Number or Name.');
      return;
    }

    const allResults = JSON.parse(localStorage.getItem('madrassa_exam_results') || '[]');
    const match = allResults.find(r => 
      r.rollNo.toLowerCase() === query || 
      r.nameUr.toLowerCase().includes(query) || 
      r.nameEn.toLowerCase().includes(query) ||
      r.fatherUr.toLowerCase().includes(query)
    );

    if (match) {
      displayContainer.innerHTML = `
        <div class="marksheet-card">
          <img src="../images/logo.png" class="marksheet-seal" alt="Emblem Seal">
          
          <div class="marksheet-header">
            <h2 style="font-family: var(--font-ur); color: var(--primary); font-size: 2rem;">مدرسہ دارالفلاح چھوٹا لاہور صوابی</h2>
            <h3 style="font-family: var(--font-en-serif); color: var(--gold-dark);">OFFICIAL EXAM RESULT MARKSHEET</h3>
            <p style="font-size: 0.9rem; color: var(--text-muted);">${match.term}</p>
          </div>

          <div class="marksheet-info-grid">
            <div><strong>طالب علم کا نام:</strong> ${match.nameUr}</div>
            <div><strong>والد کا نام:</strong> ${match.fatherUr}</div>
            <div><strong>رول نمبر (Roll No):</strong> <span style="color: var(--primary); font-weight: 800;">${match.rollNo}</span></div>
            <div><strong>شعبہ (Department):</strong> ${match.dept}</div>
          </div>

          <table class="marksheet-table">
            <thead>
              <tr>
                <th>شعبہ / مضمون (Subject)</th>
                <th>کل نمبر (Total)</th>
                <th>حاصل کردہ نمبر (Obtained)</th>
                <th>گریڈ (Grade)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>تجوید و حفظ / علومِ دینیہ</td>
                <td>1000</td>
                <td><strong>${match.marks}</strong></td>
                <td><span class="grade-badge-mumtaz">${match.gradeUr}</span></td>
              </tr>
            </tbody>
          </table>

          <div style="display: flex; justify-content: space-between; align-items: center; background: #f3f4f6; padding: 1rem 1.5rem; border-radius: var(--radius-md);">
            <div><strong>نتیجہ (Status):</strong> <span style="color: #047857; font-weight: 800;">${match.statusUr}</span></div>
            <button onclick="window.print()" class="btn btn-outline-primary" style="padding: 0.4rem 1rem; font-size: 0.85rem;">
              <i class="fa-solid fa-print"></i> پرنٹ کیجیے (Print Marksheet)
            </button>
          </div>

          <div class="marksheet-footer-signatures">
            <div style="text-align: center;">
              <div style="border-bottom: 1px solid var(--text-dark); width: 140px; margin-bottom: 0.3rem;"></div>
              <span style="font-size: 0.85rem; font-weight: 600;">ناظمِ امتحانات (Controller)</span>
            </div>
            <div style="text-align: center;">
              <div style="border-bottom: 1px solid var(--text-dark); width: 140px; margin-bottom: 0.3rem;"></div>
              <span style="font-size: 0.85rem; font-weight: 600;">مہتمم (Principal Signature)</span>
            </div>
          </div>
        </div>
      `;
      displayContainer.scrollIntoView({ behavior: 'smooth' });
    } else {
      displayContainer.innerHTML = `
        <div style="text-align: center; padding: 2.5rem; background: var(--bg-surface); border-radius: var(--radius-lg); border: 2px solid #ef4444; max-width: 600px; margin: 2rem auto;">
          <i class="fa-solid fa-triangle-exclamation" style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;"></i>
          <h3 class="lang-en" style="color: #ef4444;">No Exam Result Found</h3>
          <h3 class="lang-ur" style="color: #ef4444;">کوئی نتیجہ موصول نہیں ہوا</h3>
          <p class="lang-en" style="color: var(--text-muted); margin-top: 0.5rem;">Please re-check your Roll Number (e.g. MDF-2026-1001) or Name.</p>
          <p class="lang-ur" style="color: var(--text-muted); margin-top: 0.5rem;">برائے مہربانی اپنا درست رول نمبر (مثال: MDF-2026-1001) یا نام درج کریں۔</p>
        </div>
      `;
    }
  });
}

/* --------------------------------------------------------------------------
   10. Batch Excel (.xlsx) Results Upload & Sample Download Engine
   -------------------------------------------------------------------------- */
function initXLSXUpload() {
  const xlsxInput = document.getElementById('xlsxFileInput');
  const xlsxForm = document.getElementById('xlsxUploadForm');

  if (!xlsxForm || !xlsxInput) return;

  xlsxForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const file = xlsxInput.files[0];
    if (!file) {
      alert('Please select an Excel (.xlsx, .xls) or CSV file.');
      return;
    }

    if (typeof XLSX === 'undefined') {
      alert('Excel parsing library loading... Please check internet connection or try again.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.SheetNames[0];
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);

        if (rows.length === 0) {
          alert('Selected spreadsheet file is empty.');
          return;
        }

        const existingResults = JSON.parse(localStorage.getItem('madrassa_exam_results') || '[]');
        let importedCount = 0;

        rows.forEach(r => {
          const rollNo = (r['Student Roll No'] || r['Roll No'] || r['rollNo'] || '').toString().trim().toUpperCase();
          const nameUr = (r["Student Name (Urdu)"] || r['Student Name'] || r['nameUr'] || '').toString().trim();
          const fatherUr = (r["Father's Name (Urdu)"] || r['Father Name'] || r['fatherUr'] || '').toString().trim();
          const dept = (r['Department'] || r['dept'] || 'تحفیظ القرآن والتجوید').toString().trim();
          const term = (r['Examination Term'] || r['term'] || 'Annual Examination 2026 / سالانہ امتحان ۲۰۲۶').toString().trim();
          const marks = (r['Obtained / Total Marks'] || r['Marks'] || r['marks'] || '950 / 1000').toString().trim();
          const gradeUr = (r['Grade'] || r['gradeUr'] || 'ممتاز (Excellent)').toString().trim();
          const statusUr = (r['Result Status'] || r['statusUr'] || 'کامیاب (Passed)').toString().trim();

          if (rollNo && nameUr) {
            existingResults.unshift({
              rollNo, nameUr, nameEn: nameUr, fatherUr, fatherEn: fatherUr, dept, term, marks, gradeUr, statusUr
            });
            importedCount++;
          }
        });

        localStorage.setItem('madrassa_exam_results', JSON.stringify(existingResults));

        // Auto push announcement ticker
        const existingTicker = JSON.parse(localStorage.getItem('madrassa_custom_ticker') || '[]');
        existingTicker.unshift({
          id: Date.now(),
          textEn: `🎓 Batch Exam Results Published (${importedCount} Students) - View Results Portal!`,
          textUr: `🎓 تازہ ترین خبر: ${importedCount} طلباء کے امتحانی نتائج بمطابق ایکسل فائل شائع کر دیے گئے ہیں!`,
          link: 'sections/results.html'
        });
        localStorage.setItem('madrassa_custom_ticker', JSON.stringify(existingTicker));

        const isUr = document.documentElement.getAttribute('lang') === 'ur';
        alert(isUr 
          ? `مبارک ہو! ایکسل فائل سے ${importedCount} طلباء کے نتائج کامیابی کے ساتھ اپ لوڈ ہو گئے ہیں۔`
          : `Success! Imported ${importedCount} student exam results from Excel file.`);

        xlsxForm.reset();
      } catch (err) {
        alert('Error parsing Excel file. Please ensure valid .xlsx format: ' + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

function downloadSampleXLSX() {
  if (typeof XLSX === 'undefined') {
    window.open('../sample_results.csv', '_blank');
    return;
  }

  const sampleData = [
    {
      "Student Roll No": "MDF-2026-1003",
      "Student Name (Urdu)": "عمر فاروق",
      "Father's Name (Urdu)": "خالد محمود",
      "Department": "تحفیظ القرآن والتجوید (Hifz-ul-Quran)",
      "Examination Term": "Annual Examination 2026 / سالانہ امتحان ۲۰۲۶",
      "Obtained / Total Marks": "950 / 1000",
      "Grade": "ممتاز (Excellent)",
      "Result Status": "کامیاب (Passed)"
    },
    {
      "Student Roll No": "MDF-2026-1004",
      "Student Name (Urdu)": "محمد اسامہ",
      "Father's Name (Urdu)": "طارق عزیز",
      "Department": "عصری پرائمری و مڈل اسکولنگ (Schooling)",
      "Examination Term": "Annual Examination 2026 / سالانہ امتحان ۲۰۲۶",
      "Obtained / Total Marks": "920 / 1000",
      "Grade": "جید جداً (Very Good)",
      "Result Status": "کامیاب (Passed)"
    }
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sample Results");
  XLSX.writeFile(wb, "sample_results.xlsx");
}

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
