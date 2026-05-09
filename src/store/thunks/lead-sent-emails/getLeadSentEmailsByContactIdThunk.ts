import type { AppThunk } from '@/store';
import { LeadSentEmailsActions } from '../../dumps/leadSentEmails';
import { getLeadSentEmailsByContactId } from '@/api/lead-sent-emails';

type ResponseType = Promise<200 | 400 | 500>;

export const getLeadSentEmailsByContactIdThunk = (
  contactId: string
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getLeadSentEmailsByContactId(contactId);
      if (!response.success || !response.data) return 400;
      const normalized = response.data.map((item) => ({
        ...item,
        persona_id: item.persona_id ?? null,
      }));
      dispatch(LeadSentEmailsActions.addLeadSentEmails(normalized));
      return 200;
    } catch (error) {
      console.error('getLeadSentEmailsByContactIdThunk:', error);
      return 500;
    }
  };
};
