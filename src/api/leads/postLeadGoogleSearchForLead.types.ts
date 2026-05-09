/**
 * Haiku prompts used to map SERP rows to this business (filter unwanted URLs).
 */
export type GoogleSearchResolveSerpPrompts = {
  systemPrompt: string;
  userMessage: string;
};

/**
 * JSON body from Express POST /api/services/lead-google-search (per-platform SERP).
 * Facebook may run without a lead website (server uses a name/location-biased query); other flows may still expect a site.
 */
export type PostLeadGoogleSearchResponseBody = {
  success?: boolean;
  error?: string;
  message?: string;
  websiteUrls?: string[];
  linkCount?: number;
  hasProfiles?: boolean;
  leadUpdated?: boolean;
  skipped?: boolean;
  platform?: 'facebook' | 'instagram' | 'linkedin';
  resolveSerpPrompts?: GoogleSearchResolveSerpPrompts | null;
  /** Facebook: Apify skipped (e.g. `lead_has_complete_contact` when a contact has email and phone). */
  facebookApifySkipped?: string;
  /** Facebook: Apify actor error (SERP may still have succeeded). */
  facebookApifyError?: string;
  /** Facebook: a new `lead_contacts` row was created from Apify page data. */
  facebookContactCreated?: boolean;
  /** Facebook: an existing contact was updated (e.g. email added to phone-only row). */
  facebookContactMerged?: boolean;
};
