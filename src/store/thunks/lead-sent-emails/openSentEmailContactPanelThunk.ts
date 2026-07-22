import type { AppThunk } from '../../store';
import { LEAD_CONTACT_DETAIL_PATH } from '@/config/routes';
import {
  CurrentLeadContactActions,
  CurrentLeadContactEmailActions,
} from '../../current';
import { setCurrentLeadThunk } from '../leads/setCurrentLeadThunk';
import { getLeadContactEmailsByContactIdThunk } from '../lead-contact-emails/getLeadContactEmailsByContactIdThunk';
import { getLeadSentEmailsByContactIdThunk } from './getLeadSentEmailsByContactIdThunk';

type ResponseType = Promise<200 | 400>;

/**
 * Loads lead + contact context for follow-up from the sent-emails list, then navigates to the contact detail page.
 */
export const openSentEmailContactPanelThunk = (
  leadContactId: string
): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    const contact = getState().leadContacts[leadContactId];
    if (!contact) {
      console.error('❌ openSentEmailContactPanelThunk: contact not found', leadContactId);
      return 400;
    }

    await dispatch(setCurrentLeadThunk(contact.lead_id));
    dispatch(CurrentLeadContactActions.setLeadContact(contact));
    await dispatch(getLeadContactEmailsByContactIdThunk(leadContactId));
    await dispatch(getLeadSentEmailsByContactIdThunk(leadContactId));

    dispatch(CurrentLeadContactEmailActions.reset());
    dispatch(
      CurrentLeadContactEmailActions.updateFields({
        lead_id: contact.lead_id,
        lead_contact_id: contact.id,
      })
    );

    if (typeof window !== 'undefined') {
      window.location.assign(LEAD_CONTACT_DETAIL_PATH);
    }
    return 200;
  };
};
