'use client';

import { createPortal } from 'react-dom';
import type { LeadCostLineLedger } from '@/model';
import { leadCostTypeLabel } from '../../lead-cost-type-labels';
import { leadCostsTableRowStyles as styles } from './lead-costs-table-row-styles';
import {
  COSTS_ROW_TOOLTIP_WIDTH,
  useCostsRowTooltip,
} from './use-lead-costs-row-tooltip';

type CostsLedgerTableRowProps = {
  line: LeadCostLineLedger;
  dateLabel: string;
  costLabel: string;
};

export const CostsLedgerTableRow = (props: CostsLedgerTableRowProps) => {
  const { line, dateLabel, costLabel } = props;
  const {
    anchorRef,
    tooltipOpen,
    tooltipPos,
    openTooltip,
    scheduleClose,
    updateTooltipPosition,
  } = useCostsRowTooltip();

  const typeCellLabel = `${leadCostTypeLabel(line.ledger_type)} · ${line.entry_source === 'ai' ? 'AI' : 'Manual'}`;

  const tooltipContent = (
    <div
      role="tooltip"
      className={styles.costTooltip}
      style={{
        position: 'fixed',
        top: tooltipPos.top,
        left: tooltipPos.left,
        width: COSTS_ROW_TOOLTIP_WIDTH,
        transform: 'translateY(-100%)',
        zIndex: 9999,
      }}
      onMouseEnter={openTooltip}
      onMouseLeave={scheduleClose}
    >
      <span className={styles.costTooltipLine}>
        Category: {leadCostTypeLabel(line.ledger_type)}
      </span>
      <span className={styles.costTooltipLine}>
        Source: {line.entry_source === 'ai' ? 'AI logged' : 'Manual'}
      </span>
      <span className={styles.costTooltipLine}>{line.description}</span>
    </div>
  );

  return (
    <tr className={styles.tableRow}>
      <td className={styles.tableCell}>
        <span className={styles.typeBadge}>{typeCellLabel}</span>
      </td>
      <td className={styles.tableCellDate}>{dateLabel}</td>
      <td className={styles.tableCellRight}>
        <span
          ref={anchorRef}
          className={styles.costAnchor}
          onMouseEnter={() => {
            openTooltip();
            updateTooltipPosition();
          }}
          onMouseLeave={scheduleClose}
        >
          <span className={styles.costValue}>{costLabel}</span>
        </span>
        {tooltipOpen && typeof document !== 'undefined'
          ? createPortal(tooltipContent, document.body)
          : null}
      </td>
    </tr>
  );
};
