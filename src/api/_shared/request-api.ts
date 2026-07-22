import type { ApiResult } from './types';
import { parseApiJson } from './parse-api-json';

/**
 * Sole transport entry point for browser-side API calls. Never throws.
 */
export const requestApi = async <T>(
  url: string,
  init?: RequestInit,
): Promise<ApiResult<T>> => {
  try {
    const res = await fetch(url, init);
    const parsed = await parseApiJson<T>(res, url);
    return { ...parsed, httpStatus: res.status };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: `Network error: ${message}`,
      httpStatus: 0,
    };
  }
};
