import { API_CONFIG } from '@/config/api';
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
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/services/lead-auto-categorize-batch`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories, leads }),
      }
    );

    let json: PostLeadAutoCategorizeBatchResponseBody = {};
    try {
      json = (await response.json()) as PostLeadAutoCategorizeBatchResponseBody;
    } catch {
      return { success: false, error: 'Invalid JSON response' };
    }

    if (!response.ok || !json.success || !Array.isArray(json.assignments)) {
      return {
        success: false,
        error: json.error ?? `Request failed (HTTP ${response.status})`,
      };
    }

    return json;
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
};
