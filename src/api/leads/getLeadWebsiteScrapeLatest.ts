import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { ApiResult } from '../types';

export type WebsiteScrapeLatestSummary = {
  hasCompletedCrawl: boolean;
  pageCount: number;
  completedAt: string | null;
  scrapeRunId: string | null;
};

export const getLeadWebsiteScrapeLatest = async (
  leadId: string
): Promise<ApiResult<WebsiteScrapeLatestSummary>> => {
  const result = await requestApi<WebsiteScrapeLatestSummary>(`${API_CONFIG.SERVER_URL}/api/data/leads/${encodeURIComponent(leadId)}/website-scrape-latest`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
  if (!result.success && result.error?.includes('Invalid JSON')) {
    return { ...result, error: 'Invalid response' };
  }
  if (!result.success || result.httpStatus >= 400) return result;
  return result;
};
