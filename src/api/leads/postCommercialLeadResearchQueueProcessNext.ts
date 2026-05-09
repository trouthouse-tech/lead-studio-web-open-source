/**
 * Triggers one commercial lead research worker step (Next → Express process-next).
 */
export const postCommercialLeadResearchQueueProcessNext = async (): Promise<Response> => {
  return fetch('/api/leads/commercial-lead-research-queue/process-next', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
};
