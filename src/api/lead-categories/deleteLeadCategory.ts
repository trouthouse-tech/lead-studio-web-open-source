import { API_CONFIG } from '@/config/api';
import type { ApiResponse } from '../types';

export const deleteLeadCategory = async (
  id: string,
  apiBaseUrl?: string
): Promise<ApiResponse<null>> => {
  const baseUrl = apiBaseUrl ?? API_CONFIG.SERVER_URL;

  try {
    const response = await fetch(
      `${baseUrl}/api/data/lead-categories/${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
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

    return { success: true, data: null };
  } catch (error) {
    console.error('Error deleting lead category:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
