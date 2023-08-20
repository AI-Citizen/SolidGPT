import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _typeof from "@babel/runtime/helpers/esm/typeof";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _extends from "@babel/runtime/helpers/esm/extends";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["autoComplete", "onChange", "onFocus", "onBlur", "onPressEnter", "onKeyDown", "prefixCls", "disabled", "htmlSize", "className", "maxLength", "suffix", "showCount", "type", "classes", "classNames", "styles"];
import clsx from 'classnames';
import useMergedState from "rc-util/es/hooks/useMergedState";
import omit from "rc-util/es/omit";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import BaseInput from "./BaseInput";
import { fixControlledValue, resolveOnChange, triggerFocus } from "./utils/commonUtils";
var Input = /*#__PURE__*/forwardRef(function (props, ref) {
  var autoComplete = props.autoComplete,
    onChange = props.onChange,
    onFocus = props.onFocus,
    onBlur = props.onBlur,
    onPressEnter = props.onPressEnter,
    onKeyDown = props.onKeyDown,
    _props$prefixCls = props.prefixCls,
    prefixCls = _props$prefixCls === void 0 ? 'rc-input' : _props$prefixCls,
    disabled = props.disabled,
    htmlSize = props.htmlSize,
    className = props.className,
    maxLength = props.maxLength,
    suffix = props.suffix,
    showCount = props.showCount,
    _props$type = props.type,
    type = _props$type === void 0 ? 'text' : _props$type,
    classes = props.classes,
    classNames = props.classNames,
    styles = props.styles,
    rest = _objectWithoutProperties(props, _excluded);
  var _useMergedState = useMergedState(props.defaultValue, {
      value: props.value
    }),
    _useMergedState2 = _slicedToArray(_useMergedState, 2),
    value = _useMergedState2[0],
    setValue = _useMergedState2[1];
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    focused = _useState2[0],
    setFocused = _useState2[1];
  var inputRef = useRef(null);
  var focus = function focus(option) {
    if (inputRef.current) {
      triggerFocus(inputRef.current, option);
    }
  };
  useImperativeHandle(ref, function () {
    return {
      focus: focus,
      blur: function blur() {
        var _inputRef$current;
        (_inputRef$current = inputRef.current) === null || _inputRef$current === void 0 ? void 0 : _inputRef$current.blur();
      },
      setSelectionRange: function setSelectionRange(start, end, direction) {
        var _inputRef$current2;
        (_inputRef$current2 = inputRef.current) === null || _inputRef$current2 === void 0 ? void 0 : _inputRef$current2.setSelectionRange(start, end, direction);
      },
      select: function select() {
        var _inputRef$current3;
        (_inputRef$current3 = inputRef.current) === null || _inputRef$current3 === void 0 ? void 0 : _inputRef$current3.select();
      },
      input: inputRef.current
    };
  });
  useEffect(function () {
    setFocused(function (prev) {
      return prev && disabled ? false : prev;
    });
  }, [disabled]);
  var handleChange = function handleChange(e) {
    if (props.value === undefined) {
      setValue(e.target.value);
    }
    if (inputRef.current) {
      resolveOnChange(inputRef.current, e, onChange);
    }
  };
  var handleKeyDown = function handleKeyDown(e) {
    if (onPressEnter && e.key === 'Enter') {
      onPressEnter(e);
    }
    onKeyDown === null || onKeyDown === void 0 ? void 0 : onKeyDown(e);
  };
  var handleFocus = function handleFocus(e) {
    setFocused(true);
    onFocus === null || onFocus === void 0 ? void 0 : onFocus(e);
  };
  var handleBlur = function handleBlur(e) {
    setFocused(false);
    onBlur === null || onBlur === void 0 ? void 0 : onBlur(e);
  };
  var handleReset = function handleReset(e) {
    setValue('');
    focus();
    if (inputRef.current) {
      resolveOnChange(inputRef.current, e, onChange);
    }
  };
  var getInputElement = function getInputElement() {
    // Fix https://fb.me/react-unknown-prop
    var otherProps = omit(props, ['prefixCls', 'onPressEnter', 'addonBefore', 'addonAfter', 'prefix', 'suffix', 'allowClear',
    // Input elements must be either controlled or uncontrolled,
    // specify either the value prop, or the defaultValue prop, but not both.
    'defaultValue', 'showCount', 'classes', 'htmlSize', 'styles', 'classNames']);
    return /*#__PURE__*/React.createElement("input", _extends({
      autoComplete: autoComplete
    }, otherProps, {
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      className: clsx(prefixCls, _defineProperty({}, "".concat(prefixCls, "-disabled"), disabled), classNames === null || classNames === void 0 ? void 0 : classNames.input),
      style: styles === null || styles === void 0 ? void 0 : styles.input,
      ref: inputRef,
      size: htmlSize,
      type: type
    }));
  };
  var getSuffix = function getSuffix() {
    // Max length value
    var hasMaxLength = Number(maxLength) > 0;
    if (suffix || showCount) {
      var val = fixControlledValue(value);
      var valueLength = _toConsumableArray(val).length;
      var dataCount = _typeof(showCount) === 'object' ? showCount.formatter({
        value: val,
        count: valueLength,
        maxLength: maxLength
      }) : "".concat(valueLength).concat(hasMaxLength ? " / ".concat(maxLength) : '');
      return /*#__PURE__*/React.createElement(React.Fragment, null, !!showCount && /*#__PURE__*/React.createElement("span", {
        className: clsx("".concat(prefixCls, "-show-count-suffix"), _defineProperty({}, "".concat(prefixCls, "-show-count-has-suffix"), !!suffix), classNames === null || classNames === void 0 ? void 0 : classNames.count),
        style: _objectSpread({}, styles === null || styles === void 0 ? void 0 : styles.count)
      }, dataCount), suffix);
    }
    return null;
  };
  return /*#__PURE__*/React.createElement(BaseInput, _extends({}, rest, {
    prefixCls: prefixCls,
    className: className,
    inputElement: getInputElement(),
    handleReset: handleReset,
    value: fixControlledValue(value),
    focused: focused,
    triggerFocus: focus,
    suffix: getSuffix(),
    disabled: disabled,
    classes: classes,
    classNames: classNames,
    styles: styles
  }));
});
export default Input;