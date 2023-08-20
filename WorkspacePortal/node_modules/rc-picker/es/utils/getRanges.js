import * as React from 'react';
export default function getRanges(_ref) {
  var prefixCls = _ref.prefixCls,
    _ref$components = _ref.components,
    components = _ref$components === void 0 ? {} : _ref$components,
    needConfirmButton = _ref.needConfirmButton,
    onNow = _ref.onNow,
    onOk = _ref.onOk,
    okDisabled = _ref.okDisabled,
    showNow = _ref.showNow,
    locale = _ref.locale;
  var presetNode;
  var okNode;
  if (needConfirmButton) {
    var Button = components.button || 'button';
    if (onNow && showNow !== false) {
      presetNode = /*#__PURE__*/React.createElement("li", {
        className: "".concat(prefixCls, "-now")
      }, /*#__PURE__*/React.createElement("a", {
        className: "".concat(prefixCls, "-now-btn"),
        onClick: onNow
      }, locale.now));
    }
    okNode = needConfirmButton && /*#__PURE__*/React.createElement("li", {
      className: "".concat(prefixCls, "-ok")
    }, /*#__PURE__*/React.createElement(Button, {
      disabled: okDisabled,
      onClick: onOk
    }, locale.ok));
  }
  if (!presetNode && !okNode) {
    return null;
  }
  return /*#__PURE__*/React.createElement("ul", {
    className: "".concat(prefixCls, "-ranges")
  }, presetNode, okNode);
}