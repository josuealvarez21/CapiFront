export {};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(name: string, params: Record<string, string | number> = {}) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', name, params);
}

export function trackCta(location: string, label: string) {
  trackEvent('cta_click', { location, label });
}

export function trackReferral() {
  if (typeof window === 'undefined') return;
  const ref = document.referrer || '';
  const source = /chatgpt\.com/i.test(ref)
    ? 'chatgpt.com'
    : /perplexity\.ai/i.test(ref)
      ? 'perplexity.ai'
      : null;
  if (source) trackEvent('llm_referral', { source });
}
