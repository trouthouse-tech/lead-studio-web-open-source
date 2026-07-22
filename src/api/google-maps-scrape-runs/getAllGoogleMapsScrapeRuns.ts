import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { GoogleMapsScrapeRun } from '@/model';
import type { ApiResult } from '../types';

const convertToModel = (data: Record<string, unknown>): GoogleMapsScrapeRun => ({
  id: data.id as string,
  name: data.name as string,
  searchQuery: data.search_query as string,
  status: data.status as GoogleMapsScrapeRun['status'],
  resultsCount: data.results_count as number,
  businessesImported: data.businesses_imported as number,
  maxResults: (data.max_results as number | null) ?? undefined,
  createdAt: new Date(data.created_at as string),
  completedAt: data.completed_at
    ? new Date(data.completed_at as string)
    : undefined,
  error: (data.error as string | null) ?? undefined,
  duration: (data.duration as number | null) ?? undefined,
});

export const getAllGoogleMapsScrapeRuns = async (): Promise<
  ApiResult<GoogleMapsScrapeRun[]>
> => {
  const result = await requestApi<Record<string, unknown>[]>(
    `${API_CONFIG.SERVER_URL}/api/data/google-maps-scrape-runs`,
    { method: 'GET', headers: { 'Content-Type': 'application/json' } },
  );

  if (!result.success || result.httpStatus >= 400) {
    return result as ApiResult<GoogleMapsScrapeRun[]>;
  }

  const rows = (result.data ?? []) as Record<string, unknown>[];
  return { ...result, data: rows.map(convertToModel) };
};
