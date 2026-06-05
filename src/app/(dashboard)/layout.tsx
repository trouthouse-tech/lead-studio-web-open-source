'use client';

import { OssSetupGate } from '@/packages/oss-setup/oss-setup-gate';

export default function DashboardLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  return <OssSetupGate>{children}</OssSetupGate>;
}
