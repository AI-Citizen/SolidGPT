'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _path = require('./path');

var _path2 = _interopRequireDefault(_path);

var _polygon = require('./polygon');

var _polygon2 = _interopRequireDefault(_polygon);

var _ops = require('./ops');

var reflect = function reflect(p, q) {
  return (0, _ops.minus)((0, _ops.times)(2, p), q);
};

exports['default'] = function (_ref) {
  var _Path;

  var points = _ref.points;
  var tension = _ref.tension;

  tension = tension || 0.3;
  var diffs = [];
  var l = points.length;
  if (l <= 2) {
    return (0, _polygon2['default'])({ points: points });
  }
  for (var i = 1; i <= l - 1; i++) {
    diffs.push((0, _ops.times)(tension, (0, _ops.minus)(points[i], points[i - 1])));
  }
  var controlPoints = [(0, _ops.plus)(points[0], reflect(diffs[0], diffs[1]))];
  for (var i = 1; i <= l - 2; i++) {
    controlPoints.push((0, _ops.minus)(points[i], (0, _ops.average)([diffs[i], diffs[i - 1]])));
  }
  controlPoints.push((0, _ops.minus)(points[l - 1], reflect(diffs[l - 2], diffs[l - 3])));
  var c0 = controlPoints[0];
  var c1 = controlPoints[1];
  var p0 = points[0];
  var p1 = points[1];
  var path = (_Path = (0, _path2['default'])()).moveto.apply(_Path, _toConsumableArray(p0)).curveto(c0[0], c0[1], c1[0], c1[1], p1[0], p1[1]);

  return {
    path: (0, _ops.range)(2, l).reduce(function (pt, i) {
      var c = controlPoints[i];
      var p = points[i];
      return pt.smoothcurveto(c[0], c[1], p[0], p[1]);
    }, path),
    centroid: (0, _ops.average)(points)
  };
};

module.exports = exports['default'];