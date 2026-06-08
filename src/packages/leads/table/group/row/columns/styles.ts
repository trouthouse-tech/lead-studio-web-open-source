export const leadsTableRowColumnStyles = {
  tableRow: `
    hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0
    relative cursor-pointer
  `,
  selectedRow: `bg-blue-50`,
  checkboxCell: `px-2 text-center`,
  checkbox: `cursor-pointer`,
  rowNumberCell: `
    px-2 py-2 text-sm text-gray-500 font-mono
  `,
  clickableCell: `px-3 py-2 text-sm`,
  businessName: `
    font-semibold text-gray-900 hover:text-blue-700
  `,
  websiteLink: `
    text-blue-600 text-xs truncate max-w-xs
    hover:text-blue-800 hover:underline cursor-pointer
    border-none bg-transparent p-0 text-left transition-colors
  `,
  tableCell: `px-3 py-2 text-sm text-gray-900`,
  tableCellCenter: `px-3 py-2 text-sm text-center`,
  qualityScoreSelect: `
    font-mono px-2 py-1 text-sm border border-gray-300 rounded bg-white
    focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none
    cursor-pointer hover:border-gray-400 transition-colors
  `,
  emptyValue: `text-gray-400`,
  contactCount: `text-sm font-mono text-gray-900`,
  categorySelect: `
    px-2 py-1 text-sm border border-gray-300 rounded bg-white
    focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none
    hover:border-gray-400 transition-colors max-w-xs w-full
  `,
  categoryInputContainer: `
    relative max-w-xs w-full
  `,
  categoryMenuPortal: `
    z-[100] rounded border border-gray-300 bg-white shadow-lg overflow-y-auto
  `,
  categoryMenuItem: `
    w-full text-left px-2 py-1.5 text-sm text-gray-800 hover:bg-gray-50
    border-none bg-transparent cursor-pointer
  `,
  categoryMenuItemAdd: `
    w-full text-left px-2 py-1.5 text-sm text-blue-700 hover:bg-blue-50
    border-none bg-transparent cursor-pointer font-medium
  `,
  statusValue: `text-sm text-gray-700`,
  statusSelect: `
    px-2 py-1 text-sm border border-gray-300 rounded bg-white
    focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none
    cursor-pointer hover:border-gray-400 transition-colors
  `,
  actionsCell: `px-3 py-2 text-sm text-center relative`,
  menuContainer: `relative inline-flex`,
  menuButton: `
    w-8 h-8 flex items-center justify-center text-gray-600 text-xl
    hover:text-gray-900 hover:bg-gray-100 transition-colors
    focus:outline-none focus:ring-2 focus:ring-blue-500 rounded cursor-pointer
    border-none bg-transparent
  `,
};
