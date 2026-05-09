import { API_CONFIG } from '@/config/api';
import type { LeadAiExchangeCostRow } from '@/model';
import type { ApiResponse } from '../types';

/**
 * GET /api/data/leads/:leadId/ai-exchange-costs — contact chat, website at-a-glance, and Google profile
 * SERP resolution AI rows with tokens.
 */
export const getLeadAiExchangeCostsForLead = async (
  leadId: string,
): Promise<ApiResponse<LeadAiExchangeCostRow[]>> => {
  try {
    const url = `${API_CONFIG.SERVER_URL}/api/data/leads/${encodeURIComponent(leadId)}/ai-exchange-costs`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status === 404) {
      return { success: true, data: [] };
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return { success: true, data: [] };
    }

    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || 'Failed to get lead AI exchange costs',
      };
    }

    return {
      success: true,
      data: data.data ?? data ?? [],
    };
  } catch (error: unknown) {
    console.error('❌ getLeadAiExchangeCostsForLead error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to get lead AI exchange costs',
    };
  }
};
