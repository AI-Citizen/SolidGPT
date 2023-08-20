import classNames from 'classnames';
import { SubMenu as RcSubMenu, useFullPath } from 'rc-menu';
import omit from "rc-util/es/omit";
import * as React from 'react';
import { cloneElement, isValidElement } from '../_util/reactNode';
import MenuContext from './MenuContext';
const SubMenu = props => {
  var _a;
  const {
    popupClassName,
    icon,
    title,
    theme: customTheme
  } = props;
  const context = React.useContext(MenuContext);
  const {
    prefixCls,
    inlineCollapsed,
    theme: contextTheme
  } = context;
  const parentPath = useFullPath();
  let titleNode;
  if (!icon) {
    titleNode = inlineCollapsed && !parentPath.length && title && typeof title === 'string' ? /*#__PURE__*/React.createElement("div", {
      className: `${prefixCls}-inline-collapsed-noicon`
    }, title.charAt(0)) : /*#__PURE__*/React.createElement("span", {
      className: `${prefixCls}-title-content`
    }, title);
  } else {
    // inline-collapsed.md demo 依赖 span 来隐藏文字,有 icon 属性，则内部包裹一个 span
    // ref: https://github.com/ant-design/ant-design/pull/23456
    const titleIsSpan = isValidElement(title) && title.type === 'span';
    titleNode = /*#__PURE__*/React.createElement(React.Fragment, null, cloneElement(icon, {
      className: classNames(isValidElement(icon) ? (_a = icon.props) === null || _a === void 0 ? void 0 : _a.className : '', `${prefixCls}-item-icon`)
    }), titleIsSpan ? title : /*#__PURE__*/React.createElement("span", {
      className: `${prefixCls}-title-content`
    }, title));
  }
  const contextValue = React.useMemo(() => Object.assign(Object.assign({}, context), {
    firstLevel: false
  }), [context]);
  return /*#__PURE__*/React.createElement(MenuContext.Provider, {
    value: contextValue
  }, /*#__PURE__*/React.createElement(RcSubMenu, Object.assign({}, omit(props, ['icon']), {
    title: titleNode,
    popupClassName: classNames(prefixCls, popupClassName, `${prefixCls}-${customTheme || contextTheme}`)
  })));
};
export default SubMenu;