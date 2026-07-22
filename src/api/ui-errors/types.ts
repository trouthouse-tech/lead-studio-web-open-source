export type UiErrorSeverity = 'fatal' | 'error' | 'warning';

export type ReportUiErrorBody = {
  event: string;
  message: string;
  routePath: string;
  stack?: string | null;
  componentName?: string | null;
  digest?: string | null;
  severity?: UiErrorSeverity;
};
