'use client';

import { useMemo } from 'react';
import { AppLayout } from '@/components';
import { ToCallLogList } from '@/packages/to-call-log-list';
import { useRegisterStaticDashboardBreadcrumbs } from '@/utils/dashboard-breadcrumbs';

export default function ToCallLogPage() {
  const crumbs = useMemo(
    () => [
      { label: 'Commercial leads', href: '/leads' },
      { label: 'To Call Log' },
    ],
    [],
  );
  useRegisterStaticDashboardBreadcrumbs(crumbs);

  return (
    <AppLayout>
      <ToCallLogList />
    </AppLayout>
  );
}
