const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1936097721102290";
const STORAGE_KEY = "novaimpact-marketing-consent";

export function readConsent() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    // Blocked or cleared storage: treat as "no choice yet" and ask again.
    return null;
  }
}

export function writeConsent(value) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // The choice still applies to this page view, it just will not be remembered.
  }
}

let pixelLoaded = false;

// Meta's base pixel, loaded only once marketing consent has been granted.
export function loadMetaPixel() {
  if (pixelLoaded || typeof window === "undefined") return;
  pixelLoaded = true;

  if (!window.fbq) {
    const fbq = function (...args) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    };
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.push = fbq;
    window.fbq = fbq;
    window._fbq = fbq;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }

  // Calls made before the script arrives are queued by the stub above.
  window.fbq("init", PIXEL_ID);
  window.fbq("track", "PageView");
}

// Client-side navigations do not reload the base pixel, so count them here.
export function trackPageView() {
  if (!pixelLoaded) return;
  window.fbq?.("track", "PageView");
}

// Meta standard Lead event. No form values are sent.
export function trackLead() {
  if (!pixelLoaded) return;
  window.fbq?.("track", "Lead");
}
