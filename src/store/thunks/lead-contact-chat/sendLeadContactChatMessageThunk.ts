import type { AppThunk } from '@/store';
import { postLeadContactChatMessage } from '@/api/services';
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
      const messages = await postLeadContactChatMessage(leadContactId, content);
      dispatch(
        LeadContactChatActions.setMessagesForContact({ leadContactId, messages }),
      );
      return 200;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to send contact message';
      dispatch(
        LeadContactChatActions.setErrorForContact({
          leadContactId,
          error: message,
        }),
      );
      return 500;
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
