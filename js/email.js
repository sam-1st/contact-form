const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'w_2buiqjV1G9DWBbE',
  SERVICE_ID: 'service_tbjfywq',
  TEMPLATE_ID: 'template_vb7mbpt',
};

function initEmailService() {
  if (typeof emailjs === 'undefined') {
    console.error('EmailJS SDK not loaded.');
    return;
  }
  emailjs.init({ publicKey: EMAILJS_CONFIG.PUBLIC_KEY });
}

/**
 * Sends the contact form via EmailJS.
 * @param {{name: string, email: string, phone: string, subject: string, message: string}} data
 * @returns {Promise<{ok: true} | {ok: false, error: string}>}
 */
function sendContactEmail(data) {
  if (typeof emailjs === 'undefined') {
    return Promise.resolve({ ok: false, error: 'Email service unavailable. Please try again later.' });
  }

  const templateParams = {
    from_name: data.name,
    reply_to: data.email,
    phone: data.phone,
    subject: data.subject,
    message: data.message,
  };

  return emailjs
    .send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, templateParams)
    .then(() => ({ ok: true }))
    .catch((err) => {
      console.error('EmailJS send failed:', err);
      return { ok: false, error: 'Something went wrong while sending. Please try again.' };
    });
}

document.addEventListener('DOMContentLoaded', initEmailService);