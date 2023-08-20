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
  var _ref$accessor = _ref.accessor;
  var accessor = _ref$accessor === undefined ? _ops.id : _ref$accessor;
  var width = _ref.width;
  var height = _ref.height;
  var min = _ref.min;
  var max = _ref.max;
  var _ref$gutter = _ref.gutter;
  var gutter = _ref$gutter === undefined ? 10 : _ref$gutter;
  var _ref$offset = _ref.offset;
  var offset = _ref$offset === undefined ? [0, 0] : _ref$offset;
  var compute = _ref.compute;

  var groups = [];
  var minUnset = false;
  var maxUnset = false;
  if (min == null) {
    min = 0;minUnset = true;
  }
  if (max == null) {
    max = 0;maxUnset = true;
  }

  var _offset = _slicedToArray(offset, 2);

  var offX = _offset[0];
  var offY = _offset[1];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {

    for (var _iterator = data.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2);

      var i = _step$value[0];
      var d = _step$value[1];
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = d.entries()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _step3$value = _slicedToArray(_step3.value, 2);

          var j = _step3$value[0];
          var el = _step3$value[1];

          var val = accessor(el);
          if (minUnset && val < min) {
            min = val;
          }
          if (maxUnset && val > max) {
            max = val;
          }
          if (groups[j] == null) {
            groups[j] = [];
          }
          groups[j][i] = val;
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3['return']) {
            _iterator3['return']();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
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

  var n = groups.length;
  var groupWidth = (width - gutter * (n - 1)) / n;
  var curves = [];
  var scale = (0, _linear2['default'])([min, max], [height + offY, offY]);

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = groups.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _step2$value = _slicedToArray(_step2.value, 2);

      var i = _step2$value[0];
      var g = _step2$value[1];

      var w = groupWidth / g.length;
      var shift = (groupWidth + gutter) * i + offX;
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = g.entries()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var _step4$value = _slicedToArray(_step4.value, 2);

          var j = _step4$value[0];
          var el = _step4$value[1];

          var left = shift + w * j;
          var right = left + w;
          var bottom = scale(0);
          var _top = scale(el);
          var line = (0, _rectangle2['default'])({ left: left, right: right, bottom: bottom, top: _top });
          curves.push((0, _ops.enhance)(compute, {
            item: data[j][i],
            line: line,
            group: i,
            index: j
          }));
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4['return']) {
            _iterator4['return']();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
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

  return { curves: curves, scale: scale };
};

module.exports = exports['default'];