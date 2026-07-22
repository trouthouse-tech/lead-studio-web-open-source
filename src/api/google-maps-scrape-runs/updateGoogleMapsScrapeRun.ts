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

export type UpdateGoogleMapsScrapeRunInput = {
  status?: GoogleMapsScrapeRun['status'];
  resultsCount?: number;
  businessesImported?: number;
  completedAt?: Date | null;
  error?: string | null;
  duration?: number | null;
};

export const updateGoogleMapsScrapeRun = async (
  id: string,
  updates: UpdateGoogleMapsScrapeRunInput
): Promise<ApiResult<GoogleMapsScrapeRun>> => {
  const payload: Record<string, unknown> = {};
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.resultsCount !== undefined)
      payload.results_count = updates.resultsCount;
    if (updates.businessesImported !== undefined)
      payload.businesses_imported = updates.businessesImported;
    if (updates.completedAt !== undefined) {
      payload.completed_at = updates.completedAt
        ? updates.completedAt.toISOString()
        : null;
    }
    if (updates.error !== undefined) payload.error = updates.error;
    if (updates.duration !== undefined) payload.duration = updates.duration;

  const result = await requestApi<GoogleMapsScrapeRun>(`${API_CONFIG.SERVER_URL}/api/data/google-maps-scrape-runs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  if (!result.success || result.httpStatus >= 400) return result;
  return result;
};
