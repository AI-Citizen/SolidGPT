var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import CheckCircleFilled from "@ant-design/icons/es/icons/CheckCircleFilled";
import CloseCircleFilled from "@ant-design/icons/es/icons/CloseCircleFilled";
import CloseOutlined from "@ant-design/icons/es/icons/CloseOutlined";
import ExclamationCircleFilled from "@ant-design/icons/es/icons/ExclamationCircleFilled";
import InfoCircleFilled from "@ant-design/icons/es/icons/InfoCircleFilled";
import LoadingOutlined from "@ant-design/icons/es/icons/LoadingOutlined";
import classNames from 'classnames';
import { Notice } from 'rc-notification';
import * as React from 'react';
import { ConfigContext } from '../config-provider';
import useStyle from './style';
export const TypeIcon = {
  info: /*#__PURE__*/React.createElement(InfoCircleFilled, null),
  success: /*#__PURE__*/React.createElement(CheckCircleFilled, null),
  error: /*#__PURE__*/React.createElement(CloseCircleFilled, null),
  warning: /*#__PURE__*/React.createElement(ExclamationCircleFilled, null),
  loading: /*#__PURE__*/React.createElement(LoadingOutlined, null)
};
export function getCloseIcon(prefixCls, closeIcon) {
  if (closeIcon === null || closeIcon === false) {
    return null;
  }
  return closeIcon || /*#__PURE__*/React.createElement("span", {
    className: `${prefixCls}-close-x`
  }, /*#__PURE__*/React.createElement(CloseOutlined, {
    className: `${prefixCls}-close-icon`
  }));
}
const typeToIcon = {
  success: CheckCircleFilled,
  info: InfoCircleFilled,
  error: CloseCircleFilled,
  warning: ExclamationCircleFilled
};
export const PureContent = props => {
  const {
    prefixCls,
    icon,
    type,
    message,
    description,
    btn,
    role = 'alert'
  } = props;
  let iconNode = null;
  if (icon) {
    iconNode = /*#__PURE__*/React.createElement("span", {
      className: `${prefixCls}-icon`
    }, icon);
  } else if (type) {
    iconNode = /*#__PURE__*/React.createElement(typeToIcon[type] || null, {
      className: classNames(`${prefixCls}-icon`, `${prefixCls}-icon-${type}`)
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    className: classNames({
      [`${prefixCls}-with-icon`]: iconNode
    }),
    role: role
  }, iconNode, /*#__PURE__*/React.createElement("div", {
    className: `${prefixCls}-message`
  }, message), /*#__PURE__*/React.createElement("div", {
    className: `${prefixCls}-description`
  }, description), btn && /*#__PURE__*/React.createElement("div", {
    className: `${prefixCls}-btn`
  }, btn));
};
/** @private Internal Component. Do not use in your production. */
const PurePanel = props => {
  const {
      prefixCls: staticPrefixCls,
      className,
      icon,
      type,
      message,
      description,
      btn,
      closable = true,
      closeIcon
    } = props,
    restProps = __rest(props, ["prefixCls", "className", "icon", "type", "message", "description", "btn", "closable", "closeIcon"]);
  const {
    getPrefixCls
  } = React.useContext(ConfigContext);
  const prefixCls = staticPrefixCls || getPrefixCls('notification');
  const noticePrefixCls = `${prefixCls}-notice`;
  const [, hashId] = useStyle(prefixCls);
  return /*#__PURE__*/React.createElement(Notice, Object.assign({}, restProps, {
    prefixCls: prefixCls,
    className: classNames(className, hashId, `${noticePrefixCls}-pure-panel`),
    eventKey: "pure",
    duration: null,
    closable: closable,
    closeIcon: getCloseIcon(prefixCls, closeIcon),
    content: /*#__PURE__*/React.createElement(PureContent, {
      prefixCls: noticePrefixCls,
      icon: icon,
      type: type,
      message: message,
      description: description,
      btn: btn
    })
  }));
};
export default PurePanel;