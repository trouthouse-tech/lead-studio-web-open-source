import { API_CONFIG } from '@/config/api';
import type { EmailSendingIdentity } from '@/model/email-sending-identity';
import type { ApiResponse } from '../types';

/**
 * GET /api/data/email-sending-identities — From addresses configured on the express server.
 */
export const listEmailSendingIdentities = async (): Promise<
  ApiResponse<EmailSendingIdentity[]>
> => {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/email-sending-identities`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        error: (data as { error?: string }).error || `HTTP ${response.status}`,
      };
    }

    const rows = (data as { data?: EmailSendingIdentity[] }).data ?? data;
    return {
      success: true,
      data: Array.isArray(rows) ? rows : [],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list sending identities',
    };
  }
};
