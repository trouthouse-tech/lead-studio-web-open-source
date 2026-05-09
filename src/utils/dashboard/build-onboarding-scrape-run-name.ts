/**
 * Human-readable label for a Google Maps scrape run created from onboarding.
 */
export const buildOnboardingScrapeRunName = (businessType: string): string => {
  const date = new Date().toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
  return `${businessType.trim()} – ${date}`;
};
