'use client';

var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import LoadingOutlined from "@ant-design/icons/es/icons/LoadingOutlined";
import classNames from 'classnames';
import RcSwitch from 'rc-switch';
import * as React from 'react';
import warning from '../_util/warning';
import Wave from '../_util/wave';
import { ConfigContext } from '../config-provider';
import DisabledContext from '../config-provider/DisabledContext';
import useSize from '../config-provider/hooks/useSize';
import useStyle from './style';
const Switch = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
      prefixCls: customizePrefixCls,
      size: customizeSize,
      disabled: customDisabled,
      loading,
      className,
      rootClassName,
      style
    } = props,
    restProps = __rest(props, ["prefixCls", "size", "disabled", "loading", "className", "rootClassName", "style"]);
  process.env.NODE_ENV !== "production" ? warning('checked' in props || !('value' in props), 'Switch', '`value` is not a valid prop, do you mean `checked`?') : void 0;
  const {
    getPrefixCls,
    direction,
    switch: SWITCH
  } = React.useContext(ConfigContext);
  // ===================== Disabled =====================
  const disabled = React.useContext(DisabledContext);
  const mergedDisabled = (customDisabled !== null && customDisabled !== void 0 ? customDisabled : disabled) || loading;
  const prefixCls = getPrefixCls('switch', customizePrefixCls);
  const loadingIcon = /*#__PURE__*/React.createElement("div", {
    className: `${prefixCls}-handle`
  }, loading && /*#__PURE__*/React.createElement(LoadingOutlined, {
    className: `${prefixCls}-loading-icon`
  }));
  // Style
  const [wrapSSR, hashId] = useStyle(prefixCls);
  const mergedSize = useSize(customizeSize);
  const classes = classNames(SWITCH === null || SWITCH === void 0 ? void 0 : SWITCH.className, {
    [`${prefixCls}-small`]: mergedSize === 'small',
    [`${prefixCls}-loading`]: loading,
    [`${prefixCls}-rtl`]: direction === 'rtl'
  }, className, rootClassName, hashId);
  const mergedStyle = Object.assign(Object.assign({}, SWITCH === null || SWITCH === void 0 ? void 0 : SWITCH.style), style);
  return wrapSSR( /*#__PURE__*/React.createElement(Wave, {
    component: "Switch"
  }, /*#__PURE__*/React.createElement(RcSwitch, Object.assign({}, restProps, {
    prefixCls: prefixCls,
    className: classes,
    style: mergedStyle,
    disabled: mergedDisabled,
    ref: ref,
    loadingIcon: loadingIcon
  }))));
});
Switch.__ANT_SWITCH = true;
if (process.env.NODE_ENV !== 'production') {
  Switch.displayName = 'Switch';
}
export default Switch;