/**
 * Server stores n8n results as `{ data: ... }`; unwrap to the inner value for display.
 */
export const unwrapResearchPayloadData = (payload: unknown): unknown => {
  if (!payload || typeof payload !== 'object') return payload;
  const o = payload as Record<string, unknown>;
  if ('data' in o && o.data !== undefined) return o.data;
  return payload;
};
