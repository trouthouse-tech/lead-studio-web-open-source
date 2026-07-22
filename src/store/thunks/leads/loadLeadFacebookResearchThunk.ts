import { mapApiFailureToThunkStatus } from '@/api/_shared';
import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import type { AppThunk } from '@/store';
import {
  getLeadFacebookResearch,
  type LeadFacebookResearchData,
} from '@/api/leads';

export type LoadLeadFacebookResearchResult =
  | { status: 200; data: LeadFacebookResearchData }
  | { status: 400; error: string }
  | { status: 500; error: string };

type ResponseType = Promise<LoadLeadFacebookResearchResult>;

/**
 * Fetches stored Facebook page/posts research payloads for a lead (read-only GET).
 */
export const loadLeadFacebookResearchThunk = (leadId: string): AppThunk<ResponseType> => {
  return async (): ResponseType => {
    try {
      const res = await getLeadFacebookResearch(leadId);
      if (!res.success || !res.data) {
        return {
          status: mapApiFailureToThunkStatus(res),
          error: res.error || 'Failed to load Facebook research',
        };
      }
      return { status: 200, data: res.data };
    } catch (error: unknown) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToLoadLeadFacebookResearch',
        message,
        stack,
        thunkName: 'loadLeadFacebookResearchThunk',
      });
      console.error('❌ loadLeadFacebookResearchThunk error:', error);
      return {
        status: 500,
        error: error instanceof Error ? error.message : 'Failed to load Facebook research',
      };
    }
  };
};
