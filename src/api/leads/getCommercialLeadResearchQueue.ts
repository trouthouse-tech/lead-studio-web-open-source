export type CommercialLeadResearchQueueItem = {
  id: string;
  batch_id: string;
  lead_id: string;
  status: string;
  scheduled_at: string;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
  lead_business_name?: string | null;
  lead_name?: string | null;
};

export type GetCommercialLeadResearchQueueResponse =
  | { success: true; data: CommercialLeadResearchQueueItem[]; count: number }
  | { success: false; error?: string };

/**
 * Fetches recent commercial lead research queue rows (Next → Express).
 */
export const getCommercialLeadResearchQueue = async (
  limit?: number
): Promise<Response> => {
  const qs =
    typeof limit === 'number' && Number.isFinite(limit)
      ? `?limit=${encodeURIComponent(String(limit))}`
      : '';
  return fetch(`/api/leads/commercial-lead-research-queue${qs}`, {
    method: 'GET',
  });
};
