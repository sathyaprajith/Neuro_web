export const MAX_FIELD_LENGTHS = {
  name: 120,
  email: 254,
  subject: 180,
  message: 2000,
  affiliation: 120,
};

export function validateContactInput(input) {
  const errors = {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { valid: false, errors: { form: 'Invalid request body.' }, sanitized: {} };
  }
  const name = String(input.name ?? '').trim();
  const email = String(input.email ?? '').trim();
  const subject = String(input.subject ?? '').trim();
  const message = String(input.message ?? '').trim();
  const affiliation = String(input.affiliation ?? '').trim();

  if (!name) {
    errors.name = 'Name is required.';
  } else if (name.length > MAX_FIELD_LENGTHS.name) {
    errors.name = `Name must be shorter than ${MAX_FIELD_LENGTHS.name} characters.`;
  }

  if (!email) {
    errors.email = 'Email is required.';
  } else if (email.length > MAX_FIELD_LENGTHS.email) {
    errors.email = `Email must be shorter than ${MAX_FIELD_LENGTHS.email} characters.`;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!subject) {
    errors.subject = 'Subject is required.';
  } else if (subject.length > MAX_FIELD_LENGTHS.subject) {
    errors.subject = `Subject must be shorter than ${MAX_FIELD_LENGTHS.subject} characters.`;
  }

  if (!message) {
    errors.message = 'Message is required.';
  } else if (message.length < 10) {
    errors.message = 'Message must be at least 10 characters.';
  } else if (message.length > MAX_FIELD_LENGTHS.message) {
    errors.message = `Message must be shorter than ${MAX_FIELD_LENGTHS.message} characters.`;
  }

  if (affiliation && affiliation.length > MAX_FIELD_LENGTHS.affiliation) {
    errors.affiliation = `Affiliation must be shorter than ${MAX_FIELD_LENGTHS.affiliation} characters.`;
  }

  if (/\r|\n|\0/.test(String(input.subject ?? ''))) errors.subject = 'Subject contains invalid characters.';
  if (/\0/.test(String(input.message ?? ''))) errors.message = 'Message contains invalid characters.';

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      name,
      email,
      subject,
      message,
      affiliation,
    },
  };
}
