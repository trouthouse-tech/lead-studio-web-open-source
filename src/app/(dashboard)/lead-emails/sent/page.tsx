'use client';

import { useMemo } from 'react';
import { LeadSentEmailsPage } from '@/packages/lead-sent-emails';
import { AppLayout } from '@/components';
import { useRegisterStaticDashboardBreadcrumbs } from '@/utils/dashboard-breadcrumbs';

export default function LeadSentEmailsRoutePage() {
  const crumbs = useMemo(
    () => [
      { label: 'Commercial leads', href: '/leads' },
      { label: 'Sent emails' },
    ],
    [],
  );
  useRegisterStaticDashboardBreadcrumbs(crumbs);

  return (
    <AppLayout>
      <LeadSentEmailsPage />
    </AppLayout>
  );
}
