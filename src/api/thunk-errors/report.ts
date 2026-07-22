import { API_CONFIG } from '@/config/api';
import type { ReportThunkErrorBody } from './types';

/**
 * POST /api/data/thunk-errors/report — persists an unexpected thunk failure (prod only).
 * Synchronous fire-and-forget; never throws.
 *
 * @param body - Stable event id, message, optional thunk context
 */
export const reportThunkError = (body: ReportThunkErrorBody): void => {
  if (process.env.NODE_ENV === 'development') {
    return;
  }

  fetch(`${API_CONFIG.SERVER_URL}/api/data/thunk-errors/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: body.event,
      message: body.message,
      stack: body.stack ?? null,
      thunkName: body.thunkName ?? null,
      collection: body.collection ?? null,
      entityId: body.entityId ?? null,
      severity: body.severity ?? 'error',
    }),
    keepalive: true,
  }).catch(() => {});
};
