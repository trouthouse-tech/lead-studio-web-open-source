import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import type { AppThunk } from '@/store';
import { LeadContactEmailQueueActions } from '../../dumps/leadContactEmailQueue';
import { deleteQueueItem } from '@/api/lead-contact-email-queue';
import { mapApiFailureToThunkStatus } from '@/api/_shared';

type ResponseType = Promise<200 | 400 | 500>;

export const deleteQueueItemThunk = (itemId: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await deleteQueueItem(itemId);

      if (!response.success) {
        console.error('Failed to delete queue item:', response.error);
        return mapApiFailureToThunkStatus(response);
      }

      dispatch(LeadContactEmailQueueActions.removeQueueItem(itemId));
      return 200;
    } catch (error: unknown) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToDeleteQueueItem',
        message,
        stack,
        thunkName: 'deleteQueueItemThunk',
      });
      console.error('❌ deleteQueueItemThunk error:', error);
      return 500;
    }
  };
};
