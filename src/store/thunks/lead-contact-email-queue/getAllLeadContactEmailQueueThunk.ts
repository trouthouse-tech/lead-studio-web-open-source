import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import type { AppThunk } from '@/store';
import { LeadContactEmailQueueActions } from '../../dumps/leadContactEmailQueue';
import { getAllQueueItems } from '@/api/lead-contact-email-queue';
import { mapApiFailureToThunkStatus } from '@/api/_shared';

type ResponseType = Promise<200 | 400 | 500>;

export const getAllLeadContactEmailQueueThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getAllQueueItems();

      if (response.success && response.data) {
        const normalized = response.data.map((item) => ({
          ...item,
          persona_id: item.persona_id ?? null,
        }));
        dispatch(LeadContactEmailQueueActions.addQueueItems(normalized));
        return 200;
      }

      if (
        response.error?.includes('not found') ||
        response.error?.includes('Invalid response')
      ) {
        dispatch(LeadContactEmailQueueActions.addQueueItems([]));
        return 200;
      }

      return mapApiFailureToThunkStatus(response);
    } catch (error: unknown) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToGetAllLeadContactEmailQueue',
        message,
        stack,
        thunkName: 'getAllLeadContactEmailQueueThunk',
      });
      console.error('❌ getAllLeadContactEmailQueueThunk error:', error);
      return 500;
    }
  };
};
