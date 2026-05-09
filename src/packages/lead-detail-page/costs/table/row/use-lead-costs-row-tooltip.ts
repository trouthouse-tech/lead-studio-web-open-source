import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

export const COSTS_ROW_TOOLTIP_WIDTH = 280;
export const COSTS_ROW_TOOLTIP_GAP_PX = 8;
export const COSTS_ROW_HOVER_CLOSE_DELAY_MS = 120;

type TooltipPosition = {
  top: number;
  left: number;
};

/**
 * Shared hover tooltip anchor + fixed positioning for lead cost table rows.
 */
export const useCostsRowTooltip = () => {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const leaveTimerRef = useRef<number | null>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipPos, setTooltipPos] = useState<TooltipPosition>({ top: 0, left: 0 });

  const clearLeaveTimer = () => {
    if (leaveTimerRef.current != null) {
      window.clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  };

  const scheduleClose = () => {
    clearLeaveTimer();
    leaveTimerRef.current = window.setTimeout(() => {
      setTooltipOpen(false);
      leaveTimerRef.current = null;
    }, COSTS_ROW_HOVER_CLOSE_DELAY_MS);
  };

  const openTooltip = () => {
    clearLeaveTimer();
    setTooltipOpen(true);
  };

  const updateTooltipPosition = useCallback(() => {
    const el = anchorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const viewportW = window.innerWidth;
    let left = r.right - COSTS_ROW_TOOLTIP_WIDTH;
    left = Math.max(
      COSTS_ROW_TOOLTIP_GAP_PX,
      Math.min(left, viewportW - COSTS_ROW_TOOLTIP_WIDTH - COSTS_ROW_TOOLTIP_GAP_PX),
    );
    const top = r.top - COSTS_ROW_TOOLTIP_GAP_PX;
    setTooltipPos({ top, left });
  }, []);

  useLayoutEffect(() => {
    if (!tooltipOpen) return;
    updateTooltipPosition();
  }, [tooltipOpen, updateTooltipPosition]);

  useEffect(() => {
    if (!tooltipOpen) return;
    const onReposition = () => updateTooltipPosition();
    window.addEventListener('scroll', onReposition, true);
    window.addEventListener('resize', onReposition);
    return () => {
      window.removeEventListener('scroll', onReposition, true);
      window.removeEventListener('resize', onReposition);
    };
  }, [tooltipOpen, updateTooltipPosition]);

  useEffect(() => {
    return () => clearLeaveTimer();
  }, []);

  return {
    anchorRef,
    tooltipOpen,
    tooltipPos,
    openTooltip,
    scheduleClose,
    updateTooltipPosition,
  };
};
