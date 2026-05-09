import { API_CONFIG } from '@/config/api';
import type { LeadCost } from '@/model/lead-cost';
import type { ApiResponse } from '../types';

export type GetAllLeadCostsParams = {
  lead_id?: string;
};

/**
 * Fetches all lead costs from the server.
 * Expects backend GET /api/data/lead-costs (e.g. tht-express-server lead-costs router).
 */
export const getAllLeadCosts = async (
  params?: GetAllLeadCostsParams
): Promise<ApiResponse<LeadCost[]>> => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.lead_id) searchParams.append('leadId', params.lead_id);
    const queryString = searchParams.toString();
    const url = `${API_CONFIG.SERVER_URL}/api/data/lead-costs${queryString ? `?${queryString}` : ''}`;

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
    console.error('❌ getAllLeadCosts error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to get lead costs',
    };
  }
};
