import type { AppThunk } from '../../store';
import { LeadActivitiesActions } from '../../dumps';
import { getAllLeadActivities } from '@/api';

type ResponseType = Promise<200 | 500>;

export const getLeadActivitiesThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getAllLeadActivities();
      const data = response.success && response.data ? response.data : [];
      dispatch(LeadActivitiesActions.setLeadActivities(data));
      return 200;
    } catch (error) {
      console.error('❌ getLeadActivitiesThunk error:', error);
      return 500;
    }
  };
};
