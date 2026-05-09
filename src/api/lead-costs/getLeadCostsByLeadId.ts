import { API_CONFIG } from '@/config/api';
import type { LeadCost } from '@/model/lead-cost';
import type { ApiResponse } from '../types';

/**
 * Fetches all lead costs for a specific lead.
 * Expects backend GET /api/data/lead-costs/lead/:leadId
 */
export const getLeadCostsByLeadId = async (
  leadId: string
): Promise<ApiResponse<LeadCost[]>> => {
  try {
    const url = `${API_CONFIG.SERVER_URL}/api/data/lead-costs/lead/${leadId}`;

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
        error: data.error || data.message || 'Failed to get lead costs',
      };
    }

    return {
      success: true,
      data: data.data ?? data ?? [],
    };
  } catch (error: unknown) {
    console.error('❌ getLeadCostsByLeadId error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to get lead costs',
    };
  }
};
