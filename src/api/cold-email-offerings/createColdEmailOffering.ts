import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { ColdEmailOffering } from '@/model/cold-email-offering';
import type { ApiResult } from '../types';

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
): Promise<ApiResult<ColdEmailOffering>> => {
  const result = await requestApi<ColdEmailOffering>(`${API_CONFIG.SERVER_URL}/api/data/cold-email-offerings`, {
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
      });
  if (!result.success || result.httpStatus >= 400) return result;
  return result;
};
