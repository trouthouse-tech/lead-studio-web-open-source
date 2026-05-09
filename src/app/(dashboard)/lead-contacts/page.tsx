'use client';

import { useMemo } from 'react';
import { LeadContactsPage as LeadContactsTablePage } from '@/packages/lead-contacts';
import { AppLayout } from '@/components';
import { useRegisterStaticDashboardBreadcrumbs } from '@/utils/dashboard-breadcrumbs';

export default function LeadContactsPage() {
  const crumbs = useMemo(
    () => [
      { label: 'Commercial leads', href: '/leads' },
      { label: 'Lead Contacts' },
    ],
    [],
  );
  useRegisterStaticDashboardBreadcrumbs(crumbs);

  return (
    <AppLayout>
      <LeadContactsTablePage />
    </AppLayout>
  );
}
