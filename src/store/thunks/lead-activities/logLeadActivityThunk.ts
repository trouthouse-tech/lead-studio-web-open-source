import type { AppThunk } from '../../store';
import { LeadActivitiesActions } from '../../dumps';
import { createLeadActivity } from '@/api';

type ResponseType = Promise<200 | 500>;

type LogLeadActivityPayload = {
  leadId: string;
  customerName: string;
};

export const logLeadActivityThunk = (
  payload: LogLeadActivityPayload
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await createLeadActivity({
        lead_id: payload.leadId,
        customer_id: payload.leadId,
        customer_name: payload.customerName,
        activity_type: 'lead_opened',
      });
      if (response.success && response.data) {
        dispatch(LeadActivitiesActions.addLeadActivity(response.data));
      }
      return 200;
    } catch (error) {
      console.error('❌ logLeadActivityThunk error:', error);
      return 500;
    }
  };
};
