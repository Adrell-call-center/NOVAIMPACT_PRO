export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://novaimpactltd.com";
export const SITE_NAME = "Nova Impact";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/imgs/logo/footer-logo-white.png`;
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export function absoluteUrl(path = "") {
  if (!path) return SITE_URL;
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
