import type { Lead } from '@/model';

/**
 * Leads created by Google Maps Places scrape use `idempotency_key` shaped as
 * `gmaps-places:{scrapeRunId}:{placeId}` (see mentorai-server processGoogleMapsScrapeTrigger).
 */
export const filterLeadsFromGoogleMapsScrapeRun = (
  leads: Lead[],
  scrapeRunId: string
): Lead[] => {
  const prefix = `gmaps-places:${scrapeRunId}:`;
  return leads.filter(
    (l) => typeof l.idempotency_key === 'string' && l.idempotency_key.startsWith(prefix)
  );
};
