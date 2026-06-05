'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { OssSetupBuilderActions, type OssSetupStep } from '@/store/builders/ossSetupBuilder';
import {
  completeOssSetupThunk,
  hydrateOssSetupThunk,
  persistOssSetupThunk,
  testExpressHealthThunk,
} from '@/store/thunks/oss-setup';
import { DASHBOARD_PATH } from '@/config/landing-links';
import {
  DatabaseStep,
  EnvStep,
  IntroStep,
  ReadyStep,
  TestStep,
} from './steps';

const STEP_LABELS = ['Intro', 'API URL', 'Database', 'Test', 'Ready'] as const;

export const OssSetup = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    step,
    serverUrl,
    hydrated,
    healthTesting,
    lastHealthOk,
    healthError,
    setupComplete,
  } = useAppSelector((s) => s.ossSetupBuilder);

  useEffect(() => {
    void dispatch(hydrateOssSetupThunk());
  }, [dispatch]);

  const goToStep = (next: OssSetupStep) => {
    dispatch(OssSetupBuilderActions.setStep(next));
    void dispatch(persistOssSetupThunk());
  };

  const handleServerUrlChange = (url: string) => {
    dispatch(OssSetupBuilderActions.setServerUrl(url));
    dispatch(OssSetupBuilderActions.setLastHealthOk(null));
    dispatch(OssSetupBuilderActions.setHealthError(null));
  };

  const handleFinish = async () => {
    await dispatch(completeOssSetupThunk());
    router.push(DASHBOARD_PATH);
  };

  if (!hydrated) {
    return (
      <div className={styles.page}>
        <p className={styles.loading}>Loading setup…</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Lead Studio setup</h1>
          <nav className={styles.steps} aria-label="Setup progress">
            {STEP_LABELS.map((label, index) => (
              <span
                key={label}
                className={
                  index === step
                    ? styles.stepActive
                    : index < step
                      ? styles.stepDone
                      : styles.step
                }
              >
                {label}
              </span>
            ))}
          </nav>
        </header>

        {step === 0 && <IntroStep onNext={() => goToStep(1)} />}
        {step === 1 && (
          <EnvStep
            serverUrl={serverUrl}
            onServerUrlChange={handleServerUrlChange}
            onBack={() => goToStep(0)}
            onNext={() => goToStep(2)}
          />
        )}
        {step === 2 && (
          <DatabaseStep onBack={() => goToStep(1)} onNext={() => goToStep(3)} />
        )}
        {step === 3 && (
          <TestStep
            healthTesting={healthTesting}
            lastHealthOk={lastHealthOk}
            healthError={healthError}
            onBack={() => goToStep(2)}
            onTest={() => void dispatch(testExpressHealthThunk())}
            onNext={() => goToStep(4)}
          />
        )}
        {step === 4 && <ReadyStep onFinish={() => void handleFinish()} />}
      </div>
    </div>
  );
};

const styles = {
  page: `
    min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12
  `,
  card: `
    w-full max-w-2xl bg-white rounded-lg shadow-sm border border-gray-200 p-8
  `,
  header: `mb-8`,
  title: `text-3xl font-bold text-gray-900 mb-4`,
  steps: `flex flex-wrap gap-2 text-xs`,
  step: `px-2 py-1 rounded bg-gray-100 text-gray-500`,
  stepActive: `px-2 py-1 rounded bg-orange-100 text-orange-800 font-medium`,
  stepDone: `px-2 py-1 rounded bg-green-100 text-green-800`,
  loading: `text-gray-500 text-center`,
};
