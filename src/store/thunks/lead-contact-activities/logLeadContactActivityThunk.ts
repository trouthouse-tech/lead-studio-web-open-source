import type { AppThunk } from '../../store';
import { LeadContactActivitiesActions } from '../../dumps';
import { createLeadContactActivity } from '@/api';

type ResponseType = Promise<200 | 500>;

type LogLeadContactActivityPayload = {
  leadContactId: string;
  leadId: string;
  customerName: string;
};

export const logLeadContactActivityThunk = (
  payload: LogLeadContactActivityPayload
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await createLeadContactActivity({
        lead_contact_id: payload.leadContactId,
        lead_id: payload.leadId,
        customer_id: payload.leadId,
        customer_name: payload.customerName,
        activity_type: 'lead_contact_opened',
      });
      if (response.success && response.data) {
        dispatch(LeadContactActivitiesActions.addLeadContactActivity(response.data));
      }
      return 200;
    } catch (error) {
      console.error('❌ logLeadContactActivityThunk error:', error);
      return 500;
    }
  };
};
