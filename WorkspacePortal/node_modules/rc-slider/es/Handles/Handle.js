import _extends from "@babel/runtime/helpers/esm/extends";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["prefixCls", "value", "valueIndex", "onStartMove", "style", "render", "dragging", "onOffsetChange"];
import * as React from 'react';
import classNames from 'classnames';
import KeyCode from "rc-util/es/KeyCode";
import SliderContext from '../context';
import { getDirectionStyle, getIndex } from '../util';
var Handle = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var _classNames, _getIndex;
  var prefixCls = props.prefixCls,
    value = props.value,
    valueIndex = props.valueIndex,
    onStartMove = props.onStartMove,
    style = props.style,
    render = props.render,
    dragging = props.dragging,
    onOffsetChange = props.onOffsetChange,
    restProps = _objectWithoutProperties(props, _excluded);
  var _React$useContext = React.useContext(SliderContext),
    min = _React$useContext.min,
    max = _React$useContext.max,
    direction = _React$useContext.direction,
    disabled = _React$useContext.disabled,
    keyboard = _React$useContext.keyboard,
    range = _React$useContext.range,
    tabIndex = _React$useContext.tabIndex,
    ariaLabelForHandle = _React$useContext.ariaLabelForHandle,
    ariaLabelledByForHandle = _React$useContext.ariaLabelledByForHandle,
    ariaValueTextFormatterForHandle = _React$useContext.ariaValueTextFormatterForHandle;
  var handlePrefixCls = "".concat(prefixCls, "-handle");
  // ============================ Events ============================
  var onInternalStartMove = function onInternalStartMove(e) {
    if (!disabled) {
      onStartMove(e, valueIndex);
    }
  };
  // =========================== Keyboard ===========================
  var onKeyDown = function onKeyDown(e) {
    if (!disabled && keyboard) {
      var offset = null;
      // Change the value
      switch (e.which || e.keyCode) {
        case KeyCode.LEFT:
          offset = direction === 'ltr' || direction === 'btt' ? -1 : 1;
          break;
        case KeyCode.RIGHT:
          offset = direction === 'ltr' || direction === 'btt' ? 1 : -1;
          break;
        // Up is plus
        case KeyCode.UP:
          offset = direction !== 'ttb' ? 1 : -1;
          break;
        // Down is minus
        case KeyCode.DOWN:
          offset = direction !== 'ttb' ? -1 : 1;
          break;
        case KeyCode.HOME:
          offset = 'min';
          break;
        case KeyCode.END:
          offset = 'max';
          break;
        case KeyCode.PAGE_UP:
          offset = 2;
          break;
        case KeyCode.PAGE_DOWN:
          offset = -2;
          break;
      }
      if (offset !== null) {
        e.preventDefault();
        onOffsetChange(offset, valueIndex);
      }
    }
  };
  // ============================ Offset ============================
  var positionStyle = getDirectionStyle(direction, value, min, max);
  // ============================ Render ============================
  var handleNode = /*#__PURE__*/React.createElement("div", _extends({
    ref: ref,
    className: classNames(handlePrefixCls, (_classNames = {}, _defineProperty(_classNames, "".concat(handlePrefixCls, "-").concat(valueIndex + 1), range), _defineProperty(_classNames, "".concat(handlePrefixCls, "-dragging"), dragging), _classNames)),
    style: _objectSpread(_objectSpread({}, positionStyle), style),
    onMouseDown: onInternalStartMove,
    onTouchStart: onInternalStartMove,
    onKeyDown: onKeyDown,
    tabIndex: disabled ? null : getIndex(tabIndex, valueIndex),
    role: "slider",
    "aria-valuemin": min,
    "aria-valuemax": max,
    "aria-valuenow": value,
    "aria-disabled": disabled,
    "aria-label": getIndex(ariaLabelForHandle, valueIndex),
    "aria-labelledby": getIndex(ariaLabelledByForHandle, valueIndex),
    "aria-valuetext": (_getIndex = getIndex(ariaValueTextFormatterForHandle, valueIndex)) === null || _getIndex === void 0 ? void 0 : _getIndex(value)
  }, restProps));
  // Customize
  if (render) {
    handleNode = render(handleNode, {
      index: valueIndex,
      prefixCls: prefixCls,
      value: value,
      dragging: dragging
    });
  }
  return handleNode;
});
if (process.env.NODE_ENV !== 'production') {
  Handle.displayName = 'Handle';
}
export default Handle;