import { postLeadDescriptionFromStoredCrawl } from '@/api/leads';
import type { AppThunk } from '../../store';

export type LeadDescriptionFromStoredCrawlOutcome =
  | { ok: true }
  | { ok: false; message: string };

/**
 * POST description-from-stored-crawl for current lead (Express /api/services/lead-description-from-stored-crawl, no Apify).
 */
export const runLeadDescriptionFromStoredCrawlThunk = (): AppThunk<
  Promise<LeadDescriptionFromStoredCrawlOutcome>
> => {
  return async (_dispatch, getState) => {
    const leadId = getState().currentLead.id;
    if (!leadId) {
      return { ok: false, message: 'No lead selected' };
    }

    const result = await postLeadDescriptionFromStoredCrawl(leadId);
    const json = (result.data ?? result) as {
      success?: boolean;
      error?: string;
      message?: string;
    };

    if (result.httpStatus === 401) {
      return {
        ok: false,
        message: 'Unauthorized. Check CRON_SECRET configuration.',
      };
    }

    if (json.error === 'no_stored_crawl' || json.error === 'no_pages_in_stored_crawl') {
      return {
        ok: false,
        message:
          json.message || 'No stored website crawl. Run web research first.',
      };
    }

    if (!result.success) {
      return {
        ok: false,
        message: json.message || json.error || result.error || 'Request failed',
      };
    }

    if (json.success === false) {
      return {
        ok: false,
        message: json.error || 'AI summarization failed',
      };
    }

    return { ok: true };
  };
};
