import { ArrowRight } from 'lucide-react';
import { OSS_QUICKSTART_URL } from '@/config/landing-links';
import { LANDING_CONTENT } from '../content';

/**
 * Landing section 04 — Self-host dark block.
 */
export const SelfHost = () => {
  const c = LANDING_CONTENT.selfHost;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.block}>
          <span className={`mono-label ${styles.kicker}`}>{c.kicker}</span>
          <h2 className={styles.title}>{c.title}</h2>
          <p className={styles.body}>{c.body}</p>
          <div className={styles.terminal}>
            {c.terminalLines.map((line) => (
              <div key={line}>
                <span className={styles.terminalPrompt}>$ </span>
                {line}
              </div>
            ))}
          </div>
          <a
            href={OSS_QUICKSTART_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.docsLink}
          >
            {c.docsLink}
            <ArrowRight className={`cta-arrow h-4 w-4`} />
          </a>
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: `
    px-6 py-20
    sm:py-28
  `,
  inner: `
    mx-auto max-w-6xl
  `,
  block: `
    rounded-2xl bg-ink p-10 text-ink-foreground
    sm:p-14
  `,
  kicker: `
    text-primary
  `,
  title: `
    mt-4 max-w-2xl text-4xl font-medium tracking-tight
    sm:text-5xl
  `,
  body: `
    mt-5 max-w-xl text-white/60
  `,
  terminal: `
    mt-10 rounded-md border border-white/10 bg-black/40 p-6 font-mono text-sm leading-relaxed text-white/90
  `,
  terminalPrompt: `
    text-white/40
  `,
  docsLink: `
    mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline
  `,
};
