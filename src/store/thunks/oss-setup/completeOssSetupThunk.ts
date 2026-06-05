import type { AppThunk } from '../../store';
import { OssSetupBuilderActions } from '@/store/builders/ossSetupBuilder';
import { persistOssSetupThunk } from './hydrateOssSetupThunk';

type ResponseType = Promise<200 | 400>;

/**
 * Marks OSS stack setup complete after a successful health check.
 */
export const completeOssSetupThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    const { lastHealthOk } = getState().ossSetupBuilder;

    if (lastHealthOk !== true) {
      return 400;
    }

    dispatch(OssSetupBuilderActions.setSetupComplete(true));
    dispatch(OssSetupBuilderActions.setStep(4));
    await dispatch(persistOssSetupThunk());
    return 200;
  };
};
