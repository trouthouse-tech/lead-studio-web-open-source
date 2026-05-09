'use client';

import { useAppDispatch } from '@/store/hooks';
import { CurrentLeadContactEmailActions } from '@/store/current';
import { LeadContactEmailBuilderActions } from '@/store/builders';
import { LeadContactEmailComposePanel } from './LeadContactEmailComposePanel';

export const EmailEditorPanel = () => {
  const dispatch = useAppDispatch();

  const close = () => {
    dispatch(LeadContactEmailBuilderActions.closeEmailModal());
    dispatch(CurrentLeadContactEmailActions.reset());
  };

  return <LeadContactEmailComposePanel variant="modal" onCancel={close} />;
};
