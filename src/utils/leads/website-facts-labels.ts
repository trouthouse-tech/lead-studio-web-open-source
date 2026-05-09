import type { Lead, LeadSummaryWebsiteFacts } from '@/model';

/** Display order for `lead.summary.facts` (website AI extraction). */
export const WEBSITE_FACT_ROWS: { key: keyof LeadSummaryWebsiteFacts; label: string }[] = [
  { key: 'residential_vs_commercial', label: 'Residential vs commercial' },
  { key: 'business_model', label: 'Business model' },
  { key: 'primary_services', label: 'Primary services' },
  { key: 'service_area', label: 'Service area' },
  { key: 'years_in_business', label: 'Years in business' },
  { key: 'team_size', label: 'Team size' },
  { key: 'certifications_or_licenses', label: 'Certifications / licenses' },
];

/**
 * True when any structured website fact on the lead has a non-empty string value.
 */
export const hasWebsiteFactsContent = (lead: Lead): boolean => {
  const facts = lead.summary?.facts;
  return WEBSITE_FACT_ROWS.some(({ key }) => {
    const raw = facts?.[key];
    return typeof raw === 'string' && raw.trim() !== '';
  });
};
