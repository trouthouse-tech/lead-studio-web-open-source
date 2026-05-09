/**
 * Response from Express POST /api/services/lead-same-domain-url-discovery.
 */
export type PostLeadSameDomainUrlDiscoveryResponseBody = {
  success?: boolean;
  error?: string;
  message?: string;
  leadUpdated?: boolean;
  linkCount?: number;
  websiteUrls?: string[];
  skipped?: boolean;
  skippedReason?: string;
};
