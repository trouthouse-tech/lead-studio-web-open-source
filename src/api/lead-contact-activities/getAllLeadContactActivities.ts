import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { LeadContactActivity } from '@/model';
import type { ApiResult } from '../types';

export const getAllLeadContactActivities = async (): Promise<
  ApiResult<LeadContactActivity[]>
> => {
  const result = await requestApi<LeadContactActivity[]>(
    `${API_CONFIG.SERVER_URL}/api/data/lead-contact-activities`,
    { method: 'GET', headers: { 'Content-Type': 'application/json' } },
  );

  if (!result.success && result.error?.includes('Invalid JSON')) {
    return { ...result, error: 'Invalid response' };
  }
  if (!result.success || result.httpStatus >= 400) return result;
  return { ...result, data: result.data ?? [] };
};
