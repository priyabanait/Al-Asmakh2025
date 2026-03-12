// Shared lead/contact form validation for About Us, Privilege Partners, etc.

export const initialLeadFormData = {
  name: '',
  email: '',
  phone: '',
  propertyType: '',
  message: '',
};

export const validateLeadForm = (formData) => {
  const errors = {};

  const name = (formData.name || '').trim();
  const email = (formData.email || '').trim();
  const phoneRaw = formData.phone || '';

  // Name - required, min 2 chars
  if (!name) {
    errors.name = 'Name is required';
  } else if (name.length < 2) {
    errors.name = 'Please enter your full name';
  }

  // Email - required + basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Phone - required + basic length check on digits
  const digits = phoneRaw.replace(/\D/g, '');
  if (!digits) {
    errors.phone = 'Phone number is required';
  } else if (digits.length < 7 || digits.length > 15) {
    errors.phone = 'Please enter a valid phone number';
  }

  // Property type and message are optional for now,
  // but you can enforce them here if needed.

  return errors;
};

export const hasLeadFormErrors = (errors) => {
  return errors && Object.keys(errors).length > 0;
};

