import { getApiClient } from '@/api/client';
import type { ApiResponse } from '../types';

type DeleteResponseBody = {
  success: boolean;
  error?: string;
};

/**
 * DELETE /api/data/recurring-costs/:id
 */
export const deleteRecurringCost = async (id: string): Promise<ApiResponse<void>> => {
  try {
    const { data } = await getApiClient().delete<DeleteResponseBody>(
      `/api/data/recurring-costs/${encodeURIComponent(id)}`,
    );
    if (!data.success) {
      return { success: false, error: data.error ?? 'Failed to delete recurring cost' };
    }
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete recurring cost',
    };
  }
};
