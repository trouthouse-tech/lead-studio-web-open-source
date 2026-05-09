import { getApiClient } from '@/api/client';
import type { ApiResponse } from '../types';

type DeleteResponseBody = {
  success: boolean;
  error?: string;
};

/**
 * DELETE /api/data/one-time-costs/:id
 */
export const deleteOneTimeCost = async (id: string): Promise<ApiResponse<void>> => {
  try {
    const { data } = await getApiClient().delete<DeleteResponseBody>(
      `/api/data/one-time-costs/${encodeURIComponent(id)}`,
    );
    if (!data.success) {
      return { success: false, error: data.error ?? 'Failed to delete one-time cost' };
    }
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete one-time cost',
    };
  }
};
