import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import { mapApiFailureToThunkStatus } from '@/api/_shared';
import type { AppThunk } from '@/store';
import { LeadContactEmailsActions } from '../../dumps/leadContactEmails';
import {
  createLeadContactEmail,
  updateLeadContactEmail,
  type CreateLeadContactEmailInput,
  type UpdateLeadContactEmailInput,
} from '@/api/lead-contact-emails';
import type { LeadContactEmail } from '@/model/lead-contact-email';

type SaveSuccess = { status: 200; email: LeadContactEmail };
type ResponseType = Promise<SaveSuccess | 400 | 500>;

export const saveCurrentLeadContactEmailThunk = (emailData: {
  id?: string;
  lead_id: string;
  lead_contact_id: string;
  subject: string;
  body: CreateLeadContactEmailInput['body'];
  campaign_ids?: string[];
  email_sending_identity_id?: string | null;
  cold_email_offering_id?: string | null;
}): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      if (emailData.id) {
        const updates: UpdateLeadContactEmailInput = {
          subject: emailData.subject,
          body: emailData.body,
          campaign_ids: emailData.campaign_ids,
          email_sending_identity_id: emailData.email_sending_identity_id,
          cold_email_offering_id: emailData.cold_email_offering_id,
        };
        const response = await updateLeadContactEmail(emailData.id, updates);
        if (!response.success || !response.data) return mapApiFailureToThunkStatus(response);
        dispatch(LeadContactEmailsActions.updateLeadContactEmail(response.data));
        return { status: 200, email: response.data };
      }
      const createData: CreateLeadContactEmailInput = {
        lead_id: emailData.lead_id,
        lead_contact_id: emailData.lead_contact_id,
        subject: emailData.subject,
        body: emailData.body,
        campaign_ids: emailData.campaign_ids || [],
        email_sending_identity_id: emailData.email_sending_identity_id,
        cold_email_offering_id: emailData.cold_email_offering_id,
      };
      const response = await createLeadContactEmail(createData);
      if (!response.success || !response.data) return mapApiFailureToThunkStatus(response);
      dispatch(LeadContactEmailsActions.addLeadContactEmails([response.data]));
      return { status: 200, email: response.data };
    } catch (error) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToSaveCurrentLeadContactEmail',
        message,
        stack,
        thunkName: 'saveCurrentLeadContactEmailThunk',
      });
      console.error('saveCurrentLeadContactEmailThunk:', error);
      return 500;
    }
  };
};
