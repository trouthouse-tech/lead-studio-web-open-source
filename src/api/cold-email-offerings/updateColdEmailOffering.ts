import { API_CONFIG } from '@/config/api';
import type { ColdEmailOffering } from '@/model/cold-email-offering';
import type { ApiResponse } from '../types';

export type UpdateColdEmailOfferingInput = {
  title?: string;
  hook?: string;
  description?: string;
  source_notes?: string;
  sort_order?: number;
  is_archived?: boolean;
};

/**
 * PATCH `/api/data/cold-email-offerings/:id`
 */
export const updateColdEmailOffering = async (
  id: string,
  input: UpdateColdEmailOfferingInput,
): Promise<ApiResponse<ColdEmailOffering>> => {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/cold-email-offerings/${id}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      },
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || `HTTP ${response.status}`,
      };
    }
    return { success: true, data: data.data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
