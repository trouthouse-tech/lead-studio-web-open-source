'use client';

import { useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadBuilderActions } from '@/store/builders';
import type { Lead } from '@/model';
import { LeadsTableRowMenu } from '../../menu';
import { leadsTableRowColumnStyles as styles } from '../styles';

type LeadsTableRowActionsColumnProps = {
  lead: Lead;
};

export const LeadsTableRowActionsColumn = (
  props: LeadsTableRowActionsColumnProps
) => {
  const { lead } = props;
  const dispatch = useAppDispatch();
  const leadBuilder = useAppSelector((state) => state.leadBuilder);
  const menuOpenId = leadBuilder.leadsTableMenuOpenId;
  const menuContainerRef = useRef<HTMLDivElement | null>(null);
  const isMenuOpen = menuOpenId === lead.id;

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(e.target as Node)
      ) {
        dispatch(LeadBuilderActions.setLeadsTableMenuOpenId(null));
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, dispatch]);

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      LeadBuilderActions.setLeadsTableMenuOpenId(isMenuOpen ? null : lead.id)
    );
  };

  return (
    <td className={styles.actionsCell} onClick={(e) => e.stopPropagation()}>
      <div className={styles.menuContainer} ref={menuContainerRef}>
        <button
          type="button"
          onClick={handleMenuToggle}
          className={styles.menuButton}
          aria-label="Lead actions"
        >
          ⋯
        </button>
        {isMenuOpen && <LeadsTableRowMenu lead={lead} />}
      </div>
    </td>
  );
};
