import * as React from 'react';
import SliderContext from '../context';
import Track from './Track';
import { getIndex } from '../util';
export default function Tracks(props) {
  var prefixCls = props.prefixCls,
    style = props.style,
    values = props.values,
    startPoint = props.startPoint,
    onStartMove = props.onStartMove;
  var _React$useContext = React.useContext(SliderContext),
    included = _React$useContext.included,
    range = _React$useContext.range,
    min = _React$useContext.min;
  var trackList = React.useMemo(function () {
    if (!range) {
      // null value do not have track
      if (values.length === 0) {
        return [];
      }
      var startValue = startPoint !== null && startPoint !== void 0 ? startPoint : min;
      var endValue = values[0];
      return [{
        start: Math.min(startValue, endValue),
        end: Math.max(startValue, endValue)
      }];
    }
    // Multiple
    var list = [];
    for (var i = 0; i < values.length - 1; i += 1) {
      list.push({
        start: values[i],
        end: values[i + 1]
      });
    }
    return list;
  }, [values, range, startPoint, min]);
  return included ? trackList.map(function (_ref, index) {
    var start = _ref.start,
      end = _ref.end;
    return /*#__PURE__*/React.createElement(Track, {
      index: index,
      prefixCls: prefixCls,
      style: getIndex(style, index),
      start: start,
      end: end,
      key: index,
      onStartMove: onStartMove
    });
  }) : null;
}