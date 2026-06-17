import { API_CONFIG } from '@/config/api';
import type { ColdEmailOffering } from '@/model/cold-email-offering';
import type { ApiResponse } from '../types';

/**
 * GET `/api/data/cold-email-offerings`
 */
export const getAllColdEmailOfferings = async (
  includeArchived = false,
): Promise<ApiResponse<ColdEmailOffering[]>> => {
  try {
    const qs = includeArchived ? '?include_archived=true' : '';
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/cold-email-offerings${qs}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } },
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || `HTTP ${response.status}`,
      };
    }
    return { success: true, data: data.data ?? [] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
