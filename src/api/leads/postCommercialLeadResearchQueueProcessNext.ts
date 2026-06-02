import { API_CONFIG } from '@/config/api';

/**
 * Triggers one commercial lead research worker step (Express POST /api/data/commercial-lead-research-queue/process-next).
 */
export const postCommercialLeadResearchQueueProcessNext = async (): Promise<Response> => {
  return fetch(`${API_CONFIG.SERVER_URL}/api/data/commercial-lead-research-queue/process-next`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
};
