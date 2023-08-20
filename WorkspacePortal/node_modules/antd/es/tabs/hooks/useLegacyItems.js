var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import * as React from 'react';
import toArray from "rc-util/es/Children/toArray";
import warning from '../../_util/warning';
function filter(items) {
  return items.filter(item => item);
}
export default function useLegacyItems(items, children) {
  if (items) {
    return items;
  }
  process.env.NODE_ENV !== "production" ? warning(!children, 'Tabs', 'Tabs.TabPane is deprecated. Please use `items` directly.') : void 0;
  const childrenItems = toArray(children).map(node => {
    if ( /*#__PURE__*/React.isValidElement(node)) {
      const {
        key,
        props
      } = node;
      const _a = props || {},
        {
          tab
        } = _a,
        restProps = __rest(_a, ["tab"]);
      const item = Object.assign(Object.assign({
        key: String(key)
      }, restProps), {
        label: tab
      });
      return item;
    }
    return null;
  });
  return filter(childrenItems);
}