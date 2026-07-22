import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import { mapApiFailureToThunkStatus } from '@/api/_shared';
import { deleteToCallLog } from '@/api/to-call-log';
import type { AppThunk } from '../../store';
import { ToCallLogsActions } from '@/store/dumps/toCallLogs';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * DELETEs a to-call log row and removes it from normalized `toCallLogs` state.
 */
export const deleteToCallLogThunk = (id: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await deleteToCallLog(id);

      if (response.success) {
        dispatch(ToCallLogsActions.removeToCallLog(id));
        return 200;
      }

      return mapApiFailureToThunkStatus(response);
    } catch (error: unknown) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToDeleteToCallLog',
        message,
        stack,
        thunkName: 'deleteToCallLogThunk',
      });
      console.error('❌ deleteToCallLogThunk error:', error);
      return 500;
    }
  };
};
