import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import { mapApiFailureToThunkStatus } from '@/api/_shared';
import {
  updateToCallLog,
  type UpdateToCallLogInput,
} from '@/api/to-call-log';
import type { AppThunk } from '../../store';
import { ToCallLogsActions } from '@/store/dumps/toCallLogs';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * PATCHes a to-call log row and upserts it into normalized `toCallLogs` state.
 */
export const updateToCallLogThunk = (
  id: string,
  input: UpdateToCallLogInput,
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await updateToCallLog(id, input);

      if (response.success && response.data) {
        dispatch(ToCallLogsActions.upsertToCallLog(response.data));
        return 200;
      }

      return mapApiFailureToThunkStatus(response);
    } catch (error: unknown) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToUpdateToCallLog',
        message,
        stack,
        thunkName: 'updateToCallLogThunk',
      });
      console.error('❌ updateToCallLogThunk error:', error);
      return 500;
    }
  };
};
