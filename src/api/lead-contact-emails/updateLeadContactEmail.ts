import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type {
  LeadContactEmail,
  TiptapContent,
} from '@/model/lead-contact-email';
import type { ApiResult } from '../types';

export type UpdateLeadContactEmailInput = {
  subject?: string;
  body?: TiptapContent;
  campaign_ids?: string[];
  email_sending_identity_id?: string | null;
  cold_email_offering_id?: string | null;
};

export const updateLeadContactEmail = async (
  id: string,
  updates: UpdateLeadContactEmailInput
): Promise<ApiResult<LeadContactEmail>> => {
  const result = await requestApi<LeadContactEmail>(`${API_CONFIG.SERVER_URL}/api/data/lead-contact-emails/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
  if (!result.success || result.httpStatus >= 400) return result;
  return result;
};
