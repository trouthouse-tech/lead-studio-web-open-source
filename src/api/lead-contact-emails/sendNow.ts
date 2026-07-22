import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { ApiResult } from '../types';

export type SendNowInput = {
  lead_contact_email_id: string;
  persona_id?: string | null;
};

export const sendNow = async (
  input: SendNowInput
): Promise<ApiResult<{ sentEmailId: string }>> => {
  const result = await requestApi<{ sentEmailId: string }>(`${API_CONFIG.SERVER_URL}/api/data/lead-contact-emails/send-now`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_contact_email_id: input.lead_contact_email_id,
          persona_id: input.persona_id ?? null,
        }),
      });
  if (!result.success || result.httpStatus >= 400) return result;
  return result;
};
