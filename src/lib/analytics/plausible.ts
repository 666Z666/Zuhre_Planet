/**
 * Plausible Analytics Integration
 * 
 * Gizlilik odaklı analitik aracı Plausible'ın yapılandırması.
 */

declare global {
  interface Window {
    plausible: {
      (...args: unknown[]): void;
      q?: unknown[];
    };
  }
}

/**
 * Track custom event in Plausible
 */
export function trackEvent(name: string, props?: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined' || !window.plausible) return;

  try {
    window.plausible(name, { props });
  } catch (error) {
    console.error('Plausible event tracking failed:', error);
  }
}

/**
 * Initialize Plausible (if not via script tag)
 */
export function initPlausible() {
  if (typeof window === 'undefined') return;

  window.plausible = window.plausible || function(...args: unknown[]) {
    (window.plausible.q = window.plausible.q || []).push(args);
  };
}
