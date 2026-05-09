import { API_CONFIG } from '@/config/api';
import type { ToCallLog, ToCallLogStatus } from '@/model/to-call-log';
import type { ApiResponse } from '../types';

export type UpdateToCallLogInput = {
  notes?: string;
  call_notes?: string | null;
  call_status?: ToCallLogStatus;
  called_at?: string | null;
};

export const updateToCallLog = async (
  id: string,
  input: UpdateToCallLogInput
): Promise<ApiResponse<ToCallLog>> => {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/to-call-log/${id}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
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
