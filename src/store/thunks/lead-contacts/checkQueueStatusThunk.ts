import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import type { AppThunk } from '@/store';
import { LeadContactBuilderActions } from '../../builders';
import { getAllQueueItems } from '@/api/lead-contact-email-queue';
import { mapApiFailureToThunkStatus } from '@/api/_shared';

type ResponseType = Promise<200 | 400 | 500>;

export const checkQueueStatusThunk = (
  contactId: string
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getAllQueueItems({
        lead_contact_id: contactId,
      });
      if (response.success && response.data) {
        const activeItem = response.data.find(
          (item) => item.status === 'queued' || item.status === 'sending'
        );
        dispatch(
          LeadContactBuilderActions.setQueueStatus(
            activeItem
              ? { status: activeItem.status, id: activeItem.id }
              : null
          )
        );
        return 200;
      }
      return mapApiFailureToThunkStatus(response);
    } catch (error) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToCheckQueueStatus',
        message,
        stack,
        thunkName: 'checkQueueStatusThunk',
      });
      console.error('Failed to check queue status:', error);
      return 500;
    }
  };
};
