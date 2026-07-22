'use client';

import { useMemo } from 'react';
import { LeadContactDetailPage } from '@/packages/lead-contact-detail-page';
import { AppLayout } from '@/components';
import { LEAD_DETAIL_PATH } from '@/config/routes';
import { useRegisterStaticDashboardBreadcrumbs } from '@/utils/dashboard-breadcrumbs';

/**
 * Static contact detail route — entity identity lives in Redux `currentLeadContact` (ADR 008).
 */
export default function LeadContactDetailRoute() {
  const crumbs = useMemo(
    () => [
      { label: 'Commercial leads', href: '/leads' },
      { label: 'Lead', href: LEAD_DETAIL_PATH },
      { label: 'Contact' },
    ],
    [],
  );
  useRegisterStaticDashboardBreadcrumbs(crumbs);

  return (
    <AppLayout>
      <LeadContactDetailPage />
    </AppLayout>
  );
}
