import { API_CONFIG } from '@/config/api';
import type { ApiResponse } from '../types';

export type GenerateColdEmailOfferingFromNotesResult = {
  title: string;
  hook: string;
  description: string;
};

/**
 * POST `/api/data/cold-email-offerings/generate-from-notes`
 */
export const generateColdEmailOfferingFromNotes = async (
  sourceNotes: string,
): Promise<ApiResponse<GenerateColdEmailOfferingFromNotesResult>> => {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/cold-email-offerings/generate-from-notes`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_notes: sourceNotes }),
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
