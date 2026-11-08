/**
 * Google Analytics 4 (GA4) Integration
 * 
 * Kullanıcı etkileşimlerini takip etmek için Google Analytics kütüphanesi.
 */

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

/**
 * Initialize GA4
 */
export function initGA4(trackingId: string) {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', trackingId);
}

/**
 * Track page view in GA4
 */
export function trackPageView(url: string) {
  if (typeof window === 'undefined' || !window.gtag) return;

  try {
    window.gtag('event', 'page_view', {
      page_path: url,
    });
  } catch (error) {
    console.error('GA4 page view tracking failed:', error);
  }
}

/**
 * Track custom event in GA4
 */
export function trackGA4Event(name: string, params?: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined' || !window.gtag) return;

  try {
    window.gtag('event', name, params);
  } catch (error) {
    console.error('GA4 event tracking failed:', error);
  }
}
