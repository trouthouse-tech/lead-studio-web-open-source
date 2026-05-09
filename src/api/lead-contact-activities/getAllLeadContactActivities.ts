import { API_CONFIG } from '@/config/api';
import type { LeadContactActivity } from '@/model';
import type { ApiResponse } from '../types';

export const getAllLeadContactActivities = async (): Promise<
  ApiResponse<LeadContactActivity[]>
> => {
  try {
    const response = await fetch(`${API_CONFIG.SERVER_URL}/api/data/lead-contact-activities`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
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
        error: data.error || 'Failed to fetch lead contact activities',
      };
    }

    return {
      success: true,
      data: data.data ?? data ?? [],
    };
  } catch (error: unknown) {
    console.error('❌ getAllLeadContactActivities error:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch lead contact activities',
    };
  }
};
