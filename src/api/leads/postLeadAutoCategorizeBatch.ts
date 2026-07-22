import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type {
  PostLeadAutoCategorizeBatchCategoryPayload,
  PostLeadAutoCategorizeBatchLeadPayload,
  PostLeadAutoCategorizeBatchResponseBody,
} from './postLeadAutoCategorizeBatch.types';

/**
 * POST /api/services/lead-auto-categorize-batch — batch suggest categories (existing ids or null). Server resolves tenant user when `userId` is omitted.
 */
export const postLeadAutoCategorizeBatch = async (
  categories: PostLeadAutoCategorizeBatchCategoryPayload[],
  leads: PostLeadAutoCategorizeBatchLeadPayload[]
): Promise<PostLeadAutoCategorizeBatchResponseBody> => {
  const result = await requestApi<PostLeadAutoCategorizeBatchResponseBody>(
    `${API_CONFIG.SERVER_URL}/api/services/lead-auto-categorize-batch`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categories, leads }),
    },
  );

  if (result.error?.includes('Invalid JSON')) {
    return { success: false, error: 'Invalid JSON response' };
  }

  const json = (result.data ?? result) as PostLeadAutoCategorizeBatchResponseBody;
  if (!result.success || result.httpStatus >= 400 || !json.success || !Array.isArray(json.assignments)) {
    return {
      success: false,
      error: json.error ?? result.error ?? `Request failed (HTTP ${result.httpStatus})`,
    };
  }

  return json;
};
