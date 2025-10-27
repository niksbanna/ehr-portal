/**
 * Utility functions for masking sensitive data
 */

/**
 * Masks Aadhaar number showing only last 4 digits
 * Format: XXXX-XXXX-1234
 */
export function maskAadhaar(aadhaar: string): string {
  if (!aadhaar) return aadhaar;

  // Remove any existing formatting
  const cleaned = aadhaar.replace(/[-\s]/g, '');

  // If not a valid length, return masked
  if (cleaned.length !== 12) {
    return 'XXXX-XXXX-XXXX';
  }

  // Show only last 4 digits
  const last4 = cleaned.slice(-4);
  return `XXXX-XXXX-${last4}`;
}

/**
 * Masks PAN number showing only last 4 characters
 * Format: XXXXXX1234
 */
export function maskPAN(pan: string): string {
  if (!pan) return pan;

  // Remove any spaces
  const cleaned = pan.replace(/\s/g, '');

  // If not a valid length (PAN is 10 chars), return masked
  if (cleaned.length !== 10) {
    return 'XXXXXX'.padEnd(cleaned.length, 'X');
  }

  // Show only last 4 characters
  const last4 = cleaned.slice(-4);
  return 'XXXXXX' + last4;
}

/**
 * Recursively masks sensitive fields in an object
 */
export function maskSensitiveData(obj: any): any {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => maskSensitiveData(item));
  }

  const masked = { ...obj };
  const sensitiveFields = ['aadhaar', 'pan', 'panNumber'];

  for (const key in masked) {
    if (masked.hasOwnProperty(key)) {
      const lowerKey = key.toLowerCase();

      if (lowerKey === 'aadhaar') {
        masked[key] = maskAadhaar(masked[key]);
      } else if (lowerKey === 'pan' || lowerKey === 'pannumber') {
        masked[key] = maskPAN(masked[key]);
      } else if (typeof masked[key] === 'object') {
        masked[key] = maskSensitiveData(masked[key]);
      }
    }
  }

  return masked;
}
