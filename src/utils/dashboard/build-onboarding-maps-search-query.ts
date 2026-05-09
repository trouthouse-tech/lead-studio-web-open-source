/**
 * Builds the Places API text search string for dashboard onboarding.
 * Uses business type + postal area so results stay local to the user's market.
 * Google Places Text Search accepts queries like "plumbers near 19103" without a separate geocode step.
 *
 * @param businessType - User label (e.g. "plumbers", "coffee shops")
 * @param postalCode - ZIP/postal code (US assumed; extend if you add country)
 */
export const buildOnboardingMapsSearchQuery = (
  businessType: string,
  postalCode: string
): string => {
  const type = businessType.trim();
  const zip = postalCode.trim();
  return `${type} near ${zip}`;
};
