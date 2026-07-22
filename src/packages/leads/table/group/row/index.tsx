'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadBuilderActions } from '@/store/builders';
import { LEAD_DETAIL_PATH } from '@/config';
import { setCurrentLeadThunk, updateLeadThunk } from '@/store/thunks/leads';
import type { Lead } from '@/model';
import {
  LeadsTableRowCheckboxColumn,
  LeadsTableRowNumberColumn,
  LeadsTableRowBusinessColumn,
  LeadsTableRowCategoryColumn,
  LeadsTableRowStatusColumn,
  LeadsTableRowQualityColumn,
  LeadsTableRowContactsColumn,
  LeadsTableRowResearchColumn,
  LeadsTableRowActionsColumn,
} from './columns';
import { leadsTableRowColumnStyles as styles } from './columns/styles';

type LeadsTableRowProps = {
  lead: Lead;
  index: number;
};

export const LeadsTableRow = (props: LeadsTableRowProps) => {
  const { lead, index } = props;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const leadContactsRecord = useAppSelector((state) => state.leadContacts);
  const leadBuilder = useAppSelector((state) => state.leadBuilder);
  const selectedLeadIds = leadBuilder.selectedLeadIds;

  const isSelected = selectedLeadIds.includes(lead.id);

  const handleToggleLead = () => {
    dispatch(LeadBuilderActions.toggleLeadSelection(lead.id));
  };

  const handleRowClick = () => {
    void dispatch(setCurrentLeadThunk(lead.id));
    router.push(LEAD_DETAIL_PATH);
  };

  const handleQualityScoreChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newScore =
      e.target.value === '' ? undefined : parseInt(e.target.value, 10);
    await dispatch(updateLeadThunk(lead.id, { quality_score: newScore }));
  };

  const contactsForLead = useMemo(
    () =>
      Object.values(leadContactsRecord).filter((c) => c.lead_id === lead.id),
    [leadContactsRecord, lead.id]
  );

  return (
    <tr
      className={`${styles.tableRow} ${isSelected ? styles.selectedRow : ''}`}
      onClick={handleRowClick}
    >
      <LeadsTableRowCheckboxColumn
        isSelected={isSelected}
        onToggle={handleToggleLead}
      />
      <LeadsTableRowNumberColumn index={index} />
      <LeadsTableRowBusinessColumn lead={lead} />
      <LeadsTableRowCategoryColumn lead={lead} />
      <LeadsTableRowStatusColumn lead={lead} />
      <LeadsTableRowQualityColumn
        lead={lead}
        onQualityScoreChange={handleQualityScoreChange}
      />
      <LeadsTableRowContactsColumn contactCount={contactsForLead.length} />
      <LeadsTableRowResearchColumn lead={lead} />
      <LeadsTableRowActionsColumn lead={lead} />
    </tr>
  );
};
