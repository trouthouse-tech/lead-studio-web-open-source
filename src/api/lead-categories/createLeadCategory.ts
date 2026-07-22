import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { LeadCategory } from '@/model';
import type { ApiResult } from '../types';

export type CreateLeadCategoryInput = {
  name: string;
  normalizedName: string;
  leadsCount?: number;
};

/**
 * Creates a lead category (Express expects snake_case body).
 */
export const createLeadCategory = async (
  input: CreateLeadCategoryInput,
  apiBaseUrl?: string
): Promise<ApiResult<LeadCategory>> => {
  const baseUrl = apiBaseUrl ?? API_CONFIG.SERVER_URL;
  const result = await requestApi<Record<string, unknown>>(`${baseUrl}/api/data/lead-categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: input.name,
      normalized_name: input.normalizedName,
      leads_count: input.leadsCount ?? 0,
    }),
  });

  if (!result.success || result.httpStatus >= 400) {
    return {
      success: false,
      error: result.error ?? 'Failed to create lead category',
      httpStatus: result.httpStatus,
    };
  }

  const raw = (result.data ?? {}) as Record<string, unknown>;
  const data: LeadCategory = {
    id: raw.id as string,
    name: raw.name as string,
    normalized_name: (raw.normalized_name as string) ?? input.normalizedName,
    leads_count: (raw.leads_count as number) ?? 0,
    created_at: (raw.created_at as string) ?? new Date().toISOString(),
    updated_at: (raw.updated_at as string) ?? new Date().toISOString(),
  };
  return { success: true, data, httpStatus: result.httpStatus };
};
