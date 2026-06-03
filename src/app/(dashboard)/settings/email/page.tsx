'use client';

import { useMemo } from 'react';
import { AppLayout } from '@/components';
import { EmailSetup } from '@/packages/settings/email-setup';
import { useRegisterStaticDashboardBreadcrumbs } from '@/utils/dashboard-breadcrumbs';

export default function EmailSetupPage() {
  const crumbs = useMemo(
    () => [{ label: 'Email setup' }],
    []
  );
  useRegisterStaticDashboardBreadcrumbs(crumbs);

  return (
    <AppLayout>
      <EmailSetup />
    </AppLayout>
  );
};
