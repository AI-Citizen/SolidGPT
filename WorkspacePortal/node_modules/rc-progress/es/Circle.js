import _extends from "@babel/runtime/helpers/esm/extends";
import _typeof from "@babel/runtime/helpers/esm/typeof";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["id", "prefixCls", "steps", "strokeWidth", "trailWidth", "gapDegree", "gapPosition", "trailColor", "strokeLinecap", "style", "className", "strokeColor", "percent"];
import * as React from 'react';
import classNames from 'classnames';
import { defaultProps, useTransitionDuration } from './common';
import useId from './hooks/useId';
function stripPercentToNumber(percent) {
  return +percent.replace('%', '');
}
function toArray(value) {
  var mergedValue = value !== null && value !== void 0 ? value : [];
  return Array.isArray(mergedValue) ? mergedValue : [mergedValue];
}
var VIEW_BOX_SIZE = 100;
var getCircleStyle = function getCircleStyle(perimeter, perimeterWithoutGap, offset, percent, rotateDeg, gapDegree, gapPosition, strokeColor, strokeLinecap, strokeWidth) {
  var stepSpace = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : 0;
  var offsetDeg = offset / 100 * 360 * ((360 - gapDegree) / 360);
  var positionDeg = gapDegree === 0 ? 0 : {
    bottom: 0,
    top: 180,
    left: 90,
    right: -90
  }[gapPosition];
  var strokeDashoffset = (100 - percent) / 100 * perimeterWithoutGap;
  // Fix percent accuracy when strokeLinecap is round
  // https://github.com/ant-design/ant-design/issues/35009
  if (strokeLinecap === 'round' && percent !== 100) {
    strokeDashoffset += strokeWidth / 2;
    // when percent is small enough (<= 1%), keep smallest value to avoid it's disappearance
    if (strokeDashoffset >= perimeterWithoutGap) {
      strokeDashoffset = perimeterWithoutGap - 0.01;
    }
  }
  return {
    stroke: typeof strokeColor === 'string' ? strokeColor : undefined,
    strokeDasharray: "".concat(perimeterWithoutGap, "px ").concat(perimeter),
    strokeDashoffset: strokeDashoffset + stepSpace,
    transform: "rotate(".concat(rotateDeg + offsetDeg + positionDeg, "deg)"),
    transformOrigin: '0 0',
    transition: 'stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s, stroke-width .06s ease .3s, opacity .3s ease 0s',
    fillOpacity: 0
  };
};
var Circle = function Circle(props) {
  var _defaultProps$props = _objectSpread(_objectSpread({}, defaultProps), props),
    id = _defaultProps$props.id,
    prefixCls = _defaultProps$props.prefixCls,
    steps = _defaultProps$props.steps,
    strokeWidth = _defaultProps$props.strokeWidth,
    trailWidth = _defaultProps$props.trailWidth,
    _defaultProps$props$g = _defaultProps$props.gapDegree,
    gapDegree = _defaultProps$props$g === void 0 ? 0 : _defaultProps$props$g,
    gapPosition = _defaultProps$props.gapPosition,
    trailColor = _defaultProps$props.trailColor,
    strokeLinecap = _defaultProps$props.strokeLinecap,
    style = _defaultProps$props.style,
    className = _defaultProps$props.className,
    strokeColor = _defaultProps$props.strokeColor,
    percent = _defaultProps$props.percent,
    restProps = _objectWithoutProperties(_defaultProps$props, _excluded);
  var mergedId = useId(id);
  var gradientId = "".concat(mergedId, "-gradient");
  var radius = VIEW_BOX_SIZE / 2 - strokeWidth / 2;
  var perimeter = Math.PI * 2 * radius;
  var rotateDeg = gapDegree > 0 ? 90 + gapDegree / 2 : -90;
  var perimeterWithoutGap = perimeter * ((360 - gapDegree) / 360);
  var _ref = _typeof(steps) === 'object' ? steps : {
      count: steps,
      space: 2
    },
    stepCount = _ref.count,
    stepSpace = _ref.space;
  var circleStyle = getCircleStyle(perimeter, perimeterWithoutGap, 0, 100, rotateDeg, gapDegree, gapPosition, trailColor, strokeLinecap, strokeWidth);
  var percentList = toArray(percent);
  var strokeColorList = toArray(strokeColor);
  var gradient = strokeColorList.find(function (color) {
    return color && _typeof(color) === 'object';
  });
  var paths = useTransitionDuration();
  var getStokeList = function getStokeList() {
    var stackPtg = 0;
    return percentList.map(function (ptg, index) {
      var color = strokeColorList[index] || strokeColorList[strokeColorList.length - 1];
      var stroke = color && _typeof(color) === 'object' ? "url(#".concat(gradientId, ")") : undefined;
      var circleStyleForStack = getCircleStyle(perimeter, perimeterWithoutGap, stackPtg, ptg, rotateDeg, gapDegree, gapPosition, color, strokeLinecap, strokeWidth);
      stackPtg += ptg;
      return /*#__PURE__*/React.createElement("circle", {
        key: index,
        className: "".concat(prefixCls, "-circle-path"),
        r: radius,
        cx: 0,
        cy: 0,
        stroke: stroke,
        strokeLinecap: strokeLinecap,
        strokeWidth: strokeWidth,
        opacity: ptg === 0 ? 0 : 1,
        style: circleStyleForStack,
        ref: function ref(elem) {
          // https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
          // React will call the ref callback with the DOM element when the component mounts,
          // and call it with `null` when it unmounts.
          // Refs are guaranteed to be up-to-date before componentDidMount or componentDidUpdate fires.
          paths[index] = elem;
        }
      });
    }).reverse();
  };
  var getStepStokeList = function getStepStokeList() {
    // only show the first percent when pass steps
    var current = Math.round(stepCount * (percentList[0] / 100));
    var stepPtg = 100 / stepCount;
    var stackPtg = 0;
    return new Array(stepCount).fill(null).map(function (_, index) {
      var color = index <= current - 1 ? strokeColorList[0] : trailColor;
      var stroke = color && _typeof(color) === 'object' ? "url(#".concat(gradientId, ")") : undefined;
      var circleStyleForStack = getCircleStyle(perimeter, perimeterWithoutGap, stackPtg, stepPtg, rotateDeg, gapDegree, gapPosition, color, 'butt', strokeWidth, stepSpace);
      stackPtg += (perimeterWithoutGap - circleStyleForStack.strokeDashoffset + stepSpace) * 100 / perimeterWithoutGap;
      return /*#__PURE__*/React.createElement("circle", {
        key: index,
        className: "".concat(prefixCls, "-circle-path"),
        r: radius,
        cx: 0,
        cy: 0,
        stroke: stroke
        // strokeLinecap={strokeLinecap}
        ,
        strokeWidth: strokeWidth,
        opacity: 1,
        style: circleStyleForStack,
        ref: function ref(elem) {
          paths[index] = elem;
        }
      });
    });
  };
  return /*#__PURE__*/React.createElement("svg", _extends({
    className: classNames("".concat(prefixCls, "-circle"), className),
    viewBox: "".concat(-VIEW_BOX_SIZE / 2, " ").concat(-VIEW_BOX_SIZE / 2, " ").concat(VIEW_BOX_SIZE, " ").concat(VIEW_BOX_SIZE),
    style: style,
    id: id,
    role: "presentation"
  }, restProps), gradient && /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: gradientId,
    x1: "100%",
    y1: "0%",
    x2: "0%",
    y2: "0%"
  }, Object.keys(gradient).sort(function (a, b) {
    return stripPercentToNumber(a) - stripPercentToNumber(b);
  }).map(function (key, index) {
    return /*#__PURE__*/React.createElement("stop", {
      key: index,
      offset: key,
      stopColor: gradient[key]
    });
  }))), !stepCount && /*#__PURE__*/React.createElement("circle", {
    className: "".concat(prefixCls, "-circle-trail"),
    r: radius,
    cx: 0,
    cy: 0,
    stroke: trailColor,
    strokeLinecap: strokeLinecap,
    strokeWidth: trailWidth || strokeWidth,
    style: circleStyle
  }), stepCount ? getStepStokeList() : getStokeList());
};
if (process.env.NODE_ENV !== 'production') {
  Circle.displayName = 'Circle';
}
export default Circle;