import { getMentoraiDataApiBaseUrl } from '@/config/api';
import type { SavedFilter } from '@/model';
import type { ApiResponse } from '../types';
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
export const getSavedFilters = async (): Promise<ApiResponse<SavedFilter[]>> => {
  try {
    const base = getMentoraiDataApiBaseUrl();
    const res = await fetch(`${base}/api/data/saved-filters`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const json = (await res.json()) as ListJson;
    if (!res.ok) {
      return { success: false, error: json.error || `HTTP ${res.status}` };
    }
    const raw = json.data ?? [];
    const mapped: SavedFilter[] = [];
    for (const row of raw) {
      const m = mapRow(row);
      if (m) mapped.push(m);
    }
    return { success: true, data: mapped };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return { success: false, error: message };
  }
};
