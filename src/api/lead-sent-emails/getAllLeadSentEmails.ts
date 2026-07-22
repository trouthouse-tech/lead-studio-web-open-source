import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { LeadSentEmail } from '@/model/lead-sent-email';
import type { ApiResult } from '../types';

/**
 * Fetches all lead sent emails from the server.
 * Expects backend GET /api/data/lead-sent-emails.
 * If the endpoint is missing (404) or returns non-JSON, returns empty array.
 */
export const getAllLeadSentEmails = async (): Promise<ApiResult<LeadSentEmail[]>> => {
  const result = await requestApi<LeadSentEmail[]>(`${API_CONFIG.SERVER_URL}/api/data/lead-sent-emails`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
  if (!result.success && result.httpStatus === 404) {
    return { success: true, data: [], httpStatus: 404 };
  }
  if (!result.success && result.error?.includes('Invalid JSON')) {
    return { success: true, data: [], httpStatus: result.httpStatus };
  }
  if (!result.success || result.httpStatus >= 400) return result;
  return { ...result, data: result.data ?? [] };
};
