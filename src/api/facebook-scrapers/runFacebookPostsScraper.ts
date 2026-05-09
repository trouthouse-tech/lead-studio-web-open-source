import type { ApiResponse } from '../types';
import type { FacebookScraperProfileInput } from './types';

export type { FacebookScraperProfileInput } from './types';

/**
 * Browser → same-origin /api/scrapers/facebook-posts/run → mentorai n8n proxy.
 */
export const runFacebookPostsScraper = async (
  input: FacebookScraperProfileInput
): Promise<ApiResponse<unknown>> => {
  try {
    if (typeof window === 'undefined') {
      return { success: false, error: 'runFacebookPostsScraper must run in the browser' };
    }

    const response = await fetch(`${window.location.origin}/api/scrapers/facebook-posts/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileUrl: input.profileUrl.trim() }),
    });

    const raw = await response.text();
    const trimmed = raw.trim();
    const looksLikeJson = trimmed.startsWith('{') || trimmed.startsWith('[');

    if (!looksLikeJson) {
      return {
        success: false,
        error: `Expected JSON (HTTP ${response.status})`,
      };
    }

    const json = JSON.parse(raw) as {
      success?: boolean;
      data?: unknown;
      error?: string;
    };

    if (!response.ok || !json.success) {
      return {
        success: false,
        error: json.error || `Request failed (${response.status})`,
      };
    }

    return { success: true, data: json.data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
