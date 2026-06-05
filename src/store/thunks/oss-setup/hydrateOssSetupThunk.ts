import type { AppThunk } from '../../store';
import { OssSetupBuilderActions, type OssSetupStep } from '@/store/builders/ossSetupBuilder';
import {
  getDefaultOssServerUrl,
  readOssSetupStorage,
  writeOssSetupStorage,
} from '@/utils/oss-setup';

type ResponseType = Promise<200>;

/**
 * Loads OSS setup state from localStorage into Redux.
 */
export const hydrateOssSetupThunk = (): AppThunk<ResponseType> => {
  return (dispatch): ResponseType => {
    const stored = readOssSetupStorage();
    const defaultUrl = getDefaultOssServerUrl();

    if (stored) {
      dispatch(OssSetupBuilderActions.setStep(stored.step as OssSetupStep));
      dispatch(OssSetupBuilderActions.setServerUrl(stored.serverUrl));
      dispatch(OssSetupBuilderActions.setSetupComplete(stored.setupComplete));
    } else {
      dispatch(OssSetupBuilderActions.setServerUrl(defaultUrl));
    }

    dispatch(OssSetupBuilderActions.setHydrated(true));
    return Promise.resolve(200);
  };
};

/**
 * Persists current builder fields to localStorage.
 */
export const persistOssSetupThunk = (): AppThunk<Promise<200>> => {
  return (_dispatch, getState): Promise<200> => {
    const { step, serverUrl, setupComplete } = getState().ossSetupBuilder;
    writeOssSetupStorage({
      version: 1,
      step,
      serverUrl,
      setupComplete,
    });
    return Promise.resolve(200);
  };
};
