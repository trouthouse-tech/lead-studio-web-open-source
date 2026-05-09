export const leadCostsTableRowStyles = {
  tableRow: `border-t border-gray-100 bg-white align-top`,
  tableCell: `px-4 py-3 text-sm text-gray-900`,
  tableCellRight: `px-4 py-3 text-right text-sm text-gray-900`,
  tableCellDate: `px-4 py-3 text-sm text-gray-600`,
  typeBadge: `inline-block text-xs`,
  costAnchor: `relative inline-flex cursor-help`,
  costValue: `font-medium text-gray-900`,
  costTooltip: `
    flex flex-col rounded-md border border-gray-200 bg-white p-2 text-left shadow-lg
    max-w-[340px]
  `,
  costTooltipLine: `text-xs text-gray-700 py-0.5`,
} as const;
