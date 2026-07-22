import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { ApiResult } from '../types';

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
): Promise<ApiResult<GenerateColdEmailOfferingFromNotesResult>> => {
  const result = await requestApi<GenerateColdEmailOfferingFromNotesResult>(`${API_CONFIG.SERVER_URL}/api/data/cold-email-offerings/generate-from-notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_notes: sourceNotes }),
      });
  if (!result.success || result.httpStatus >= 400) return result;
  return result;
};
