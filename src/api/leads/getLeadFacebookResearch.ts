import { API_CONFIG } from '@/config/api';
import type { ApiResponse } from '../types';

export type FacebookResearchRow = {
  id: string;
  payload: unknown;
  completed_at: string | null;
};

export type LeadFacebookResearchData = {
  page: FacebookResearchRow | null;
  posts: FacebookResearchRow | null;
};

export const getLeadFacebookResearch = async (
  leadId: string
): Promise<ApiResponse<LeadFacebookResearchData>> => {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/leads/${leadId}/facebook-research`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    );
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        success: false,
        error: body.error || body.message || 'Failed to load Facebook research',
      };
    }
    const data = body.data as LeadFacebookResearchData | undefined;
    if (!data || typeof data !== 'object') {
      return { success: false, error: 'Invalid response' };
    }
    return { success: true, data };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Failed to load Facebook research',
    };
  }
};
