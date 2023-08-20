import _extends from "@babel/runtime/helpers/esm/extends";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _typeof from "@babel/runtime/helpers/esm/typeof";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
var _excluded = ["defaultValue", "value", "onFocus", "onBlur", "onChange", "allowClear", "maxLength", "onCompositionStart", "onCompositionEnd", "suffix", "prefixCls", "classes", "showCount", "className", "style", "disabled", "hidden", "classNames", "styles", "onResize"];
import clsx from 'classnames';
import { BaseInput } from 'rc-input';
import { fixControlledValue, resolveOnChange } from "rc-input/es/utils/commonUtils";
import useMergedState from "rc-util/es/hooks/useMergedState";
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import ResizableTextArea from "./ResizableTextArea";
function fixEmojiLength(value, maxLength) {
  return _toConsumableArray(value || '').slice(0, maxLength).join('');
}
function setTriggerValue(isCursorInEnd, preValue, triggerValue, maxLength) {
  var newTriggerValue = triggerValue;
  if (isCursorInEnd) {
    // 光标在尾部，直接截断
    newTriggerValue = fixEmojiLength(triggerValue, maxLength);
  } else if (_toConsumableArray(preValue || '').length < triggerValue.length && _toConsumableArray(triggerValue || '').length > maxLength) {
    // 光标在中间，如果最后的值超过最大值，则采用原先的值
    newTriggerValue = preValue;
  }
  return newTriggerValue;
}
var TextArea = /*#__PURE__*/React.forwardRef(function (_ref, ref) {
  var _clsx;
  var defaultValue = _ref.defaultValue,
    customValue = _ref.value,
    onFocus = _ref.onFocus,
    onBlur = _ref.onBlur,
    onChange = _ref.onChange,
    allowClear = _ref.allowClear,
    maxLength = _ref.maxLength,
    onCompositionStart = _ref.onCompositionStart,
    onCompositionEnd = _ref.onCompositionEnd,
    suffix = _ref.suffix,
    _ref$prefixCls = _ref.prefixCls,
    prefixCls = _ref$prefixCls === void 0 ? 'rc-textarea' : _ref$prefixCls,
    classes = _ref.classes,
    showCount = _ref.showCount,
    className = _ref.className,
    style = _ref.style,
    disabled = _ref.disabled,
    hidden = _ref.hidden,
    classNames = _ref.classNames,
    styles = _ref.styles,
    onResize = _ref.onResize,
    rest = _objectWithoutProperties(_ref, _excluded);
  var _useMergedState = useMergedState(defaultValue, {
      value: customValue,
      defaultValue: defaultValue
    }),
    _useMergedState2 = _slicedToArray(_useMergedState, 2),
    value = _useMergedState2[0],
    setValue = _useMergedState2[1];
  var resizableTextAreaRef = useRef(null);
  var _React$useState = React.useState(false),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    focused = _React$useState2[0],
    setFocused = _React$useState2[1];
  var _React$useState3 = React.useState(false),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    compositing = _React$useState4[0],
    setCompositing = _React$useState4[1];
  var oldCompositionValueRef = React.useRef();
  var oldSelectionStartRef = React.useRef(0);
  var _React$useState5 = React.useState(null),
    _React$useState6 = _slicedToArray(_React$useState5, 2),
    textareaResized = _React$useState6[0],
    setTextareaResized = _React$useState6[1];
  var focus = function focus() {
    var _resizableTextAreaRef;
    (_resizableTextAreaRef = resizableTextAreaRef.current) === null || _resizableTextAreaRef === void 0 ? void 0 : _resizableTextAreaRef.textArea.focus();
  };
  useImperativeHandle(ref, function () {
    return {
      resizableTextArea: resizableTextAreaRef.current,
      focus: focus,
      blur: function blur() {
        var _resizableTextAreaRef2;
        (_resizableTextAreaRef2 = resizableTextAreaRef.current) === null || _resizableTextAreaRef2 === void 0 ? void 0 : _resizableTextAreaRef2.textArea.blur();
      }
    };
  });
  useEffect(function () {
    setFocused(function (prev) {
      return !disabled && prev;
    });
  }, [disabled]);

  // =========================== Value Update ===========================
  // Max length value
  var hasMaxLength = Number(maxLength) > 0;
  var onInternalCompositionStart = function onInternalCompositionStart(e) {
    setCompositing(true);
    // 拼音输入前保存一份旧值
    oldCompositionValueRef.current = value;
    // 保存旧的光标位置
    oldSelectionStartRef.current = e.currentTarget.selectionStart;
    onCompositionStart === null || onCompositionStart === void 0 ? void 0 : onCompositionStart(e);
  };
  var onInternalCompositionEnd = function onInternalCompositionEnd(e) {
    setCompositing(false);
    var triggerValue = e.currentTarget.value;
    if (hasMaxLength) {
      var _oldCompositionValueR;
      var isCursorInEnd = oldSelectionStartRef.current >= maxLength + 1 || oldSelectionStartRef.current === ((_oldCompositionValueR = oldCompositionValueRef.current) === null || _oldCompositionValueR === void 0 ? void 0 : _oldCompositionValueR.length);
      triggerValue = setTriggerValue(isCursorInEnd, oldCompositionValueRef.current, triggerValue, maxLength);
    }
    // Patch composition onChange when value changed
    if (triggerValue !== value) {
      setValue(triggerValue);
      resolveOnChange(e.currentTarget, e, onChange, triggerValue);
    }
    onCompositionEnd === null || onCompositionEnd === void 0 ? void 0 : onCompositionEnd(e);
  };
  var handleChange = function handleChange(e) {
    var triggerValue = e.target.value;
    if (!compositing && hasMaxLength) {
      // 1. 复制粘贴超过maxlength的情况 2.未超过maxlength的情况
      var isCursorInEnd = e.target.selectionStart >= maxLength + 1 || e.target.selectionStart === triggerValue.length || !e.target.selectionStart;
      triggerValue = setTriggerValue(isCursorInEnd, value, triggerValue, maxLength);
    }
    setValue(triggerValue);
    resolveOnChange(e.currentTarget, e, onChange, triggerValue);
  };
  var handleKeyDown = function handleKeyDown(e) {
    var onPressEnter = rest.onPressEnter,
      onKeyDown = rest.onKeyDown;
    if (e.key === 'Enter' && onPressEnter) {
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

  // ============================== Reset ===============================
  var handleReset = function handleReset(e) {
    var _resizableTextAreaRef3;
    setValue('');
    focus();
    resolveOnChange((_resizableTextAreaRef3 = resizableTextAreaRef.current) === null || _resizableTextAreaRef3 === void 0 ? void 0 : _resizableTextAreaRef3.textArea, e, onChange);
  };
  var val = fixControlledValue(value);
  if (!compositing && hasMaxLength && (customValue === null || customValue === undefined)) {
    // fix #27612 将value转为数组进行截取，解决 '😂'.length === 2 等emoji表情导致的截取乱码的问题
    val = fixEmojiLength(val, maxLength);
  }
  var suffixNode = suffix;
  var dataCount;
  if (showCount) {
    var valueLength = _toConsumableArray(val).length;
    if (_typeof(showCount) === 'object') {
      dataCount = showCount.formatter({
        value: val,
        count: valueLength,
        maxLength: maxLength
      });
    } else {
      dataCount = "".concat(valueLength).concat(hasMaxLength ? " / ".concat(maxLength) : '');
    }
    suffixNode = /*#__PURE__*/React.createElement(React.Fragment, null, suffixNode, /*#__PURE__*/React.createElement("span", {
      className: clsx("".concat(prefixCls, "-data-count"), classNames === null || classNames === void 0 ? void 0 : classNames.count),
      style: styles === null || styles === void 0 ? void 0 : styles.count
    }, dataCount));
  }
  var handleResize = function handleResize(size) {
    var _resizableTextAreaRef4;
    onResize === null || onResize === void 0 ? void 0 : onResize(size);
    if ((_resizableTextAreaRef4 = resizableTextAreaRef.current) !== null && _resizableTextAreaRef4 !== void 0 && _resizableTextAreaRef4.textArea.style.height) {
      setTextareaResized(true);
    }
  };
  var isPureTextArea = !rest.autoSize && !showCount && !allowClear;
  var textarea = /*#__PURE__*/React.createElement(BaseInput, {
    value: val,
    allowClear: allowClear,
    handleReset: handleReset,
    suffix: suffixNode,
    prefixCls: prefixCls,
    classes: {
      affixWrapper: clsx(classes === null || classes === void 0 ? void 0 : classes.affixWrapper, (_clsx = {}, _defineProperty(_clsx, "".concat(prefixCls, "-show-count"), showCount), _defineProperty(_clsx, "".concat(prefixCls, "-textarea-allow-clear"), allowClear), _clsx))
    },
    disabled: disabled,
    focused: focused,
    className: className,
    style: _objectSpread(_objectSpread({}, style), textareaResized && !isPureTextArea ? {
      height: 'auto'
    } : {}),
    dataAttrs: {
      affixWrapper: {
        'data-count': typeof dataCount === 'string' ? dataCount : undefined
      }
    },
    hidden: hidden,
    inputElement: /*#__PURE__*/React.createElement(ResizableTextArea, _extends({}, rest, {
      onKeyDown: handleKeyDown,
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onCompositionStart: onInternalCompositionStart,
      onCompositionEnd: onInternalCompositionEnd,
      className: classNames === null || classNames === void 0 ? void 0 : classNames.textarea,
      style: _objectSpread(_objectSpread({}, styles === null || styles === void 0 ? void 0 : styles.textarea), {}, {
        resize: style === null || style === void 0 ? void 0 : style.resize
      }),
      disabled: disabled,
      prefixCls: prefixCls,
      onResize: handleResize,
      ref: resizableTextAreaRef
    }))
  });
  return textarea;
});
export default TextArea;