import * as React from 'react';
import classNames from 'classnames';
var TabPane = /*#__PURE__*/React.forwardRef(function (_ref, ref) {
  var prefixCls = _ref.prefixCls,
    className = _ref.className,
    style = _ref.style,
    id = _ref.id,
    active = _ref.active,
    tabKey = _ref.tabKey,
    children = _ref.children;
  return /*#__PURE__*/React.createElement("div", {
    id: id && "".concat(id, "-panel-").concat(tabKey),
    role: "tabpanel",
    tabIndex: active ? 0 : -1,
    "aria-labelledby": id && "".concat(id, "-tab-").concat(tabKey),
    "aria-hidden": !active,
    style: style,
    className: classNames(prefixCls, active && "".concat(prefixCls, "-active"), className),
    ref: ref
  }, children);
});
if (process.env.NODE_ENV !== 'production') {
  TabPane.displayName = 'TabPane';
}
export default TabPane;