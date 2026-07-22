import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { ApiResult } from '../types';

type ProcessNextResult = {
  success: boolean;
  processed?: number;
  successful?: number;
  failed?: number;
  errors?: string[];
};

export const processNextQueueItem = async (): Promise<
  ApiResult<ProcessNextResult>
> => {
  const result = await requestApi<ProcessNextResult>(
    `${API_CONFIG.SERVER_URL}/api/data/lead-contact-email-queue/process-next`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    },
  );

  if (!result.success || result.httpStatus >= 400) return result;
  return { ...result, data: (result.data ?? result) as ProcessNextResult };
};
