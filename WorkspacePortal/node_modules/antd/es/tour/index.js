'use client';

var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import RCTour from '@rc-component/tour';
import classNames from 'classnames';
import React, { useContext } from 'react';
import getPlacements from '../_util/placements';
import { ConfigContext } from '../config-provider';
import theme from '../theme';
import PurePanel from './PurePanel';
import TourPanel from './panelRender';
import useStyle from './style';
import useMergedType from './useMergedType';
const Tour = props => {
  const {
      prefixCls: customizePrefixCls,
      current,
      defaultCurrent,
      type,
      rootClassName,
      indicatorsRender,
      steps
    } = props,
    restProps = __rest(props, ["prefixCls", "current", "defaultCurrent", "type", "rootClassName", "indicatorsRender", "steps"]);
  const {
    getPrefixCls,
    direction
  } = useContext(ConfigContext);
  const prefixCls = getPrefixCls('tour', customizePrefixCls);
  const [wrapSSR, hashId] = useStyle(prefixCls);
  const {
    token
  } = theme.useToken();
  const {
    currentMergedType,
    updateInnerCurrent
  } = useMergedType({
    defaultType: type,
    steps,
    current,
    defaultCurrent
  });
  const builtinPlacements = getPlacements({
    arrowPointAtCenter: true,
    autoAdjustOverflow: true,
    offset: token.marginXXS,
    arrowWidth: token.sizePopupArrow,
    borderRadius: token.borderRadius
  });
  const customClassName = classNames({
    [`${prefixCls}-primary`]: currentMergedType === 'primary',
    [`${prefixCls}-rtl`]: direction === 'rtl'
  }, hashId, rootClassName);
  const mergedRenderPanel = (stepProps, stepCurrent) => /*#__PURE__*/React.createElement(TourPanel, {
    type: type,
    stepProps: stepProps,
    current: stepCurrent,
    indicatorsRender: indicatorsRender
  });
  const onStepChange = stepCurrent => {
    var _a;
    updateInnerCurrent(stepCurrent);
    (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, stepCurrent);
  };
  return wrapSSR( /*#__PURE__*/React.createElement(RCTour, Object.assign({}, restProps, {
    rootClassName: customClassName,
    prefixCls: prefixCls,
    current: current,
    defaultCurrent: defaultCurrent,
    animated: true,
    renderPanel: mergedRenderPanel,
    builtinPlacements: builtinPlacements,
    onChange: onStepChange,
    steps: steps
  })));
};
if (process.env.NODE_ENV !== 'production') {
  Tour.displayName = 'Tour';
}
Tour._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;
export default Tour;