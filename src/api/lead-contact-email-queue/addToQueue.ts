import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { LeadContactEmailQueue } from '@/model/lead-contact-email-queue';
import type { ApiResult } from '../types';

export type LeadContactEmailQueueType = 'custom_email';

export type AddToQueueScheduleFor = 'default' | 'today' | 'tomorrow' | 'date';

export type AddToQueueInput = {
  lead_contact_id: string;
  lead_id?: string;
  persona_id?: string | null;
  campaign_id?: string | null;
  lead_contact_email_id: string;
  /** default: global chain. today/tomorrow/date: chain on that Eastern calendar day (see schedule_date). */
  schedule_for?: AddToQueueScheduleFor;
  /** Required when schedule_for is date (YYYY-MM-DD, Eastern calendar). */
  schedule_date?: string;
};

export const addToQueue = async (
  input: AddToQueueInput
): Promise<ApiResult<LeadContactEmailQueue>> => {
  const result = await requestApi<LeadContactEmailQueue>(`${API_CONFIG.SERVER_URL}/api/data/lead-contact-email-queue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
  if (!result.success || result.httpStatus >= 400) return result;
  return result;
};
