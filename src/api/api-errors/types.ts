export type ApiErrorSeverity = 'fatal' | 'error' | 'warning';

export type ReportApiErrorBody = {
  event: string;
  message: string;
  httpMethod: string;
  routePath: string;
  stack?: string | null;
  statusCode?: number | null;
  upstream?: string | null;
  severity?: ApiErrorSeverity;
};
