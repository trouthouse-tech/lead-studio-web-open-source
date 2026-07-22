import { API_CONFIG } from '@/config/api';
import type { ReportApiErrorBody } from './types';

/**
 * POST /api/data/api-errors/report — persists an API handler failure (prod only).
 * Synchronous fire-and-forget; never throws.
 *
 * @param body - Event id, HTTP context, and error payload
 */
export const reportApiError = (body: ReportApiErrorBody): void => {
  if (process.env.NODE_ENV === 'development') {
    return;
  }

  fetch(`${API_CONFIG.SERVER_URL}/api/data/api-errors/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: body.event,
      message: body.message,
      httpMethod: body.httpMethod,
      routePath: body.routePath,
      stack: body.stack ?? null,
      statusCode: body.statusCode ?? null,
      upstream: body.upstream ?? null,
      severity: body.severity ?? 'error',
    }),
    keepalive: true,
  }).catch(() => {});
};
