'use client';

import { useMemo } from 'react';
import { LeadEmailQueuePage } from '@/packages/lead-email-queue';
import { AppLayout } from '@/components';
import { useRegisterStaticDashboardBreadcrumbs } from '@/utils/dashboard-breadcrumbs';

export default function LeadEmailQueueRoutePage() {
  const crumbs = useMemo(
    () => [
      { label: 'Commercial leads', href: '/leads' },
      { label: 'Email queue' },
    ],
    [],
  );
  useRegisterStaticDashboardBreadcrumbs(crumbs);

  return (
    <AppLayout>
      <LeadEmailQueuePage />
    </AppLayout>
  );
}
