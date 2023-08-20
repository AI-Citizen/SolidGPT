'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _linear = require('./linear');

var _linear2 = _interopRequireDefault(_linear);

var _rectangle = require('./rectangle');

var _rectangle2 = _interopRequireDefault(_rectangle);

var _ops = require('./ops');

exports['default'] = function (_ref) {
  var data = _ref.data;
  var accessor = _ref.accessor;
  var width = _ref.width;
  var height = _ref.height;
  var _ref$gutter = _ref.gutter;
  var gutter = _ref$gutter === undefined ? 10 : _ref$gutter;
  var compute = _ref.compute;
  var _ref$min = _ref.min;
  var min = _ref$min === undefined ? 0 : _ref$min;
  var _ref$max = _ref.max;
  var max = _ref$max === undefined ? 0 : _ref$max;

  if (!accessor) {
    accessor = function (x) {
      return x;
    };
  }
  var last = 0;
  var data_ = [];

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var d = _step.value;

      var _accessor = accessor(d);

      var value = _accessor.value;
      var absolute = _accessor.absolute;

      var _ref2 = absolute ? [0, value || last] : [last, last + value];

      var _ref22 = _slicedToArray(_ref2, 2);

      var low = _ref22[0];
      var high = _ref22[1];

      var m = Math.min(low, high);
      var M = Math.max(low, high);
      min = Math.min(min, m);
      max = Math.max(max, M);
      last = high;

      data_.push({
        item: d,
        low: low,
        high: high,
        value: value != null ? value : high
      });
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator['return']) {
        _iterator['return']();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var n = data_.length;
  var barWidth = (width - gutter * (n - 1)) / n;
  var curves = [];
  var scale = (0, _linear2['default'])([min, max], [height, 0]);

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = data_.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _step2$value = _slicedToArray(_step2.value, 2);

      var i = _step2$value[0];
      var d = _step2$value[1];

      var left = i * (barWidth + gutter);
      var right = left + barWidth;
      var bottom = scale(d.low);
      var _top = scale(d.high);
      var line = (0, _rectangle2['default'])({ left: left, right: right, bottom: bottom, top: _top });
      curves.push((0, _ops.enhance)(compute, {
        item: d.item,
        line: line,
        value: d.value,
        index: i
      }));
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2['return']) {
        _iterator2['return']();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return {
    curves: curves,
    scale: scale
  };
};

module.exports = exports['default'];