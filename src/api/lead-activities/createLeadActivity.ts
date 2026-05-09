import { API_CONFIG } from '@/config/api';
import type { LeadActivity } from '@/model';
import type { ApiResponse } from '../types';

export type CreateLeadActivityInput = {
  lead_id: string;
  customer_id: string;
  customer_name: string;
  activity_type?: 'lead_opened';
};

export const createLeadActivity = async (
  input: CreateLeadActivityInput
): Promise<ApiResponse<LeadActivity>> => {
  try {
    const response = await fetch(`${API_CONFIG.SERVER_URL}/api/data/lead-activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

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
        error: data.error || 'Failed to create lead activity',
      };
    }

    return {
      success: true,
      data: data.data ?? data,
    };
  } catch (error: unknown) {
    console.error('❌ createLeadActivity error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create lead activity',
    };
  }
};
