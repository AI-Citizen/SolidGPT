'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _polygon = require('./polygon');

var _polygon2 = _interopRequireDefault(_polygon);

var _ops = require('./ops');

exports['default'] = function (_ref) {
  var center = _ref.center;
  var radii = _ref.radii;

  var angle = 2 * Math.PI / radii.length;
  var points = radii.map(function (r, i) {
    return (0, _ops.plus)(center, (0, _ops.onCircle)(r, i * angle));
  });

  return (0, _polygon2['default'])({
    points: points,
    closed: true
  });
};

module.exports = exports['default'];