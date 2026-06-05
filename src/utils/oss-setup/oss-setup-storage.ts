const STORAGE_KEY = 'lead-studio:oss-setup:v1';

export type OssSetupPersisted = {
  version: 1;
  step: number;
  serverUrl: string;
  setupComplete: boolean;
};

const DEFAULT_SERVER_URL = 'http://localhost:3032';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Read persisted OSS setup state from localStorage with shape validation.
 */
export const readOssSetupStorage = (): OssSetupPersisted | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return null;
    if (parsed.version !== 1) return null;
    if (typeof parsed.step !== 'number' || parsed.step < 0 || parsed.step > 4) return null;
    if (typeof parsed.serverUrl !== 'string' || !parsed.serverUrl.trim()) return null;
    if (typeof parsed.setupComplete !== 'boolean') return null;
    return {
      version: 1,
      step: parsed.step,
      serverUrl: parsed.serverUrl.trim().replace(/\/$/, ''),
      setupComplete: parsed.setupComplete,
    };
  } catch {
    return null;
  }
};

/**
 * Persist OSS setup state to localStorage.
 */
export const writeOssSetupStorage = (state: OssSetupPersisted): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const getDefaultOssServerUrl = (): string => {
  const fromEnv = process.env.NEXT_PUBLIC_SERVER_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  return DEFAULT_SERVER_URL;
};

export const clearOssSetupStorage = (): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
};
