import type { AppThunk } from '@/store';
import { loadLeadContactDetailThunk } from './loadLeadContactDetailThunk';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Hydrates `currentLead` + `currentLeadContact` before navigating to the static contact detail page.
 */
export const openLeadContactDetailThunk = (
  leadId: string,
  contactId: string,
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    return dispatch(loadLeadContactDetailThunk(leadId, contactId));
  };
};
