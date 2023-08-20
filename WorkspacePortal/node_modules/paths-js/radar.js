'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _semiRegularPolygon = require('./semi-regular-polygon');

var _semiRegularPolygon2 = _interopRequireDefault(_semiRegularPolygon);

var _ops = require('./ops');

var collectKeys = function collectKeys(objects) {
  var keys = [];
  var keysets = objects.map(Object.keys);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = objects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var object = _step.value;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Object.keys(object)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var key = _step2.value;

          if (keys.indexOf(key) == -1) {
            keys.push(key);
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

  return keys;
};

var keyAccessor = function keyAccessor(keys) {
  var a = {};
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = keys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var key = _step3.value;

      (function (k) {
        a[k] = function (o) {
          return o[k];
        };
      })(key);
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

  return a;
};

var globalMax = function globalMax(data, accessor) {
  var keys = Object.keys(accessor);
  var maxs = data.map(function (d) {
    return (0, _ops.maxBy)(keys, function (k) {
      return accessor[k](d);
    });
  });
  return (0, _ops.max)(maxs);
};

exports['default'] = function (_ref) {
  var data = _ref.data;
  var accessor = _ref.accessor;
  var center = _ref.center;
  var r = _ref.r;
  var max = _ref.max;
  var _ref$rings = _ref.rings;
  var rings = _ref$rings === undefined ? 3 : _ref$rings;
  var _ref$compute = _ref.compute;
  var compute = _ref$compute === undefined ? {} : _ref$compute;

  if (!accessor) {
    accessor = keyAccessor(collectKeys(data));
  }
  var keys = Object.keys(accessor);
  var sides = keys.length;
  var angle = 2 * Math.PI / sides;
  var i = -1;
  if (max == null) {
    max = globalMax(data, accessor);
  }

  var ringPaths = (0, _ops.range)(1, rings, true).map(function (n) {
    var radius = r * n / rings;
    return (0, _semiRegularPolygon2['default'])({
      center: center,
      radii: (0, _ops.range)(0, sides).map(function (s) {
        return radius;
      })
    });
  });

  var polygons = data.map(function (d) {
    i += 1;

    return (0, _ops.enhance)(compute, {
      polygon: (0, _semiRegularPolygon2['default'])({
        center: center,
        radii: keys.map(function (k) {
          return r * accessor[k](d) / max;
        })
      }),
      item: d,
      index: i
    });
  });

  return {
    curves: polygons,
    rings: ringPaths
  };
};

module.exports = exports['default'];