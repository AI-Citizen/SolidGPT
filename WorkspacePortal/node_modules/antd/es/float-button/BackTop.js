var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import VerticalAlignTopOutlined from "@ant-design/icons/es/icons/VerticalAlignTopOutlined";
import classNames from 'classnames';
import CSSMotion from 'rc-motion';
import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import FloatButton, { floatButtonPrefixCls } from './FloatButton';
import { ConfigContext } from '../config-provider';
import getScroll from '../_util/getScroll';
import scrollTo from '../_util/scrollTo';
import throttleByAnimationFrame from '../_util/throttleByAnimationFrame';
import FloatButtonGroupContext from './context';
import useStyle from './style';
const BackTop = props => {
  const {
      prefixCls: customizePrefixCls,
      className,
      type = 'default',
      shape = 'circle',
      visibilityHeight = 400,
      icon = /*#__PURE__*/React.createElement(VerticalAlignTopOutlined, null),
      target,
      onClick,
      duration = 450
    } = props,
    restProps = __rest(props, ["prefixCls", "className", "type", "shape", "visibilityHeight", "icon", "target", "onClick", "duration"]);
  const [visible, setVisible] = useState(visibilityHeight === 0);
  const ref = useRef(null);
  const getDefaultTarget = () => ref.current && ref.current.ownerDocument ? ref.current.ownerDocument : window;
  const handleScroll = throttleByAnimationFrame(e => {
    const scrollTop = getScroll(e.target, true);
    setVisible(scrollTop >= visibilityHeight);
  });
  useEffect(() => {
    const getTarget = target || getDefaultTarget;
    const container = getTarget();
    handleScroll({
      target: container
    });
    container === null || container === void 0 ? void 0 : container.addEventListener('scroll', handleScroll);
    return () => {
      handleScroll.cancel();
      container === null || container === void 0 ? void 0 : container.removeEventListener('scroll', handleScroll);
    };
  }, [target]);
  const scrollToTop = e => {
    scrollTo(0, {
      getContainer: target || getDefaultTarget,
      duration
    });
    onClick === null || onClick === void 0 ? void 0 : onClick(e);
  };
  const {
    getPrefixCls
  } = useContext(ConfigContext);
  const prefixCls = getPrefixCls(floatButtonPrefixCls, customizePrefixCls);
  const rootPrefixCls = getPrefixCls();
  const [wrapSSR] = useStyle(prefixCls);
  const groupShape = useContext(FloatButtonGroupContext);
  const mergeShape = groupShape || shape;
  const contentProps = Object.assign({
    prefixCls,
    icon,
    type,
    shape: mergeShape
  }, restProps);
  return wrapSSR( /*#__PURE__*/React.createElement(CSSMotion, {
    visible: visible,
    motionName: `${rootPrefixCls}-fade`
  }, _ref => {
    let {
      className: motionClassName
    } = _ref;
    return /*#__PURE__*/React.createElement(FloatButton, Object.assign({
      ref: ref
    }, contentProps, {
      onClick: scrollToTop,
      className: classNames(className, motionClassName)
    }));
  }));
};
if (process.env.NODE_ENV !== 'production') {
  BackTop.displayName = 'BackTop';
}
export default /*#__PURE__*/memo(BackTop);