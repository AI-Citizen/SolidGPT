import * as React from 'react';
import useForceUpdate from '../_util/hooks/useForceUpdate';
import { cloneElement } from '../_util/reactNode';
import Statistic from './Statistic';
import { formatCountdown } from './utils';
const REFRESH_INTERVAL = 1000 / 30;
function getTime(value) {
  return new Date(value).getTime();
}
const Countdown = props => {
  const {
    value,
    format = 'HH:mm:ss',
    onChange,
    onFinish
  } = props;
  const forceUpdate = useForceUpdate();
  const countdown = React.useRef(null);
  const stopTimer = () => {
    onFinish === null || onFinish === void 0 ? void 0 : onFinish();
    if (countdown.current) {
      clearInterval(countdown.current);
      countdown.current = null;
    }
  };
  const syncTimer = () => {
    const timestamp = getTime(value);
    if (timestamp >= Date.now()) {
      countdown.current = setInterval(() => {
        forceUpdate();
        onChange === null || onChange === void 0 ? void 0 : onChange(timestamp - Date.now());
        if (timestamp < Date.now()) {
          stopTimer();
        }
      }, REFRESH_INTERVAL);
    }
  };
  React.useEffect(() => {
    syncTimer();
    return () => {
      if (countdown.current) {
        clearInterval(countdown.current);
        countdown.current = null;
      }
    };
  }, [value]);
  const formatter = (formatValue, config) => formatCountdown(formatValue, Object.assign(Object.assign({}, config), {
    format
  }));
  const valueRender = node => cloneElement(node, {
    title: undefined
  });
  return /*#__PURE__*/React.createElement(Statistic, Object.assign({}, props, {
    valueRender: valueRender,
    formatter: formatter
  }));
};
export default /*#__PURE__*/React.memo(Countdown);