var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import EllipsisOutlined from "@ant-design/icons/es/icons/EllipsisOutlined";
import classNames from 'classnames';
import RcMenu from 'rc-menu';
import useEvent from "rc-util/es/hooks/useEvent";
import omit from "rc-util/es/omit";
import * as React from 'react';
import { forwardRef } from 'react';
import initCollapseMotion from '../_util/motion';
import { cloneElement, isValidElement } from '../_util/reactNode';
import warning from '../_util/warning';
import { ConfigContext } from '../config-provider';
import MenuContext from './MenuContext';
import OverrideContext from './OverrideContext';
import useItems from './hooks/useItems';
import useStyle from './style';
const InternalMenu = /*#__PURE__*/forwardRef((props, ref) => {
  var _a, _b;
  const override = React.useContext(OverrideContext);
  const overrideObj = override || {};
  const {
    getPrefixCls,
    getPopupContainer,
    direction,
    menu
  } = React.useContext(ConfigContext);
  const rootPrefixCls = getPrefixCls();
  const {
      prefixCls: customizePrefixCls,
      className,
      style,
      theme = 'light',
      expandIcon,
      _internalDisableMenuItemTitleTooltip,
      inlineCollapsed,
      siderCollapsed,
      items,
      children,
      rootClassName,
      mode,
      selectable,
      onClick,
      overflowedIndicatorPopupClassName
    } = props,
    restProps = __rest(props, ["prefixCls", "className", "style", "theme", "expandIcon", "_internalDisableMenuItemTitleTooltip", "inlineCollapsed", "siderCollapsed", "items", "children", "rootClassName", "mode", "selectable", "onClick", "overflowedIndicatorPopupClassName"]);
  const passedProps = omit(restProps, ['collapsedWidth']);
  // ========================= Items ===========================
  const mergedChildren = useItems(items) || children;
  // ======================== Warning ==========================
  process.env.NODE_ENV !== "production" ? warning(!('inlineCollapsed' in props && mode !== 'inline'), 'Menu', '`inlineCollapsed` should only be used when `mode` is inline.') : void 0;
  process.env.NODE_ENV !== "production" ? warning(!(props.siderCollapsed !== undefined && 'inlineCollapsed' in props), 'Menu', '`inlineCollapsed` not control Menu under Sider. Should set `collapsed` on Sider instead.') : void 0;
  process.env.NODE_ENV !== "production" ? warning('items' in props && !children, 'Menu', '`children` will be removed in next major version. Please use `items` instead.') : void 0;
  (_a = overrideObj.validator) === null || _a === void 0 ? void 0 : _a.call(overrideObj, {
    mode
  });
  // ========================== Click ==========================
  // Tell dropdown that item clicked
  const onItemClick = useEvent(function () {
    var _a;
    onClick === null || onClick === void 0 ? void 0 : onClick.apply(void 0, arguments);
    (_a = overrideObj.onClick) === null || _a === void 0 ? void 0 : _a.call(overrideObj);
  });
  // ========================== Mode ===========================
  const mergedMode = overrideObj.mode || mode;
  // ======================= Selectable ========================
  const mergedSelectable = selectable !== null && selectable !== void 0 ? selectable : overrideObj.selectable;
  // ======================== Collapsed ========================
  // Inline Collapsed
  const mergedInlineCollapsed = React.useMemo(() => {
    if (siderCollapsed !== undefined) {
      return siderCollapsed;
    }
    return inlineCollapsed;
  }, [inlineCollapsed, siderCollapsed]);
  const defaultMotions = {
    horizontal: {
      motionName: `${rootPrefixCls}-slide-up`
    },
    inline: initCollapseMotion(rootPrefixCls),
    other: {
      motionName: `${rootPrefixCls}-zoom-big`
    }
  };
  const prefixCls = getPrefixCls('menu', customizePrefixCls || overrideObj.prefixCls);
  const [wrapSSR, hashId] = useStyle(prefixCls, !override);
  const menuClassName = classNames(`${prefixCls}-${theme}`, menu === null || menu === void 0 ? void 0 : menu.className, className);
  // ====================== Expand Icon ========================
  let mergedExpandIcon;
  if (typeof expandIcon === 'function') {
    mergedExpandIcon = expandIcon;
  } else {
    const beClone = expandIcon || overrideObj.expandIcon;
    mergedExpandIcon = cloneElement(beClone, {
      className: classNames(`${prefixCls}-submenu-expand-icon`, isValidElement(beClone) ? (_b = beClone.props) === null || _b === void 0 ? void 0 : _b.className : '')
    });
  }
  // ======================== Context ==========================
  const contextValue = React.useMemo(() => ({
    prefixCls,
    inlineCollapsed: mergedInlineCollapsed || false,
    direction,
    firstLevel: true,
    theme,
    mode: mergedMode,
    disableMenuItemTitleTooltip: _internalDisableMenuItemTitleTooltip
  }), [prefixCls, mergedInlineCollapsed, direction, _internalDisableMenuItemTitleTooltip, theme]);
  // ========================= Render ==========================
  return wrapSSR( /*#__PURE__*/React.createElement(OverrideContext.Provider, {
    value: null
  }, /*#__PURE__*/React.createElement(MenuContext.Provider, {
    value: contextValue
  }, /*#__PURE__*/React.createElement(RcMenu, Object.assign({
    getPopupContainer: getPopupContainer,
    overflowedIndicator: /*#__PURE__*/React.createElement(EllipsisOutlined, null),
    overflowedIndicatorPopupClassName: classNames(prefixCls, `${prefixCls}-${theme}`, overflowedIndicatorPopupClassName),
    mode: mergedMode,
    selectable: mergedSelectable,
    onClick: onItemClick
  }, passedProps, {
    inlineCollapsed: mergedInlineCollapsed,
    style: Object.assign(Object.assign({}, menu === null || menu === void 0 ? void 0 : menu.style), style),
    className: menuClassName,
    prefixCls: prefixCls,
    direction: direction,
    defaultMotions: defaultMotions,
    expandIcon: mergedExpandIcon,
    ref: ref,
    rootClassName: classNames(rootClassName, hashId)
  }), mergedChildren))));
});
export default InternalMenu;