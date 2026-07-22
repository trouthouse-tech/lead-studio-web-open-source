import { mapApiFailureToThunkStatus } from '@/api/_shared';
import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import type { AppThunk } from '@/store';
import { processNextQueueItem } from '@/api/lead-contact-email-queue';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Process the next item in the email queue (force send).
 * Backend may not implement this; non-2xx is handled by the UI.
 */
export const processEmailQueueThunk = (): AppThunk<ResponseType> => {
  return async (): ResponseType => {
    try {
      const response = await processNextQueueItem();

      if (response.success) return 200;
      return mapApiFailureToThunkStatus(response);
    } catch (error: unknown) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToProcessEmailQueue',
        message,
        stack,
        thunkName: 'processEmailQueueThunk',
      });
      console.error('❌ processEmailQueueThunk error:', error);
      return 500;
    }
  };
};
