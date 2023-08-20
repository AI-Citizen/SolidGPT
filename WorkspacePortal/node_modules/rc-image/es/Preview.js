import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _extends from "@babel/runtime/helpers/esm/extends";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["fallback", "src", "imgRef"],
  _excluded2 = ["prefixCls", "src", "alt", "fallback", "movable", "onClose", "visible", "icons", "rootClassName", "closeIcon", "getContainer", "current", "count", "countRender", "scaleStep", "minScale", "maxScale", "transitionName", "maskTransitionName", "imageRender", "imgCommonProps", "toolbarRender", "onTransform", "onChange"];
import classnames from 'classnames';
import Dialog from 'rc-dialog';
import addEventListener from "rc-util/es/Dom/addEventListener";
import KeyCode from "rc-util/es/KeyCode";
import { warning } from "rc-util/es/warning";
import React, { useContext, useEffect, useRef, useState } from 'react';
import { PreviewGroupContext } from "./context";
import getFixScaleEleTransPosition from "./getFixScaleEleTransPosition";
import useImageTransform from "./hooks/useImageTransform";
import useStatus from "./hooks/useStatus";
import Operations from "./Operations";
import { BASE_SCALE_RATIO, WHEEL_MAX_SCALE_RATIO } from "./previewConfig";
var PreviewImage = function PreviewImage(_ref) {
  var fallback = _ref.fallback,
    src = _ref.src,
    imgRef = _ref.imgRef,
    props = _objectWithoutProperties(_ref, _excluded);
  var _useStatus = useStatus({
      src: src,
      fallback: fallback
    }),
    _useStatus2 = _slicedToArray(_useStatus, 2),
    getImgRef = _useStatus2[0],
    srcAndOnload = _useStatus2[1];
  return /*#__PURE__*/React.createElement("img", _extends({
    ref: function ref(_ref2) {
      imgRef.current = _ref2;
      getImgRef(_ref2);
    }
  }, props, srcAndOnload));
};
var Preview = function Preview(props) {
  var prefixCls = props.prefixCls,
    src = props.src,
    alt = props.alt,
    fallback = props.fallback,
    _props$movable = props.movable,
    movable = _props$movable === void 0 ? true : _props$movable,
    onClose = props.onClose,
    visible = props.visible,
    _props$icons = props.icons,
    icons = _props$icons === void 0 ? {} : _props$icons,
    rootClassName = props.rootClassName,
    closeIcon = props.closeIcon,
    getContainer = props.getContainer,
    _props$current = props.current,
    current = _props$current === void 0 ? 0 : _props$current,
    _props$count = props.count,
    count = _props$count === void 0 ? 1 : _props$count,
    countRender = props.countRender,
    _props$scaleStep = props.scaleStep,
    scaleStep = _props$scaleStep === void 0 ? 0.5 : _props$scaleStep,
    _props$minScale = props.minScale,
    minScale = _props$minScale === void 0 ? 1 : _props$minScale,
    _props$maxScale = props.maxScale,
    maxScale = _props$maxScale === void 0 ? 50 : _props$maxScale,
    _props$transitionName = props.transitionName,
    transitionName = _props$transitionName === void 0 ? 'zoom' : _props$transitionName,
    _props$maskTransition = props.maskTransitionName,
    maskTransitionName = _props$maskTransition === void 0 ? 'fade' : _props$maskTransition,
    imageRender = props.imageRender,
    imgCommonProps = props.imgCommonProps,
    toolbarRender = props.toolbarRender,
    onTransform = props.onTransform,
    onChange = props.onChange,
    restProps = _objectWithoutProperties(props, _excluded2);
  var imgRef = useRef();
  var downPositionRef = useRef({
    deltaX: 0,
    deltaY: 0,
    transformX: 0,
    transformY: 0
  });
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isMoving = _useState2[0],
    setMoving = _useState2[1];
  var groupContext = useContext(PreviewGroupContext);
  var showLeftOrRightSwitches = groupContext && count > 1;
  var showOperationsProgress = groupContext && count >= 1;
  var _useImageTransform = useImageTransform(imgRef, minScale, maxScale, onTransform),
    transform = _useImageTransform.transform,
    resetTransform = _useImageTransform.resetTransform,
    updateTransform = _useImageTransform.updateTransform,
    dispatchZoomChange = _useImageTransform.dispatchZoomChange;
  var _useState3 = useState(true),
    _useState4 = _slicedToArray(_useState3, 2),
    enableTransition = _useState4[0],
    setEnableTransition = _useState4[1];
  var rotate = transform.rotate,
    scale = transform.scale,
    x = transform.x,
    y = transform.y;
  var wrapClassName = classnames(_defineProperty({}, "".concat(prefixCls, "-moving"), isMoving));
  useEffect(function () {
    if (!enableTransition) {
      setEnableTransition(true);
    }
  }, [enableTransition]);
  var onAfterClose = function onAfterClose() {
    resetTransform('close');
  };
  var onZoomIn = function onZoomIn() {
    dispatchZoomChange(BASE_SCALE_RATIO + scaleStep, 'zoomIn');
  };
  var onZoomOut = function onZoomOut() {
    dispatchZoomChange(BASE_SCALE_RATIO / (BASE_SCALE_RATIO + scaleStep), 'zoomOut');
  };
  var onRotateRight = function onRotateRight() {
    updateTransform({
      rotate: rotate + 90
    }, 'rotateRight');
  };
  var onRotateLeft = function onRotateLeft() {
    updateTransform({
      rotate: rotate - 90
    }, 'rotateLeft');
  };
  var onFlipX = function onFlipX() {
    updateTransform({
      flipX: !transform.flipX
    }, 'flipX');
  };
  var onFlipY = function onFlipY() {
    updateTransform({
      flipY: !transform.flipY
    }, 'flipY');
  };
  var onSwitchLeft = function onSwitchLeft(event) {
    event === null || event === void 0 ? void 0 : event.preventDefault();
    event === null || event === void 0 ? void 0 : event.stopPropagation();
    if (current > 0) {
      setEnableTransition(false);
      resetTransform('prev');
      onChange === null || onChange === void 0 ? void 0 : onChange(current - 1, current);
    }
  };
  var onSwitchRight = function onSwitchRight(event) {
    event === null || event === void 0 ? void 0 : event.preventDefault();
    event === null || event === void 0 ? void 0 : event.stopPropagation();
    if (current < count - 1) {
      setEnableTransition(false);
      resetTransform('next');
      onChange === null || onChange === void 0 ? void 0 : onChange(current + 1, current);
    }
  };
  var onMouseUp = function onMouseUp() {
    if (visible && isMoving) {
      setMoving(false);
      /** No need to restore the position when the picture is not moved, So as not to interfere with the click */
      var _downPositionRef$curr = downPositionRef.current,
        transformX = _downPositionRef$curr.transformX,
        transformY = _downPositionRef$curr.transformY;
      var hasChangedPosition = x !== transformX && y !== transformY;
      if (!hasChangedPosition) {
        return;
      }
      var width = imgRef.current.offsetWidth * scale;
      var height = imgRef.current.offsetHeight * scale;
      // eslint-disable-next-line @typescript-eslint/no-shadow
      var _imgRef$current$getBo = imgRef.current.getBoundingClientRect(),
        left = _imgRef$current$getBo.left,
        top = _imgRef$current$getBo.top;
      var isRotate = rotate % 180 !== 0;
      var fixState = getFixScaleEleTransPosition(isRotate ? height : width, isRotate ? width : height, left, top);
      if (fixState) {
        updateTransform(_objectSpread({}, fixState), 'dragRebound');
      }
    }
  };
  var onMouseDown = function onMouseDown(event) {
    // Only allow main button
    if (!movable || event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    downPositionRef.current = {
      deltaX: event.pageX - transform.x,
      deltaY: event.pageY - transform.y,
      transformX: transform.x,
      transformY: transform.y
    };
    setMoving(true);
  };
  var onMouseMove = function onMouseMove(event) {
    if (visible && isMoving) {
      updateTransform({
        x: event.pageX - downPositionRef.current.deltaX,
        y: event.pageY - downPositionRef.current.deltaY
      }, 'move');
    }
  };
  var onWheel = function onWheel(event) {
    if (!visible || event.deltaY == 0) return;
    // Scale ratio depends on the deltaY size
    var scaleRatio = Math.abs(event.deltaY / 100);
    // Limit the maximum scale ratio
    var mergedScaleRatio = Math.min(scaleRatio, WHEEL_MAX_SCALE_RATIO);
    // Scale the ratio each time
    var ratio = BASE_SCALE_RATIO + mergedScaleRatio * scaleStep;
    if (event.deltaY > 0) {
      ratio = BASE_SCALE_RATIO / ratio;
    }
    dispatchZoomChange(ratio, 'wheel', event.clientX, event.clientY);
  };
  var onKeyDown = function onKeyDown(event) {
    if (!visible || !showLeftOrRightSwitches) return;
    if (event.keyCode === KeyCode.LEFT) {
      onSwitchLeft();
    } else if (event.keyCode === KeyCode.RIGHT) {
      onSwitchRight();
    }
  };
  var onDoubleClick = function onDoubleClick(event) {
    if (visible) {
      if (scale !== 1) {
        updateTransform({
          x: 0,
          y: 0,
          scale: 1
        }, 'doubleClick');
      } else {
        dispatchZoomChange(BASE_SCALE_RATIO + scaleStep, 'doubleClick', event.clientX, event.clientY);
      }
    }
  };
  useEffect(function () {
    var onTopMouseUpListener;
    var onTopMouseMoveListener;
    var onMouseUpListener;
    var onMouseMoveListener;
    if (movable) {
      onMouseUpListener = addEventListener(window, 'mouseup', onMouseUp, false);
      onMouseMoveListener = addEventListener(window, 'mousemove', onMouseMove, false);
      try {
        // Resolve if in iframe lost event
        /* istanbul ignore next */
        if (window.top !== window.self) {
          onTopMouseUpListener = addEventListener(window.top, 'mouseup', onMouseUp, false);
          onTopMouseMoveListener = addEventListener(window.top, 'mousemove', onMouseMove, false);
        }
      } catch (error) {
        /* istanbul ignore next */
        warning(false, "[rc-image] ".concat(error));
      }
    }
    return function () {
      var _onMouseUpListener, _onMouseMoveListener, _onTopMouseUpListener, _onTopMouseMoveListen;
      (_onMouseUpListener = onMouseUpListener) === null || _onMouseUpListener === void 0 ? void 0 : _onMouseUpListener.remove();
      (_onMouseMoveListener = onMouseMoveListener) === null || _onMouseMoveListener === void 0 ? void 0 : _onMouseMoveListener.remove();
      /* istanbul ignore next */
      (_onTopMouseUpListener = onTopMouseUpListener) === null || _onTopMouseUpListener === void 0 ? void 0 : _onTopMouseUpListener.remove();
      /* istanbul ignore next */
      (_onTopMouseMoveListen = onTopMouseMoveListener) === null || _onTopMouseMoveListen === void 0 ? void 0 : _onTopMouseMoveListen.remove();
    };
  }, [visible, isMoving, x, y, rotate, movable]);
  useEffect(function () {
    var onKeyDownListener = addEventListener(window, 'keydown', onKeyDown, false);
    return function () {
      onKeyDownListener.remove();
    };
  }, [visible, showLeftOrRightSwitches, current]);
  var imgNode = /*#__PURE__*/React.createElement(PreviewImage, _extends({}, imgCommonProps, {
    width: props.width,
    height: props.height,
    imgRef: imgRef,
    className: "".concat(prefixCls, "-img"),
    alt: alt,
    style: {
      transform: "translate3d(".concat(transform.x, "px, ").concat(transform.y, "px, 0) scale3d(").concat(transform.flipX ? '-' : '').concat(scale, ", ").concat(transform.flipY ? '-' : '').concat(scale, ", 1) rotate(").concat(rotate, "deg)"),
      transitionDuration: !enableTransition && '0s'
    },
    fallback: fallback,
    src: src,
    onWheel: onWheel,
    onMouseDown: onMouseDown,
    onDoubleClick: onDoubleClick
  }));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dialog, _extends({
    transitionName: transitionName,
    maskTransitionName: maskTransitionName,
    closable: false,
    keyboard: true,
    prefixCls: prefixCls,
    onClose: onClose,
    visible: visible,
    wrapClassName: wrapClassName,
    rootClassName: rootClassName,
    getContainer: getContainer
  }, restProps, {
    afterClose: onAfterClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "".concat(prefixCls, "-img-wrapper")
  }, imageRender ? imageRender(imgNode, _objectSpread({
    transform: transform
  }, groupContext ? {
    current: current
  } : {})) : imgNode)), /*#__PURE__*/React.createElement(Operations, {
    visible: visible,
    transform: transform,
    maskTransitionName: maskTransitionName,
    closeIcon: closeIcon,
    getContainer: getContainer,
    prefixCls: prefixCls,
    rootClassName: rootClassName,
    icons: icons,
    countRender: countRender,
    showSwitch: showLeftOrRightSwitches,
    showProgress: showOperationsProgress,
    current: current,
    count: count,
    scale: scale,
    minScale: minScale,
    maxScale: maxScale,
    toolbarRender: toolbarRender,
    onSwitchLeft: onSwitchLeft,
    onSwitchRight: onSwitchRight,
    onZoomIn: onZoomIn,
    onZoomOut: onZoomOut,
    onRotateRight: onRotateRight,
    onRotateLeft: onRotateLeft,
    onFlipX: onFlipX,
    onFlipY: onFlipY,
    onClose: onClose
  }));
};
export default Preview;