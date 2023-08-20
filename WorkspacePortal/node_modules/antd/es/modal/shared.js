import CloseOutlined from "@ant-design/icons/es/icons/CloseOutlined";
import React from 'react';
import Button from '../button';
import { convertLegacyProps } from '../button/button';
import { DisabledContextProvider } from '../config-provider/DisabledContext';
import { useLocale } from '../locale';
import { getConfirmLocale } from './locale';
export function renderCloseIcon(prefixCls, closeIcon) {
  return /*#__PURE__*/React.createElement("span", {
    className: `${prefixCls}-close-x`
  }, closeIcon || /*#__PURE__*/React.createElement(CloseOutlined, {
    className: `${prefixCls}-close-icon`
  }));
}
export const Footer = props => {
  const {
    okText,
    okType = 'primary',
    cancelText,
    confirmLoading,
    onOk,
    onCancel,
    okButtonProps,
    cancelButtonProps
  } = props;
  const [locale] = useLocale('Modal', getConfirmLocale());
  return /*#__PURE__*/React.createElement(DisabledContextProvider, {
    disabled: false
  }, /*#__PURE__*/React.createElement(Button, Object.assign({
    onClick: onCancel
  }, cancelButtonProps), cancelText || (locale === null || locale === void 0 ? void 0 : locale.cancelText)), /*#__PURE__*/React.createElement(Button, Object.assign({}, convertLegacyProps(okType), {
    loading: confirmLoading,
    onClick: onOk
  }, okButtonProps), okText || (locale === null || locale === void 0 ? void 0 : locale.okText)));
};