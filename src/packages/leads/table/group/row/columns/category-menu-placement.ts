const CATEGORY_MENU_MAX_HEIGHT_PX = 224;
const CATEGORY_MENU_VIEWPORT_GAP_PX = 4;
const CATEGORY_MENU_VIEWPORT_PAD_PX = 8;

export type CategoryMenuPlacement = {
  left: number;
  width: number;
  maxHeight: number;
  top?: number;
  bottom?: number;
};

export const getCategoryMenuPlacement = (
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
