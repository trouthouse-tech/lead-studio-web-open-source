import type { AppThunk } from '../../store';
import { postLeadDescriptionFromStoredCrawl } from '@/api/leads';

export type LeadDescriptionFromStoredCrawlOutcome =
  | { ok: true }
  | { ok: false; message: string };

/**
 * POST description-from-stored-crawl for current lead (Next proxy → Express, no Apify).
 */
export const runLeadDescriptionFromStoredCrawlThunk = (): AppThunk<
  Promise<LeadDescriptionFromStoredCrawlOutcome>
> => {
  return async (_dispatch, getState) => {
    const leadId = getState().currentLead.id;
    if (!leadId) {
      return { ok: false, message: 'No lead selected' };
    }

    try {
      const res = await postLeadDescriptionFromStoredCrawl(leadId);
      const text = await res.text();
      let json: { success?: boolean; error?: string; message?: string } = {};
      try {
        json = JSON.parse(text) as { success?: boolean; error?: string; message?: string };
      } catch {
        return { ok: false, message: 'Invalid response from server' };
      }

      if (res.status === 401) {
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

      if (!res.ok) {
        return {
          ok: false,
          message: json.message || json.error || 'Request failed',
        };
      }

      if (json.success === false) {
        return {
          ok: false,
          message: json.error || 'AI summarization failed',
        };
      }

      return { ok: true };
    } catch (error: unknown) {
      console.error('runLeadDescriptionFromStoredCrawlThunk:', error);
      return {
        ok: false,
        message: error instanceof Error ? error.message : 'Network error',
      };
    }
  };
};
