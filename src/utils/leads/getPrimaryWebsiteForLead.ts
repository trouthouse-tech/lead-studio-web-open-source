import type { Lead } from '@/model';

/**
 * Primary site URL for display and crawl: `website`, else first `website_urls` entry.
 */
export const getPrimaryWebsiteForLead = (lead: Lead): string | null => {
  const w = lead.website?.trim();
  if (w) return w;
  const first = lead.website_urls?.find((u) => u?.trim());
  return first?.trim() ?? null;
};
