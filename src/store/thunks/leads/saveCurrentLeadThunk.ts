import type { AppThunk } from '../../store';
import { LeadBuilderActions } from '../../builders';
import { updateLeadThunk } from './updateLeadThunk';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Persists `currentLead` field edits via PATCH. Sets `isSavingLeadDetail` on the lead builder.
 * On success, exits lead detail edit mode (`isEditing`).
 */
export const saveCurrentLeadThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    const currentLead = getState().currentLead;
    if (!currentLead.id) return 400;
    if (getState().leadBuilder.isSavingLeadDetail) return 400;

    dispatch(LeadBuilderActions.setIsSavingLeadDetail(true));
    try {
      const result = await dispatch(
        updateLeadThunk(currentLead.id, {
          business_name: currentLead.business_name,
          status: currentLead.status,
          quality_score: currentLead.quality_score ?? undefined,
          category_name: currentLead.category_name ?? undefined,
          category_id: currentLead.category_id ?? undefined,
          website: currentLead.website ?? undefined,
          facebook_url: currentLead.facebook_url ?? undefined,
          name: currentLead.name ?? undefined,
          address: currentLead.address ?? undefined,
          description: currentLead.description ?? undefined,
          notes: currentLead.notes ?? undefined,
        })
      );
      if (result === 200) {
        dispatch(LeadBuilderActions.setIsEditing(false));
      }
      return result;
    } finally {
      dispatch(LeadBuilderActions.setIsSavingLeadDetail(false));
    }
  };
};
