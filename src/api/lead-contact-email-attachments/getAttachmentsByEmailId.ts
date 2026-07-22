import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { LeadContactEmailAttachment } from '@/model/lead-contact-email-attachment';
import type { ApiResult } from '../types';

export const getAttachmentsByEmailId = async (
  emailId: string
): Promise<ApiResult<LeadContactEmailAttachment[]>> => {
  const result = await requestApi<LeadContactEmailAttachment[]>(`${API_CONFIG.SERVER_URL}/api/data/lead-contact-email-attachments/${emailId}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
  if (!result.success || result.httpStatus >= 400) return result;
  return { ...result, data: result.data ?? [] };
};
