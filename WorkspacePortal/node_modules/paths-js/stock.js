'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _polygon = require('./polygon');

var _polygon2 = _interopRequireDefault(_polygon);

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

  var polygons = arranged.map(function (_ref) {
    var points = _ref.points;
    var xmin = _ref.xmin;
    var xmax = _ref.xmax;

    var scaledPoints = points.map(scale);
    points.push([xmax, base]);
    points.push([xmin, base]);
    var scaledPointsClosed = points.map(scale);
    i += 1;

    return (0, _ops.enhance)(options.compute, {
      item: options.data[i],
      line: (0, _polygon2['default'])({
        points: scaledPoints,
        closed: false
      }),
      area: (0, _polygon2['default'])({
        points: scaledPointsClosed,
        closed: true
      }),
      index: i
    });
  });

  return {
    curves: polygons,
    xscale: xscale,
    yscale: yscale
  };
};

module.exports = exports['default'];