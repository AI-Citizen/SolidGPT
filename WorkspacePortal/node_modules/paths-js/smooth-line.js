'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _bezier = require('./bezier');

var _bezier2 = _interopRequireDefault(_bezier);

var _lineChartComp = require('./line-chart-comp');

var _lineChartComp2 = _interopRequireDefault(_lineChartComp);

var _ops = require('./ops');

exports['default'] = function (options) {
  var _comp = (0, _lineChartComp2['default'])(options);

  var arranged = _comp.arranged;
  var scale = _comp.scale;
  var xscale = _comp.xscale;
  var yscale = _comp.yscale;
  var base = _comp.base;

  var i = -1;

  var lines = arranged.map(function (_ref) {
    var _line$path$lineto, _line$path;

    var points = _ref.points;
    var xmin = _ref.xmin;
    var xmax = _ref.xmax;

    var scaledPoints = points.map(scale);
    i += 1;
    var line = (0, _bezier2['default'])({ points: scaledPoints });
    var area = {
      path: (_line$path$lineto = (_line$path = line.path).lineto.apply(_line$path, _toConsumableArray(scale([xmax, base])))).lineto.apply(_line$path$lineto, _toConsumableArray(scale([xmin, base]))).closepath(),
      centroid: (0, _ops.average)([line.centroid, scale([xmin, base]), scale([xmax, base])])
    };

    return (0, _ops.enhance)(options.compute, {
      item: options.data[i],
      line: line,
      area: area,
      index: i
    });
  });

  return {
    curves: lines,
    xscale: xscale,
    yscale: yscale
  };
};

module.exports = exports['default'];