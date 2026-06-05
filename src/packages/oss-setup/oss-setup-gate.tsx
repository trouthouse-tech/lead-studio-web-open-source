'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { hydrateOssSetupThunk } from '@/store/thunks/oss-setup';
import { OSS_SETUP_PATH } from '@/config/routes';

type OssSetupGateProps = {
  children: React.ReactNode;
};

/**
 * Redirects dashboard routes to /setup until OSS stack setup is marked complete.
 */
export const OssSetupGate = (props: OssSetupGateProps) => {
  const { children } = props;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { hydrated, setupComplete } = useAppSelector((s) => s.ossSetupBuilder);

  useEffect(() => {
    void dispatch(hydrateOssSetupThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!hydrated) return;
    if (setupComplete) return;
    if (pathname === OSS_SETUP_PATH) return;
    router.replace(OSS_SETUP_PATH);
  }, [hydrated, setupComplete, pathname, router]);

  if (!hydrated) {
    return null;
  }

  if (!setupComplete && pathname !== OSS_SETUP_PATH) {
    return null;
  }

  return <>{children}</>;
};
