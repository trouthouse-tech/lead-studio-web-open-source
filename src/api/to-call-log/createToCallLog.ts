import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { ToCallLog, ToCallLogStatus } from '@/model/to-call-log';
import type { ApiResult } from '../types';

export type CreateToCallLogInput = {
  lead_id: string;
  lead_contact_id: string;
  lead_contact_email_queue_id?: string | null;
  notes: string;
  call_notes?: string | null;
  call_status?: ToCallLogStatus;
};

export const createToCallLog = async (
  input: CreateToCallLogInput
): Promise<ApiResult<ToCallLog>> => {
  const result = await requestApi<ToCallLog>(`${API_CONFIG.SERVER_URL}/api/data/to-call-log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
  if (!result.success || result.httpStatus >= 400) return result;
  return result;
};
