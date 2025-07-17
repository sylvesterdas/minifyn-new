// This file is adapted from the official Next.js + GA4 example:
// https://github.com/vercel/next.js/blob/canary/examples/with-google-analytics/lib/gtag.js

type GTagEvent = {
  action: string;
  category: string;
  label: string;
  value?: number;
};

// Log the event
export const trackEvent = ({ action, category, label, value }: GTagEvent) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[GA_EVENT]`, { action, category, label, value });
    return;
  }

  // Check if gtag is available
  if (typeof window.gtag !== 'function') {
    return;
  }
  
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
