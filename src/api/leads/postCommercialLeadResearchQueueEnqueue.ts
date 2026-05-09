export type PostCommercialLeadResearchQueueEnqueueResponseBody = {
  success?: boolean;
  batchId?: string;
  insertedCount?: number;
  error?: string;
  message?: string;
};

/**
 * Enqueues one commercial lead research row per lead (Next → Express); worker runs via cron.
 */
export const postCommercialLeadResearchQueueEnqueue = async (
  leadIds: string[]
): Promise<Response> => {
  return fetch('/api/leads/commercial-lead-research-queue/enqueue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ leadIds }),
  });
};
