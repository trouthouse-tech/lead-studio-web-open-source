'use client';

import { ErrorBoundary } from '@/components/error-boundary';

export default function DashboardLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <ErrorBoundary componentName="DashboardLayout">{children}</ErrorBoundary>
  );
}
