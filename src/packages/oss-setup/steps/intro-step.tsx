'use client';

import { GITHUB_EXPRESS_REPO_URL } from '@/config/landing-links';

type IntroStepProps = {
  onNext: () => void;
};

export const IntroStep = (props: IntroStepProps) => {
  const { onNext } = props;

  return (
    <section className={styles.section}>
      <h2 className={styles.h2}>Welcome to Lead Studio</h2>
      <p className={styles.p}>
        This open-source slice pairs a Next.js CRM with{' '}
        <strong>lead-studio-express-server</strong> (Supabase + research workers). This
        wizard verifies your stack before you use the dashboard.
      </p>
      <ul className={styles.list}>
        <li>
          Express API repo:{' '}
          <a href={GITHUB_EXPRESS_REPO_URL} className={styles.link} target="_blank" rel="noreferrer">
            lead-studio-express-server
          </a>
        </li>
        <li>
          Full quickstart: express repo <code className={styles.code}>docs/oss-quickstart.md</code>
        </li>
      </ul>
      <button type="button" className={styles.primaryButton} onClick={onNext}>
        Get started
      </button>
    </section>
  );
};

const styles = {
  section: `
    max-w-xl
  `,
  h2: `
    text-2xl font-semibold text-gray-900 mb-3
  `,
  p: `
    text-gray-600 mb-4 leading-relaxed
  `,
  list: `
    list-disc pl-5 text-gray-600 space-y-2 mb-6
  `,
  link: `
    text-orange-600 hover:text-orange-700 underline
  `,
  code: `
    text-sm bg-gray-100 px-1 rounded
  `,
  primaryButton: `
    px-4 py-2 rounded-md bg-orange-500 text-white font-medium
    hover:bg-orange-600
  `,
};
