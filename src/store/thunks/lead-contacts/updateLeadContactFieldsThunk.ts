import type { AppThunk } from '@/store';
import { updateLeadContact } from '@/api/lead-contacts';
import { LeadContactsActions } from '../../dumps/leadContacts';
import { CurrentLeadContactActions } from '../../current';
import { LeadContactBuilderActions } from '../../builders';
import type { LeadContact } from '@/model/lead-contact';

type ResponseType = Promise<200 | 400 | 500>;

export const updateLeadContactFieldsThunk = (
  contactId: string,
  fields: Partial<
    Pick<LeadContact, 'name' | 'email' | 'phone' | 'role' | 'notes' | 'status'>
  >
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      dispatch(LeadContactBuilderActions.setSaving(true));
      const response = await updateLeadContact(contactId, fields);
      if (response.success && response.data) {
        dispatch(LeadContactsActions.updateLeadContact(response.data));
        dispatch(CurrentLeadContactActions.setLeadContact(response.data));
        dispatch(LeadContactBuilderActions.setEditing(false));
        dispatch(LeadContactBuilderActions.setSaving(false));
        return 200;
      }
      dispatch(LeadContactBuilderActions.setSaving(false));
      return 400;
    } catch (error) {
      console.error('updateLeadContactFieldsThunk:', error);
      dispatch(LeadContactBuilderActions.setSaving(false));
      return 500;
    }
  };
};
