var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import classNames from 'classnames';
import * as React from 'react';
import warning from '../_util/warning';
import { ConfigContext } from '../config-provider';
import TimelineItem from './TimelineItem';
import TimelineItemList from './TimelineItemList';
import useItems from './useItems';
// CSSINJS
import useStyle from './style';
const Timeline = props => {
  const {
    getPrefixCls,
    direction,
    timeline
  } = React.useContext(ConfigContext);
  const {
      prefixCls: customizePrefixCls,
      children,
      items,
      className,
      style
    } = props,
    restProps = __rest(props, ["prefixCls", "children", "items", "className", "style"]);
  const prefixCls = getPrefixCls('timeline', customizePrefixCls);
  // =================== Warning =====================
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV !== "production" ? warning(!children, 'Timeline', '`Timeline.Item` is deprecated. Please use `items` instead.') : void 0;
  }
  // Style
  const [wrapSSR, hashId] = useStyle(prefixCls);
  const mergedItems = useItems(items, children);
  return wrapSSR( /*#__PURE__*/React.createElement(TimelineItemList, Object.assign({}, restProps, {
    className: classNames(timeline === null || timeline === void 0 ? void 0 : timeline.className, className),
    style: Object.assign(Object.assign({}, timeline === null || timeline === void 0 ? void 0 : timeline.style), style),
    prefixCls: prefixCls,
    direction: direction,
    items: mergedItems,
    hashId: hashId
  })));
};
Timeline.Item = TimelineItem;
if (process.env.NODE_ENV !== 'production') {
  Timeline.displayName = 'Timeline';
}
export default Timeline;