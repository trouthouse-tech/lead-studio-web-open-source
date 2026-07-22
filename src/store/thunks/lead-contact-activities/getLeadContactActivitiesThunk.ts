import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import type { AppThunk } from '../../store';
import { LeadContactActivitiesActions } from '../../dumps';
import { getAllLeadContactActivities } from '@/api';

type ResponseType = Promise<200 | 500>;

export const getLeadContactActivitiesThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getAllLeadContactActivities();
      const data = response.success && response.data ? response.data : [];
      dispatch(LeadContactActivitiesActions.setLeadContactActivities(data));
      return 200;
    } catch (error) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToGetLeadContactActivities',
        message,
        stack,
        thunkName: 'getLeadContactActivitiesThunk',
      });
      console.error('❌ getLeadContactActivitiesThunk error:', error);
      return 500;
    }
  };
};
