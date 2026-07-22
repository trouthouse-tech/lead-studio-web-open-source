import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { Lead, LeadStatus } from '@/model';
import type { ApiResult } from '../types';

/**
 * POST body for `/api/data/leads` — matches mentorai-server `CreateLeadInput` (only
 * `business_name` and `idempotency_key` are required server-side).
 */
export type CreateLeadRequestBody = {
  business_name: string;
  idempotency_key: string;
  name?: string | null;
  email?: string;
  phone?: string;
  address?: string | null;
  website?: string | null;
  has_quote_form?: boolean;
  has_chat_bot?: boolean;
  has_phone_quote?: boolean;
  notes?: string | null;
  description?: string | null;
  status?: LeadStatus;
};

/**
 * Creates a lead via Express API (used by Google Maps scraper upload on server).
 */
export const createLead = async (
  lead: CreateLeadRequestBody,
  apiBaseUrl?: string
): Promise<ApiResult<Lead>> => {
  const baseUrl = apiBaseUrl ?? API_CONFIG.SERVER_URL;

  const result = await requestApi<Lead>(`${baseUrl}/api/data/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead),
  });

  if (!result.success || result.httpStatus >= 400) {
    return { ...result, success: false, error: result.error ?? 'Failed to create lead' };
  }

  return { ...result, data: result.data ?? (result as ApiResult<Lead>).data! };
};
