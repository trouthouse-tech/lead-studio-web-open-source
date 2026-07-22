import { mapApiFailureToThunkStatus } from '@/api/_shared';
import { postLeadContactChatMessage } from '@/api/services';
import type { AppThunk } from '@/store';
import { LeadContactChatActions } from '../../dumps';

type Status = Promise<200 | 400 | 500>;

export const sendLeadContactChatMessageThunk = (
  leadContactId: string,
  content: string,
): AppThunk<Status> => {
  return async (dispatch): Status => {
    if (!leadContactId || !content.trim()) {
      return 400;
    }

    dispatch(
      LeadContactChatActions.setPostingForContact({
        leadContactId,
        isPosting: true,
      }),
    );
    dispatch(
      LeadContactChatActions.setErrorForContact({ leadContactId, error: null }),
    );

    try {
      const result = await postLeadContactChatMessage(leadContactId, content);
      if (!result.success || !result.data) {
        dispatch(
          LeadContactChatActions.setErrorForContact({
            leadContactId,
            error: result.error ?? 'Failed to send contact message',
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
        LeadContactChatActions.setPostingForContact({
          leadContactId,
          isPosting: false,
        }),
      );
    }
  };
};
