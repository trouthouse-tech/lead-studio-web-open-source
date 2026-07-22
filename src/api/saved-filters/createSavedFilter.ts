import { getMentoraiDataApiBaseUrl } from '@/config/api';
import { requestApi } from '../_shared';
import type { PersistedLeadsFilters } from '@/utils/leads';
import type { SavedFilter } from '@/model';
import type { ApiResult } from '../types';
import { parsePersistedLeadsFiltersPayload } from '@/utils/leads';

type CreateJson = {
  success?: boolean;
  data?: {
    id: string;
    user_id: string;
    name: string;
    filters: unknown;
    created_at: string;
    updated_at: string;
  };
  error?: string;
};

/**
 * POST `/api/data/saved-filters` with `{ name, filters }` (optional `user_id`; server picks default tenant user).
 */
export const createSavedFilter = async (input: {
  userId?: string;
  name: string;
  filters: PersistedLeadsFilters;
}): Promise<ApiResult<SavedFilter>> => {
  const base = getMentoraiDataApiBaseUrl();
  const body: Record<string, unknown> = {
    name: input.name,
    filters: input.filters,
  };
  if (input.userId?.trim()) {
    body.user_id = input.userId.trim();
  }

  const result = await requestApi<CreateJson['data']>(`${base}/api/data/saved-filters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!result.success || result.httpStatus >= 400) {
    return {
      success: false,
      error: result.error ?? `HTTP ${result.httpStatus}`,
      httpStatus: result.httpStatus,
    };
  }

  const row = result.data;
  if (!row) {
    return { success: false, error: 'Missing row', httpStatus: result.httpStatus };
  }
  const filters = parsePersistedLeadsFiltersPayload(row.filters);
  if (!filters) {
    return { success: false, error: 'Invalid filters in response', httpStatus: result.httpStatus };
  }
  return {
    success: true,
    data: {
      id: row.id,
      user_id: row.user_id,
      name: row.name,
      filters,
      created_at: row.created_at,
      updated_at: row.updated_at,
    },
    httpStatus: result.httpStatus,
  };
};
