'use client';

import { createPortal } from 'react-dom';
import type { LeadCostLineAi } from '@/model';
import { leadCostsTableRowStyles as styles } from './lead-costs-table-row-styles';
import {
  COSTS_ROW_TOOLTIP_WIDTH,
  useCostsRowTooltip,
} from './use-lead-costs-row-tooltip';

type CostsAiExchangeTableRowProps = {
  line: LeadCostLineAi;
  dateLabel: string;
  costLabel: string;
};

export const CostsAiExchangeTableRow = (props: CostsAiExchangeTableRowProps) => {
  const { line, dateLabel, costLabel } = props;
  const {
    anchorRef,
    tooltipOpen,
    tooltipPos,
    openTooltip,
    scheduleClose,
    updateTooltipPosition,
  } = useCostsRowTooltip();

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
      <span className={styles.costTooltipLine}>Model: {line.model_used || 'Unknown'}</span>
      <span className={styles.costTooltipLine}>
        Input tokens: {line.input_tokens.toLocaleString()}
      </span>
      <span className={styles.costTooltipLine}>
        Output tokens: {line.output_tokens.toLocaleString()}
      </span>
      <span className={styles.costTooltipLine}>
        Input rate: $
        {line.input_cost_per_million_usd === null
          ? 'N/A'
          : line.input_cost_per_million_usd.toFixed(2)}
        /1M
      </span>
      <span className={styles.costTooltipLine}>
        Output rate: $
        {line.output_cost_per_million_usd === null
          ? 'N/A'
          : line.output_cost_per_million_usd.toFixed(2)}
        /1M
      </span>
    </div>
  );

  return (
    <tr className={styles.tableRow}>
      <td className={styles.tableCell}>
        <span className={styles.typeBadge}>{line.label}</span>
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
