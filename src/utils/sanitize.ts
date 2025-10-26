/**
 * Text Sanitization Utilities
 * Sanitizes user input to prevent XSS attacks
 */

/**
 * Sanitizes HTML content by escaping potentially dangerous characters
 * Use this for any user-generated content that needs to be displayed
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return html.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Sanitizes plain text by removing any HTML tags and escaping special characters
 */
export function sanitizeText(text: string): string {
  if (!text) return '';

  // Remove any HTML tags
  const withoutTags = text.replace(/<[^>]*>/g, '');

  // Escape special characters
  return sanitizeHtml(withoutTags);
}

/**
 * Sanitizes rich text notes (SOAP notes, clinical notes, etc.)
 * Allows basic formatting but removes dangerous elements
 */
export function sanitizeRichText(text: string): string {
  if (!text) return '';

  // Remove script tags and event handlers
  let sanitized = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, '');

  // Remove javascript: and data: URIs
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/data:text\/html/gi, '');

  // Remove iframe, object, embed tags
  sanitized = sanitized.replace(/<(iframe|object|embed|applet)[^>]*>/gi, '');

  return sanitized;
}

/**
 * Validates and sanitizes URL to prevent XSS via href attributes
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';

  // Only allow http, https, and mailto protocols
  const allowedProtocols = /^(https?|mailto):/i;

  if (allowedProtocols.test(url)) {
    return url;
  }

  // If no protocol or suspicious protocol, return empty or relative URL
  if (url.startsWith('/') || url.startsWith('#')) {
    return url;
  }

  return '';
}
