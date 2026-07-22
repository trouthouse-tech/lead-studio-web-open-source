import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { ToCallLog, ToCallLogStatus } from '@/model/to-call-log';
import type { ApiResult } from '../types';

export type UpdateToCallLogInput = {
  notes?: string;
  call_notes?: string | null;
  call_status?: ToCallLogStatus;
  called_at?: string | null;
};

export const updateToCallLog = async (
  id: string,
  input: UpdateToCallLogInput
): Promise<ApiResult<ToCallLog>> => {
  const result = await requestApi<ToCallLog>(`${API_CONFIG.SERVER_URL}/api/data/to-call-log/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
  if (!result.success || result.httpStatus >= 400) return result;
  return result;
};
