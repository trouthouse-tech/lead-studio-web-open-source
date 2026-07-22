import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { LeadCost, LeadCostType } from '@/model/lead-cost';
import type { ApiResult } from '../types';

export type PostLeadCostBody = {
  lead_id: string;
  type: LeadCostType;
  description: string;
  cost_cents: number;
};

/**
 * POST /api/data/lead-costs — creates a ledger row (manual user entry; entry_source user).
 */
export const postLeadCost = async (
  body: PostLeadCostBody,
): Promise<ApiResult<LeadCost>> => {
  const result = await requestApi<LeadCost>(`${API_CONFIG.SERVER_URL}/api/data/lead-costs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lead_id: body.lead_id,
        type: body.type,
        description: body.description,
        cost_cents: body.cost_cents,
      }),
    });
  if (!result.success || result.httpStatus >= 400) return result;
  return result;
};
