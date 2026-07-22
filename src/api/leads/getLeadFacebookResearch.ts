import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { ApiResult } from '../types';

export type FacebookResearchRow = {
  id: string;
  payload: unknown;
  completed_at: string | null;
};

export type LeadFacebookResearchData = {
  page: FacebookResearchRow | null;
  posts: FacebookResearchRow | null;
};

export const getLeadFacebookResearch = async (
  leadId: string
): Promise<ApiResult<LeadFacebookResearchData>> => {
  const result = await requestApi<LeadFacebookResearchData>(`${API_CONFIG.SERVER_URL}/api/data/leads/${leadId}/facebook-research`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
  if (!result.success && result.error?.includes('Invalid JSON')) {
    return { ...result, error: 'Invalid response' };
  }
  if (!result.success || result.httpStatus >= 400) return result;
  return result;
};
