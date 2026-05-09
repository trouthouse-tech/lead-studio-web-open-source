import type { AppThunk } from '@/store';
import { sendNow, type SendNowInput } from '@/api/lead-contact-emails';

export type SendLeadContactEmailNowThunkResult =
  | { ok: true }
  | { ok: false; error: string };

type ResponseType = Promise<SendLeadContactEmailNowThunkResult>;

/**
 * Sends a saved draft email immediately via the outbound send-now endpoint.
 */
export const sendLeadContactEmailNowThunk = (
  input: SendNowInput
): AppThunk<ResponseType> => {
  return async (): ResponseType => {
    try {
      const response = await sendNow(input);
      if (!response.success) {
        return {
          ok: false,
          error: response.error || 'Send failed',
        };
      }
      return { ok: true };
    } catch (error: unknown) {
      console.error('❌ sendLeadContactEmailNowThunk error:', error);
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Send failed',
      };
    }
  };
};
