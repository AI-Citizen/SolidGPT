import useMergedState from "rc-util/es/hooks/useMergedState";
import { useLayoutEffect } from 'react';
/**
 * returns the merged type of a step or the default type.
 */
const useMergedType = _ref => {
  let {
    defaultType,
    steps = [],
    current,
    defaultCurrent
  } = _ref;
  var _a;
  const [innerCurrent, updateInnerCurrent] = useMergedState(defaultCurrent, {
    value: current
  });
  useLayoutEffect(() => {
    if (current === undefined) return;
    updateInnerCurrent(current);
  }, [current]);
  const innerType = typeof innerCurrent === 'number' ? (_a = steps[innerCurrent]) === null || _a === void 0 ? void 0 : _a.type : defaultType;
  const currentMergedType = innerType !== null && innerType !== void 0 ? innerType : defaultType;
  return {
    currentMergedType,
    updateInnerCurrent
  };
};
export default useMergedType;