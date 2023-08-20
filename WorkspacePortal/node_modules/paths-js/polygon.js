'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _path = require('./path');

var _path2 = _interopRequireDefault(_path);

var _ops = require('./ops');

exports['default'] = function (_ref) {
  var _Path;

  var points = _ref.points;
  var closed = _ref.closed;

  var l = points.length;
  var head = points[0];
  var tail = points.slice(1, l + 1);
  var path = tail.reduce(function (pt, p) {
    return pt.lineto.apply(pt, _toConsumableArray(p));
  }, (_Path = (0, _path2['default'])()).moveto.apply(_Path, _toConsumableArray(head)));

  return {
    path: closed ? path.closepath() : path,
    centroid: (0, _ops.average)(points)
  };
};

module.exports = exports['default'];