'use client';

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
import { debounce } from 'throttle-debounce';
import { cloneElement, isValidElement } from '../_util/reactNode';
import warning from '../_util/warning';
import { ConfigContext } from '../config-provider';
import useStyle from './style/index';
const SpinSizes = ['small', 'default', 'large'];
// Render indicator
let defaultIndicator = null;
function renderIndicator(prefixCls, props) {
  const {
    indicator
  } = props;
  const dotClassName = `${prefixCls}-dot`;
  // should not be render default indicator when indicator value is null
  if (indicator === null) {
    return null;
  }
  if (isValidElement(indicator)) {
    return cloneElement(indicator, {
      className: classNames(indicator.props.className, dotClassName)
    });
  }
  if (isValidElement(defaultIndicator)) {
    return cloneElement(defaultIndicator, {
      className: classNames(defaultIndicator.props.className, dotClassName)
    });
  }
  return /*#__PURE__*/React.createElement("span", {
    className: classNames(dotClassName, `${prefixCls}-dot-spin`)
  }, /*#__PURE__*/React.createElement("i", {
    className: `${prefixCls}-dot-item`,
    key: 1
  }), /*#__PURE__*/React.createElement("i", {
    className: `${prefixCls}-dot-item`,
    key: 2
  }), /*#__PURE__*/React.createElement("i", {
    className: `${prefixCls}-dot-item`,
    key: 3
  }), /*#__PURE__*/React.createElement("i", {
    className: `${prefixCls}-dot-item`,
    key: 4
  }));
}
function shouldDelay(spinning, delay) {
  return !!spinning && !!delay && !isNaN(Number(delay));
}
const Spin = props => {
  const {
      spinPrefixCls: prefixCls,
      spinning: customSpinning = true,
      delay = 0,
      className,
      rootClassName,
      size = 'default',
      tip,
      wrapperClassName,
      style,
      children,
      hashId
    } = props,
    restProps = __rest(props, ["spinPrefixCls", "spinning", "delay", "className", "rootClassName", "size", "tip", "wrapperClassName", "style", "children", "hashId"]);
  const [spinning, setSpinning] = React.useState(() => customSpinning && !shouldDelay(customSpinning, delay));
  React.useEffect(() => {
    if (customSpinning) {
      const showSpinning = debounce(delay, () => {
        setSpinning(true);
      });
      showSpinning();
      return () => {
        var _a;
        (_a = showSpinning === null || showSpinning === void 0 ? void 0 : showSpinning.cancel) === null || _a === void 0 ? void 0 : _a.call(showSpinning);
      };
    }
    setSpinning(false);
  }, [delay, customSpinning]);
  const isNestedPattern = React.useMemo(() => typeof children !== 'undefined', [children]);
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV !== "production" ? warning(!tip || isNestedPattern, 'Spin', '`tip` only work in nest pattern.') : void 0;
  }
  const {
    direction,
    spin
  } = React.useContext(ConfigContext);
  const spinClassName = classNames(prefixCls, spin === null || spin === void 0 ? void 0 : spin.className, {
    [`${prefixCls}-sm`]: size === 'small',
    [`${prefixCls}-lg`]: size === 'large',
    [`${prefixCls}-spinning`]: spinning,
    [`${prefixCls}-show-text`]: !!tip,
    [`${prefixCls}-rtl`]: direction === 'rtl'
  }, className, rootClassName, hashId);
  const containerClassName = classNames(`${prefixCls}-container`, {
    [`${prefixCls}-blur`]: spinning
  });
  // fix https://fb.me/react-unknown-prop
  const divProps = omit(restProps, ['indicator', 'prefixCls']);
  const mergedStyle = Object.assign(Object.assign({}, spin === null || spin === void 0 ? void 0 : spin.style), style);
  const spinElement = /*#__PURE__*/React.createElement("div", Object.assign({}, divProps, {
    style: mergedStyle,
    className: spinClassName,
    "aria-live": "polite",
    "aria-busy": spinning
  }), renderIndicator(prefixCls, props), tip && isNestedPattern ? /*#__PURE__*/React.createElement("div", {
    className: `${prefixCls}-text`
  }, tip) : null);
  if (isNestedPattern) {
    return /*#__PURE__*/React.createElement("div", Object.assign({}, divProps, {
      className: classNames(`${prefixCls}-nested-loading`, wrapperClassName, hashId)
    }), spinning && /*#__PURE__*/React.createElement("div", {
      key: "loading"
    }, spinElement), /*#__PURE__*/React.createElement("div", {
      className: containerClassName,
      key: "container"
    }, children));
  }
  return spinElement;
};
const SpinFC = props => {
  const {
    prefixCls: customizePrefixCls
  } = props;
  const {
    getPrefixCls
  } = React.useContext(ConfigContext);
  const spinPrefixCls = getPrefixCls('spin', customizePrefixCls);
  const [wrapSSR, hashId] = useStyle(spinPrefixCls);
  const spinClassProps = Object.assign(Object.assign({}, props), {
    spinPrefixCls,
    hashId
  });
  return wrapSSR( /*#__PURE__*/React.createElement(Spin, Object.assign({}, spinClassProps)));
};
SpinFC.setDefaultIndicator = indicator => {
  defaultIndicator = indicator;
};
if (process.env.NODE_ENV !== 'production') {
  SpinFC.displayName = 'Spin';
}
export default SpinFC;