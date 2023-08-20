'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _linear = require('./linear');

var _linear2 = _interopRequireDefault(_linear);

var _sector = require('./sector');

var _sector2 = _interopRequireDefault(_sector);

var _ops = require('./ops');

exports['default'] = function (_ref) {
  var data = _ref.data;
  var accessor = _ref.accessor;
  var center = _ref.center;
  var r = _ref.r;
  var R = _ref.R;
  var compute = _ref.compute;

  var values = data.map(accessor);
  var s = (0, _ops.sum)(values);
  s = s === 0 ? 1 : s;
  var scale = (0, _linear2['default'])([0, s], [0, 2 * Math.PI]);
  var curves = [];
  var t = 0;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = data.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2);

      var i = _step$value[0];
      var item = _step$value[1];

      var value = values[i];
      curves.push((0, _ops.enhance)(compute, {
        item: item,
        index: i,
        sector: (0, _sector2['default'])({
          center: center,
          r: r,
          R: R,
          start: scale(t),
          end: scale(t + value)
        })
      }));
      t += value;
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

  return { curves: curves };
};

module.exports = exports['default'];