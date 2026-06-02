/**
 * API Configuration
 * Manages different API endpoints for development and production
 */

/** True while `next build` is running (NODE_ENV is production but env vars may be unset). */
const isNextProductionBuildPhase = (): boolean =>
  process.env.NEXT_PHASE === 'phase-production-build';

const isProductionEnvironment = (): boolean => {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return false;
    }
  }

  const isVercelProduction = process.env.VERCEL_ENV === 'production';
  const isNodeProduction = process.env.NODE_ENV === 'production';

  return isVercelProduction || isNodeProduction;
};

const getDefaultUrl = (): string => {
  if (isProductionEnvironment() && !isNextProductionBuildPhase()) {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('NEXT_PUBLIC_API_URL must be set in production environment.');
    }
    return process.env.NEXT_PUBLIC_API_URL;
  }

  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
};

const getServerUrl = (): string => {
  // Express API base URL (mentorai-server `/api/data/*` and service routes) — not the Next.js app.
  const explicit = process.env.NEXT_PUBLIC_SERVER_URL?.trim();
  const fallbackFromApi = process.env.NEXT_PUBLIC_API_URL?.trim();
  /** Local mentorai-server; default port 3005 (see mentorai-server/index.ts). */
  const devDefault = 'http://localhost:3005';

  if (isProductionEnvironment() && !isNextProductionBuildPhase()) {
    const url = explicit || fallbackFromApi;
    if (!url) {
      throw new Error(
        'Set NEXT_PUBLIC_SERVER_URL or NEXT_PUBLIC_API_URL to your Express API URL in production.'
      );
    }
    return url;
  }

  // In dev, do not fall back to NEXT_PUBLIC_API_URL — it is often set to this app’s URL (e.g. :3000)
  // and would send API calls to Next instead of Express.
  return explicit || devDefault;
};

export const API_CONFIG = {
  LOCAL: 'http://localhost:3005',
  DEFAULT: getDefaultUrl(),
  SERVER_URL: getServerUrl(),
} as const;

/**
 * Base URL for mentorai-server `/api/data/*` routes (browser calls; matches {@link getAllLeads}).
 */
export const getMentoraiDataApiBaseUrl = (): string =>
  API_CONFIG.SERVER_URL.replace(/\/$/, '');

export type ApiEnvironment = 'local' | 'production';

export const getApiUrl = (environment?: ApiEnvironment): string => {
  if (!environment) {
    return API_CONFIG.DEFAULT;
  }

  if (environment === 'local') {
    return API_CONFIG.LOCAL;
  }

  if (!isNextProductionBuildPhase() && !process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL must be set for production environment.');
  }

  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
};

/**
 * Base URL for mentorai-server (Express). Used only by Next.js route handlers (server).
 * Prefer `EXPRESS_SERVER_URL` when this Next app and the API run on different hosts.
 */
export const getMentoraiServerBaseUrl = (): string | null => {
  const base =
    process.env.EXPRESS_SERVER_URL?.replace(/\/$/, '') ||
    process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, '') ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  return base?.trim() || null;
};
