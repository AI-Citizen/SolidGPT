"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var sum = function sum(xs) {
  return xs.reduce(function (a, b) {
    return a + b;
  }, 0);
};

var min = function min(xs) {
  return xs.reduce(function (a, b) {
    return Math.min(a, b);
  });
};

var max = function max(xs) {
  return xs.reduce(function (a, b) {
    return Math.max(a, b);
  });
};

var sumBy = function sumBy(xs, f) {
  return xs.reduce(function (a, b) {
    return a + f(b);
  }, 0);
};

var minBy = function minBy(xs, f) {
  return xs.reduce(function (a, b) {
    return Math.min(a, f(b));
  }, Infinity);
};

var maxBy = function maxBy(xs, f) {
  return xs.reduce(function (a, b) {
    return Math.max(a, f(b));
  }, -Infinity);
};

var plus = function plus(_ref, _ref3) {
  var _ref2 = _slicedToArray(_ref, 2);

  var a = _ref2[0];
  var b = _ref2[1];

  var _ref32 = _slicedToArray(_ref3, 2);

  var c = _ref32[0];
  var d = _ref32[1];
  return [a + c, b + d];
};

var minus = function minus(_ref4, _ref5) {
  var _ref42 = _slicedToArray(_ref4, 2);

  var a = _ref42[0];
  var b = _ref42[1];

  var _ref52 = _slicedToArray(_ref5, 2);

  var c = _ref52[0];
  var d = _ref52[1];
  return [a - c, b - d];
};

var times = function times(k, _ref6) {
  var _ref62 = _slicedToArray(_ref6, 2);

  var a = _ref62[0];
  var b = _ref62[1];
  return [k * a, k * b];
};

var length = function length(_ref7) {
  var _ref72 = _slicedToArray(_ref7, 2);

  var a = _ref72[0];
  var b = _ref72[1];
  return Math.sqrt(a * a + b * b);
};

var sumVectors = function sumVectors(xs) {
  return xs.reduce(plus, [0, 0]);
};

var average = function average(points) {
  return times(1 / points.length, points.reduce(plus));
};

var onCircle = function onCircle(r, angle) {
  return times(r, [Math.sin(angle), -Math.cos(angle)]);
};

var enhance = function enhance(compute, curve) {
  var obj = compute || {};
  for (var key in obj) {
    var method = obj[key];
    curve[key] = method(curve.index, curve.item, curve.group);
  }
  return curve;
};

var range = function range(a, b, inclusive) {
  var result = [];
  for (var i = a; i < b; i++) {
    result.push(i);
  }
  if (inclusive) {
    result.push(b);
  }
  return result;
};

var mapObject = function mapObject(obj, f) {
  var result = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.keys(obj)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var k = _step.value;

      var v = obj[k];
      result.push(f(k, v));
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"]) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return result;
};

var pairs = function pairs(obj) {
  return mapObject(obj, function (k, v) {
    return [k, v];
  });
};

var id = function id(x) {
  return x;
};

exports.sum = sum;
exports.min = min;
exports.max = max;
exports.sumBy = sumBy;
exports.minBy = minBy;
exports.maxBy = maxBy;
exports.plus = plus;
exports.minus = minus;
exports.times = times;
exports.id = id;
exports.length = length;
exports.sumVectors = sumVectors;
exports.average = average;
exports.onCircle = onCircle;
exports.enhance = enhance;
exports.range = range;
exports.mapObject = mapObject;
exports.pairs = pairs;
exports["default"] = { sum: sum, min: min, max: max, sumBy: sumBy, minBy: minBy, maxBy: maxBy, plus: plus, minus: minus, times: times, id: id,
  length: length, sumVectors: sumVectors, average: average, onCircle: onCircle, enhance: enhance, range: range, mapObject: mapObject, pairs: pairs };