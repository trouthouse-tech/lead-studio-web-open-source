import type { ApiResponse } from './types';

/**
 * Parse JSON from a fetch Response; never throws.
 */
export const parseApiJson = async <T>(
  res: Response,
  url: string,
): Promise<ApiResponse<T>> => {
  try {
    const body = (await res.json()) as ApiResponse<T>;
    return body;
  } catch {
    return {
      success: false,
      error: `Invalid JSON from ${url}`,
    };
  }
};
