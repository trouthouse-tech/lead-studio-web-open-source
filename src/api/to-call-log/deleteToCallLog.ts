import { API_CONFIG } from '@/config/api';
import type { ApiResponse } from '../types';

export const deleteToCallLog = async (id: string): Promise<ApiResponse<void>> => {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/to-call-log/${id}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error:
          errorData.error ||
          errorData.message ||
          `HTTP error! status: ${response.status}`,
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
