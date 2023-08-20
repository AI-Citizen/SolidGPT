'use client';

var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import classNames from 'classnames';
import RcDrawer from 'rc-drawer';
import * as React from 'react';
import { getTransitionName } from '../_util/motion';
import warning from '../_util/warning';
import { ConfigContext } from '../config-provider';
import { NoFormStyle } from '../form/context';
import DrawerPanel from './DrawerPanel';
// CSSINJS
import { NoCompactStyle } from '../space/Compact';
import useStyle from './style';
const SizeTypes = ['default', 'large'];
const defaultPushState = {
  distance: 180
};
const Drawer = props => {
  var _a;
  const {
      rootClassName,
      width,
      height,
      size = 'default',
      mask = true,
      push = defaultPushState,
      open,
      afterOpenChange,
      onClose,
      prefixCls: customizePrefixCls,
      getContainer: customizeGetContainer,
      style,
      className,
      // Deprecated
      visible,
      afterVisibleChange
    } = props,
    rest = __rest(props, ["rootClassName", "width", "height", "size", "mask", "push", "open", "afterOpenChange", "onClose", "prefixCls", "getContainer", "style", "className", "visible", "afterVisibleChange"]);
  const {
    getPopupContainer,
    getPrefixCls,
    direction,
    drawer
  } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('drawer', customizePrefixCls);
  // Style
  const [wrapSSR, hashId] = useStyle(prefixCls);
  const getContainer =
  // 有可能为 false，所以不能直接判断
  customizeGetContainer === undefined && getPopupContainer ? () => getPopupContainer(document.body) : customizeGetContainer;
  const drawerClassName = classNames({
    'no-mask': !mask,
    [`${prefixCls}-rtl`]: direction === 'rtl'
  }, rootClassName, hashId);
  // ========================== Warning ===========================
  if (process.env.NODE_ENV !== 'production') {
    [['visible', 'open'], ['afterVisibleChange', 'afterOpenChange']].forEach(_ref => {
      let [deprecatedName, newName] = _ref;
      process.env.NODE_ENV !== "production" ? warning(!(deprecatedName in props), 'Drawer', `\`${deprecatedName}\` is deprecated, please use \`${newName}\` instead.`) : void 0;
    });
    if (getContainer !== undefined && ((_a = props.style) === null || _a === void 0 ? void 0 : _a.position) === 'absolute') {
      process.env.NODE_ENV !== "production" ? warning(false, 'Drawer', '`style` is replaced by `rootStyle` in v5. Please check that `position: absolute` is necessary.') : void 0;
    }
  }
  // ============================ Size ============================
  const mergedWidth = React.useMemo(() => width !== null && width !== void 0 ? width : size === 'large' ? 736 : 378, [width, size]);
  const mergedHeight = React.useMemo(() => height !== null && height !== void 0 ? height : size === 'large' ? 736 : 378, [height, size]);
  // =========================== Motion ===========================
  const maskMotion = {
    motionName: getTransitionName(prefixCls, 'mask-motion'),
    motionAppear: true,
    motionEnter: true,
    motionLeave: true,
    motionDeadline: 500
  };
  const panelMotion = motionPlacement => ({
    motionName: getTransitionName(prefixCls, `panel-motion-${motionPlacement}`),
    motionAppear: true,
    motionEnter: true,
    motionLeave: true,
    motionDeadline: 500
  });
  // =========================== Render ===========================
  return wrapSSR( /*#__PURE__*/React.createElement(NoCompactStyle, null, /*#__PURE__*/React.createElement(NoFormStyle, {
    status: true,
    override: true
  }, /*#__PURE__*/React.createElement(RcDrawer, Object.assign({
    prefixCls: prefixCls,
    onClose: onClose,
    maskMotion: maskMotion,
    motion: panelMotion
  }, rest, {
    open: open !== null && open !== void 0 ? open : visible,
    mask: mask,
    push: push,
    width: mergedWidth,
    height: mergedHeight,
    style: Object.assign(Object.assign({}, drawer === null || drawer === void 0 ? void 0 : drawer.style), style),
    className: classNames(drawer === null || drawer === void 0 ? void 0 : drawer.className, className),
    rootClassName: drawerClassName,
    getContainer: getContainer,
    afterOpenChange: afterOpenChange !== null && afterOpenChange !== void 0 ? afterOpenChange : afterVisibleChange
  }), /*#__PURE__*/React.createElement(DrawerPanel, Object.assign({
    prefixCls: prefixCls
  }, rest, {
    onClose: onClose
  }))))));
};
/** @private Internal Component. Do not use in your production. */
const PurePanel = props => {
  const {
      prefixCls: customizePrefixCls,
      style,
      className,
      placement = 'right'
    } = props,
    restProps = __rest(props, ["prefixCls", "style", "className", "placement"]);
  const {
    getPrefixCls
  } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('drawer', customizePrefixCls);
  // Style
  const [wrapSSR, hashId] = useStyle(prefixCls);
  const cls = classNames(prefixCls, `${prefixCls}-pure`, `${prefixCls}-${placement}`, hashId, className);
  return wrapSSR( /*#__PURE__*/React.createElement("div", {
    className: cls,
    style: style
  }, /*#__PURE__*/React.createElement(DrawerPanel, Object.assign({
    prefixCls: prefixCls
  }, restProps))));
};
Drawer._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;
if (process.env.NODE_ENV !== 'production') {
  Drawer.displayName = 'Drawer';
}
export default Drawer;