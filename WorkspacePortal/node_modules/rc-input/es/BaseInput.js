import _extends from "@babel/runtime/helpers/esm/extends";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _typeof from "@babel/runtime/helpers/esm/typeof";
import clsx from 'classnames';
import React, { cloneElement, useRef } from 'react';
import { hasAddon, hasPrefixSuffix } from "./utils/commonUtils";
var BaseInput = function BaseInput(props) {
  var _inputElement$props, _inputElement$props2;
  var inputElement = props.inputElement,
    prefixCls = props.prefixCls,
    prefix = props.prefix,
    suffix = props.suffix,
    addonBefore = props.addonBefore,
    addonAfter = props.addonAfter,
    className = props.className,
    style = props.style,
    disabled = props.disabled,
    readOnly = props.readOnly,
    focused = props.focused,
    triggerFocus = props.triggerFocus,
    allowClear = props.allowClear,
    value = props.value,
    handleReset = props.handleReset,
    hidden = props.hidden,
    classes = props.classes,
    classNames = props.classNames,
    dataAttrs = props.dataAttrs,
    styles = props.styles,
    components = props.components;
  var AffixWrapperComponent = (components === null || components === void 0 ? void 0 : components.affixWrapper) || 'span';
  var GroupWrapperComponent = (components === null || components === void 0 ? void 0 : components.groupWrapper) || 'span';
  var WrapperComponent = (components === null || components === void 0 ? void 0 : components.wrapper) || 'span';
  var GroupAddonComponent = (components === null || components === void 0 ? void 0 : components.groupAddon) || 'span';
  var containerRef = useRef(null);
  var onInputClick = function onInputClick(e) {
    var _containerRef$current;
    if ((_containerRef$current = containerRef.current) !== null && _containerRef$current !== void 0 && _containerRef$current.contains(e.target)) {
      triggerFocus === null || triggerFocus === void 0 ? void 0 : triggerFocus();
    }
  };

  // ================== Clear Icon ================== //
  var getClearIcon = function getClearIcon() {
    var _clsx;
    if (!allowClear) {
      return null;
    }
    var needClear = !disabled && !readOnly && value;
    var clearIconCls = "".concat(prefixCls, "-clear-icon");
    var iconNode = _typeof(allowClear) === 'object' && allowClear !== null && allowClear !== void 0 && allowClear.clearIcon ? allowClear.clearIcon : '✖';
    return /*#__PURE__*/React.createElement("span", {
      onClick: handleReset
      // Do not trigger onBlur when clear input
      // https://github.com/ant-design/ant-design/issues/31200
      ,
      onMouseDown: function onMouseDown(e) {
        return e.preventDefault();
      },
      className: clsx(clearIconCls, (_clsx = {}, _defineProperty(_clsx, "".concat(clearIconCls, "-hidden"), !needClear), _defineProperty(_clsx, "".concat(clearIconCls, "-has-suffix"), !!suffix), _clsx)),
      role: "button",
      tabIndex: -1
    }, iconNode);
  };
  var element = /*#__PURE__*/cloneElement(inputElement, {
    value: value,
    hidden: hidden,
    className: clsx((_inputElement$props = inputElement.props) === null || _inputElement$props === void 0 ? void 0 : _inputElement$props.className, !hasPrefixSuffix(props) && !hasAddon(props) && className) || null,
    style: _objectSpread(_objectSpread({}, (_inputElement$props2 = inputElement.props) === null || _inputElement$props2 === void 0 ? void 0 : _inputElement$props2.style), !hasPrefixSuffix(props) && !hasAddon(props) ? style : {})
  });

  // ================== Prefix & Suffix ================== //
  if (hasPrefixSuffix(props)) {
    var _clsx2;
    var affixWrapperPrefixCls = "".concat(prefixCls, "-affix-wrapper");
    var affixWrapperCls = clsx(affixWrapperPrefixCls, (_clsx2 = {}, _defineProperty(_clsx2, "".concat(affixWrapperPrefixCls, "-disabled"), disabled), _defineProperty(_clsx2, "".concat(affixWrapperPrefixCls, "-focused"), focused), _defineProperty(_clsx2, "".concat(affixWrapperPrefixCls, "-readonly"), readOnly), _defineProperty(_clsx2, "".concat(affixWrapperPrefixCls, "-input-with-clear-btn"), suffix && allowClear && value), _clsx2), !hasAddon(props) && className, classes === null || classes === void 0 ? void 0 : classes.affixWrapper, classNames === null || classNames === void 0 ? void 0 : classNames.affixWrapper);
    var suffixNode = (suffix || allowClear) && /*#__PURE__*/React.createElement("span", {
      className: clsx("".concat(prefixCls, "-suffix"), classNames === null || classNames === void 0 ? void 0 : classNames.suffix),
      style: styles === null || styles === void 0 ? void 0 : styles.suffix
    }, getClearIcon(), suffix);
    element = /*#__PURE__*/React.createElement(AffixWrapperComponent, _extends({
      className: affixWrapperCls,
      style: _objectSpread(_objectSpread({}, !hasAddon(props) ? style : undefined), styles === null || styles === void 0 ? void 0 : styles.affixWrapper),
      hidden: !hasAddon(props) && hidden,
      onClick: onInputClick
    }, dataAttrs === null || dataAttrs === void 0 ? void 0 : dataAttrs.affixWrapper, {
      ref: containerRef
    }), prefix && /*#__PURE__*/React.createElement("span", {
      className: clsx("".concat(prefixCls, "-prefix"), classNames === null || classNames === void 0 ? void 0 : classNames.prefix),
      style: styles === null || styles === void 0 ? void 0 : styles.prefix
    }, prefix), /*#__PURE__*/cloneElement(inputElement, {
      value: value,
      hidden: null
    }), suffixNode);
  }

  // ================== Addon ================== //
  if (hasAddon(props)) {
    var wrapperCls = "".concat(prefixCls, "-group");
    var addonCls = "".concat(wrapperCls, "-addon");
    var mergedWrapperClassName = clsx("".concat(prefixCls, "-wrapper"), wrapperCls, classes === null || classes === void 0 ? void 0 : classes.wrapper);
    var mergedGroupClassName = clsx("".concat(prefixCls, "-group-wrapper"), className, classes === null || classes === void 0 ? void 0 : classes.group);

    // Need another wrapper for changing display:table to display:inline-block
    // and put style prop in wrapper
    return /*#__PURE__*/React.createElement(GroupWrapperComponent, {
      className: mergedGroupClassName,
      style: style,
      hidden: hidden
    }, /*#__PURE__*/React.createElement(WrapperComponent, {
      className: mergedWrapperClassName
    }, addonBefore && /*#__PURE__*/React.createElement(GroupAddonComponent, {
      className: addonCls
    }, addonBefore), /*#__PURE__*/cloneElement(element, {
      hidden: null
    }), addonAfter && /*#__PURE__*/React.createElement(GroupAddonComponent, {
      className: addonCls
    }, addonAfter)));
  }
  return element;
};
export default BaseInput;