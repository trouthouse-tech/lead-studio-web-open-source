import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import type { AppThunk } from '@/store';
import { addToQueue } from '@/api/lead-contact-email-queue';
import type { LeadContactEmailQueue } from '@/model/lead-contact-email-queue';
import { mapApiFailureToThunkStatus } from '@/api/_shared';

type ResponseType = Promise<200 | 400 | 500>;

export const requeueQueueItemThunk = (
  queueItem: LeadContactEmailQueue
): AppThunk<ResponseType> => {
  return async (): ResponseType => {
    try {
      if (!queueItem.lead_contact_email_id) {
        console.error('requeueQueueItemThunk: missing lead_contact_email_id');
        return 400;
      }
      const response = await addToQueue({
        lead_contact_id: queueItem.lead_contact_id,
        lead_id: queueItem.lead_id,
        persona_id: queueItem.persona_id,
        campaign_id: queueItem.campaign_id,
        lead_contact_email_id: queueItem.lead_contact_email_id,
      });

      if (!response.success) {
        console.error('Failed to re-queue item:', response.error);
        return mapApiFailureToThunkStatus(response);
      }

      return 200;
    } catch (error: unknown) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToRequeueQueueItem',
        message,
        stack,
        thunkName: 'requeueQueueItemThunk',
      });
      console.error('❌ requeueQueueItemThunk error:', error);
      return 500;
    }
  };
};
