import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import type { AppThunk } from '@/store';
import { deleteAttachment } from '@/api/lead-contact-email-attachments';
import { LeadContactEmailAttachmentsActions } from '../../dumps/leadContactEmailAttachments';
import { CurrentLeadContactEmailActions } from '../../current';
import { mapApiFailureToThunkStatus } from '@/api/_shared';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Deletes a saved attachment row and removes it from the current draft's id list.
 */
export const deleteLeadContactEmailAttachmentThunk = (
  attachmentId: string
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const res = await deleteAttachment(attachmentId);
      if (!res.success) {
        return mapApiFailureToThunkStatus(res);
      }
      dispatch(LeadContactEmailAttachmentsActions.removeAttachment(attachmentId));
      dispatch(CurrentLeadContactEmailActions.removeAttachmentId(attachmentId));
      return 200;
    } catch (error: unknown) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToDeleteLeadContactEmailAttachment',
        message,
        stack,
        thunkName: 'deleteLeadContactEmailAttachmentThunk',
      });
      console.error('❌ deleteLeadContactEmailAttachmentThunk error:', error);
      return 500;
    }
  };
};
