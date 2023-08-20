'use client';

var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import CloseOutlined from "@ant-design/icons/es/icons/CloseOutlined";
import EllipsisOutlined from "@ant-design/icons/es/icons/EllipsisOutlined";
import PlusOutlined from "@ant-design/icons/es/icons/PlusOutlined";
import classNames from 'classnames';
import RcTabs from 'rc-tabs';
import * as React from 'react';
import warning from '../_util/warning';
import { ConfigContext } from '../config-provider';
import useSize from '../config-provider/hooks/useSize';
import TabPane from './TabPane';
import useAnimateConfig from './hooks/useAnimateConfig';
import useLegacyItems from './hooks/useLegacyItems';
import useStyle from './style';
const Tabs = props => {
  const {
      type,
      className,
      rootClassName,
      size: customSize,
      onEdit,
      hideAdd,
      centered,
      addIcon,
      popupClassName,
      children,
      items,
      animated,
      style
    } = props,
    otherProps = __rest(props, ["type", "className", "rootClassName", "size", "onEdit", "hideAdd", "centered", "addIcon", "popupClassName", "children", "items", "animated", "style"]);
  const {
    prefixCls: customizePrefixCls,
    moreIcon = /*#__PURE__*/React.createElement(EllipsisOutlined, null)
  } = otherProps;
  const {
    direction,
    tabs,
    getPrefixCls,
    getPopupContainer
  } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('tabs', customizePrefixCls);
  const [wrapSSR, hashId] = useStyle(prefixCls);
  let editable;
  if (type === 'editable-card') {
    editable = {
      onEdit: (editType, _ref) => {
        let {
          key,
          event
        } = _ref;
        onEdit === null || onEdit === void 0 ? void 0 : onEdit(editType === 'add' ? event : key, editType);
      },
      removeIcon: /*#__PURE__*/React.createElement(CloseOutlined, null),
      addIcon: addIcon || /*#__PURE__*/React.createElement(PlusOutlined, null),
      showAdd: hideAdd !== true
    };
  }
  const rootPrefixCls = getPrefixCls();
  process.env.NODE_ENV !== "production" ? warning(!('onPrevClick' in props) && !('onNextClick' in props), 'Tabs', '`onPrevClick` and `onNextClick` has been removed. Please use `onTabScroll` instead.') : void 0;
  const mergedItems = useLegacyItems(items, children);
  const mergedAnimated = useAnimateConfig(prefixCls, animated);
  const size = useSize(customSize);
  const mergedStyle = Object.assign(Object.assign({}, tabs === null || tabs === void 0 ? void 0 : tabs.style), style);
  return wrapSSR( /*#__PURE__*/React.createElement(RcTabs, Object.assign({
    direction: direction,
    getPopupContainer: getPopupContainer,
    moreTransitionName: `${rootPrefixCls}-slide-up`
  }, otherProps, {
    items: mergedItems,
    className: classNames({
      [`${prefixCls}-${size}`]: size,
      [`${prefixCls}-card`]: ['card', 'editable-card'].includes(type),
      [`${prefixCls}-editable-card`]: type === 'editable-card',
      [`${prefixCls}-centered`]: centered
    }, tabs === null || tabs === void 0 ? void 0 : tabs.className, className, rootClassName, hashId),
    popupClassName: classNames(popupClassName, hashId),
    style: mergedStyle,
    editable: editable,
    moreIcon: moreIcon,
    prefixCls: prefixCls,
    animated: mergedAnimated
  })));
};
Tabs.TabPane = TabPane;
if (process.env.NODE_ENV !== 'production') {
  Tabs.displayName = 'Tabs';
}
export default Tabs;