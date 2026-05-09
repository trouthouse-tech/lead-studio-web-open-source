'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode, RefObject } from 'react';

const CATEGORY_MENU_MAX_HEIGHT_PX = 224;
const CATEGORY_MENU_VIEWPORT_GAP_PX = 4;
const CATEGORY_MENU_VIEWPORT_PAD_PX = 8;

type CategoryMenuPlacement = {
  left: number;
  width: number;
  maxHeight: number;
  top?: number;
  bottom?: number;
};

const getCategoryMenuPlacement = (
  containerRect: DOMRect
): CategoryMenuPlacement => {
  const spaceBelow =
    window.innerHeight -
    containerRect.bottom -
    CATEGORY_MENU_VIEWPORT_GAP_PX -
    CATEGORY_MENU_VIEWPORT_PAD_PX;
  const spaceAbove =
    containerRect.top -
    CATEGORY_MENU_VIEWPORT_GAP_PX -
    CATEGORY_MENU_VIEWPORT_PAD_PX;
  const preferOpenUpward =
    spaceBelow < Math.min(CATEGORY_MENU_MAX_HEIGHT_PX, 120) &&
    spaceAbove > spaceBelow;

  if (preferOpenUpward) {
    return {
      left: containerRect.left,
      width: containerRect.width,
      maxHeight: Math.max(
        80,
        Math.min(CATEGORY_MENU_MAX_HEIGHT_PX, spaceAbove)
      ),
      bottom:
        window.innerHeight - containerRect.top + CATEGORY_MENU_VIEWPORT_GAP_PX,
    };
  }

  return {
    left: containerRect.left,
    width: containerRect.width,
    maxHeight: Math.max(
      80,
      Math.min(CATEGORY_MENU_MAX_HEIGHT_PX, spaceBelow)
    ),
    top: containerRect.bottom + CATEGORY_MENU_VIEWPORT_GAP_PX,
  };
};

type LeadsFiltersCategoryMenuProps = {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
};

export const LeadsFiltersCategoryMenu = (props: LeadsFiltersCategoryMenuProps) => {
  const { open, onClose, anchorRef, children } = props;
  const menuPortalRef = useRef<HTMLDivElement>(null);
  const [menuPlacement, setMenuPlacement] = useState<CategoryMenuPlacement | null>(
    null
  );

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (anchorRef.current?.contains(target)) {
        return;
      }
      if (menuPortalRef.current?.contains(target)) {
        return;
      }
      onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose, anchorRef]);

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    const updatePlacement = () => {
      const el = anchorRef.current;
      if (!el) {
        return;
      }
      setMenuPlacement(getCategoryMenuPlacement(el.getBoundingClientRect()));
    };

    updatePlacement();
    window.addEventListener('scroll', updatePlacement, true);
    window.addEventListener('resize', updatePlacement);
    return () => {
      window.removeEventListener('scroll', updatePlacement, true);
      window.removeEventListener('resize', updatePlacement);
    };
  }, [open, anchorRef]);

  if (!open || !menuPlacement || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      ref={menuPortalRef}
      className={styles.portal}
      style={{
        position: 'fixed',
        left: menuPlacement.left,
        width: menuPlacement.width,
        maxHeight: menuPlacement.maxHeight,
        ...(menuPlacement.top !== undefined
          ? { top: menuPlacement.top }
          : { bottom: menuPlacement.bottom }),
      }}
    >
      {children}
    </div>,
    document.body
  );
};

const styles = {
  portal: `
    z-[100] rounded border border-gray-300 bg-white shadow-lg overflow-y-auto py-1
  `,
};
