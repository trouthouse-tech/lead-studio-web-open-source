'use client';

import { useEffect } from 'react';
import { LeadDetailPage } from '@/packages/lead-detail-page';
import { AppLayout } from '@/components';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { BreadcrumbBuilderActions } from '@/store/builders';

export default function LeadDetailRoute() {
  const dispatch = useAppDispatch();
  const currentLeadId = useAppSelector((state) => state.currentLead?.id ?? '');

  useEffect(() => {
    if (!currentLeadId) {
      dispatch(BreadcrumbBuilderActions.reset());
      return;
    }

    dispatch(
      BreadcrumbBuilderActions.setTrail({
        base: { label: 'Commercial leads', href: '/leads' },
        segments: [
          {
            kind: 'entitySwitcher',
            entityKind: 'lead',
            currentId: currentLeadId,
          },
        ],
      }),
    );

    return () => {
      dispatch(BreadcrumbBuilderActions.reset());
    };
  }, [currentLeadId, dispatch]);

  return (
    <AppLayout>
      <LeadDetailPage />
    </AppLayout>
  );
}
