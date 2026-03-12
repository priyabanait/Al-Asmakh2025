export const FALLBACK_PROPERTY_IMAGE = "/images/fallback-property.png";

/**
 * Safely normalise an image URL.
 * - Returns a valid URL string or the shared fallback image.
 * - Treats missing/empty/invalid URLs and legacy "/div.property-thumbnail-wrapper.png"
 *   paths as fallback.
 */
export function getSafeImage(url) {
  if (!url || typeof url !== "string") return FALLBACK_PROPERTY_IMAGE;

  const trimmed = url.trim();
  if (!trimmed) return FALLBACK_PROPERTY_IMAGE;

  // Guard against old invalid placeholder path
  if (trimmed === "/div.property-thumbnail-wrapper.png") {
    return FALLBACK_PROPERTY_IMAGE;
  }

  // Allow absolute URLs (http/https) and root‑relative paths
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("/")) {
    return trimmed;
  }

  // Everything else falls back
  return FALLBACK_PROPERTY_IMAGE;
}

/**
 * One‑time onError handler for <img> / next/image that prevents infinite loops.
 *
 * Usage:
 *   <Image onError={handleImageErrorOnce} ... />
 */
export function handleImageErrorOnce(e) {
  const img = e.currentTarget;
  if (!img || typeof img !== "object") return;

  if (img.dataset && img.dataset.fallback === "true") {
    // Already replaced once – do nothing to avoid infinite loop
    return;
  }

  if (img.dataset) {
    img.dataset.fallback = "true";
  }

  img.src = FALLBACK_PROPERTY_IMAGE;
}

