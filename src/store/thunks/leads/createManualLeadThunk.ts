import type { AppThunk } from '../../store';
import { createLead } from '@/api/leads';
import { createLeadContact } from '@/api/lead-contacts';
import { LeadsActions } from '../../dumps/leads';
import { LeadContactsActions } from '../../dumps/leadContacts';
import { mapApiFailureToThunkStatus } from '@/api/_shared';

type ResponseType = Promise<200 | 400 | 500>;

const trim = (value: string) => value.trim();

/**
 * Creates a lead via POST /api/data/leads, then optionally a primary contact,
 * using `currentLead` and `currentLeadContact` as the form source.
 */
export const createManualLeadThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    const lead = getState().currentLead;
    const contact = getState().currentLeadContact;
    if (!lead) return 400;

    const businessName = trim(lead.business_name);
    if (!businessName) return 400;

    const contactName = trim(contact.name ?? '');
    const contactEmail = trim(contact.email ?? '');
    const contactPhone = trim(contact.phone ?? '');
    const hasContactInfo =
      contactName.length > 0 ||
      contactEmail.length > 0 ||
      contactPhone.length > 0;

    const idempotency_key = crypto.randomUUID();
    const address = trim(lead.address ?? '');
    const website = trim(lead.website ?? '');

    const leadRes = await createLead({
      business_name: businessName,
      idempotency_key,
      name: contactName || businessName,
      address: address || null,
      website: website || null,
      has_quote_form: false,
      has_chat_bot: false,
      has_phone_quote: false,
      notes: null,
      description: null,
      status: 'not_contacted',
    });

    if (!leadRes.success || !leadRes.data) {
      return mapApiFailureToThunkStatus(leadRes);
    }

    dispatch(LeadsActions.addLead(leadRes.data));

    if (hasContactInfo) {
      const nameForContact =
        contactName ||
        (contactEmail.includes('@')
          ? contactEmail.split('@')[0] ?? 'Contact'
          : 'Contact');

      const contactRes = await createLeadContact({
        lead_id: leadRes.data.id,
        name: nameForContact,
        email: contactEmail || undefined,
        phone: contactPhone || undefined,
      });

      if (contactRes.success && contactRes.data) {
        dispatch(LeadContactsActions.updateLeadContact(contactRes.data));
      }
    }

    return 200;
  };
};
