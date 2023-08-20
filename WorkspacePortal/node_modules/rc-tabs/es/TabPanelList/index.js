import _extends from "@babel/runtime/helpers/esm/extends";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
var _excluded = ["key", "forceRender", "style", "className"];
import * as React from 'react';
import classNames from 'classnames';
import CSSMotion from 'rc-motion';
import TabContext from "../TabContext";
import TabPane from "./TabPane";
export default function TabPanelList(_ref) {
  var id = _ref.id,
    activeKey = _ref.activeKey,
    animated = _ref.animated,
    tabPosition = _ref.tabPosition,
    destroyInactiveTabPane = _ref.destroyInactiveTabPane;
  var _React$useContext = React.useContext(TabContext),
    prefixCls = _React$useContext.prefixCls,
    tabs = _React$useContext.tabs;
  var tabPaneAnimated = animated.tabPane;
  var tabPanePrefixCls = "".concat(prefixCls, "-tabpane");
  return /*#__PURE__*/React.createElement("div", {
    className: classNames("".concat(prefixCls, "-content-holder"))
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames("".concat(prefixCls, "-content"), "".concat(prefixCls, "-content-").concat(tabPosition), _defineProperty({}, "".concat(prefixCls, "-content-animated"), tabPaneAnimated))
  }, tabs.map(function (_ref2) {
    var key = _ref2.key,
      forceRender = _ref2.forceRender,
      paneStyle = _ref2.style,
      paneClassName = _ref2.className,
      restTabProps = _objectWithoutProperties(_ref2, _excluded);
    var active = key === activeKey;
    return /*#__PURE__*/React.createElement(CSSMotion, _extends({
      key: key,
      visible: active,
      forceRender: forceRender,
      removeOnLeave: !!destroyInactiveTabPane,
      leavedClassName: "".concat(tabPanePrefixCls, "-hidden")
    }, animated.tabPaneMotion), function (_ref3, ref) {
      var motionStyle = _ref3.style,
        motionClassName = _ref3.className;
      return /*#__PURE__*/React.createElement(TabPane, _extends({}, restTabProps, {
        prefixCls: tabPanePrefixCls,
        id: id,
        tabKey: key,
        animated: tabPaneAnimated,
        active: active,
        style: _objectSpread(_objectSpread({}, paneStyle), motionStyle),
        className: classNames(paneClassName, motionClassName),
        ref: ref
      }));
    });
  })));
}