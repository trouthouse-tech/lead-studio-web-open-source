'use client';

import type { Lead } from '@/model';
import { leadsTableRowColumnStyles as styles } from '../styles';
import { getQualityScoreColor, qualityScoreOptions } from '../quality-score';

type LeadsTableRowQualityColumnProps = {
  lead: Lead;
  onQualityScoreChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const LeadsTableRowQualityColumn = (
  props: LeadsTableRowQualityColumnProps
) => {
  const { lead, onQualityScoreChange } = props;

  const qualityClass =
    lead.quality_score != null
      ? getQualityScoreColor(lead.quality_score)
      : styles.emptyValue;

  return (
    <td className={styles.tableCellCenter} onClick={(e) => e.stopPropagation()}>
      <select
        value={
          lead.quality_score !== undefined && lead.quality_score !== null
            ? lead.quality_score.toString()
            : ''
        }
        onChange={onQualityScoreChange}
        className={`${styles.qualityScoreSelect} ${qualityClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        {qualityScoreOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </td>
  );
};
