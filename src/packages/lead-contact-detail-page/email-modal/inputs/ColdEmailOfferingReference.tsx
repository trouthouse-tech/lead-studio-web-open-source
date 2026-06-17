import type { ColdEmailOffering } from '@/model/cold-email-offering';

type Props = {
  offering: ColdEmailOffering;
  variant: 'modal' | 'fab' | 'drawer';
};

/**
 * Read-only offering details shown while composing an outbound email.
 */
export const ColdEmailOfferingReference = (props: Props) => {
  const { offering, variant } = props;

  return (
    <div className={styles.card(variant)}>
      <p className={styles.eyebrow}>Use this angle while you write</p>
      <h3 className={styles.title}>{offering.title}</h3>
      <div className={styles.hookBlock}>
        <span className={styles.hookLabel}>Hook</span>
        <p className={styles.hookText}>{offering.hook}</p>
      </div>
      {offering.description.trim() ? (
        <div className={styles.descBlock}>
          <span className={styles.descLabel}>Context</span>
          <p className={styles.descText}>{offering.description}</p>
        </div>
      ) : null}
    </div>
  );
};

const styles = {
  card: (variant: Props['variant']) =>
    `rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 space-y-2 ${
      variant === 'fab' ? 'text-sm' : ''
    }`,
  eyebrow: `text-[10px] font-semibold uppercase tracking-wide text-emerald-800`,
  title: `text-sm font-semibold text-emerald-950`,
  hookBlock: `space-y-1`,
  hookLabel: `text-[10px] font-semibold uppercase tracking-wide text-emerald-700`,
  hookText: `text-sm leading-relaxed text-emerald-950 font-medium`,
  descBlock: `space-y-1 pt-1 border-t border-emerald-200/80`,
  descLabel: `text-[10px] font-semibold uppercase tracking-wide text-emerald-700`,
  descText: `text-sm leading-relaxed text-emerald-900`,
};
