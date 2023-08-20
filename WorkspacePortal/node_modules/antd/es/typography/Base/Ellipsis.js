import toArray from "rc-util/es/Children/toArray";
import useIsomorphicLayoutEffect from "rc-util/es/hooks/useLayoutEffect";
import * as React from 'react';
function cuttable(node) {
  const type = typeof node;
  return type === 'string' || type === 'number';
}
function getNodesLen(nodeList) {
  let totalLen = 0;
  nodeList.forEach(node => {
    if (cuttable(node)) {
      totalLen += String(node).length;
    } else {
      totalLen += 1;
    }
  });
  return totalLen;
}
function sliceNodes(nodeList, len) {
  let currLen = 0;
  const currentNodeList = [];
  for (let i = 0; i < nodeList.length; i += 1) {
    // Match to return
    if (currLen === len) {
      return currentNodeList;
    }
    const node = nodeList[i];
    const canCut = cuttable(node);
    const nodeLen = canCut ? String(node).length : 1;
    const nextLen = currLen + nodeLen;
    // Exceed but current not which means we need cut this
    // This will not happen on validate ReactElement
    if (nextLen > len) {
      const restLen = len - currLen;
      currentNodeList.push(String(node).slice(0, restLen));
      return currentNodeList;
    }
    currentNodeList.push(node);
    currLen = nextLen;
  }
  return nodeList;
}
const NONE = 0;
const PREPARE = 1;
const WALKING = 2;
const DONE_WITH_ELLIPSIS = 3;
const DONE_WITHOUT_ELLIPSIS = 4;
const Ellipsis = _ref => {
  let {
    enabledMeasure,
    children,
    text,
    width,
    fontSize,
    rows,
    onEllipsis
  } = _ref;
  const [[startLen, midLen, endLen], setCutLength] = React.useState([0, 0, 0]);
  const [walkingState, setWalkingState] = React.useState(NONE);
  const [singleRowHeight, setSingleRowHeight] = React.useState(0);
  const singleRowRef = React.useRef(null);
  const midRowRef = React.useRef(null);
  const nodeList = React.useMemo(() => toArray(text), [text]);
  const totalLen = React.useMemo(() => getNodesLen(nodeList), [nodeList]);
  const mergedChildren = React.useMemo(() => {
    if (!enabledMeasure || walkingState !== DONE_WITH_ELLIPSIS) {
      return children(nodeList, false);
    }
    return children(sliceNodes(nodeList, midLen), midLen < totalLen);
  }, [enabledMeasure, walkingState, children, nodeList, midLen, totalLen]);
  // ======================== Walk ========================
  useIsomorphicLayoutEffect(() => {
    if (enabledMeasure && width && fontSize && totalLen) {
      setWalkingState(PREPARE);
      setCutLength([0, Math.ceil(totalLen / 2), totalLen]);
    }
  }, [enabledMeasure, width, fontSize, text, totalLen, rows]);
  useIsomorphicLayoutEffect(() => {
    var _a;
    if (walkingState === PREPARE) {
      setSingleRowHeight(((_a = singleRowRef.current) === null || _a === void 0 ? void 0 : _a.offsetHeight) || 0);
    }
  }, [walkingState]);
  useIsomorphicLayoutEffect(() => {
    var _a, _b;
    if (singleRowHeight) {
      if (walkingState === PREPARE) {
        // Ignore if position is enough
        const midHeight = ((_a = midRowRef.current) === null || _a === void 0 ? void 0 : _a.offsetHeight) || 0;
        const maxHeight = rows * singleRowHeight;
        if (midHeight <= maxHeight) {
          setWalkingState(DONE_WITHOUT_ELLIPSIS);
          onEllipsis(false);
        } else {
          setWalkingState(WALKING);
        }
      } else if (walkingState === WALKING) {
        if (startLen !== endLen) {
          const midHeight = ((_b = midRowRef.current) === null || _b === void 0 ? void 0 : _b.offsetHeight) || 0;
          const maxHeight = rows * singleRowHeight;
          let nextStartLen = startLen;
          let nextEndLen = endLen;
          // We reach the last round
          if (startLen === endLen - 1) {
            nextEndLen = startLen;
          } else if (midHeight <= maxHeight) {
            nextStartLen = midLen;
          } else {
            nextEndLen = midLen;
          }
          const nextMidLen = Math.ceil((nextStartLen + nextEndLen) / 2);
          setCutLength([nextStartLen, nextMidLen, nextEndLen]);
        } else {
          setWalkingState(DONE_WITH_ELLIPSIS);
          onEllipsis(true);
        }
      }
    }
  }, [walkingState, startLen, endLen, rows, singleRowHeight]);
  // ======================= Render =======================
  const measureStyle = {
    width,
    whiteSpace: 'normal',
    margin: 0,
    padding: 0
  };
  const renderMeasure = (content, ref, style) => /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    ref: ref,
    style: Object.assign({
      position: 'fixed',
      display: 'block',
      left: 0,
      top: 0,
      zIndex: -9999,
      visibility: 'hidden',
      pointerEvents: 'none',
      fontSize: Math.floor(fontSize / 2) * 2
    }, style)
  }, content);
  const renderMeasureSlice = (len, ref) => {
    const sliceNodeList = sliceNodes(nodeList, len);
    return renderMeasure(children(sliceNodeList, true), ref, measureStyle);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, mergedChildren, enabledMeasure && walkingState !== DONE_WITH_ELLIPSIS && walkingState !== DONE_WITHOUT_ELLIPSIS && /*#__PURE__*/React.createElement(React.Fragment, null, renderMeasure('lg', singleRowRef, {
    wordBreak: 'keep-all',
    whiteSpace: 'nowrap'
  }), walkingState === PREPARE ? renderMeasure(children(nodeList, false), midRowRef, measureStyle) : renderMeasureSlice(midLen, midRowRef)));
};
if (process.env.NODE_ENV !== 'production') {
  Ellipsis.displayName = 'Ellipsis';
}
export default Ellipsis;