import {
  postLeadAutoCategorizeForLead,
  type PostLeadAutoCategorizeResponseBody,
} from '@/api/leads';
import { normalizeLeadCategoryName } from '@/utils/leads';
import type { AppThunk } from '../../store';
import { createLeadCategoryThunk } from '../lead-categories';
import { updateLeadThunk } from './updateLeadThunk';

export type RunLeadAutoCategorizeResult =
  | {
      ok: true;
      categoryName: string;
      confidence: number;
      reason: string;
      matchedExisting: boolean;
      createdCategory: boolean;
    }
  | { ok: false; status: 400 | 500; error?: string; message?: string };

type ResponseType = Promise<RunLeadAutoCategorizeResult>;

/**
 * Runs AI auto-categorization for current lead, creates category if needed, then assigns it.
 */
export const runLeadAutoCategorizeThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    const leadId = getState().currentLead?.id;
    if (!leadId) {
      return { ok: false, status: 400, message: 'No lead selected' };
    }

    try {
      const res = await postLeadAutoCategorizeForLead(leadId);
      const text = await res.text();
      let json: PostLeadAutoCategorizeResponseBody = {};
      try {
        json = JSON.parse(text) as PostLeadAutoCategorizeResponseBody;
      } catch {
        return { ok: false, status: 400, message: 'Invalid response from server' };
      }

      if (!res.ok || json.success === false) {
        return {
          ok: false,
          status: res.status >= 500 ? 500 : 400,
          error: typeof json.error === 'string' ? json.error : undefined,
          message: typeof json.error === 'string' ? json.error : undefined,
        };
      }

      const suggestedName = json.categoryName?.trim();
      if (!suggestedName) {
        return {
          ok: false,
          status: 500,
          message: 'AI did not return a category name',
        };
      }

      const normalizedSuggested = normalizeLeadCategoryName(suggestedName);
      const leadCategories = getState().leadCategories;
      const existing = leadCategories.find(
        (cat) => normalizeLeadCategoryName(cat.name) === normalizedSuggested
      );

      let createdCategory = false;
      if (!existing) {
        const created = await dispatch(createLeadCategoryThunk(suggestedName));
        if (created !== 200) {
          return {
            ok: false,
            status: 500,
            message: 'Failed to create suggested category',
          };
        }
        createdCategory = true;
      }

      const refreshedCategories = getState().leadCategories;
      const resolvedCategory = refreshedCategories.find(
        (cat) => normalizeLeadCategoryName(cat.name) === normalizedSuggested
      );

      const update = await dispatch(
        updateLeadThunk(leadId, {
          category_id: resolvedCategory?.id ?? null,
          category_name: resolvedCategory?.name ?? suggestedName,
        })
      );

      if (update !== 200) {
        return {
          ok: false,
          status: 500,
          message: 'Failed to assign suggested category to lead',
        };
      }

      return {
        ok: true,
        categoryName: resolvedCategory?.name ?? suggestedName,
        confidence: typeof json.confidence === 'number' ? json.confidence : 0.5,
        reason: json.reason?.trim() || 'Matched from lead context.',
        matchedExisting: Boolean(existing || json.matchedExisting),
        createdCategory,
      };
    } catch (error: unknown) {
      console.error('runLeadAutoCategorizeThunk:', error);
      return { ok: false, status: 500 };
    }
  };
};
