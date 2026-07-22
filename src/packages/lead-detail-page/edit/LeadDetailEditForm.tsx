'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { saveCurrentLeadThunk } from '@/store/thunks/leads';
import { LeadBuilderActions } from '@/store/builders';
import { CurrentLeadActions } from '@/store/current';
import { BusinessNameInput } from '../inputs/BusinessNameInput';
import { CategoryInput } from '../inputs/CategoryInput';
import { StatusInput } from '../inputs/StatusInput';
import { QualityScoreInput } from '../inputs/QualityScoreInput';
import { DescriptionInput } from '../inputs/DescriptionInput';
import { FacebookUrlInput } from '../inputs/FacebookUrlInput';
import type { Lead } from '@/model';

export const LeadDetailEditForm = () => {
  const dispatch = useAppDispatch();
  const currentLead = useAppSelector((state) => state.currentLead);
  const leadsRecord = useAppSelector((state) => state.leads);
  const leadBuilder = useAppSelector((state) => state.leadBuilder);
  const isSaving = leadBuilder.isSavingLeadDetail;

  const handleSave = () => {
    if (!currentLead.id || isSaving) return;
    dispatch(saveCurrentLeadThunk());
  };

  const handleCancel = () => {
  const id = currentLead.id;
    if (id && leadsRecord[id]) {
      dispatch(CurrentLeadActions.setCurrentLead(leadsRecord[id]));
    }
    dispatch(LeadBuilderActions.setIsEditing(false));
  };

  return (
    <div className={styles.formWrap}>
      <div className={styles.formGrid}>
        <div className={styles.fieldSpanTwo}>
          <BusinessNameInput />
        </div>
        <CategoryInput />
        <StatusInput
          fallbackStatus={(currentLead.status ?? 'not_contacted') as Lead['status']}
        />
        <FacebookUrlInput />
        <QualityScoreInput />
        <div className={styles.fieldSpanFull}>
          <DescriptionInput />
        </div>
      </div>

      <div className={styles.footerActions}>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isSaving}
          className={styles.cancelButton}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className={styles.saveButton}
        >
          {isSaving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  formWrap: ``,
  formGrid: `grid grid-cols-1 sm:grid-cols-2 gap-3`,
  fieldSpanTwo: `sm:col-span-2`,
  fieldSpanFull: `sm:col-span-2`,
  footerActions: `flex justify-end gap-2 mt-5`,
  cancelButton: `
    px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg
    hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
    disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
  `,
  saveButton: `
    px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg
    hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
    disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer
  `,
};
