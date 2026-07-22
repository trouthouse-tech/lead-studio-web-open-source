import { API_CONFIG } from '@/config/api';
import type { ReportUiErrorBody } from './types';

/**
 * POST /api/data/ui-errors/report — persists a UI / error-boundary failure (prod only).
 * Synchronous fire-and-forget; never throws.
 *
 * @param body - Event id, route path, and error payload
 */
export const reportUiError = (body: ReportUiErrorBody): void => {
  if (process.env.NODE_ENV === 'development') {
    return;
  }

  fetch(`${API_CONFIG.SERVER_URL}/api/data/ui-errors/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: body.event,
      message: body.message,
      routePath: body.routePath,
      stack: body.stack ?? null,
      componentName: body.componentName ?? null,
      digest: body.digest ?? null,
      severity: body.severity ?? 'error',
    }),
    keepalive: true,
  }).catch(() => {});
};
