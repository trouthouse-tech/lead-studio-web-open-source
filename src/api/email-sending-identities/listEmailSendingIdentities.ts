import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { EmailSendingIdentity } from '@/model/email-sending-identity';
import type { ApiResult } from '../types';

/**
 * GET /api/data/email-sending-identities — From addresses configured on the express server.
 */
export const listEmailSendingIdentities = async (): Promise<
  ApiResult<EmailSendingIdentity[]>
> => {
  const result = await requestApi<EmailSendingIdentity[]>(
    `${API_CONFIG.SERVER_URL}/api/data/email-sending-identities`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    },
  );

  if (!result.success || result.httpStatus >= 400) return result;

  const payload = (result.data ?? result) as EmailSendingIdentity[] | { data?: EmailSendingIdentity[] };
  const rows = Array.isArray(payload) ? payload : payload.data ?? [];
  return { ...result, data: Array.isArray(rows) ? rows : [] };
};
