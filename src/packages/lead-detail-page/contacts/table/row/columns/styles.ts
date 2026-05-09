export const contactRowColumnStyles = {
  row: `
    border-t border-gray-100 bg-white align-top cursor-pointer transition-colors hover:bg-gray-50
  `,
  cell: `
    px-4 py-3 text-sm text-gray-900
  `,
  cellMuted: `
    px-4 py-3 text-sm text-gray-600
  `,
  nameCell: `
    min-w-0
  `,
  name: `
    font-medium leading-tight text-gray-900
  `,
  contactMeta: `
    mt-0.5 truncate text-xs leading-tight text-gray-500
  `,
  statusBadge: `
    inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700
  `,
  actionsCell: `
    relative px-4 py-3 text-right
  `,
  menuWrap: `
    relative inline-flex
  `,
  menuTrigger: `
    border-none bg-transparent p-0 text-gray-500 cursor-pointer
    transition-colors hover:text-gray-700
  `,
  menuIcon: `
    h-4 w-4
  `,
  menu: `
    fixed z-[70] min-w-[15rem] overflow-hidden rounded-md border border-gray-200
    bg-white shadow-lg
  `,
  backdrop: `
    fixed inset-0 z-[60] border-none bg-transparent p-0
  `,
  menuItem: `
    w-full border-none bg-white px-3 py-2 text-left text-sm text-gray-700 cursor-pointer
    transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400
  `,
  menuItemDelete: `
    w-full border-none bg-white px-3 py-2 text-left text-sm text-red-600 cursor-pointer
    transition-colors hover:bg-red-50
  `,
  callLogModalOverlay: `
    fixed inset-0 z-[80] flex items-center justify-center bg-black/30 p-4
  `,
  callLogModal: `
    w-full max-w-lg rounded-lg border border-gray-200 bg-white p-4 shadow-xl
  `,
  callLogModalTitle: `
    text-sm font-semibold text-gray-900
  `,
  callLogModalSubtitle: `
    mt-1 text-xs text-gray-500
  `,
  callLogNotesInput: `
    mt-3 w-full rounded border border-gray-300 p-2 text-sm text-gray-900
    focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
  `,
  callLogModalActions: `
    mt-3 flex items-center justify-end gap-2
  `,
  callLogCancelButton: `
    rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700
    transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60
  `,
  callLogSaveButton: `
    rounded border border-blue-600 bg-blue-600 px-3 py-1.5 text-xs font-medium text-white
    transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60
  `,
};
