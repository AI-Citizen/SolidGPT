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
import { ConfigContext } from '../config-provider';
import useStyle from './style';
const CheckableTag = props => {
  const {
      prefixCls: customizePrefixCls,
      className,
      checked,
      onChange,
      onClick
    } = props,
    restProps = __rest(props, ["prefixCls", "className", "checked", "onChange", "onClick"]);
  const {
    getPrefixCls
  } = React.useContext(ConfigContext);
  const handleClick = e => {
    onChange === null || onChange === void 0 ? void 0 : onChange(!checked);
    onClick === null || onClick === void 0 ? void 0 : onClick(e);
  };
  const prefixCls = getPrefixCls('tag', customizePrefixCls);
  // Style
  const [wrapSSR, hashId] = useStyle(prefixCls);
  const cls = classNames(prefixCls, `${prefixCls}-checkable`, {
    [`${prefixCls}-checkable-checked`]: checked
  }, className, hashId);
  return wrapSSR( /*#__PURE__*/React.createElement("span", Object.assign({}, restProps, {
    className: cls,
    onClick: handleClick
  })));
};
export default CheckableTag;