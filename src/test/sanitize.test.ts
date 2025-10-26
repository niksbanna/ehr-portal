import { describe, it, expect } from 'vitest';
import { sanitizeHtml, sanitizeText, sanitizeRichText, sanitizeUrl } from '../utils/sanitize';

describe('Sanitization Utilities', () => {
  describe('sanitizeHtml', () => {
    it('should escape HTML special characters', () => {
      const input = '<script>alert("XSS")</script>';
      const output = sanitizeHtml(input);
      expect(output).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;');
    });

    it('should escape ampersands', () => {
      expect(sanitizeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
    });

    it('should handle empty strings', () => {
      expect(sanitizeHtml('')).toBe('');
    });
  });

  describe('sanitizeText', () => {
    it('should remove HTML tags and escape special characters', () => {
      const input = '<p>Hello <strong>World</strong></p>';
      const output = sanitizeText(input);
      expect(output).toBe('Hello World');
    });

    it('should handle script tags', () => {
      const input = 'Text <script>alert("XSS")</script> more text';
      const output = sanitizeText(input);
      expect(output).toBe('Text alert(&quot;XSS&quot;) more text');
    });
  });

  describe('sanitizeRichText', () => {
    it('should remove script tags', () => {
      const input = 'Safe text <script>alert("XSS")</script> more text';
      const output = sanitizeRichText(input);
      expect(output).not.toContain('<script>');
      expect(output).toContain('Safe text');
    });

    it('should remove event handlers', () => {
      const input = '<div onclick="alert(\'XSS\')">Click me</div>';
      const output = sanitizeRichText(input);
      expect(output).not.toContain('onclick');
    });

    it('should remove javascript: URIs', () => {
      const input = '<a href="javascript:alert(\'XSS\')">Link</a>';
      const output = sanitizeRichText(input);
      expect(output).not.toContain('javascript:');
    });

    it('should remove dangerous tags', () => {
      const input = 'Text <iframe src="evil.com"></iframe> more';
      const output = sanitizeRichText(input);
      expect(output).not.toContain('<iframe');
    });
  });

  describe('sanitizeUrl', () => {
    it('should allow http URLs', () => {
      const url = 'http://example.com';
      expect(sanitizeUrl(url)).toBe(url);
    });

    it('should allow https URLs', () => {
      const url = 'https://example.com';
      expect(sanitizeUrl(url)).toBe(url);
    });

    it('should allow mailto URLs', () => {
      const url = 'mailto:test@example.com';
      expect(sanitizeUrl(url)).toBe(url);
    });

    it('should block javascript: URLs', () => {
      const url = 'javascript:alert("XSS")';
      expect(sanitizeUrl(url)).toBe('');
    });

    it('should allow relative URLs', () => {
      expect(sanitizeUrl('/path/to/page')).toBe('/path/to/page');
      expect(sanitizeUrl('#anchor')).toBe('#anchor');
    });

    it('should block data: URLs', () => {
      const url = 'data:text/html,<script>alert("XSS")</script>';
      expect(sanitizeUrl(url)).toBe('');
    });
  });
});
