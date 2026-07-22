import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { ApiResult } from '../types';

export const deleteAttachment = async (
  attachmentId: string
): Promise<ApiResult<void>> => {
  const result = await requestApi<void>(`${API_CONFIG.SERVER_URL}/api/data/lead-contact-email-attachments/${attachmentId}`, { method: 'DELETE' });
  if (!result.success || result.httpStatus >= 400) return result;
  return { ...result, success: true };
};
