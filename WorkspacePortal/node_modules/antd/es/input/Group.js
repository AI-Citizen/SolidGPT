import classNames from 'classnames';
import * as React from 'react';
import { useContext, useMemo } from 'react';
import warning from '../_util/warning';
import { ConfigContext } from '../config-provider';
import { FormItemInputContext } from '../form/context';
import useStyle from './style';
const Group = props => {
  const {
    getPrefixCls,
    direction
  } = useContext(ConfigContext);
  const {
    prefixCls: customizePrefixCls,
    className
  } = props;
  const prefixCls = getPrefixCls('input-group', customizePrefixCls);
  const inputPrefixCls = getPrefixCls('input');
  const [wrapSSR, hashId] = useStyle(inputPrefixCls);
  const cls = classNames(prefixCls, {
    [`${prefixCls}-lg`]: props.size === 'large',
    [`${prefixCls}-sm`]: props.size === 'small',
    [`${prefixCls}-compact`]: props.compact,
    [`${prefixCls}-rtl`]: direction === 'rtl'
  }, hashId, className);
  const formItemContext = useContext(FormItemInputContext);
  const groupFormItemContext = useMemo(() => Object.assign(Object.assign({}, formItemContext), {
    isFormItemInput: false
  }), [formItemContext]);
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV !== "production" ? warning(false, 'Input.Group', `'Input.Group' is deprecated. Please use 'Space.Compact' instead.`) : void 0;
  }
  return wrapSSR( /*#__PURE__*/React.createElement("span", {
    className: cls,
    style: props.style,
    onMouseEnter: props.onMouseEnter,
    onMouseLeave: props.onMouseLeave,
    onFocus: props.onFocus,
    onBlur: props.onBlur
  }, /*#__PURE__*/React.createElement(FormItemInputContext.Provider, {
    value: groupFormItemContext
  }, props.children)));
};
export default Group;