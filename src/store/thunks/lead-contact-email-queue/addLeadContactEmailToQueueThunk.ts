import type { AppThunk } from '@/store';
import { addToQueue, type AddToQueueInput } from '@/api/lead-contact-email-queue';
import { LeadContactEmailQueueActions } from '../../dumps/leadContactEmailQueue';

export type AddLeadContactEmailToQueueThunkResult =
  | { ok: true }
  | { ok: false; error: string };

type ResponseType = Promise<AddLeadContactEmailToQueueThunkResult>;

/**
 * Enqueues a lead contact email for scheduled sending and merges the queue row into Redux.
 */
export const addLeadContactEmailToQueueThunk = (
  input: AddToQueueInput
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await addToQueue(input);
      if (!response.success || !response.data) {
        return {
          ok: false,
          error: response.error || 'Queue failed.',
        };
      }
      const normalized = {
        ...response.data,
        persona_id: response.data.persona_id ?? null,
      };
      dispatch(LeadContactEmailQueueActions.updateQueueItem(normalized));
      return { ok: true };
    } catch (error: unknown) {
      console.error('❌ addLeadContactEmailToQueueThunk error:', error);
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Queue failed.',
      };
    }
  };
};
