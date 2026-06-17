import { API_CONFIG } from '@/config/api';
import type { ApiResponse } from '../types';

/**
 * DELETE `/api/data/cold-email-offerings/:id`
 */
export const deleteColdEmailOffering = async (
  id: string,
): Promise<ApiResponse<void>> => {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/cold-email-offerings/${id}`,
      { method: 'DELETE', headers: { 'Content-Type': 'application/json' } },
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || `HTTP ${response.status}`,
      };
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
