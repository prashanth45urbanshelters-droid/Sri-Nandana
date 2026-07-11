/* ════════════════════════════════════════
   Sri Nandana Infra — Interactive Scripts
   ════════════════════════════════════════ */

// ── Scroll reveal ──────────────────────────
const reveals = document.querySelectorAll('.reveal-up');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

reveals.forEach(el => revealObserver.observe(el));

// ── Mobile nav toggle ──────────────────────
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');

menuToggle.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
  mobileNav.setAttribute('aria-hidden', !isOpen);

  // Animate hamburger spans
  const spans = menuToggle.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '1';
    spans[2].style.transform = '';
  }
});

// Close mobile nav on link click
document.querySelectorAll('.mobile-nav-link, .mobile-nav-cta').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    const spans = menuToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '1';
    spans[2].style.transform = '';
  });
});

// ── Stat counter animation ─────────────────
const statsSection = document.querySelector('.hero-stats');
let statsAnimated = false;

if (statsSection) {
  const statsObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !statsAnimated) {
      statsAnimated = true;
      animateCounters();
    }
  }, { threshold: 0.2 });

  statsObserver.observe(statsSection);
}

function animateCounters() {
  document.querySelectorAll('.stat-item strong[data-count]').forEach(el => {
    const end = parseInt(el.getAttribute('data-count'), 10);
    const dur = 1500;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // Cubic ease out
      el.textContent = Math.round(ease * end);
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  });
}

// ── Google Sheets Lead Collection ──────────────────
// Replace this URL with your actual Google Apps Script Web App URL after deployment
const scriptURL = 'https://script.google.com/macros/s/AKfycbyS5SzY9q1lDrrDIUlWLFn0_h96Ha-I7Oq9_p-2fRXJMFDniVsmNHAAV0qZSAQmqZVY/exec';
const enquiryForms = document.querySelectorAll('.enquiry-form-submit');

enquiryForms.forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const phoneInput = form.querySelector('input[name="phone"]');
    const phoneNumber = phoneInput.value.trim();

    // Regex for Indian phone numbers (10 digits, optional 0, 91, or +91 prefix)
    const phoneRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;

    if (!phoneRegex.test(phoneNumber)) {
      showToast("Please enter a valid 10-digit phone number.", "error");
      phoneInput.focus();
      phoneInput.style.borderColor = '#ef4444';
      phoneInput.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.15)';
      
      // Reset input styling on input edit
      const resetStyle = () => {
        phoneInput.style.borderColor = '';
        phoneInput.style.boxShadow = '';
        phoneInput.removeEventListener('input', resetStyle);
      };
      phoneInput.addEventListener('input', resetStyle);
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnHTML = submitBtn.innerHTML;

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      Submitting...
      <svg class="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
    `;

    // Create form data payload
    const formData = new FormData(form);

    fetch(scriptURL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors' // prevents CORS issues with Google redirection
    })
      .then(() => {
        showToast("Enquiry submitted successfully!", "success");
        form.reset();
      })
      .catch(error => {
        console.error('Error submitting form:', error);
        showToast("Something went wrong. Please try again.", "error");
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      });
  });
});

function showToast(message, type = "success") {
  let toast = document.getElementById('successToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'successToast';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  if (type === "error") {
    toast.style.borderLeftColor = "#ef4444";
    toast.innerHTML = `
      <div class="toast-icon" style="color: #ef4444;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <div class="toast-message"></div>
    `;
  } else {
    toast.style.borderLeftColor = "var(--accent-orange)";
    toast.innerHTML = `
      <div class="toast-icon" style="color: var(--accent-orange);">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      </div>
      <div class="toast-message"></div>
    `;
  }

  toast.querySelector('.toast-message').textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
