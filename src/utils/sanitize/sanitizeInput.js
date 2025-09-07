// src/utils/sanitization/sanitizeInput.js
import validator from 'validator';

export function sanitizeInput(input, options = {}) {
  if (input === null || input === undefined) {
    return '';
  }
  
  // Convert to string if it's not already
  let sanitized = String(input);
  
  const {
    escapeHtml = true,
    stripLow = true,
    trim = true
  } = options;
  
  // Trim whitespace first
  if (trim) {
    sanitized = validator.trim(sanitized);
  }
  
  // Remove low ASCII characters (control characters)
  if (stripLow) {
    sanitized = validator.stripLow(sanitized, true); // keep new lines
  }
  
  // Escape HTML entities to prevent XSS
  if (escapeHtml) {
    sanitized = validator.escape(sanitized);
  }
  
  return sanitized;
}

/**
 * Alternative implementation using DOMPurify for more advanced HTML sanitization
 * Uncomment if you prefer DOMPurify over validator
 */
/*
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeInput(input, options = {}) {
  if (input === null || input === undefined) {
    return '';
  }
  
  let sanitized = String(input);
  
  const {
    trim = true,
    allowHtml = false
  } = options;
  
  // Trim whitespace
  if (trim) {
    sanitized = sanitized.trim();
  }
  
  // Sanitize HTML - either escape everything or sanitize selectively
  if (!allowHtml) {
    // Escape all HTML (strict mode)
    sanitized = DOMPurify.sanitize(sanitized, {
      ALLOWED_TAGS: [], // No allowed tags = escape everything
      ALLOWED_ATTR: [], // No allowed attributes
      KEEP_CONTENT: true // Keep text content
    });
  } else {
    // Allow safe HTML only (be very careful with this!)
    sanitized = DOMPurify.sanitize(sanitized, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
      ALLOWED_ATTR: ['href', 'target', 'rel'],
      ADD_ATTR: ['target'] // Allow target attribute for links
    });
  }
  
  return sanitized;
}
*/

// Optional: Specialized sanitizers for different input types
export const sanitizers = {
  email: (email) => {
    let sanitized = sanitizeInput(email, { trim: true, stripLow: true, escapeHtml: false });
    return validator.normalizeEmail(sanitized) || sanitized;
  },
  
  username: (username) => {
    let sanitized = sanitizeInput(username, { trim: true, stripLow: true, escapeHtml: true });
    // Remove special characters except allowed ones
    return sanitized.replace(/[^a-zA-Z0-9_\-.]/g, '');
  },
  
  phone: (phone) => {
    let sanitized = sanitizeInput(phone, { trim: true, stripLow: true, escapeHtml: true });
    // Keep only digits, plus sign, parentheses, and hyphens
    return sanitized.replace(/[^\d+\-()\s]/g, '');
  },
  
  text: (text) => {
    return sanitizeInput(text, { trim: true, stripLow: true, escapeHtml: true });
  },
  
  html: (html) => {
    // For content that should allow safe HTML
    return sanitizeInput(html, { trim: true, stripLow: true, escapeHtml: false });
  }
};