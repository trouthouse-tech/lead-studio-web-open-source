import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import type { AppThunk } from '@/store';
import { mapApiFailureToThunkStatus } from '@/api/_shared';
import { uploadAttachment, type UploadAttachmentInput } from '@/api/lead-contact-email-attachments';
import { LeadContactEmailAttachmentsActions } from '../../dumps/leadContactEmailAttachments';
import type { LeadContactEmailAttachment } from '@/model/lead-contact-email-attachment';

export type UploadLeadContactEmailAttachmentThunkResult =
  | { status: 200; data: LeadContactEmailAttachment }
  | { status: 400; error: string }
  | { status: 500; error: string };

type ResponseType = Promise<UploadLeadContactEmailAttachmentThunkResult>;

/**
 * Uploads a draft email attachment and stores the returned row in `leadContactEmailAttachments`.
 */
export const uploadLeadContactEmailAttachmentThunk = (
  input: UploadAttachmentInput
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await uploadAttachment(input);
      if (!response.success || !response.data) {
        return {
          status: mapApiFailureToThunkStatus(response),
          error: response.error || 'Upload failed',
        };
      }
      dispatch(LeadContactEmailAttachmentsActions.addAttachment(response.data));
      return { status: 200, data: response.data };
    } catch (error: unknown) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToUploadLeadContactEmailAttachment',
        message,
        stack,
        thunkName: 'uploadLeadContactEmailAttachmentThunk',
      });
      console.error('❌ uploadLeadContactEmailAttachmentThunk error:', error);
      return {
        status: 500,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  };
};
