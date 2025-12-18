document.addEventListener('DOMContentLoaded', () => {
  // ---------- Contact form fun: validate fields & pop a toast ----------
  const form = document.getElementById('contactForm');
  const toastEl = document.getElementById('formToast');

  const getFeedbackEl = (input) => {
    const field = input.closest('.field') || input.parentElement;
    let fb = field ? field.querySelector('.invalid-feedback') : null;
    if (!fb && field) {
      fb = document.createElement('div');
      fb.className = 'invalid-feedback';
      field.appendChild(fb);
    }
    return fb;
  };

  const setInvalid = (input, message) => {
    input.classList.add('is-invalid');
    const fb = getFeedbackEl(input);
    if (fb) {
      fb.textContent = message || 'This field is required.';
    }
  };

  const clearInvalid = (input) => {
    input.classList.remove('is-invalid');
    const fb = getFeedbackEl(input);
    if (fb) {
      fb.textContent = '';
    }
  };

  const validateEmail = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value);
  };

  const validateContactForm = () => {
    if (!form) return false;
    let isValid = true;

    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const topicSelect = form.querySelector('#topic');
    const messageInput = form.querySelector('#message');

    // ---------- Name checks: at least 2 letters — no numbers allowed ----------
    const nameVal = (nameInput?.value || '').trim();
    if (!nameVal || nameVal.length < 2) {
      setInvalid(nameInput, 'Please enter your full name.');
      isValid = false;
    } else if (/\d/.test(nameVal)) {
      setInvalid(nameInput, 'Name cannot contain numbers.');
      isValid = false;
    } else {
      clearInvalid(nameInput);
    }

    // ---------- Email checks: gotta look like a real email ----------
    const emailVal = (emailInput?.value || '').trim();
    if (!emailVal || !validateEmail(emailVal)) {
      setInvalid(emailInput, 'Please enter a valid email address.');
      isValid = false;
    } else {
      clearInvalid(emailInput);
    }

    // ---------- Topic picker: just choose one, any one ----------
    if (topicSelect) {
      const topicVal = (topicSelect.value || '').trim();
      if (!topicVal) {
        setInvalid(topicSelect, 'Please select a topic.');
        isValid = false;
      } else {
        clearInvalid(topicSelect);
      }
    }

    // ---------- Message vibes: share at least 10 characters ----------
    const messageVal = (messageInput?.value || '').trim();
    if (!messageVal || messageVal.length < 10) {
      setInvalid(messageInput, 'Please enter at least 10 characters.');
      isValid = false;
    } else {
      clearInvalid(messageInput);
    }

    return isValid;
  };

  if (form && window.bootstrap && bootstrap.Toast && toastEl) {
    const toast = bootstrap.Toast.getOrCreateInstance(toastEl);

    // ---------- Live feedback: validate while you type & tab around ----------
    ['#name', '#email', '#topic', '#message'].forEach((sel) => {
      const el = form.querySelector(sel);
      if (!el) return;
      el.addEventListener('input', () => {
        // ---------- Quick check: validate this field on the fly ----------
        if (sel === '#name') {
          const v = el.value.trim();
          if (!v || v.length < 2) {
            setInvalid(el, 'Please enter your full name.');
          } else if (/\d/.test(v)) {
            setInvalid(el, 'Name cannot contain numbers.');
          } else {
            clearInvalid(el);
          }
        } else if (sel === '#email') {
          (validateEmail(el.value.trim())) ? clearInvalid(el) : setInvalid(el, 'Please enter a valid email address.');
        } else if (sel === '#message') {
          (el.value.trim().length >= 10) ? clearInvalid(el) : setInvalid(el, 'Please enter at least 10 characters.');
        } else if (sel === '#topic') {
          (el.value.trim()) ? clearInvalid(el) : setInvalid(el, 'Please select a topic.');
        }
      });
      el.addEventListener('blur', () => {
        el.dispatchEvent(new Event('input'));
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const ok = validateContactForm();
      if (!ok) {
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid && typeof firstInvalid.focus === 'function') firstInvalid.focus();
        return;
      }
      toast.show();
      form.reset();
      // ---------- Reset zen: wipe errors and start fresh ----------
      ['#name', '#email', '#topic', '#message'].forEach((sel) => {
        const el = form.querySelector(sel);
        if (el) clearInvalid(el);
      });
    });
  }

  // ---------- Newsletter sparkle: toast it, then reset the field ----------
  const newsletterToastEl = document.getElementById('newsletterToast');
  const newsletterToast = (newsletterToastEl && window.bootstrap && bootstrap.Toast) 
    ? bootstrap.Toast.getOrCreateInstance(newsletterToastEl) 
    : null;

  document.querySelectorAll('form.newsletter-form').forEach((newsletterForm) => {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (newsletterToast) {
        newsletterToast.show();
        newsletterForm.reset();
      }
    });
  });

  // ---------- Scroll magic: musical notes & card reveals on About Us ----------
  const musicalNotesContainer = document.getElementById('musicalNotesContainer');
  const aboutCardsSection = document.querySelector('.about-cards');
  
  if (aboutCardsSection) {
    let notesActivated = false;
    let cardsActivated = false;

    const observerOptions = {
      threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // ---------- Notes ON: start the animation, once per session ----------
          if (musicalNotesContainer && !notesActivated) {
            musicalNotesContainer.classList.add('active');
            notesActivated = true;
          }
          
          // ---------- Card glow-up: reveal each with a smooth stagger ----------
          if (!cardsActivated) {
            aboutCardsSection.classList.add('visible');
            cardsActivated = true;
          }
        }
      });
    }, observerOptions);

    observer.observe(aboutCardsSection);
  }
});
