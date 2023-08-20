'use client';

var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
/* eslint-disable react/no-array-index-key */
import classNames from 'classnames';
import * as React from 'react';
import useResponsiveObserver, { responsiveArray } from '../_util/responsiveObserver';
import { ConfigContext } from '../config-provider';
import useSize from '../config-provider/hooks/useSize';
import DescriptionsContext from './DescriptionsContext';
import DescriptionsItem from './Item';
import Row from './Row';
import useRow from './hooks/useRow';
import useStyle from './style';
const DEFAULT_COLUMN_MAP = {
  xxl: 3,
  xl: 3,
  lg: 3,
  md: 3,
  sm: 2,
  xs: 1
};
function getColumn(column, screens) {
  if (typeof column === 'number') {
    return column;
  }
  if (typeof column === 'object') {
    for (let i = 0; i < responsiveArray.length; i++) {
      const breakpoint = responsiveArray[i];
      if (screens[breakpoint] && column[breakpoint] !== undefined) {
        return column[breakpoint] || DEFAULT_COLUMN_MAP[breakpoint];
      }
    }
  }
  return 3;
}
const Descriptions = props => {
  const {
      prefixCls: customizePrefixCls,
      title,
      extra,
      column = DEFAULT_COLUMN_MAP,
      colon = true,
      bordered,
      layout,
      children,
      className,
      rootClassName,
      style,
      size: customizeSize,
      labelStyle,
      contentStyle,
      items
    } = props,
    restProps = __rest(props, ["prefixCls", "title", "extra", "column", "colon", "bordered", "layout", "children", "className", "rootClassName", "style", "size", "labelStyle", "contentStyle", "items"]);
  const {
    getPrefixCls,
    direction,
    descriptions
  } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('descriptions', customizePrefixCls);
  const [screens, setScreens] = React.useState({});
  const mergedColumn = getColumn(column, screens);
  const mergedSize = useSize(customizeSize);
  const rows = useRow(mergedColumn, items, children);
  const [wrapSSR, hashId] = useStyle(prefixCls);
  const responsiveObserver = useResponsiveObserver();
  // Responsive
  React.useEffect(() => {
    const token = responsiveObserver.subscribe(newScreens => {
      if (typeof column !== 'object') {
        return;
      }
      setScreens(newScreens);
    });
    return () => {
      responsiveObserver.unsubscribe(token);
    };
  }, []);
  // ======================== Render ========================
  const contextValue = React.useMemo(() => ({
    labelStyle,
    contentStyle
  }), [labelStyle, contentStyle]);
  return wrapSSR( /*#__PURE__*/React.createElement(DescriptionsContext.Provider, {
    value: contextValue
  }, /*#__PURE__*/React.createElement("div", Object.assign({
    className: classNames(prefixCls, descriptions === null || descriptions === void 0 ? void 0 : descriptions.className, {
      [`${prefixCls}-${mergedSize}`]: mergedSize && mergedSize !== 'default',
      [`${prefixCls}-bordered`]: !!bordered,
      [`${prefixCls}-rtl`]: direction === 'rtl'
    }, className, rootClassName, hashId),
    style: Object.assign(Object.assign({}, descriptions === null || descriptions === void 0 ? void 0 : descriptions.style), style)
  }, restProps), (title || extra) && /*#__PURE__*/React.createElement("div", {
    className: `${prefixCls}-header`
  }, title && /*#__PURE__*/React.createElement("div", {
    className: `${prefixCls}-title`
  }, title), extra && /*#__PURE__*/React.createElement("div", {
    className: `${prefixCls}-extra`
  }, extra)), /*#__PURE__*/React.createElement("div", {
    className: `${prefixCls}-view`
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("tbody", null, rows.map((row, index) => /*#__PURE__*/React.createElement(Row, {
    key: index,
    index: index,
    colon: colon,
    prefixCls: prefixCls,
    vertical: layout === 'vertical',
    bordered: bordered,
    row: row
  }))))))));
};
if (process.env.NODE_ENV !== 'production') {
  Descriptions.displayName = 'Descriptions';
}
export { DescriptionsContext };
Descriptions.Item = DescriptionsItem;
export default Descriptions;