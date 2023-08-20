'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _linear = require('./linear');

var _linear2 = _interopRequireDefault(_linear);

var _ops = require('./ops');

var epsilon = 1e-5;

var box = function box(datum, accessor, sort) {
  var points = datum.map(accessor);
  var sorted = sort ? points.sort(function (_ref, _ref3) {
    var _ref2 = _slicedToArray(_ref, 2);

    var a = _ref2[0];
    var b = _ref2[1];

    var _ref32 = _slicedToArray(_ref3, 2);

    var c = _ref32[0];
    var d = _ref32[1];
    return a - c;
  }) : points;
  var l = sorted.length;
  var xmin = sorted[0][0];
  var xmax = sorted[l - 1][0];
  var ymin = (0, _ops.minBy)(sorted, function (p) {
    return p[1];
  });
  var ymax = (0, _ops.maxBy)(sorted, function (p) {
    return p[1];
  });
  if (xmin == xmax) {
    xmax += epsilon;
  }
  if (ymin == ymax) {
    ymax += epsilon;
  }

  return {
    points: sorted,
    xmin: xmin,
    xmax: xmax,
    ymin: ymin,
    ymax: ymax
  };
};

exports['default'] = function (_ref4) {
  var data = _ref4.data;
  var xaccessor = _ref4.xaccessor;
  var yaccessor = _ref4.yaccessor;
  var width = _ref4.width;
  var height = _ref4.height;
  var closed = _ref4.closed;
  var min = _ref4.min;
  var max = _ref4.max;
  var _ref4$sort = _ref4.sort;
  var sort = _ref4$sort === undefined ? true : _ref4$sort;

  if (!xaccessor) {
    xaccessor = function (_ref5) {
      var _ref52 = _slicedToArray(_ref5, 2);

      var x = _ref52[0];
      var y = _ref52[1];
      return x;
    };
  }
  if (!yaccessor) {
    yaccessor = function (_ref6) {
      var _ref62 = _slicedToArray(_ref6, 2);

      var x = _ref62[0];
      var y = _ref62[1];
      return y;
    };
  }
  var f = function f(i) {
    return [xaccessor(i), yaccessor(i)];
  };
  var arranged = data.map(function (datum) {
    return box(datum, f, sort);
  });

  var xmin = (0, _ops.minBy)(arranged, function (d) {
    return d.xmin;
  });
  var xmax = (0, _ops.maxBy)(arranged, function (d) {
    return d.xmax;
  });
  var ymin = min == null ? (0, _ops.minBy)(arranged, function (d) {
    return d.ymin;
  }) : min;
  var ymax = max == null ? (0, _ops.maxBy)(arranged, function (d) {
    return d.ymax;
  }) : max;
  if (closed) {
    ymin = Math.min(ymin, 0);
    ymax = Math.max(ymax, 0);
  }
  var base = closed ? 0 : ymin;
  var xscale = (0, _linear2['default'])([xmin, xmax], [0, width]);
  var yscale = (0, _linear2['default'])([ymin, ymax], [height, 0]);
  var scale = function scale(_ref7) {
    var _ref72 = _slicedToArray(_ref7, 2);

    var x = _ref72[0];
    var y = _ref72[1];
    return [xscale(x), yscale(y)];
  };

  return {
    arranged: arranged,
    scale: scale,
    xscale: xscale,
    yscale: yscale,
    base: base
  };
};

module.exports = exports['default'];