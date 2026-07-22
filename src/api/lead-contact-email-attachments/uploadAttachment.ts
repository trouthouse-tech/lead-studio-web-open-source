import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { LeadContactEmailAttachment } from '@/model/lead-contact-email-attachment';
import type { ApiResult } from '../types';

export type UploadAttachmentInput = {
  file: File;
  lead_contact_email_id: string;
  lead_id: string;
  lead_contact_id: string;
};

export const uploadAttachment = async (
  input: UploadAttachmentInput
): Promise<ApiResult<LeadContactEmailAttachment>> => {
  const formData = new FormData();
  formData.append('file', input.file);
  formData.append('lead_contact_email_id', input.lead_contact_email_id);
  formData.append('lead_id', input.lead_id);
  formData.append('lead_contact_id', input.lead_contact_id);

  const result = await requestApi<LeadContactEmailAttachment>(
    `${API_CONFIG.SERVER_URL}/api/data/lead-contact-email-attachments`,
    { method: 'POST', body: formData },
  );
  if (!result.success || result.httpStatus >= 400) {
    return { ...result, error: result.error ?? `HTTP error! status: ${result.httpStatus}` };
  }
  return result;
};
