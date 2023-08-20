export function getTargetRect(target) {
  return target !== window ? target.getBoundingClientRect() : {
    top: 0,
    bottom: window.innerHeight
  };
}
export function getFixedTop(placeholderRect, targetRect, offsetTop) {
  if (offsetTop !== undefined && targetRect.top > placeholderRect.top - offsetTop) {
    return offsetTop + targetRect.top;
  }
  return undefined;
}
export function getFixedBottom(placeholderRect, targetRect, offsetBottom) {
  if (offsetBottom !== undefined && targetRect.bottom < placeholderRect.bottom + offsetBottom) {
    const targetBottomOffset = window.innerHeight - targetRect.bottom;
    return offsetBottom + targetBottomOffset;
  }
  return undefined;
}