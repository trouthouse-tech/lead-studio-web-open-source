import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import { mapApiFailureToThunkStatus } from '@/api/_shared';
import type { AppThunk } from '@/store';
import { getLeadById } from '@/api/leads';
import { getLeadContactsByLeadId } from '@/api/lead-contacts';
import { LeadsActions } from '../../dumps/leads';
import { CurrentLeadActions } from '../../current';
import { CurrentLeadContactActions } from '../../current';
import { LeadContactBuilderActions } from '../../builders';
import { setCurrentLeadThunk } from '../leads/setCurrentLeadThunk';
import { logLeadContactActivityThunk } from '../lead-contact-activities';
import { checkQueueStatusThunk } from './checkQueueStatusThunk';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Hydrates currentLead + currentLeadContact for the contact detail page.
 */
export const loadLeadContactDetailThunk = (
  leadId: string,
  contactId: string
): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    try {
      dispatch(LeadContactBuilderActions.reset());

      let lead = getState().leads[leadId];
      if (!lead) {
        const leadRes = await getLeadById(leadId);
        if (!leadRes.success || !leadRes.data) {
          return mapApiFailureToThunkStatus(leadRes);
        }
        dispatch(LeadsActions.addLead(leadRes.data));
        lead = leadRes.data;
      }
      dispatch(CurrentLeadActions.setCurrentLead(lead));
      dispatch(setCurrentLeadThunk(leadId));

      const contactsRes = await getLeadContactsByLeadId(leadId);
      if (!contactsRes.success || !contactsRes.data) {
        return mapApiFailureToThunkStatus(contactsRes);
      }
      const contact = contactsRes.data.find((c) => c.id === contactId);
      if (!contact) {
        return 400;
      }

      dispatch(CurrentLeadContactActions.setLeadContact(contact));
      void dispatch(
        logLeadContactActivityThunk({
          leadContactId: contact.id,
          leadId: lead.id,
          customerName: lead.business_name || 'Unknown customer',
        })
      );
      void dispatch(checkQueueStatusThunk(contactId));
      return 200;
    } catch (e) {
      const { message, stack } = coerceErrorFields(e);
      reportThunkError({
        event: 'failedToLoadLeadContactDetail',
        message,
        stack,
        thunkName: 'loadLeadContactDetailThunk',
      });
      console.error('❌ loadLeadContactDetailThunk:', e);
      return 500;
    }
  };
};
