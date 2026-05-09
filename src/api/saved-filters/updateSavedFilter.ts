import { getMentoraiDataApiBaseUrl } from '@/config/api';
import type { PersistedLeadsFilters } from '@/utils/leads';
import type { SavedFilter } from '@/model';
import type { ApiResponse } from '../types';
import { parsePersistedLeadsFiltersPayload } from '@/utils/leads';

type PatchJson = {
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
 * PATCH `/api/data/saved-filters/:id` with `{ name?, filters? }` (optional `user_id`).
 */
export const updateSavedFilter = async (input: {
  userId?: string;
  id: string;
  name?: string;
  filters?: PersistedLeadsFilters;
}): Promise<ApiResponse<SavedFilter>> => {
  try {
    const body: Record<string, unknown> = {};
    if (input.userId?.trim()) {
      body.user_id = input.userId.trim();
    }
    if (input.name !== undefined) body.name = input.name;
    if (input.filters !== undefined) body.filters = input.filters;

    const base = getMentoraiDataApiBaseUrl();
    const res = await fetch(`${base}/api/data/saved-filters/${encodeURIComponent(input.id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = (await res.json()) as PatchJson;
    if (!res.ok) {
      return { success: false, error: json.error || `HTTP ${res.status}` };
    }
    const row = json.data;
    if (!row) {
      return { success: false, error: 'Missing row' };
    }
    const filters = parsePersistedLeadsFiltersPayload(row.filters);
    if (!filters) {
      return { success: false, error: 'Invalid filters in response' };
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
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return { success: false, error: message };
  }
};
