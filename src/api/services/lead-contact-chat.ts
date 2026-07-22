import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { LeadContactChatMessage } from '@/model';
import type { ApiResult } from '../types';

type LeadContactChatResponse = {
  success: boolean;
  messages?: LeadContactChatMessage[];
  error?: string;
};

export const getLeadContactChatMessages = async (
  leadContactId: string,
): Promise<ApiResult<LeadContactChatMessage[]>> => {
  const result = await requestApi<LeadContactChatResponse>(
    `${API_CONFIG.SERVER_URL}/api/lead-contact-chat/${encodeURIComponent(leadContactId)}/messages`,
    { method: 'GET', headers: { 'Content-Type': 'application/json' } },
  );

  const payload = (result.data ?? result) as LeadContactChatResponse;
  if (!result.success || result.httpStatus >= 400 || !payload.success || !payload.messages) {
    return {
      success: false,
      error: payload.error ?? result.error ?? 'Failed to load lead contact chat',
      httpStatus: result.httpStatus,
    };
  }

  return { success: true, data: payload.messages, httpStatus: result.httpStatus };
};

export const postLeadContactChatMessage = async (
  leadContactId: string,
  content: string,
): Promise<ApiResult<LeadContactChatMessage[]>> => {
  const result = await requestApi<LeadContactChatResponse>(
    `${API_CONFIG.SERVER_URL}/api/lead-contact-chat/${encodeURIComponent(leadContactId)}/messages`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    },
  );

  const payload = (result.data ?? result) as LeadContactChatResponse;
  if (!result.success || result.httpStatus >= 400 || !payload.success || !payload.messages) {
    return {
      success: false,
      error: payload.error ?? result.error ?? 'Failed to send lead contact chat message',
      httpStatus: result.httpStatus,
    };
  }

  return { success: true, data: payload.messages, httpStatus: result.httpStatus };
};
