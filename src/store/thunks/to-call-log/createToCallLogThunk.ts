import type { AppThunk } from '../../store';
import { createToCallLog, type CreateToCallLogInput } from '@/api/to-call-log';
import { ToCallLogsActions } from '../../dumps/toCallLogs';

export type CreateToCallLogThunkResult =
  | { ok: true }
  | { ok: false; error: string };

type ResponseType = Promise<CreateToCallLogThunkResult>;

/**
 * Creates a to-call log row via the API and upserts it into normalized `toCallLogs` state.
 */
export const createToCallLogThunk = (
  input: CreateToCallLogInput
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await createToCallLog(input);
      if (!response.success || !response.data) {
        return {
          ok: false,
          error: response.error || 'Failed to add to call log',
        };
      }
      dispatch(ToCallLogsActions.upsertToCallLog(response.data));
      return { ok: true };
    } catch (error: unknown) {
      console.error('❌ createToCallLogThunk error:', error);
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Failed to add to call log',
      };
    }
  };
};
