import { getMentoraiDataApiBaseUrl } from '@/config/api';
import { requestApi } from '../_shared';
import type { SavedFilter } from '@/model';
import type { ApiResult } from '../types';
import { parsePersistedLeadsFiltersPayload } from '@/utils/leads';

type ListJson = {
  success?: boolean;
  data?: Array<{
    id: string;
    user_id: string;
    name: string;
    filters: unknown;
    created_at: string;
    updated_at: string;
  }>;
  error?: string;
};

const mapRow = (row: NonNullable<ListJson['data']>[number]): SavedFilter | null => {
  const filters = parsePersistedLeadsFiltersPayload(row.filters);
  if (!filters) {
    return null;
  }
  return {
    id: row.id,
    user_id: row.user_id,
    name: row.name,
    filters,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
};

/**
 * GET `/api/data/saved-filters` — all presets (single-tenant).
 */
export const getSavedFilters = async (): Promise<ApiResult<SavedFilter[]>> => {
  const base = getMentoraiDataApiBaseUrl();
  const result = await requestApi<NonNullable<ListJson['data']>>(`${base}/api/data/saved-filters`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!result.success || result.httpStatus >= 400) {
    return {
      success: false,
      error: result.error ?? `HTTP ${result.httpStatus}`,
      httpStatus: result.httpStatus,
    };
  }

  const raw = result.data ?? [];
  const mapped: SavedFilter[] = [];
  for (const row of raw) {
    const m = mapRow(row);
    if (m) mapped.push(m);
  }
  return { ...result, data: mapped };
};
