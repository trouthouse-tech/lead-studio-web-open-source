import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { ApiResult } from '../types';
import type { FacebookScraperProfileInput } from './types';

export type { FacebookScraperProfileInput } from './types';

/**
 * POST Facebook posts scraper run (Express POST /api/scrapers/facebook-posts/run).
 */
export const runFacebookPostsScraper = async (
  input: FacebookScraperProfileInput
): Promise<ApiResult<unknown>> => {
  const result = await requestApi<unknown>(
    `${API_CONFIG.SERVER_URL}/api/scrapers/facebook-posts/run`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileUrl: input.profileUrl.trim() }),
    },
  );

  if (result.error?.includes('Invalid JSON')) {
    return {
      success: false,
      error: `Expected JSON (HTTP ${result.httpStatus})`,
      httpStatus: result.httpStatus,
    };
  }

  if (!result.success || result.httpStatus >= 400) {
    return {
      ...result,
      error: result.error ?? `Request failed (${result.httpStatus})`,
    };
  }

  return result;
};
