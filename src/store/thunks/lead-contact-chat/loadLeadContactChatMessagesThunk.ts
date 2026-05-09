import type { AppThunk } from '@/store';
import { getLeadContactChatMessages } from '@/api/services';
import { LeadContactChatActions } from '../../dumps';

type Status = Promise<200 | 400 | 500>;

export const loadLeadContactChatMessagesThunk = (
  leadContactId: string,
): AppThunk<Status> => {
  return async (dispatch): Status => {
    if (!leadContactId) {
      return 400;
    }

    dispatch(
      LeadContactChatActions.setLoadingForContact({
        leadContactId,
        isLoading: true,
      }),
    );
    dispatch(
      LeadContactChatActions.setErrorForContact({ leadContactId, error: null }),
    );
    try {
      const messages = await getLeadContactChatMessages(leadContactId);
      dispatch(
        LeadContactChatActions.setMessagesForContact({ leadContactId, messages }),
      );
      return 200;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to load contact chat';
      dispatch(
        LeadContactChatActions.setErrorForContact({
          leadContactId,
          error: message,
        }),
      );
      return 500;
    } finally {
      dispatch(
        LeadContactChatActions.setLoadingForContact({
          leadContactId,
          isLoading: false,
        }),
      );
    }
  };
};
