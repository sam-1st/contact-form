document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initMessageCounter();
  initFormValidation();
});

/* --------------------------------------------------------------------
   Mobile nav toggle
   -------------------------------------------------------------------- */
function initNavToggle() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* --------------------------------------------------------------------
   Live character counter for the message field
   -------------------------------------------------------------------- */
function initMessageCounter() {
  const message = document.getElementById('message');
  const counter = document.getElementById('messageCount');
  if (!message || !counter) return;

  const MIN = 20;

  const update = () => {
    const len = message.value.length;
    if (len >= MIN) {
      counter.textContent = `${len} characters`;
      counter.classList.add('field__count--ok');
    } else {
      counter.textContent = `${len} / ${MIN} min.`;
      counter.classList.remove('field__count--ok');
    }
  };

  message.addEventListener('input', update);
  update();
}

/* --------------------------------------------------------------------
   Validation rules
   -------------------------------------------------------------------- */
const VALIDATORS = {
  name: (value) => {
    if (!value.trim()) return 'Please enter your name.';
    if (value.trim().length < 3) return 'Name must be at least 3 characters.';
    return '';
  },
  email: (value) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value.trim()) return 'Please enter your email.';
    if (!re.test(value.trim())) return 'Please enter a valid email address.';
    return '';
  },
  phone: (value) => {
    const digits = value.replace(/\D/g, '');
    if (!value.trim()) return 'Please enter your phone number.';
    if (digits.length < 10) return 'Phone number must have at least 10 digits.';
    return '';
  },
  subject: (value) => {
    if (!value.trim()) return 'Please enter a subject.';
    if (value.trim().length < 3) return 'Subject must be at least 3 characters.';
    return '';
  },
  message: (value) => {
    if (!value.trim()) return 'Please write a message.';
    if (value.trim().length < 20) return 'Message must be at least 20 characters.';
    return '';
  },
};

function validateField(input) {
  const validator = VALIDATORS[input.name];
  if (!validator) return true;

  const errorMsg = validator(input.value);
  const fieldEl = input.closest('.field');
  const errorEl = fieldEl.querySelector('.field__error');

  if (errorMsg) {
    fieldEl.classList.add('field--invalid');
    if (errorEl) errorEl.textContent = errorMsg;
    return false;
  }

  fieldEl.classList.remove('field--invalid');
  if (errorEl) errorEl.textContent = '';
  return true;
}

/* --------------------------------------------------------------------
   Form submit flow
   -------------------------------------------------------------------- */
function initFormValidation() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  if (!form || !submitBtn) return;

  const inputs = Array.from(form.querySelectorAll('.field__input'));

  // Validate on blur, clear error while typing
  inputs.forEach((input) => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      const fieldEl = input.closest('.field');
      if (fieldEl.classList.contains('field--invalid')) validateField(input);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const allValid = inputs.map(validateField).every(Boolean);
    if (!allValid) {
      const firstInvalid = form.querySelector('.field--invalid .field__input');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim(),
    };

    setButtonLoading(submitBtn, true);

    sendContactEmail(data)
      .then((result) => {
        if (result.ok) {
          showToast('success', 'Message sent successfully! We\u2019ll be in touch soon.');
          form.reset();
          document.getElementById('messageCount').textContent = '0 / 20 min.';
          document.getElementById('messageCount').classList.remove('field__count--ok');
        } else {
          showToast('error', result.error || 'Failed to send message. Please try again.');
        }
      })
      .finally(() => setButtonLoading(submitBtn, false));
  });
}

function setButtonLoading(btn, isLoading) {
  btn.disabled = isLoading;
  btn.classList.toggle('is-loading', isLoading);
  const label = btn.querySelector('.btn__label');
  if (label) label.textContent = isLoading ? 'Sending\u2026' : 'Send message';
}

/* --------------------------------------------------------------------
   Toast notifications
   -------------------------------------------------------------------- */
function showToast(type, message) {
  const stack = document.getElementById('toastStack');
  if (!stack) return;

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', 'status');

  const icon = type === 'success' ? '\u2705' : '\u274C';
  toast.innerHTML = `<span class="toast__icon">${icon}</span><span class="toast__text"></span>`;
  toast.querySelector('.toast__text').textContent = message;

  stack.appendChild(toast);

  const AUTO_DISMISS_MS = 4500;
  const timer = setTimeout(() => dismissToast(toast), AUTO_DISMISS_MS);

  toast.addEventListener('click', () => {
    clearTimeout(timer);
    dismissToast(toast);
  });
}

function dismissToast(toast) {
  toast.classList.add('toast--out');
  toast.addEventListener('animationend', () => toast.remove(), { once: true });
}