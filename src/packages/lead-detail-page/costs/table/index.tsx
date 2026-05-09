'use client';

import type { LeadCostLine } from '@/model';
import { CostsTableView } from './view';

export type CostLinesTableProps = {
  rows: LeadCostLine[];
};

export const CostLinesTable = (props: CostLinesTableProps) => {
  return <CostsTableView rows={props.rows} />;
};

export { CostsTableView } from './view';
