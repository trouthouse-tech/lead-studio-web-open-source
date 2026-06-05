'use client';

import Link from 'next/link';
import { DASHBOARD_PATH } from '@/config/landing-links';

type ReadyStepProps = {
  onFinish: () => void;
};

export const ReadyStep = (props: ReadyStepProps) => {
  const { onFinish } = props;

  return (
    <section className={styles.section}>
      <h2 className={styles.h2}>You are ready</h2>
      <p className={styles.p}>
        Stack setup is complete. Open the dashboard to manage leads, run research, and configure
        email when you are ready.
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.primaryButton} onClick={onFinish}>
          Go to dashboard
        </button>
        <Link href={DASHBOARD_PATH} className={styles.link}>
          Or continue without clicking Finish
        </Link>
      </div>
    </section>
  );
};

const styles = {
  section: `max-w-xl`,
  h2: `text-2xl font-semibold text-gray-900 mb-3`,
  p: `text-gray-600 mb-6 leading-relaxed`,
  actions: `flex flex-col gap-3 items-start`,
  primaryButton: `
    px-4 py-2 rounded-md bg-orange-500 text-white font-medium hover:bg-orange-600
  `,
  link: `text-sm text-orange-600 hover:text-orange-700 underline`,
};
