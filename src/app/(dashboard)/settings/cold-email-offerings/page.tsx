'use client';

import { useMemo } from 'react';
import { AppLayout } from '@/components';
import { ColdEmailOfferingsPage } from '@/packages/settings/cold-email-offerings';
import { useRegisterStaticDashboardBreadcrumbs } from '@/utils/dashboard-breadcrumbs';

export default function ColdEmailOfferingsSettingsPage() {
  const crumbs = useMemo(() => [{ label: 'Cold email offerings' }], []);
  useRegisterStaticDashboardBreadcrumbs(crumbs);

  return (
    <AppLayout>
      <ColdEmailOfferingsPage />
    </AppLayout>
  );
}
