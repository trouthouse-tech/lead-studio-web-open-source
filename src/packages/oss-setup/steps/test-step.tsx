'use client';

type TestStepProps = {
  healthTesting: boolean;
  lastHealthOk: boolean | null;
  healthError: string | null;
  onBack: () => void;
  onTest: () => void;
  onNext: () => void;
};

export const TestStep = (props: TestStepProps) => {
  const {
    healthTesting,
    lastHealthOk,
    healthError,
    onBack,
    onTest,
    onNext,
  } = props;

  return (
    <section className={styles.section}>
      <h2 className={styles.h2}>Test API connection</h2>
      <p className={styles.p}>
        We call <code className={styles.code}>GET /api/health</code> on your Express server from
        this browser.
      </p>
      <button
        type="button"
        className={styles.primaryButton}
        onClick={onTest}
        disabled={healthTesting}
      >
        {healthTesting ? 'Testing…' : 'Run health check'}
      </button>
      {lastHealthOk === true && (
        <p className={styles.success}>Connection OK — Express is reachable.</p>
      )}
      {healthError && <p className={styles.error}>{healthError}</p>}
      <div className={styles.actions}>
        <button type="button" className={styles.secondaryButton} onClick={onBack}>
          Back
        </button>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={onNext}
          disabled={lastHealthOk !== true}
        >
          Next
        </button>
      </div>
    </section>
  );
};

const styles = {
  section: `max-w-xl`,
  h2: `text-2xl font-semibold text-gray-900 mb-3`,
  p: `text-gray-600 mb-4 leading-relaxed`,
  code: `text-sm bg-gray-100 px-1 rounded`,
  primaryButton: `
    px-4 py-2 rounded-md bg-orange-500 text-white font-medium
    hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed mb-4
  `,
  success: `text-green-700 text-sm mb-4`,
  error: `text-red-700 text-sm mb-4`,
  actions: `flex gap-3 mt-4`,
  secondaryButton: `
    px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50
  `,
};
