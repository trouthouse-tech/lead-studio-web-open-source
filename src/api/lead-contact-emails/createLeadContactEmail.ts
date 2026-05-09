import { API_CONFIG } from '@/config/api';
import type {
  LeadContactEmail,
  TiptapContent,
} from '@/model/lead-contact-email';
import type { ApiResponse } from '../types';

export type CreateLeadContactEmailInput = {
  lead_id: string;
  lead_contact_id: string;
  subject: string;
  body: TiptapContent;
  campaign_ids?: string[];
  email_sending_identity_id?: string | null;
};

export const createLeadContactEmail = async (
  email: CreateLeadContactEmailInput
): Promise<ApiResponse<LeadContactEmail>> => {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/lead-contact-emails`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(email),
      }
    );
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        success: false,
        error: result.error || result.message || `HTTP ${response.status}`,
      };
    }
    return result.success !== false && result.data
      ? { success: true, data: result.data }
      : { success: true, data: result as LeadContactEmail };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
