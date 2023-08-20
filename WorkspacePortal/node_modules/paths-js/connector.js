'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _path = require('./path');

var _path2 = _interopRequireDefault(_path);

var _ops = require('./ops');

exports['default'] = function (_ref) {
  var _Path$moveto$lineto$curveto, _Path$moveto, _Path;

  var start = _ref.start;
  var end = _ref.end;
  var tension = _ref.tension;

  if (tension == null) {
    tension = 0.05;
  }

  var _start = _slicedToArray(start, 2);

  var a = _start[0];
  var b = _start[1];

  var _end = _slicedToArray(end, 2);

  var c = _end[0];
  var d = _end[1];

  var length = (c - a) * tension;
  var mid1 = [a + length, b];
  var mid2 = [c - length, d];

  return {
    path: (_Path$moveto$lineto$curveto = (_Path$moveto = (_Path = (0, _path2['default'])()).moveto.apply(_Path, _toConsumableArray(start))).lineto.apply(_Path$moveto, mid1).curveto(a + 5 * length, b, c - 5 * length, d, c - length, d)).lineto.apply(_Path$moveto$lineto$curveto, _toConsumableArray(end)),
    centroid: (0, _ops.average)([start, end])
  };
};

module.exports = exports['default'];