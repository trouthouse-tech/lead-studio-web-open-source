export type ThunkErrorSeverity = 'fatal' | 'error' | 'warning';

export type ReportThunkErrorBody = {
  event: string;
  message: string;
  stack?: string | null;
  thunkName?: string | null;
  collection?: string | null;
  entityId?: string | null;
  severity?: ThunkErrorSeverity;
};
