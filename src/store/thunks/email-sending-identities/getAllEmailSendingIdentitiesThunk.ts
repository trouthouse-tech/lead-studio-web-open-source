import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import { mapApiFailureToThunkStatus } from '@/api/_shared';
import { listEmailSendingIdentities } from '@/api/email-sending-identities';
import type { AppThunk } from '../../store';
import { EmailSendingIdentitiesActions } from '@/store/dumps/emailSendingIdentities';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Loads email sending identities into the `emailSendingIdentities` dump.
 */
export const getAllEmailSendingIdentitiesThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await listEmailSendingIdentities();

      if (response.success && response.data) {
        dispatch(
          EmailSendingIdentitiesActions.setEmailSendingIdentities(response.data),
        );
        return 200;
      }

      return mapApiFailureToThunkStatus(response);
    } catch (error: unknown) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToGetAllEmailSendingIdentities',
        message,
        stack,
        thunkName: 'getAllEmailSendingIdentitiesThunk',
      });
      console.error('❌ getAllEmailSendingIdentitiesThunk error:', error);
      return 500;
    }
  };
};
