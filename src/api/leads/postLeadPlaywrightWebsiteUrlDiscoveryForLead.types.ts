/**
 * Response from Express POST /api/services/lead-playwright-website-url-discovery.
 */
export type PostLeadPlaywrightWebsiteUrlDiscoveryResponseBody = {
  success?: boolean;
  error?: string;
  message?: string;
  leadUpdated?: boolean;
  linkCount?: number;
  websiteUrls?: string[];
};
