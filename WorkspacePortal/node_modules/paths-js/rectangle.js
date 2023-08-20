'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _polygon = require('./polygon');

var _polygon2 = _interopRequireDefault(_polygon);

exports['default'] = function (_ref) {
  var left = _ref.left;
  var right = _ref.right;
  var top = _ref.top;
  var bottom = _ref.bottom;

  return (0, _polygon2['default'])({
    points: [[right, top], [right, bottom], [left, bottom], [left, top]],
    closed: true
  });
};

module.exports = exports['default'];