/**
 * Shared Tailwind class strings for the leads table research action cell.
 */
export const leadsTableResearchStyles = {
  researchCell: `px-2 py-2 text-center align-middle`,
  researchButtons: `inline-flex items-center justify-center gap-0.5`,
  researchButtonWrap: `relative inline-flex group`,
  researchDataDot: `
    pointer-events-none absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500
    ring-2 ring-white
  `,
  researchHoverAction: `
    absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full
    border border-blue-200 bg-blue-50 text-blue-700 opacity-0
    group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500
  `,
  researchHoverActionIcon: `h-2.5 w-2.5`,
  researchIconButton: `
    inline-flex h-8 w-8 shrink-0 items-center justify-center rounded border border-gray-200 bg-white
    text-gray-600 hover:text-[#FF7C1E] hover:border-orange-200 hover:bg-orange-50
    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200
    transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0
  `,
  researchIcon: `h-3.5 w-3.5`,
};

