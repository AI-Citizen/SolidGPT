import * as React from 'react';
import { executeValue } from "./utils/miscUtil";
export default function PresetPanel(props) {
  var prefixCls = props.prefixCls,
    presets = props.presets,
    _onClick = props.onClick,
    onHover = props.onHover;
  if (!presets.length) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "".concat(prefixCls, "-presets")
  }, /*#__PURE__*/React.createElement("ul", null, presets.map(function (_ref, index) {
    var label = _ref.label,
      value = _ref.value;
    return /*#__PURE__*/React.createElement("li", {
      key: index,
      onClick: function onClick() {
        return _onClick === null || _onClick === void 0 ? void 0 : _onClick(executeValue(value));
      },
      onMouseEnter: function onMouseEnter() {
        return onHover === null || onHover === void 0 ? void 0 : onHover(executeValue(value));
      },
      onMouseLeave: function onMouseLeave() {
        return onHover === null || onHover === void 0 ? void 0 : onHover(null);
      }
    }, label);
  })));
}