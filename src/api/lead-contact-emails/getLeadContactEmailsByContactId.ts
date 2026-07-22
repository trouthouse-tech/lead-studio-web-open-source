import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { LeadContactEmail } from '@/model/lead-contact-email';
import type { ApiResult } from '../types';

export const getLeadContactEmailsByContactId = async (
  contactId: string
): Promise<ApiResult<LeadContactEmail[]>> => {
  const url = `${API_CONFIG.SERVER_URL}/api/data/lead-contact-emails/contact/${contactId}`;

  const result = await requestApi<LeadContactEmail[]>(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  if (!result.success || result.httpStatus >= 400) return result;
  return { ...result, data: result.data ?? [] };
};
