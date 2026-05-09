import { API_CONFIG } from '@/config/api';
import type { LeadContactEmailQueue } from '@/model/lead-contact-email-queue';
import type { ApiResponse } from '../types';

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
): Promise<ApiResponse<LeadContactEmailQueue>> => {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/lead-contact-email-queue`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error:
          errorData.error ||
          errorData.message ||
          `HTTP error! status: ${response.status}`,
      };
    }
    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
