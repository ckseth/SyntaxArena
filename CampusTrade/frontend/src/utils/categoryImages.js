/**
 * Category-based fallback images for product cards.
 * These are inline SVG data URIs — no external dependencies needed.
 * Each SVG is a clean, minimal placeholder matching the category theme.
 */

const CATEGORY_IMAGES = {
  Electronics: `data:image/svg+xml,${encodeURIComponent(`<svg width="400" height="500" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="500" fill="#EEF2FF"/><rect x="130" y="160" width="140" height="100" rx="12" stroke="#818CF8" stroke-width="6" fill="none"/><circle cx="200" cy="210" r="25" stroke="#818CF8" stroke-width="5" fill="#C7D2FE"/><line x1="160" y1="280" x2="240" y2="280" stroke="#818CF8" stroke-width="4" stroke-linecap="round"/><rect x="175" y="300" width="50" height="8" rx="4" fill="#C7D2FE"/><text x="200" y="380" text-anchor="middle" fill="#6366F1" font-family="system-ui" font-size="16" font-weight="700">Electronics</text></svg>`)}`,

  Books: `data:image/svg+xml,${encodeURIComponent(`<svg width="400" height="500" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="500" fill="#FEF3C7"/><rect x="140" y="150" width="120" height="160" rx="8" stroke="#D97706" stroke-width="5" fill="#FDE68A"/><rect x="155" y="170" width="90" height="6" rx="3" fill="#D97706"/><rect x="155" y="185" width="70" height="6" rx="3" fill="#D97706"/><rect x="155" y="200" width="80" height="6" rx="3" fill="#D97706"/><line x1="200" y1="150" x2="200" y2="310" stroke="#D97706" stroke-width="3"/><text x="200" y="380" text-anchor="middle" fill="#B45309" font-family="system-ui" font-size="16" font-weight="700">Books</text></svg>`)}`,

  Furniture: `data:image/svg+xml,${encodeURIComponent(`<svg width="400" height="500" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="500" fill="#ECFDF5"/><rect x="130" y="180" width="140" height="80" rx="12" stroke="#059669" stroke-width="5" fill="#A7F3D0"/><rect x="140" y="260" width="10" height="50" rx="3" fill="#059669"/><rect x="250" y="260" width="10" height="50" rx="3" fill="#059669"/><rect x="125" y="170" width="150" height="20" rx="6" fill="#059669"/><text x="200" y="380" text-anchor="middle" fill="#047857" font-family="system-ui" font-size="16" font-weight="700">Furniture</text></svg>`)}`,

  Vehicles: `data:image/svg+xml,${encodeURIComponent(`<svg width="400" height="500" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="500" fill="#F0F9FF"/><ellipse cx="200" cy="260" rx="100" ry="40" stroke="#0284C7" stroke-width="5" fill="#BAE6FD"/><circle cx="160" cy="260" r="18" stroke="#0284C7" stroke-width="4" fill="#E0F2FE"/><circle cx="240" cy="260" r="18" stroke="#0284C7" stroke-width="4" fill="#E0F2FE"/><path d="M140 220 L170 180 L230 180 L260 220" stroke="#0284C7" stroke-width="5" fill="#BAE6FD" stroke-linejoin="round"/><text x="200" y="380" text-anchor="middle" fill="#0369A1" font-family="system-ui" font-size="16" font-weight="700">Vehicles</text></svg>`)}`,

  'Traditional & Ethnic Wear': `data:image/svg+xml,${encodeURIComponent(`<svg width="400" height="500" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="500" fill="#FFF1F2"/><path d="M200 150 L230 180 L230 300 L170 300 L170 180 Z" stroke="#E11D48" stroke-width="4" fill="#FECDD3"/><path d="M170 180 L140 200 L140 230 L170 220" stroke="#E11D48" stroke-width="4" fill="#FECDD3"/><path d="M230 180 L260 200 L260 230 L230 220" stroke="#E11D48" stroke-width="4" fill="#FECDD3"/><circle cx="200" cy="195" r="6" fill="#E11D48"/><rect x="185" y="240" width="30" height="4" rx="2" fill="#E11D48"/><rect x="190" y="250" width="20" height="4" rx="2" fill="#E11D48"/><text x="200" y="380" text-anchor="middle" fill="#BE123C" font-family="system-ui" font-size="14" font-weight="700">Traditional Wear</text></svg>`)}`,

  Miscellaneous: `data:image/svg+xml,${encodeURIComponent(`<svg width="400" height="500" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="500" fill="#F5F3FF"/><rect x="150" y="170" width="100" height="100" rx="16" stroke="#7C3AED" stroke-width="5" fill="#DDD6FE"/><circle cx="180" cy="210" r="10" fill="#7C3AED"/><circle cx="220" cy="210" r="10" fill="#7C3AED"/><path d="M180 240 Q200 260 220 240" stroke="#7C3AED" stroke-width="4" fill="none" stroke-linecap="round"/><text x="200" y="380" text-anchor="middle" fill="#6D28D9" font-family="system-ui" font-size="16" font-weight="700">Miscellaneous</text></svg>`)}`,

  // Legacy categories that may exist in older product data
  'Lab Gear': `data:image/svg+xml,${encodeURIComponent(`<svg width="400" height="500" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="500" fill="#F0FDFA"/><path d="M180 160 L180 230 L150 290 L250 290 L220 230 L220 160" stroke="#0D9488" stroke-width="5" fill="#99F6E4" stroke-linejoin="round"/><line x1="175" y1="160" x2="225" y2="160" stroke="#0D9488" stroke-width="5" stroke-linecap="round"/><circle cx="190" cy="260" r="8" fill="#0D9488"/><circle cx="215" cy="250" r="5" fill="#0D9488"/><text x="200" y="380" text-anchor="middle" fill="#0F766E" font-family="system-ui" font-size="16" font-weight="700">Lab Gear</text></svg>`)}`,

  Stationery: `data:image/svg+xml,${encodeURIComponent(`<svg width="400" height="500" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="500" fill="#FFF7ED"/><rect x="170" y="150" width="60" height="170" rx="4" stroke="#EA580C" stroke-width="4" fill="#FED7AA"/><polygon points="185,320 200,350 215,320" fill="#EA580C"/><line x1="185" y1="170" x2="215" y2="170" stroke="#EA580C" stroke-width="3"/><circle cx="200" cy="160" r="4" fill="#EA580C"/><text x="200" y="380" text-anchor="middle" fill="#C2410C" font-family="system-ui" font-size="16" font-weight="700">Stationery</text></svg>`)}`,

  Sports: `data:image/svg+xml,${encodeURIComponent(`<svg width="400" height="500" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="500" fill="#FEF9C3"/><circle cx="200" cy="220" r="50" stroke="#CA8A04" stroke-width="5" fill="#FEF08A"/><path d="M170 195 Q200 230 230 195" stroke="#CA8A04" stroke-width="3" fill="none"/><path d="M170 245 Q200 210 230 245" stroke="#CA8A04" stroke-width="3" fill="none"/><line x1="200" y1="170" x2="200" y2="270" stroke="#CA8A04" stroke-width="3"/><text x="200" y="380" text-anchor="middle" fill="#A16207" font-family="system-ui" font-size="16" font-weight="700">Sports</text></svg>`)}`,

  Apparel: `data:image/svg+xml,${encodeURIComponent(`<svg width="400" height="500" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="500" fill="#FCE7F3"/><path d="M175 170 L155 190 L130 180 L145 230 L165 220 L165 300 L235 300 L235 220 L255 230 L270 180 L245 190 L225 170" stroke="#DB2777" stroke-width="4" fill="#FBCFE8" stroke-linejoin="round"/><path d="M175 170 Q200 195 225 170" stroke="#DB2777" stroke-width="4" fill="none"/><text x="200" y="380" text-anchor="middle" fill="#BE185D" font-family="system-ui" font-size="16" font-weight="700">Apparel</text></svg>`)}`,

  Others: `data:image/svg+xml,${encodeURIComponent(`<svg width="400" height="500" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="500" fill="#F1F5F9"/><rect x="155" y="170" width="90" height="110" rx="12" stroke="#475569" stroke-width="5" fill="#CBD5E1"/><circle cx="200" cy="215" r="20" stroke="#475569" stroke-width="4" fill="#E2E8F0"/><rect x="190" y="250" width="20" height="15" rx="4" fill="#475569"/><text x="200" y="380" text-anchor="middle" fill="#334155" font-family="system-ui" font-size="16" font-weight="700">Others</text></svg>`)}`,
};

// Default fallback for any unrecognized category
const DEFAULT_PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent(`<svg width="400" height="500" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="500" fill="#EEF2FF"/><rect x="155" y="175" width="90" height="110" rx="16" stroke="#818CF8" stroke-width="5" fill="#C7D2FE"/><circle cx="200" cy="220" r="20" stroke="#818CF8" stroke-width="4" fill="#E0E7FF"/><rect x="185" y="255" width="30" height="10" rx="5" fill="#818CF8"/><text x="200" y="380" text-anchor="middle" fill="#6366F1" font-family="system-ui" font-size="16" font-weight="700">Product</text></svg>`)}`;

/**
 * Returns a category-appropriate fallback image (SVG data URI)
 * @param {string} category - Product category name
 * @returns {string} SVG data URI string
 */
export const getCategoryFallbackImage = (category) => {
  if (!category) return DEFAULT_PLACEHOLDER;
  return CATEGORY_IMAGES[category] || DEFAULT_PLACEHOLDER;
};

export default CATEGORY_IMAGES;
