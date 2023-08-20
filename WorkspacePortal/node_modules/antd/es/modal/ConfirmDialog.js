import CheckCircleFilled from "@ant-design/icons/es/icons/CheckCircleFilled";
import CloseCircleFilled from "@ant-design/icons/es/icons/CloseCircleFilled";
import ExclamationCircleFilled from "@ant-design/icons/es/icons/ExclamationCircleFilled";
import InfoCircleFilled from "@ant-design/icons/es/icons/InfoCircleFilled";
import classNames from 'classnames';
import * as React from 'react';
import ActionButton from '../_util/ActionButton';
import { getTransitionName } from '../_util/motion';
import warning from '../_util/warning';
import ConfigProvider from '../config-provider';
import { useLocale } from '../locale';
import Dialog from './Modal';
export function ConfirmContent(props) {
  const {
    icon,
    onCancel,
    onOk,
    close,
    onConfirm,
    isSilent,
    okText,
    okButtonProps,
    cancelText,
    cancelButtonProps,
    confirmPrefixCls,
    rootPrefixCls,
    type,
    okCancel,
    footer,
    // Legacy for static function usage
    locale: staticLocale
  } = props;
  process.env.NODE_ENV !== "production" ? warning(!(typeof icon === 'string' && icon.length > 2), 'Modal', `\`icon\` is using ReactNode instead of string naming in v4. Please check \`${icon}\` at https://ant.design/components/icon`) : void 0;
  // Icon
  let mergedIcon = icon;
  // 支持传入{ icon: null }来隐藏`Modal.confirm`默认的Icon
  if (!icon && icon !== null) {
    switch (type) {
      case 'info':
        mergedIcon = /*#__PURE__*/React.createElement(InfoCircleFilled, null);
        break;
      case 'success':
        mergedIcon = /*#__PURE__*/React.createElement(CheckCircleFilled, null);
        break;
      case 'error':
        mergedIcon = /*#__PURE__*/React.createElement(CloseCircleFilled, null);
        break;
      default:
        mergedIcon = /*#__PURE__*/React.createElement(ExclamationCircleFilled, null);
    }
  }
  const okType = props.okType || 'primary';
  // 默认为 true，保持向下兼容
  const mergedOkCancel = okCancel !== null && okCancel !== void 0 ? okCancel : type === 'confirm';
  const autoFocusButton = props.autoFocusButton === null ? false : props.autoFocusButton || 'ok';
  const [locale] = useLocale('Modal');
  const mergedLocale = staticLocale || locale;
  const cancelButton = mergedOkCancel && /*#__PURE__*/React.createElement(ActionButton, {
    isSilent: isSilent,
    actionFn: onCancel,
    close: function () {
      close === null || close === void 0 ? void 0 : close.apply(void 0, arguments);
      onConfirm === null || onConfirm === void 0 ? void 0 : onConfirm(false);
    },
    autoFocus: autoFocusButton === 'cancel',
    buttonProps: cancelButtonProps,
    prefixCls: `${rootPrefixCls}-btn`
  }, cancelText || (mergedLocale === null || mergedLocale === void 0 ? void 0 : mergedLocale.cancelText));
  return /*#__PURE__*/React.createElement("div", {
    className: `${confirmPrefixCls}-body-wrapper`
  }, /*#__PURE__*/React.createElement("div", {
    className: `${confirmPrefixCls}-body`
  }, mergedIcon, props.title === undefined ? null : /*#__PURE__*/React.createElement("span", {
    className: `${confirmPrefixCls}-title`
  }, props.title), /*#__PURE__*/React.createElement("div", {
    className: `${confirmPrefixCls}-content`
  }, props.content)), footer === undefined ? /*#__PURE__*/React.createElement("div", {
    className: `${confirmPrefixCls}-btns`
  }, cancelButton, /*#__PURE__*/React.createElement(ActionButton, {
    isSilent: isSilent,
    type: okType,
    actionFn: onOk,
    close: function () {
      close === null || close === void 0 ? void 0 : close.apply(void 0, arguments);
      onConfirm === null || onConfirm === void 0 ? void 0 : onConfirm(true);
    },
    autoFocus: autoFocusButton === 'ok',
    buttonProps: okButtonProps,
    prefixCls: `${rootPrefixCls}-btn`
  }, okText || (mergedOkCancel ? mergedLocale === null || mergedLocale === void 0 ? void 0 : mergedLocale.okText : mergedLocale === null || mergedLocale === void 0 ? void 0 : mergedLocale.justOkText))) : footer);
}
const ConfirmDialog = props => {
  const {
    close,
    zIndex,
    afterClose,
    visible,
    open,
    keyboard,
    centered,
    getContainer,
    maskStyle,
    direction,
    prefixCls,
    wrapClassName,
    rootPrefixCls,
    iconPrefixCls,
    theme,
    bodyStyle,
    closable = false,
    closeIcon,
    modalRender,
    focusTriggerAfterClose
  } = props;
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV !== "production" ? warning(visible === undefined, 'Modal', `\`visible\` is deprecated, please use \`open\` instead.`) : void 0;
  }
  const confirmPrefixCls = `${prefixCls}-confirm`;
  const width = props.width || 416;
  const style = props.style || {};
  const mask = props.mask === undefined ? true : props.mask;
  // 默认为 false，保持旧版默认行为
  const maskClosable = props.maskClosable === undefined ? false : props.maskClosable;
  const classString = classNames(confirmPrefixCls, `${confirmPrefixCls}-${props.type}`, {
    [`${confirmPrefixCls}-rtl`]: direction === 'rtl'
  }, props.className);
  return /*#__PURE__*/React.createElement(ConfigProvider, {
    prefixCls: rootPrefixCls,
    iconPrefixCls: iconPrefixCls,
    direction: direction,
    theme: theme
  }, /*#__PURE__*/React.createElement(Dialog, {
    prefixCls: prefixCls,
    className: classString,
    wrapClassName: classNames({
      [`${confirmPrefixCls}-centered`]: !!props.centered
    }, wrapClassName),
    onCancel: () => close === null || close === void 0 ? void 0 : close({
      triggerCancel: true
    }),
    open: open,
    title: "",
    footer: null,
    transitionName: getTransitionName(rootPrefixCls, 'zoom', props.transitionName),
    maskTransitionName: getTransitionName(rootPrefixCls, 'fade', props.maskTransitionName),
    mask: mask,
    maskClosable: maskClosable,
    maskStyle: maskStyle,
    style: style,
    bodyStyle: bodyStyle,
    width: width,
    zIndex: zIndex,
    afterClose: afterClose,
    keyboard: keyboard,
    centered: centered,
    getContainer: getContainer,
    closable: closable,
    closeIcon: closeIcon,
    modalRender: modalRender,
    focusTriggerAfterClose: focusTriggerAfterClose
  }, /*#__PURE__*/React.createElement(ConfirmContent, Object.assign({}, props, {
    confirmPrefixCls: confirmPrefixCls
  }))));
};
if (process.env.NODE_ENV !== 'production') {
  ConfirmDialog.displayName = 'ConfirmDialog';
}
export default ConfirmDialog;