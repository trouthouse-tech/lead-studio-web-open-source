import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { LeadSentEmail } from '@/model/lead-sent-email';
import type { ApiResult } from '../types';

export type UpdateLeadSentEmailInput = {
  status?: LeadSentEmail['status'];
  campaign_id?: string | null;
};

export const updateLeadSentEmail = async (
  id: string,
  updates: UpdateLeadSentEmailInput
): Promise<ApiResult<LeadSentEmail>> => {
  const result = await requestApi<LeadSentEmail>(`${API_CONFIG.SERVER_URL}/api/data/lead-sent-emails/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
  if (!result.success || result.httpStatus >= 400) return result;
  return { ...result, data: result.data ?? (result as ApiResult<LeadSentEmail>).data! };
};
