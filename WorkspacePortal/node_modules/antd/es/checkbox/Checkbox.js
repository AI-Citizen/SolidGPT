var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import classNames from 'classnames';
import RcCheckbox from 'rc-checkbox';
import * as React from 'react';
import warning from '../_util/warning';
import { ConfigContext } from '../config-provider';
import DisabledContext from '../config-provider/DisabledContext';
import { FormItemInputContext } from '../form/context';
import GroupContext from './GroupContext';
import useStyle from './style';
import Wave from '../_util/wave';
import { TARGET_CLS } from '../_util/wave/interface';
const InternalCheckbox = (props, ref) => {
  var _a;
  const {
      prefixCls: customizePrefixCls,
      className,
      rootClassName,
      children,
      indeterminate = false,
      style,
      onMouseEnter,
      onMouseLeave,
      skipGroup = false,
      disabled
    } = props,
    restProps = __rest(props, ["prefixCls", "className", "rootClassName", "children", "indeterminate", "style", "onMouseEnter", "onMouseLeave", "skipGroup", "disabled"]);
  const {
    getPrefixCls,
    direction,
    checkbox
  } = React.useContext(ConfigContext);
  const checkboxGroup = React.useContext(GroupContext);
  const {
    isFormItemInput
  } = React.useContext(FormItemInputContext);
  const contextDisabled = React.useContext(DisabledContext);
  const mergedDisabled = (_a = (checkboxGroup === null || checkboxGroup === void 0 ? void 0 : checkboxGroup.disabled) || disabled) !== null && _a !== void 0 ? _a : contextDisabled;
  const prevValue = React.useRef(restProps.value);
  React.useEffect(() => {
    checkboxGroup === null || checkboxGroup === void 0 ? void 0 : checkboxGroup.registerValue(restProps.value);
    process.env.NODE_ENV !== "production" ? warning('checked' in restProps || !!checkboxGroup || !('value' in restProps), 'Checkbox', '`value` is not a valid prop, do you mean `checked`?') : void 0;
  }, []);
  React.useEffect(() => {
    if (skipGroup) {
      return;
    }
    if (restProps.value !== prevValue.current) {
      checkboxGroup === null || checkboxGroup === void 0 ? void 0 : checkboxGroup.cancelValue(prevValue.current);
      checkboxGroup === null || checkboxGroup === void 0 ? void 0 : checkboxGroup.registerValue(restProps.value);
      prevValue.current = restProps.value;
    }
    return () => checkboxGroup === null || checkboxGroup === void 0 ? void 0 : checkboxGroup.cancelValue(restProps.value);
  }, [restProps.value]);
  const prefixCls = getPrefixCls('checkbox', customizePrefixCls);
  const [wrapSSR, hashId] = useStyle(prefixCls);
  const checkboxProps = Object.assign({}, restProps);
  if (checkboxGroup && !skipGroup) {
    checkboxProps.onChange = function () {
      if (restProps.onChange) {
        restProps.onChange.apply(restProps, arguments);
      }
      if (checkboxGroup.toggleOption) {
        checkboxGroup.toggleOption({
          label: children,
          value: restProps.value
        });
      }
    };
    checkboxProps.name = checkboxGroup.name;
    checkboxProps.checked = checkboxGroup.value.includes(restProps.value);
  }
  const classString = classNames(`${prefixCls}-wrapper`, {
    [`${prefixCls}-rtl`]: direction === 'rtl',
    [`${prefixCls}-wrapper-checked`]: checkboxProps.checked,
    [`${prefixCls}-wrapper-disabled`]: mergedDisabled,
    [`${prefixCls}-wrapper-in-form-item`]: isFormItemInput
  }, checkbox === null || checkbox === void 0 ? void 0 : checkbox.className, className, rootClassName, hashId);
  const checkboxClass = classNames({
    [`${prefixCls}-indeterminate`]: indeterminate
  }, TARGET_CLS, hashId);
  const ariaChecked = indeterminate ? 'mixed' : undefined;
  return wrapSSR( /*#__PURE__*/React.createElement(Wave, {
    component: "Checkbox",
    disabled: mergedDisabled
  }, /*#__PURE__*/React.createElement("label", {
    className: classString,
    style: Object.assign(Object.assign({}, checkbox === null || checkbox === void 0 ? void 0 : checkbox.style), style),
    onMouseEnter: onMouseEnter,
    onMouseLeave: onMouseLeave
  }, /*#__PURE__*/React.createElement(RcCheckbox, Object.assign({
    "aria-checked": ariaChecked
  }, checkboxProps, {
    prefixCls: prefixCls,
    className: checkboxClass,
    disabled: mergedDisabled,
    ref: ref
  })), children !== undefined && /*#__PURE__*/React.createElement("span", null, children))));
};
const Checkbox = /*#__PURE__*/React.forwardRef(InternalCheckbox);
if (process.env.NODE_ENV !== 'production') {
  Checkbox.displayName = 'Checkbox';
}
export default Checkbox;