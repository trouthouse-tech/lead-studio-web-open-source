export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
};

export type ApiResult<T> = ApiResponse<T> & { httpStatus: number };
