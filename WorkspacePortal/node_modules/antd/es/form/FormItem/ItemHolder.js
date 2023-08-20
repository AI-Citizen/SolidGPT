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
import ExclamationCircleFilled from "@ant-design/icons/es/icons/ExclamationCircleFilled";
import LoadingOutlined from "@ant-design/icons/es/icons/LoadingOutlined";
import classNames from 'classnames';
import useLayoutEffect from "rc-util/es/hooks/useLayoutEffect";
import isVisible from "rc-util/es/Dom/isVisible";
import omit from "rc-util/es/omit";
import * as React from 'react';
import { Row } from '../../grid';
import FormItemInput from '../FormItemInput';
import FormItemLabel from '../FormItemLabel';
import { FormContext, FormItemInputContext, NoStyleItemContext } from '../context';
import useDebounce from '../hooks/useDebounce';
const iconMap = {
  success: CheckCircleFilled,
  warning: ExclamationCircleFilled,
  error: CloseCircleFilled,
  validating: LoadingOutlined
};
export default function ItemHolder(props) {
  const {
      prefixCls,
      className,
      rootClassName,
      style,
      help,
      errors,
      warnings,
      validateStatus,
      meta,
      hasFeedback,
      hidden,
      children,
      fieldId,
      required,
      isRequired,
      onSubItemMetaChange
    } = props,
    restProps = __rest(props, ["prefixCls", "className", "rootClassName", "style", "help", "errors", "warnings", "validateStatus", "meta", "hasFeedback", "hidden", "children", "fieldId", "required", "isRequired", "onSubItemMetaChange"]);
  const itemPrefixCls = `${prefixCls}-item`;
  const {
    requiredMark
  } = React.useContext(FormContext);
  // ======================== Margin ========================
  const itemRef = React.useRef(null);
  const debounceErrors = useDebounce(errors);
  const debounceWarnings = useDebounce(warnings);
  const hasHelp = help !== undefined && help !== null;
  const hasError = !!(hasHelp || errors.length || warnings.length);
  const isOnScreen = !!itemRef.current && isVisible(itemRef.current);
  const [marginBottom, setMarginBottom] = React.useState(null);
  useLayoutEffect(() => {
    if (hasError && itemRef.current) {
      // The element must be part of the DOMTree to use getComputedStyle
      // https://stackoverflow.com/questions/35360711/getcomputedstyle-returns-a-cssstyledeclaration-but-all-properties-are-empty-on-a
      const itemStyle = getComputedStyle(itemRef.current);
      setMarginBottom(parseInt(itemStyle.marginBottom, 10));
    }
  }, [hasError, isOnScreen]);
  const onErrorVisibleChanged = nextVisible => {
    if (!nextVisible) {
      setMarginBottom(null);
    }
  };
  // ======================== Status ========================
  const getValidateState = function () {
    let isDebounce = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    let status = '';
    const _errors = isDebounce ? debounceErrors : meta.errors;
    const _warnings = isDebounce ? debounceWarnings : meta.warnings;
    if (validateStatus !== undefined) {
      status = validateStatus;
    } else if (meta.validating) {
      status = 'validating';
    } else if (_errors.length) {
      status = 'error';
    } else if (_warnings.length) {
      status = 'warning';
    } else if (meta.touched || hasFeedback && meta.validated) {
      // success feedback should display when pass hasFeedback prop and current value is valid value
      status = 'success';
    }
    return status;
  };
  const mergedValidateStatus = getValidateState();
  const formItemStatusContext = React.useMemo(() => {
    let feedbackIcon;
    if (hasFeedback) {
      const IconNode = mergedValidateStatus && iconMap[mergedValidateStatus];
      feedbackIcon = IconNode ? /*#__PURE__*/React.createElement("span", {
        className: classNames(`${itemPrefixCls}-feedback-icon`, `${itemPrefixCls}-feedback-icon-${mergedValidateStatus}`)
      }, /*#__PURE__*/React.createElement(IconNode, null)) : null;
    }
    return {
      status: mergedValidateStatus,
      errors,
      warnings,
      hasFeedback,
      feedbackIcon,
      isFormItemInput: true
    };
  }, [mergedValidateStatus, hasFeedback]);
  // ======================== Render ========================
  const itemClassName = classNames(itemPrefixCls, className, rootClassName, {
    [`${itemPrefixCls}-with-help`]: hasHelp || debounceErrors.length || debounceWarnings.length,
    // Status
    [`${itemPrefixCls}-has-feedback`]: mergedValidateStatus && hasFeedback,
    [`${itemPrefixCls}-has-success`]: mergedValidateStatus === 'success',
    [`${itemPrefixCls}-has-warning`]: mergedValidateStatus === 'warning',
    [`${itemPrefixCls}-has-error`]: mergedValidateStatus === 'error',
    [`${itemPrefixCls}-is-validating`]: mergedValidateStatus === 'validating',
    [`${itemPrefixCls}-hidden`]: hidden
  });
  return /*#__PURE__*/React.createElement("div", {
    className: itemClassName,
    style: style,
    ref: itemRef
  }, /*#__PURE__*/React.createElement(Row, Object.assign({
    className: `${itemPrefixCls}-row`
  }, omit(restProps, ['_internalItemRender', 'colon', 'dependencies', 'extra', 'fieldKey', 'getValueFromEvent', 'getValueProps', 'htmlFor', 'id', 'initialValue', 'isListField', 'label', 'labelAlign', 'labelCol', 'labelWrap', 'messageVariables', 'name', 'normalize', 'noStyle', 'preserve', 'requiredMark', 'rules', 'shouldUpdate', 'trigger', 'tooltip', 'validateFirst', 'validateTrigger', 'valuePropName', 'wrapperCol'])), /*#__PURE__*/React.createElement(FormItemLabel, Object.assign({
    htmlFor: fieldId
  }, props, {
    requiredMark: requiredMark,
    required: required !== null && required !== void 0 ? required : isRequired,
    prefixCls: prefixCls
  })), /*#__PURE__*/React.createElement(FormItemInput, Object.assign({}, props, meta, {
    errors: debounceErrors,
    warnings: debounceWarnings,
    prefixCls: prefixCls,
    status: mergedValidateStatus,
    help: help,
    marginBottom: marginBottom,
    onErrorVisibleChanged: onErrorVisibleChanged
  }), /*#__PURE__*/React.createElement(NoStyleItemContext.Provider, {
    value: onSubItemMetaChange
  }, /*#__PURE__*/React.createElement(FormItemInputContext.Provider, {
    value: formItemStatusContext
  }, children)))), !!marginBottom && /*#__PURE__*/React.createElement("div", {
    className: `${itemPrefixCls}-margin-offset`,
    style: {
      marginBottom: -marginBottom
    }
  }));
}