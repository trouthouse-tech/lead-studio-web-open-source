import { apiClient } from '../client';
import type { LeadContactChatMessage } from '@/model';

type LeadContactChatResponse = {
  success: boolean;
  messages?: LeadContactChatMessage[];
  error?: string;
};

export const getLeadContactChatMessages = async (
  leadContactId: string,
): Promise<LeadContactChatMessage[]> => {
  const { data } = await apiClient.get<LeadContactChatResponse>(
    `/api/lead-contact-chat/${encodeURIComponent(leadContactId)}/messages`,
  );
  if (!data.success || !data.messages) {
    throw new Error(data.error ?? 'Failed to load lead contact chat');
  }
  return data.messages;
};

export const postLeadContactChatMessage = async (
  leadContactId: string,
  content: string,
): Promise<LeadContactChatMessage[]> => {
  const { data } = await apiClient.post<LeadContactChatResponse>(
    `/api/lead-contact-chat/${encodeURIComponent(leadContactId)}/messages`,
    { content },
  );
  if (!data.success || !data.messages) {
    throw new Error(data.error ?? 'Failed to send lead contact chat message');
  }
  return data.messages;
};
