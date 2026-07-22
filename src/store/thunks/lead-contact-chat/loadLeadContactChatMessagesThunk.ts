import { mapApiFailureToThunkStatus } from '@/api/_shared';
import { getLeadContactChatMessages } from '@/api/services';
import type { AppThunk } from '@/store';
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
      const result = await getLeadContactChatMessages(leadContactId);
      if (!result.success || !result.data) {
        dispatch(
          LeadContactChatActions.setErrorForContact({
            leadContactId,
            error: result.error ?? 'Failed to load contact chat',
          }),
        );
        return mapApiFailureToThunkStatus(result);
      }

      dispatch(
        LeadContactChatActions.setMessagesForContact({
          leadContactId,
          messages: result.data,
        }),
      );
      return 200;
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
