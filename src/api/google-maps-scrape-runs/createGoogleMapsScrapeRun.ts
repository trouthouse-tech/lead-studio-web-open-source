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

export const createGoogleMapsScrapeRun = async (run: {
  name: string;
  searchQuery: string;
  status?: GoogleMapsScrapeRun['status'];
  results_count?: number;
  businesses_imported?: number;
  max_results?: number | null;
}): Promise<ApiResult<GoogleMapsScrapeRun>> => {
  console.log('📥 [web.createGoogleMapsScrapeRun] POST', {
    name: run.name,
    searchQuery: run.searchQuery,
    max_results: run.max_results ?? null,
  });

  const result = await requestApi<Record<string, unknown>>(
    `${API_CONFIG.SERVER_URL}/api/data/google-maps-scrape-runs`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: run.name,
        search_query: run.searchQuery,
        status: run.status ?? 'in_progress',
        results_count: run.results_count ?? 0,
        businesses_imported: run.businesses_imported ?? 0,
        max_results: run.max_results ?? null,
      }),
    },
  );

  if (!result.success || result.httpStatus >= 400) {
    console.warn('⚠️ [web.createGoogleMapsScrapeRun] failed', {
      success: result.success,
      httpStatus: result.httpStatus,
      error: result.error,
    });
    return {
      success: false,
      error: result.error,
      httpStatus: result.httpStatus,
    };
  }

  if (!result.data) {
    console.error('❌ [web.createGoogleMapsScrapeRun] missing data');
    return {
      success: false,
      error: 'Invalid response from server',
      httpStatus: result.httpStatus,
    };
  }

  const mapped = convertToModel(result.data);
  console.log('✅ [web.createGoogleMapsScrapeRun] created', {
    id: mapped.id,
    name: mapped.name,
    searchQuery: mapped.searchQuery,
  });

  return {
    success: true,
    data: mapped,
    httpStatus: result.httpStatus,
  };
};
