'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { LeadBuilderActions } from '@/store/builders';

export const ActionsMenu = () => {
  const dispatch = useAppDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleEdit = () => {
    setMenuOpen(false);
    dispatch(LeadBuilderActions.setIsEditing(true));
  };

  const handleOpenDelete = () => {
    setMenuOpen(false);
    dispatch(LeadBuilderActions.setLeadDeleteConfirmModalOpen(true));
  };

  return (
    <div className={styles.menuContainer} ref={menuRef}>
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        className={styles.menuButton}
        aria-label="Lead actions"
      >
        ⋯
      </button>
      {menuOpen ? (
        <>
          <div
            className={styles.menuOverlay}
            onClick={() => setMenuOpen(false)}
            aria-hidden
          />
          <div className={styles.dropdownMenu}>
            <button type="button" className={styles.menuItem} onClick={handleEdit}>
              Edit
            </button>
            <button type="button" className={styles.menuItemDanger} onClick={handleOpenDelete}>
              Delete
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
};

const styles = {
  menuContainer: `relative inline-flex`,
  menuButton: `
    w-7 h-7 flex items-center justify-center text-gray-600 text-lg leading-none
    hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
    rounded cursor-pointer border-none bg-transparent
  `,
  menuOverlay: `fixed inset-0 z-40`,
  dropdownMenu: `
    absolute right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded shadow-lg min-w-48 py-1
  `,
  menuItem: `
    w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors
    border-none bg-transparent cursor-pointer
  `,
  menuItemDanger: `
    w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors
    border-none bg-transparent cursor-pointer
  `,
};
