import _extends from "@babel/runtime/helpers/esm/extends";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import * as React from 'react';
import { createPortal } from 'react-dom';
import { CSSMotionList } from 'rc-motion';
import classNames from 'classnames';
import Notice from './Notice';
// ant-notification ant-notification-topRight
var Notifications = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var _props$prefixCls = props.prefixCls,
    prefixCls = _props$prefixCls === void 0 ? 'rc-notification' : _props$prefixCls,
    container = props.container,
    motion = props.motion,
    maxCount = props.maxCount,
    className = props.className,
    style = props.style,
    onAllRemoved = props.onAllRemoved;
  var _React$useState = React.useState([]),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    configList = _React$useState2[0],
    setConfigList = _React$useState2[1];
  // ======================== Close =========================
  var onNoticeClose = function onNoticeClose(key) {
    var _config$onClose;
    // Trigger close event
    var config = configList.find(function (item) {
      return item.key === key;
    });
    config === null || config === void 0 ? void 0 : (_config$onClose = config.onClose) === null || _config$onClose === void 0 ? void 0 : _config$onClose.call(config);
    setConfigList(function (list) {
      return list.filter(function (item) {
        return item.key !== key;
      });
    });
  };
  // ========================= Refs =========================
  React.useImperativeHandle(ref, function () {
    return {
      open: function open(config) {
        setConfigList(function (list) {
          var clone = _toConsumableArray(list);
          // Replace if exist
          var index = clone.findIndex(function (item) {
            return item.key === config.key;
          });
          var innerConfig = _objectSpread({}, config);
          if (index >= 0) {
            var _list$index;
            innerConfig.times = (((_list$index = list[index]) === null || _list$index === void 0 ? void 0 : _list$index.times) || 0) + 1;
            clone[index] = innerConfig;
          } else {
            innerConfig.times = 0;
            clone.push(innerConfig);
          }
          if (maxCount > 0 && clone.length > maxCount) {
            clone = clone.slice(-maxCount);
          }
          return clone;
        });
      },
      close: function close(key) {
        onNoticeClose(key);
      },
      destroy: function destroy() {
        setConfigList([]);
      }
    };
  });
  // ====================== Placements ======================
  var _React$useState3 = React.useState({}),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    placements = _React$useState4[0],
    setPlacements = _React$useState4[1];
  React.useEffect(function () {
    var nextPlacements = {};
    configList.forEach(function (config) {
      var _config$placement = config.placement,
        placement = _config$placement === void 0 ? 'topRight' : _config$placement;
      if (placement) {
        nextPlacements[placement] = nextPlacements[placement] || [];
        nextPlacements[placement].push(config);
      }
    });
    // Fill exist placements to avoid empty list causing remove without motion
    Object.keys(placements).forEach(function (placement) {
      nextPlacements[placement] = nextPlacements[placement] || [];
    });
    setPlacements(nextPlacements);
  }, [configList]);
  // Clean up container if all notices fade out
  var onAllNoticeRemoved = function onAllNoticeRemoved(placement) {
    setPlacements(function (originPlacements) {
      var clone = _objectSpread({}, originPlacements);
      var list = clone[placement] || [];
      if (!list.length) {
        delete clone[placement];
      }
      return clone;
    });
  };
  // Effect tell that placements is empty now
  var emptyRef = React.useRef(false);
  React.useEffect(function () {
    if (Object.keys(placements).length > 0) {
      emptyRef.current = true;
    } else if (emptyRef.current) {
      // Trigger only when from exist to empty
      onAllRemoved === null || onAllRemoved === void 0 ? void 0 : onAllRemoved();
      emptyRef.current = false;
    }
  }, [placements]);
  // ======================== Render ========================
  if (!container) {
    return null;
  }
  var placementList = Object.keys(placements);
  return /*#__PURE__*/createPortal( /*#__PURE__*/React.createElement(React.Fragment, null, placementList.map(function (placement) {
    var placementConfigList = placements[placement];
    var keys = placementConfigList.map(function (config) {
      return {
        config: config,
        key: config.key
      };
    });
    var placementMotion = typeof motion === 'function' ? motion(placement) : motion;
    return /*#__PURE__*/React.createElement(CSSMotionList, _extends({
      key: placement,
      className: classNames(prefixCls, "".concat(prefixCls, "-").concat(placement), className === null || className === void 0 ? void 0 : className(placement)),
      style: style === null || style === void 0 ? void 0 : style(placement),
      keys: keys,
      motionAppear: true
    }, placementMotion, {
      onAllRemoved: function onAllRemoved() {
        onAllNoticeRemoved(placement);
      }
    }), function (_ref, nodeRef) {
      var config = _ref.config,
        motionClassName = _ref.className,
        motionStyle = _ref.style;
      var key = config.key,
        times = config.times;
      var configClassName = config.className,
        configStyle = config.style;
      return /*#__PURE__*/React.createElement(Notice, _extends({}, config, {
        ref: nodeRef,
        prefixCls: prefixCls,
        className: classNames(motionClassName, configClassName),
        style: _objectSpread(_objectSpread({}, motionStyle), configStyle),
        times: times,
        key: key,
        eventKey: key,
        onNoticeClose: onNoticeClose
      }));
    });
  })), container);
});
if (process.env.NODE_ENV !== 'production') {
  Notifications.displayName = 'Notifications';
}
export default Notifications;