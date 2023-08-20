import classNames from 'classnames';
import * as React from 'react';
import { ConfigContext } from '../config-provider';
import Skeleton from '../skeleton';
import StatisticNumber from './Number';
import useStyle from './style';
const Statistic = props => {
  const {
    prefixCls: customizePrefixCls,
    className,
    rootClassName,
    style,
    valueStyle,
    value = 0,
    title,
    valueRender,
    prefix,
    suffix,
    loading = false,
    onMouseEnter,
    onMouseLeave,
    decimalSeparator = '.',
    groupSeparator = ','
  } = props;
  const {
    getPrefixCls,
    direction,
    statistic
  } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('statistic', customizePrefixCls);
  const [wrapSSR, hashId] = useStyle(prefixCls);
  const valueNode = /*#__PURE__*/React.createElement(StatisticNumber, Object.assign({
    decimalSeparator: decimalSeparator,
    groupSeparator: groupSeparator,
    prefixCls: prefixCls
  }, props, {
    value: value
  }));
  const cls = classNames(prefixCls, {
    [`${prefixCls}-rtl`]: direction === 'rtl'
  }, statistic === null || statistic === void 0 ? void 0 : statistic.className, className, rootClassName, hashId);
  return wrapSSR( /*#__PURE__*/React.createElement("div", {
    className: cls,
    style: Object.assign(Object.assign({}, statistic === null || statistic === void 0 ? void 0 : statistic.style), style),
    onMouseEnter: onMouseEnter,
    onMouseLeave: onMouseLeave
  }, title && /*#__PURE__*/React.createElement("div", {
    className: `${prefixCls}-title`
  }, title), /*#__PURE__*/React.createElement(Skeleton, {
    paragraph: false,
    loading: loading,
    className: `${prefixCls}-skeleton`
  }, /*#__PURE__*/React.createElement("div", {
    style: valueStyle,
    className: `${prefixCls}-content`
  }, prefix && /*#__PURE__*/React.createElement("span", {
    className: `${prefixCls}-content-prefix`
  }, prefix), valueRender ? valueRender(valueNode) : valueNode, suffix && /*#__PURE__*/React.createElement("span", {
    className: `${prefixCls}-content-suffix`
  }, suffix)))));
};
if (process.env.NODE_ENV !== 'production') {
  Statistic.displayName = 'Statistic';
}
export default Statistic;