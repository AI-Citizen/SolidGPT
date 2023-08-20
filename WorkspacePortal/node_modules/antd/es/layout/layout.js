import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import classNames from 'classnames';
import omit from "rc-util/es/omit";
import * as React from 'react';
import { ConfigContext } from '../config-provider';
import useStyle from './style';
export const LayoutContext = /*#__PURE__*/React.createContext({
  siderHook: {
    addSider: () => null,
    removeSider: () => null
  }
});
function generator(_ref) {
  let {
    suffixCls,
    tagName,
    displayName
  } = _ref;
  return BasicComponent => {
    const Adapter = /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React.createElement(BasicComponent, Object.assign({
      ref: ref,
      suffixCls: suffixCls,
      tagName: tagName
    }, props)));
    if (process.env.NODE_ENV !== 'production') {
      Adapter.displayName = displayName;
    }
    return Adapter;
  };
}
const Basic = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
      prefixCls: customizePrefixCls,
      suffixCls,
      className,
      tagName: TagName
    } = props,
    others = __rest(props, ["prefixCls", "suffixCls", "className", "tagName"]);
  const {
    getPrefixCls
  } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('layout', customizePrefixCls);
  const [wrapSSR, hashId] = useStyle(prefixCls);
  const prefixWithSuffixCls = suffixCls ? `${prefixCls}-${suffixCls}` : prefixCls;
  return wrapSSR( /*#__PURE__*/React.createElement(TagName, Object.assign({
    className: classNames(customizePrefixCls || prefixWithSuffixCls, className, hashId),
    ref: ref
  }, others)));
});
const BasicLayout = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    direction
  } = React.useContext(ConfigContext);
  const [siders, setSiders] = React.useState([]);
  const {
      prefixCls: customizePrefixCls,
      className,
      rootClassName,
      children,
      hasSider,
      tagName: Tag,
      style
    } = props,
    others = __rest(props, ["prefixCls", "className", "rootClassName", "children", "hasSider", "tagName", "style"]);
  const passedProps = omit(others, ['suffixCls']);
  const {
    getPrefixCls,
    layout
  } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('layout', customizePrefixCls);
  const [wrapSSR, hashId] = useStyle(prefixCls);
  const classString = classNames(prefixCls, {
    [`${prefixCls}-has-sider`]: typeof hasSider === 'boolean' ? hasSider : siders.length > 0,
    [`${prefixCls}-rtl`]: direction === 'rtl'
  }, layout === null || layout === void 0 ? void 0 : layout.className, className, rootClassName, hashId);
  const contextValue = React.useMemo(() => ({
    siderHook: {
      addSider: id => {
        setSiders(prev => [].concat(_toConsumableArray(prev), [id]));
      },
      removeSider: id => {
        setSiders(prev => prev.filter(currentId => currentId !== id));
      }
    }
  }), []);
  return wrapSSR( /*#__PURE__*/React.createElement(LayoutContext.Provider, {
    value: contextValue
  }, /*#__PURE__*/React.createElement(Tag, Object.assign({
    ref: ref,
    className: classString,
    style: Object.assign(Object.assign({}, layout === null || layout === void 0 ? void 0 : layout.style), style)
  }, passedProps), children)));
});
const Layout = generator({
  tagName: 'div',
  displayName: 'Layout'
})(BasicLayout);
const Header = generator({
  suffixCls: 'header',
  tagName: 'header',
  displayName: 'Header'
})(Basic);
const Footer = generator({
  suffixCls: 'footer',
  tagName: 'footer',
  displayName: 'Footer'
})(Basic);
const Content = generator({
  suffixCls: 'content',
  tagName: 'main',
  displayName: 'Content'
})(Basic);
export { Content, Footer, Header };
export default Layout;