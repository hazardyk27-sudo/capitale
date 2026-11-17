// Single source of truth for the current Terms & Conditions version. Bumping
// CURRENT_TERMS_VERSION requires every user (including ones who accepted an
// older version) to accept again before checkout — see server/terms-routes.ts
// and client/src/pages/terms.tsx. Prior acceptances are never deleted/overwritten.
export const CURRENT_TERMS_VERSION = "2.0";
export const CURRENT_TERMS_EFFECTIVE_DATE = "2026-08-19"; // ISO date, stored with each acceptance
export const CURRENT_TERMS_EFFECTIVE_DATE_LABEL = "August 19, 2026"; // display label on the Terms page
