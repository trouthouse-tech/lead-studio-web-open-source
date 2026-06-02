import { API_CONFIG } from '@/config/api';
import type { LeadContact } from '@/model/lead-contact';
import type { ApiResponse } from '../types';

/**
 * GET lead contacts for one lead (Express GET /api/data/lead-contacts/lead/:leadId).
 */
export const getLeadContactsByLeadId = async (
  leadId: string
): Promise<ApiResponse<LeadContact[]>> => {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/lead-contacts/lead/${encodeURIComponent(leadId)}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('❌ Non-JSON response:', text.substring(0, 200));
      return { success: false, error: 'Invalid response' };
    }

    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to get lead contacts',
      };
    }

    return {
      success: true,
      data: data.data ?? data ?? [],
    };
  } catch (error: unknown) {
    console.error('❌ getLeadContactsByLeadId error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get lead contacts',
    };
  }
};
