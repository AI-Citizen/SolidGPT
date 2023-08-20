import * as React from 'react';
import { SpaceContext } from './context';
const Item = _ref => {
  let {
    className,
    direction,
    index,
    marginDirection,
    children,
    split,
    wrap,
    style: customStyle
  } = _ref;
  const {
    horizontalSize,
    verticalSize,
    latestIndex,
    supportFlexGap
  } = React.useContext(SpaceContext);
  let style = {};
  if (!supportFlexGap) {
    if (direction === 'vertical') {
      if (index < latestIndex) {
        style = {
          marginBottom: horizontalSize / (split ? 2 : 1)
        };
      }
    } else {
      style = Object.assign(Object.assign({}, index < latestIndex && {
        [marginDirection]: horizontalSize / (split ? 2 : 1)
      }), wrap && {
        paddingBottom: verticalSize
      });
    }
  }
  if (children === null || children === undefined) {
    return null;
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: className,
    style: Object.assign(Object.assign({}, style), customStyle)
  }, children), index < latestIndex && split && /*#__PURE__*/React.createElement("span", {
    className: `${className}-split`,
    style: style
  }, split));
};
export default Item;