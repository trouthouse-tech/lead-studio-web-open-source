import { API_CONFIG } from '@/config/api';

type ApiClient = {
  get: <T = any>(url: string, config?: { params?: Record<string, any> }) => Promise<{ data: T }>;
  post: <T = any>(url: string, data?: any) => Promise<{ data: T }>;
  patch: <T = any>(url: string, data?: any) => Promise<{ data: T }>;
  delete: <T = any>(url: string) => Promise<{ data: T }>;
};

/**
 * Strip query string from absolute URLs for console logging (avoids leaking params).
 */
const urlForErrorLog = (fullUrl: string): string => {
  try {
    const u = new URL(fullUrl);
    return `${u.origin}${u.pathname}`;
  } catch {
    return '[url]';
  }
};

/**
 * Create API client using native fetch (built into Next.js/Node.js 18+)
 * Simpler than axios, no dependency needed
 */
const createApiClient = (): ApiClient => {
  const baseURL = API_CONFIG.SERVER_URL;

  const getHeaders = async (): Promise<HeadersInit> => ({
    'Content-Type': 'application/json',
  });

  const pickErrorText = (errorData: Record<string, unknown>): string => {
    const topError = errorData.error;
    if (typeof topError === 'string' && topError.trim()) return topError.trim();
    if (topError && typeof topError === 'object' && 'message' in topError) {
      const m = (topError as { message?: unknown }).message;
      if (typeof m === 'string' && m.trim()) return m.trim();
    }
    const msg = errorData.message;
    if (typeof msg === 'string' && msg.trim()) return msg.trim();
    return '';
  };

  const handleResponse = async <T>(response: Response, url: string): Promise<{ data: T }> => {
    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as Record<string, unknown>;
      const text = pickErrorText(errorData);
      console.error('API Error:', {
        status: response.status,
        message: text || response.statusText,
        url: urlForErrorLog(url),
      });
      throw new Error(text || `Request failed: ${response.statusText}`);
    }

    const data = await response.json().catch(() => ({}));
    return { data };
  };

  return {
    get: async <T = any>(url: string, config?: { params?: Record<string, any> }): Promise<{ data: T }> => {
      let fullUrl = `${baseURL}${url}`;
      
      // Add query params
      if (config?.params) {
        const params = new URLSearchParams();
        Object.entries(config.params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
        const queryString = params.toString();
        if (queryString) {
          fullUrl += `?${queryString}`;
        }
      }

      try {
        const response = await fetch(fullUrl, {
          method: 'GET',
          headers: await getHeaders(),
        });

        return handleResponse<T>(response, fullUrl);
      } catch (error: any) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          console.error('Network Error: No response from server');
        }
        throw error;
      }
    },

    post: async <T = any>(url: string, data?: any): Promise<{ data: T }> => {
      const fullUrl = `${baseURL}${url}`;

      try {
        const response = await fetch(fullUrl, {
          method: 'POST',
          headers: await getHeaders(),
          body: data ? JSON.stringify(data) : undefined,
        });

        return handleResponse<T>(response, fullUrl);
      } catch (error: any) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          console.error('Network Error: No response from server');
        }
        throw error;
      }
    },

    patch: async <T = any>(url: string, data?: any): Promise<{ data: T }> => {
      const fullUrl = `${baseURL}${url}`;

      try {
        const response = await fetch(fullUrl, {
          method: 'PATCH',
          headers: await getHeaders(),
          body: data ? JSON.stringify(data) : undefined,
        });

        return handleResponse<T>(response, fullUrl);
      } catch (error: any) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          console.error('Network Error: No response from server');
        }
        throw error;
      }
    },

    delete: async <T = any>(url: string): Promise<{ data: T }> => {
      const fullUrl = `${baseURL}${url}`;

      try {
        const response = await fetch(fullUrl, {
          method: 'DELETE',
          headers: await getHeaders(),
        });

        return handleResponse<T>(response, fullUrl);
      } catch (error: any) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          console.error('Network Error: No response from server');
        }
        throw error;
      }
    },
  };
};

// Create singleton instance
let _apiClient: ApiClient | null = null;

export const getApiClient = (): ApiClient => {
  if (!_apiClient) {
    _apiClient = createApiClient();
  }
  return _apiClient;
};

export const apiClient = getApiClient();
