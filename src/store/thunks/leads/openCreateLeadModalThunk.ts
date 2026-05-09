import type { AppThunk } from '../../store';
import { LeadBuilderActions } from '../../builders';
import { CurrentLeadActions, CurrentLeadContactActions } from '../../current';
import { buildManualLeadCreationDraftLead } from './build-manual-lead-creation-draft-lead';
import { buildManualLeadCreationDraftContact } from './build-manual-lead-creation-draft-contact';

/**
 * Seeds `currentLead` / `currentLeadContact` for manual creation and opens the modal.
 */
export const openCreateLeadModalThunk = (): AppThunk => {
  return (dispatch) => {
    dispatch(CurrentLeadActions.setCurrentLead(buildManualLeadCreationDraftLead()));
    dispatch(
      CurrentLeadContactActions.setLeadContact(buildManualLeadCreationDraftContact())
    );
    dispatch(LeadBuilderActions.setAddLeadModalOpen(true));
  };
};
