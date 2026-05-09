import { API_CONFIG } from '@/config/api';
import type { LeadCategory } from '@/model';
import type { ApiResponse } from '../types';

export type UpdateLeadCategoryInput = {
  name: string;
  normalizedName: string;
};

export const updateLeadCategory = async (
  id: string,
  input: UpdateLeadCategoryInput,
  apiBaseUrl?: string
): Promise<ApiResponse<LeadCategory>> => {
  const baseUrl = apiBaseUrl ?? API_CONFIG.SERVER_URL;

  try {
    const response = await fetch(
      `${baseUrl}/api/data/lead-categories/${encodeURIComponent(id)}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: input.name,
          normalized_name: input.normalizedName,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error:
          (errorData as { error?: string }).error ||
          (errorData as { message?: string }).message ||
          `HTTP error! status: ${response.status}`,
      };
    }

    const result = await response.json();
    return { success: true, data: result.data ?? result };
  } catch (error) {
    console.error('Error updating lead category:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
