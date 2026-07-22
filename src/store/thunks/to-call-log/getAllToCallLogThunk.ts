import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import type { AppThunk } from '../../store';
import { getAllToCallLog } from '@/api/to-call-log';
import { ToCallLogBuilderActions } from '@/store/builders/toCallLogBuilder';
import { ToCallLogsActions } from '@/store/dumps/toCallLogs';
import { mapApiFailureToThunkStatus } from '@/api/_shared';

type Status = 200 | 400 | 500;
type ResponseType = Promise<Status>;

export type GetAllToCallLogThunkOptions = {
  /** When true, refetch even if a full list was already loaded. */
  force?: boolean;
};

let inFlight: ResponseType | null = null;

/**
 * Loads the full to-call log list into the normalized `toCallLogs` slice.
 * Skips the network request when already hydrated unless `force` is set.
 * Concurrent non-forced calls share one in-flight request.
 */
export const getAllToCallLogThunk =
  (options?: GetAllToCallLogThunkOptions): AppThunk<ResponseType> => {
    return (dispatch, getState): ResponseType => {
      const { hasLoadedAll } = getState().toCallLogBuilder;
      if (hasLoadedAll && !options?.force) {
        return Promise.resolve(200);
      }

      if (inFlight) {
        return inFlight;
      }

      const run = async (): Promise<Status> => {
        try {
          dispatch(ToCallLogBuilderActions.setIsFetchingAll(true));
          const response = await getAllToCallLog();

          if (response.success && response.data) {
            dispatch(ToCallLogsActions.setToCallLogs(response.data));
            dispatch(ToCallLogBuilderActions.setHasLoadedAll(true));
            return 200;
          }

          if (
            response.error?.includes('not available yet') ||
            response.error?.includes('not found') ||
            response.error?.includes('Invalid response')
          ) {
            dispatch(ToCallLogsActions.setToCallLogs([]));
            dispatch(ToCallLogBuilderActions.setHasLoadedAll(true));
            return 200;
          }

          return mapApiFailureToThunkStatus(response);
        } catch (error: unknown) {
          const { message, stack } = coerceErrorFields(error);
          reportThunkError({
            event: 'failedToGetAllToCallLog',
            message,
            stack,
            thunkName: 'getAllToCallLogThunk',
          });
          console.error('❌ getAllToCallLogThunk error:', error);
          return 500;
        } finally {
          dispatch(ToCallLogBuilderActions.setIsFetchingAll(false));
          inFlight = null;
        }
      };

      inFlight = run();
      return inFlight;
    };
  };
