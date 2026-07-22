import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { LeadContact } from '@/model/lead-contact';
import type { ApiResult } from '../types';

/**
 * Fetches all lead contacts from the server.
 * Expects backend GET /api/data/lead-contacts (e.g. tht-express-server lead-contacts router).
 * If the endpoint is missing (404) or returns HTML, returns empty array so the app keeps working.
 */
export const getAllLeadContacts = async (): Promise<
  ApiResult<LeadContact[]>
> => {
  const result = await requestApi<LeadContact[]>(
    `${API_CONFIG.SERVER_URL}/api/data/lead-contacts`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    },
  );

  if (!result.success && result.httpStatus === 404) {
    return { success: true, data: [], httpStatus: 404 };
  }
  if (!result.success && result.error?.includes('Invalid JSON')) {
    return { success: true, data: [], httpStatus: result.httpStatus };
  }
  if (!result.success || result.httpStatus >= 400) return result;
  return { ...result, data: result.data ?? [] };
};
