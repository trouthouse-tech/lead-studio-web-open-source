import { API_CONFIG } from '@/config/api';
import type { LeadCost, LeadCostType } from '@/model/lead-cost';
import type { ApiResponse } from '../types';

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
): Promise<ApiResponse<LeadCost>> => {
  try {
    const response = await fetch(`${API_CONFIG.SERVER_URL}/api/data/lead-costs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lead_id: body.lead_id,
        type: body.type,
        description: body.description,
        cost_cents: body.cost_cents,
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        success: false,
        error:
          (data as { error?: string }).error ||
          (data as { message?: string }).message ||
          'Failed to create lead cost',
      };
    }

    const created = (data as { data?: LeadCost }).data;
    if (!created?.id) {
      return { success: false, error: 'Invalid response from server' };
    }

    return { success: true, data: created };
  } catch (error: unknown) {
    console.error('❌ postLeadCost error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create lead cost',
    };
  }
};
