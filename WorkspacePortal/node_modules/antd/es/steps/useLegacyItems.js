import * as React from 'react';
import toArray from "rc-util/es/Children/toArray";
import warning from '../_util/warning';
function filter(items) {
  return items.filter(item => item);
}
export default function useLegacyItems(items, children) {
  if (items) {
    return items;
  }
  process.env.NODE_ENV !== "production" ? warning(!children, 'Steps', 'Step is deprecated. Please use `items` directly.') : void 0;
  const childrenItems = toArray(children).map(node => {
    if ( /*#__PURE__*/React.isValidElement(node)) {
      const {
        props
      } = node;
      const item = Object.assign({}, props);
      return item;
    }
    return null;
  });
  return filter(childrenItems);
}