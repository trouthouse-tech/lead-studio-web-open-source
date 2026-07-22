import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type {
  LeadContactEmail,
  TiptapContent,
} from '@/model/lead-contact-email';
import type { ApiResult } from '../types';

export type CreateLeadContactEmailInput = {
  lead_id: string;
  lead_contact_id: string;
  subject: string;
  body: TiptapContent;
  campaign_ids?: string[];
  email_sending_identity_id?: string | null;
  cold_email_offering_id?: string | null;
};

export const createLeadContactEmail = async (
  email: CreateLeadContactEmailInput
): Promise<ApiResult<LeadContactEmail>> => {
  const result = await requestApi<LeadContactEmail>(`${API_CONFIG.SERVER_URL}/api/data/lead-contact-emails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(email),
      });
  if (!result.success || result.httpStatus >= 400) return result;
  return result;
};
