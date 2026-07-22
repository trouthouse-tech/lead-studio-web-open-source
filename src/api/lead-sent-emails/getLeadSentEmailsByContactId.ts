import { getAllLeadSentEmails } from './getAllLeadSentEmails';
import type { LeadSentEmail } from '@/model/lead-sent-email';
import type { ApiResult } from '../types';

/**
 * Server has no per-contact route; filters full list client-side.
 */
export const getLeadSentEmailsByContactId = async (
  contactId: string
): Promise<ApiResult<LeadSentEmail[]>> => {
  const res = await getAllLeadSentEmails();
  if (!res.success || !res.data) {
    return { success: false, error: res.error || 'Failed to load', httpStatus: res.httpStatus };
  }
  const filtered = res.data.filter((e) => e.lead_contact_id === contactId);
  return { success: true, data: filtered, httpStatus: res.httpStatus };
};
