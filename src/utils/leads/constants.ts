/** Native `title` when the leads **list row** Facebook search is disabled (one run per lead from the table). */
export const FACEBOOK_GOOGLE_SEARCH_RUN_DISABLED_TITLE =
  'Facebook search from this row can only be run once per lead. Open the lead to search again from Online profiles, or edit the Facebook URL manually.';

/** Native `title` when Playwright site URL discovery is disabled (one run per lead). */
export const PLAYWRIGHT_WEBSITE_URL_DISCOVERY_RUN_DISABLED_TITLE =
  'Site page URL discovery can only be run once per lead. Edit same-domain URLs on the lead manually if needed.';

export const LEAD_STATUSES: { value: string; label: string }[] = [
  { value: 'not_contacted', label: 'Not contacted' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'not_answered', label: 'Not answered' },
  { value: 'lost', label: 'Lost' },
  { value: 'archived', label: 'Archived' },
];

export const QUALITY_FILTER_OPTIONS: {
  value: LeadQualityFilterValue;
  label: string;
}[] = [
  { value: 'all', label: 'All' },
  { value: 'unscored', label: 'Unscored' },
  { value: '<30', label: 'Under 30' },
  { value: '30-50', label: '30–50' },
  { value: '51-70', label: '51–70' },
  { value: '71+', label: '71+' },
];

export type LeadQualityFilterValue =
  | 'all'
  | 'unscored'
  | '<30'
  | '30-50'
  | '51-70'
  | '71+';

export type LeadWebsiteFilterValue = 'all' | 'has' | 'missing';

export const WEBSITE_FILTER_OPTIONS: {
  value: LeadWebsiteFilterValue;
  label: string;
}[] = [
  { value: 'all', label: 'Any website' },
  { value: 'has', label: 'Has website' },
  { value: 'missing', label: 'No website' },
];

/** At least one `LeadContact` in Redux for the lead (`getLeadIdsWithAtLeastOneContactSet`). */
export type LeadContactFilterValue = 'all' | 'has' | 'missing';

export const CONTACT_FILTER_OPTIONS: {
  value: LeadContactFilterValue;
  label: string;
}[] = [
  { value: 'all', label: 'Any contact' },
  { value: 'has', label: 'Has contact' },
  { value: 'missing', label: 'No contact' },
];

/** One automated Facebook Google search row exists for the lead (`facebook_google_search_attempted`). */
export type LeadFacebookSearchFilterValue = 'all' | 'attempted' | 'not_attempted';

export const FACEBOOK_SEARCH_FILTER_OPTIONS: {
  value: LeadFacebookSearchFilterValue;
  label: string;
}[] = [
  { value: 'all', label: 'Any FB search' },
  { value: 'attempted', label: 'FB search ran' },
  { value: 'not_attempted', label: 'FB search not run' },
];

/** One Playwright same-domain URL discovery row exists (`playwright_website_url_discovery_attempted`). */
export type LeadUrlDiscoveryFilterValue = 'all' | 'attempted' | 'not_attempted';

export const URL_DISCOVERY_FILTER_OPTIONS: {
  value: LeadUrlDiscoveryFilterValue;
  label: string;
}[] = [
  { value: 'all', label: 'Any URL discovery' },
  { value: 'attempted', label: 'URL discovery ran' },
  { value: 'not_attempted', label: 'URL discovery not run' },
];

/** At least one `website_scrape_runs` row (`website_research_attempted`). */
export type LeadWebsiteResearchFilterValue = 'all' | 'attempted' | 'not_attempted';

export const WEBSITE_RESEARCH_FILTER_OPTIONS: {
  value: LeadWebsiteResearchFilterValue;
  label: string;
}[] = [
  { value: 'all', label: 'Any site research' },
  { value: 'attempted', label: 'Site research ran' },
  { value: 'not_attempted', label: 'Site research not run' },
];
