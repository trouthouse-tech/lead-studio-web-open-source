import { API_CONFIG } from '@/config/api';
import type { ColdEmailOffering } from '@/model/cold-email-offering';
import type { ApiResponse } from '../types';

export type CreateColdEmailOfferingInput = {
  title: string;
  hook: string;
  description: string;
  source_notes?: string;
  sort_order?: number;
  is_archived?: boolean;
};

/**
 * POST `/api/data/cold-email-offerings`
 */
export const createColdEmailOffering = async (
  input: CreateColdEmailOfferingInput,
): Promise<ApiResponse<ColdEmailOffering>> => {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/cold-email-offerings`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: input.title,
          hook: input.hook,
          description: input.description,
          source_notes: input.source_notes ?? '',
          sort_order: input.sort_order ?? 0,
          is_archived: input.is_archived ?? false,
        }),
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
