import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import type { AppThunk } from '@/store';
import { getAttachmentsByEmailId } from '@/api/lead-contact-email-attachments';
import { LeadContactEmailAttachmentsActions } from '../../dumps/leadContactEmailAttachments';
import { CurrentLeadContactEmailActions } from '../../current';
import { mapApiFailureToThunkStatus } from '@/api/_shared';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Loads saved attachments for a draft email, merges them into the dump, and syncs `attachment_ids` on the current email draft.
 */
export const getLeadContactEmailAttachmentsByEmailIdThunk = (
  emailId: string
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const res = await getAttachmentsByEmailId(emailId);
      if (!res.success) {
        return mapApiFailureToThunkStatus(res);
      }
      const list = res.data ?? [];
      if (list.length) {
        dispatch(LeadContactEmailAttachmentsActions.addAttachments(list));
        dispatch(
          CurrentLeadContactEmailActions.updateFields({
            attachment_ids: list.map((a) => a.id),
          })
        );
      }
      return 200;
    } catch (error: unknown) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToGetLeadContactEmailAttachmentsByEmailId',
        message,
        stack,
        thunkName: 'getLeadContactEmailAttachmentsByEmailIdThunk',
      });
      console.error('❌ getLeadContactEmailAttachmentsByEmailIdThunk error:', error);
      return 500;
    }
  };
};
