import * as React from 'react';
export const {
  isValidElement
} = React;
export function isFragment(child) {
  return child && isValidElement(child) && child.type === React.Fragment;
}
export function replaceElement(element, replacement, props) {
  if (!isValidElement(element)) {
    return replacement;
  }
  return /*#__PURE__*/React.cloneElement(element, typeof props === 'function' ? props(element.props || {}) : props);
}
export function cloneElement(element, props) {
  return replaceElement(element, element, props);
}