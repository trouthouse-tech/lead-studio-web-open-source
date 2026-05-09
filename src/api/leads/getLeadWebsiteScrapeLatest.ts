import { API_CONFIG } from '@/config/api';
import type { ApiResponse } from '../types';

export type WebsiteScrapeLatestSummary = {
  hasCompletedCrawl: boolean;
  pageCount: number;
  completedAt: string | null;
  scrapeRunId: string | null;
};

export const getLeadWebsiteScrapeLatest = async (
  leadId: string
): Promise<ApiResponse<WebsiteScrapeLatestSummary>> => {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/leads/${encodeURIComponent(leadId)}/website-scrape-latest`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    );
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        success: false,
        error: body.error || body.message || 'Failed to load website scrape status',
      };
    }
    const data = body.data as WebsiteScrapeLatestSummary | undefined;
    if (!data || typeof data !== 'object') {
      return { success: false, error: 'Invalid response' };
    }
    return { success: true, data };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Failed to load website scrape status',
    };
  }
};
