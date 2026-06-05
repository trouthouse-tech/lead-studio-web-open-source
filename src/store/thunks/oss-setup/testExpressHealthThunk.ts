import type { AppThunk } from '../../store';
import { OssSetupBuilderActions } from '@/store/builders/ossSetupBuilder';
import { persistOssSetupThunk } from './hydrateOssSetupThunk';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * GET {serverUrl}/api/health from the browser to verify Express is reachable.
 */
export const testExpressHealthThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    const { serverUrl } = getState().ossSetupBuilder;
    const base = serverUrl.trim().replace(/\/$/, '');

    if (!base) {
      dispatch(OssSetupBuilderActions.setHealthError('Enter your Express API URL first.'));
      dispatch(OssSetupBuilderActions.setLastHealthOk(false));
      return 400;
    }

    dispatch(OssSetupBuilderActions.setHealthTesting(true));
    dispatch(OssSetupBuilderActions.setHealthError(null));

    try {
      const response = await fetch(`${base}/api/health`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        dispatch(OssSetupBuilderActions.setLastHealthOk(false));
        dispatch(
          OssSetupBuilderActions.setHealthError(
            `Health check returned HTTP ${response.status}. Is lead-studio-express-server running?`
          )
        );
        return 500;
      }

      const contentType = response.headers.get('content-type') ?? '';
      if (!contentType.includes('application/json')) {
        dispatch(OssSetupBuilderActions.setLastHealthOk(false));
        dispatch(
          OssSetupBuilderActions.setHealthError(
            'Health endpoint did not return JSON. Check NEXT_PUBLIC_SERVER_URL / Express port (default 3032).'
          )
        );
        return 500;
      }

      const body: unknown = await response.json();
      const record = typeof body === 'object' && body !== null ? body as Record<string, unknown> : null;
      const ok =
        record?.success === true ||
        record?.status === 'ok';

      if (!ok) {
        dispatch(OssSetupBuilderActions.setLastHealthOk(false));
        dispatch(
          OssSetupBuilderActions.setHealthError(
            'Unexpected health response. See express README smoke steps.'
          )
        );
        return 500;
      }

      dispatch(OssSetupBuilderActions.setLastHealthOk(true));
      dispatch(OssSetupBuilderActions.setHealthError(null));
      await dispatch(persistOssSetupThunk());
      return 200;
    } catch (error) {
      const message =
        error instanceof TypeError
          ? 'Could not reach Express (network/CORS). Start the API and confirm the URL.'
          : error instanceof Error
            ? error.message
            : 'Health check failed';
      dispatch(OssSetupBuilderActions.setLastHealthOk(false));
      dispatch(OssSetupBuilderActions.setHealthError(message));
      return 500;
    } finally {
      dispatch(OssSetupBuilderActions.setHealthTesting(false));
    }
  };
};
