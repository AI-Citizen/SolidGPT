'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('./path');

var _path2 = _interopRequireDefault(_path);

var _connector = require('./connector');

var _connector2 = _interopRequireDefault(_connector);

var _ops = require('./ops');

exports['default'] = function (_ref) {
  var topleft = _ref.topleft;
  var topright = _ref.topright;
  var bottomleft = _ref.bottomleft;
  var bottomright = _ref.bottomright;

  var topCurve = (0, _connector2['default'])({ start: topleft, end: topright }).path;
  var bottomCurve = (0, _connector2['default'])({ start: bottomright, end: bottomleft }).path;
  var path = topCurve.connect(bottomCurve).closepath();
  var centroid = (0, _ops.average)([topleft, topright, bottomleft, bottomright]);

  return {
    path: path,
    centroid: centroid
  };
};

module.exports = exports['default'];