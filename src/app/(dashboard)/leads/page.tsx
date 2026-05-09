'use client';

import { useMemo } from 'react';
import { Leads } from '@/packages/leads';
import { AppLayout } from '@/components';
import { useRegisterStaticDashboardBreadcrumbs } from '@/utils/dashboard-breadcrumbs';

export default function LeadsPage() {
  const crumbs = useMemo(() => [{ label: 'Commercial leads' }], []);
  useRegisterStaticDashboardBreadcrumbs(crumbs);

  return (
    <AppLayout>
      <Leads />
    </AppLayout>
  );
}
