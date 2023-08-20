var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import classNames from 'classnames';
import FieldForm, { List, useWatch } from 'rc-field-form';
import * as React from 'react';
import { useMemo } from 'react';
import { ConfigContext } from '../config-provider';
import DisabledContext, { DisabledContextProvider } from '../config-provider/DisabledContext';
import { SizeContextProvider } from '../config-provider/SizeContext';
import useSize from '../config-provider/hooks/useSize';
import { FormContext, FormProvider } from './context';
import useForm from './hooks/useForm';
import useFormWarning from './hooks/useFormWarning';
import useStyle from './style';
import ValidateMessagesContext from './validateMessagesContext';
const InternalForm = (props, ref) => {
  const contextDisabled = React.useContext(DisabledContext);
  const {
    getPrefixCls,
    direction,
    form: contextForm
  } = React.useContext(ConfigContext);
  const {
      prefixCls: customizePrefixCls,
      className,
      rootClassName,
      size,
      disabled = contextDisabled,
      form,
      colon,
      labelAlign,
      labelWrap,
      labelCol,
      wrapperCol,
      hideRequiredMark,
      layout = 'horizontal',
      scrollToFirstError,
      requiredMark,
      onFinishFailed,
      name,
      style
    } = props,
    restFormProps = __rest(props, ["prefixCls", "className", "rootClassName", "size", "disabled", "form", "colon", "labelAlign", "labelWrap", "labelCol", "wrapperCol", "hideRequiredMark", "layout", "scrollToFirstError", "requiredMark", "onFinishFailed", "name", "style"]);
  const mergedSize = useSize(size);
  const contextValidateMessages = React.useContext(ValidateMessagesContext);
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useFormWarning(props);
  }
  const mergedRequiredMark = useMemo(() => {
    if (requiredMark !== undefined) {
      return requiredMark;
    }
    if (contextForm && contextForm.requiredMark !== undefined) {
      return contextForm.requiredMark;
    }
    if (hideRequiredMark) {
      return false;
    }
    return true;
  }, [hideRequiredMark, requiredMark, contextForm]);
  const mergedColon = colon !== null && colon !== void 0 ? colon : contextForm === null || contextForm === void 0 ? void 0 : contextForm.colon;
  const prefixCls = getPrefixCls('form', customizePrefixCls);
  // Style
  const [wrapSSR, hashId] = useStyle(prefixCls);
  const formClassName = classNames(prefixCls, `${prefixCls}-${layout}`, {
    [`${prefixCls}-hide-required-mark`]: mergedRequiredMark === false,
    [`${prefixCls}-rtl`]: direction === 'rtl',
    [`${prefixCls}-${mergedSize}`]: mergedSize
  }, hashId, contextForm === null || contextForm === void 0 ? void 0 : contextForm.className, className, rootClassName);
  const [wrapForm] = useForm(form);
  const {
    __INTERNAL__
  } = wrapForm;
  __INTERNAL__.name = name;
  const formContextValue = useMemo(() => ({
    name,
    labelAlign,
    labelCol,
    labelWrap,
    wrapperCol,
    vertical: layout === 'vertical',
    colon: mergedColon,
    requiredMark: mergedRequiredMark,
    itemRef: __INTERNAL__.itemRef,
    form: wrapForm
  }), [name, labelAlign, labelCol, wrapperCol, layout, mergedColon, mergedRequiredMark, wrapForm]);
  React.useImperativeHandle(ref, () => wrapForm);
  const scrollToField = (options, fieldName) => {
    if (options) {
      let defaultScrollToFirstError = {
        block: 'nearest'
      };
      if (typeof options === 'object') {
        defaultScrollToFirstError = options;
      }
      wrapForm.scrollToField(fieldName, defaultScrollToFirstError);
    }
  };
  const onInternalFinishFailed = errorInfo => {
    onFinishFailed === null || onFinishFailed === void 0 ? void 0 : onFinishFailed(errorInfo);
    if (errorInfo.errorFields.length) {
      const fieldName = errorInfo.errorFields[0].name;
      if (scrollToFirstError !== undefined) {
        scrollToField(scrollToFirstError, fieldName);
        return;
      }
      if (contextForm && contextForm.scrollToFirstError !== undefined) {
        scrollToField(contextForm.scrollToFirstError, fieldName);
      }
    }
  };
  return wrapSSR( /*#__PURE__*/React.createElement(DisabledContextProvider, {
    disabled: disabled
  }, /*#__PURE__*/React.createElement(SizeContextProvider, {
    size: mergedSize
  }, /*#__PURE__*/React.createElement(FormProvider, {
    // This is not list in API, we pass with spread
    validateMessages: contextValidateMessages
  }, /*#__PURE__*/React.createElement(FormContext.Provider, {
    value: formContextValue
  }, /*#__PURE__*/React.createElement(FieldForm, Object.assign({
    id: name
  }, restFormProps, {
    name: name,
    onFinishFailed: onInternalFinishFailed,
    form: wrapForm,
    style: Object.assign(Object.assign({}, contextForm === null || contextForm === void 0 ? void 0 : contextForm.style), style),
    className: formClassName
  })))))));
};
const Form = /*#__PURE__*/React.forwardRef(InternalForm);
if (process.env.NODE_ENV !== 'production') {
  Form.displayName = 'Form';
}
export { List, useForm, useWatch };
export default Form;