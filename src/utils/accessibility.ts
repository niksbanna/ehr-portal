/**
 * Accessibility Utilities
 * Helpers for WCAG compliance - focus management, ARIA labels, keyboard navigation
 */

/**
 * Manages focus trap within a modal or dialog
 * Ensures keyboard users can't tab outside the modal
 */
export class FocusTrap {
  private element: HTMLElement;
  private previousFocus: HTMLElement | null = null;
  private focusableElements: HTMLElement[] = [];

  constructor(element: HTMLElement) {
    this.element = element;
    this.previousFocus = document.activeElement as HTMLElement;
  }

  activate(): void {
    this.updateFocusableElements();
    this.element.addEventListener('keydown', this.handleKeyDown);

    // Focus first focusable element
    if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus();
    }
  }

  deactivate(): void {
    this.element.removeEventListener('keydown', this.handleKeyDown);

    // Restore focus to previous element
    if (this.previousFocus) {
      this.previousFocus.focus();
    }
  }

  private updateFocusableElements(): void {
    const focusableSelectors = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ];

    this.focusableElements = Array.from(
      this.element.querySelectorAll(focusableSelectors.join(', '))
    ) as HTMLElement[];
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Tab') return;

    this.updateFocusableElements();

    if (this.focusableElements.length === 0) return;

    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[this.focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };
}

/**
 * Generates a unique ID for ARIA labelledby/describedby
 */
let idCounter = 0;
export function generateId(prefix: string = 'a11y'): string {
  return `${prefix}-${++idCounter}`;
}

/**
 * Announces a message to screen readers using ARIA live region
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Checks if element meets WCAG contrast ratio requirements
 * @param foreground - RGB color of text
 * @param background - RGB color of background
 * @param level - WCAG level ('AA' or 'AAA')
 * @param largeText - Whether text is large (18pt+ or 14pt+ bold)
 */
export function meetsContrastRequirements(
  foreground: { r: number; g: number; b: number },
  background: { r: number; g: number; b: number },
  level: 'AA' | 'AAA' = 'AA',
  largeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);

  if (level === 'AAA') {
    return largeText ? ratio >= 4.5 : ratio >= 7;
  }

  // AA requirements
  return largeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Calculates contrast ratio between two colors
 */
function getContrastRatio(
  color1: { r: number; g: number; b: number },
  color2: { r: number; g: number; b: number }
): number {
  const l1 = getRelativeLuminance(color1);
  const l2 = getRelativeLuminance(color2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculates relative luminance for a color
 */
function getRelativeLuminance(color: { r: number; g: number; b: number }): number {
  const rgb = [color.r, color.g, color.b].map((val) => {
    const sRGB = val / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

/**
 * Ensures an element has appropriate ARIA labels
 */
export function ensureAriaLabel(element: HTMLElement, label: string): void {
  if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
    element.setAttribute('aria-label', label);
  }
}
