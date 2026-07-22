import type { ApiResult } from './types';

/**
 * Maps a failed API result to the thunk status union (400 client vs 500 server/network).
 */
export const mapApiFailureToThunkStatus = (
  result: ApiResult<unknown>,
): 400 | 500 => (result.httpStatus === 400 ? 400 : 500);
