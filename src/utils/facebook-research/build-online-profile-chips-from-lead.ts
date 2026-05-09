import type { Lead } from '@/model';

export type OnlineProfileChip = {
  label: string;
  url: string | null;
  icon: string;
};

/**
 * URLs from lead enrichment (Google + scrapers). Only shows fields we store.
 */
export const buildOnlineProfileChipsFromLead = (lead: Lead): OnlineProfileChip[] => {
  const website =
    lead.website?.trim() ||
    (lead.website_urls && lead.website_urls[0]?.trim()) ||
    null;
  return [
    { label: 'Website', url: website, icon: '🌐' },
    { label: 'Facebook', url: lead.facebook_url?.trim() || null, icon: '📘' },
    { label: 'Instagram', url: lead.instagram_url?.trim() || null, icon: '📷' },
    { label: 'LinkedIn', url: lead.linkedin_url?.trim() || null, icon: '💼' },
    { label: 'Google Reviews', url: lead.google_reviews_url?.trim() || null, icon: '📍' },
  ];
};
