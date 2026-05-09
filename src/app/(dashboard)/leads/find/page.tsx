'use client';

import { useMemo } from 'react';
import { AppLayout } from '@/components';
import { FindLeads } from '@/packages/find-leads';
import { useRegisterStaticDashboardBreadcrumbs } from '@/utils/dashboard-breadcrumbs';

export default function FindLeadsPage() {
  const crumbs = useMemo(
    () => [
      { label: 'Commercial leads', href: '/leads' },
      { label: 'Find leads' },
    ],
    [],
  );
  useRegisterStaticDashboardBreadcrumbs(crumbs);

  return (
    <AppLayout fullWidth>
      <FindLeads />
    </AppLayout>
  );
}
