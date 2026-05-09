'use client';

import type { LeadCostLine } from '@/model';
import { CostsAiExchangeTableRow } from './lead-costs-ai-exchange-table-row';
import { CostsLedgerTableRow } from './lead-costs-ledger-table-row';

export type CostsTableRowProps = {
  line: LeadCostLine;
  dateLabel: string;
  costLabel: string;
};

export const CostsTableRow = (props: CostsTableRowProps) => {
  const { line, dateLabel, costLabel } = props;
  if (line.kind === 'ai_exchange') {
    return (
      <CostsAiExchangeTableRow line={line} dateLabel={dateLabel} costLabel={costLabel} />
    );
  }
  return <CostsLedgerTableRow line={line} dateLabel={dateLabel} costLabel={costLabel} />;
};

export { CostsAiExchangeTableRow } from './lead-costs-ai-exchange-table-row';
export { CostsLedgerTableRow } from './lead-costs-ledger-table-row';
export { leadCostsTableRowStyles } from './lead-costs-table-row-styles';
export {
  COSTS_ROW_HOVER_CLOSE_DELAY_MS,
  COSTS_ROW_TOOLTIP_GAP_PX,
  COSTS_ROW_TOOLTIP_WIDTH,
  useCostsRowTooltip,
} from './use-lead-costs-row-tooltip';
