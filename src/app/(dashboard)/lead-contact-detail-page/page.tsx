'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { LeadContactDetailPage } from '@/packages/lead-contact-detail-page';
import { AppLayout } from '@/components';
import { LEAD_DETAIL_PATH } from '@/config/routes';
import { useRegisterStaticDashboardBreadcrumbs } from '@/utils/dashboard-breadcrumbs';

const LeadContactDetailContent = () => {
  const search = useSearchParams();
  const leadId = search.get('leadId') ?? '';
  const contactId = search.get('contactId') ?? '';
  const ok = leadId && contactId;

  if (!ok) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        Missing <code className="font-mono">leadId</code> or{' '}
        <code className="font-mono">contactId</code> query params.
      </div>
    );
  }

  return <LeadContactDetailPage leadId={leadId} contactId={contactId} />;
};

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
      <Suspense fallback={<p className="text-gray-500 p-8">Loading…</p>}>
        <LeadContactDetailContent />
      </Suspense>
    </AppLayout>
  );
}
