import { API_CONFIG } from '@/config/api';
import type { Lead, LeadStatus } from '@/model';
import type { ApiResponse } from '../types';

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
): Promise<ApiResponse<Lead>> => {
  const baseUrl = apiBaseUrl ?? API_CONFIG.SERVER_URL;

  try {
    const response = await fetch(`${baseUrl}/api/data/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error:
          (errorData as { error?: string }).error ||
          (errorData as { message?: string }).message ||
          `HTTP error! status: ${response.status}`,
      };
    }

    const result = (await response.json()) as { data?: Lead } | Lead;
    const data = 'data' in result && result.data ? result.data : (result as Lead);
    return { success: true, data };
  } catch (error) {
    console.error('Error creating lead:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
