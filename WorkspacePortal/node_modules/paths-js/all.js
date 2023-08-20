'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bar = require('./bar');

var _bar2 = _interopRequireDefault(_bar);

var _bezier = require('./bezier');

var _bezier2 = _interopRequireDefault(_bezier);

var _connector = require('./connector');

var _connector2 = _interopRequireDefault(_connector);

var _curvedRectangle = require('./curved-rectangle');

var _curvedRectangle2 = _interopRequireDefault(_curvedRectangle);

var _graph = require('./graph');

var _graph2 = _interopRequireDefault(_graph);

var _linear = require('./linear');

var _linear2 = _interopRequireDefault(_linear);

var _path = require('./path');

var _path2 = _interopRequireDefault(_path);

var _pie = require('./pie');

var _pie2 = _interopRequireDefault(_pie);

var _polygon = require('./polygon');

var _polygon2 = _interopRequireDefault(_polygon);

var _radar = require('./radar');

var _radar2 = _interopRequireDefault(_radar);

var _rectangle = require('./rectangle');

var _rectangle2 = _interopRequireDefault(_rectangle);

var _sankey = require('./sankey');

var _sankey2 = _interopRequireDefault(_sankey);

var _sector = require('./sector');

var _sector2 = _interopRequireDefault(_sector);

var _semiRegularPolygon = require('./semi-regular-polygon');

var _semiRegularPolygon2 = _interopRequireDefault(_semiRegularPolygon);

var _smoothLine = require('./smooth-line');

var _smoothLine2 = _interopRequireDefault(_smoothLine);

var _stack = require('./stack');

var _stack2 = _interopRequireDefault(_stack);

var _stock = require('./stock');

var _stock2 = _interopRequireDefault(_stock);

var _tree = require('./tree');

var _tree2 = _interopRequireDefault(_tree);

var _voronoi = require('./voronoi');

var _voronoi2 = _interopRequireDefault(_voronoi);

var _waterfall = require('./waterfall');

var _waterfall2 = _interopRequireDefault(_waterfall);

(function () {
  "use strict";

  var global = (1, eval)('this');

  global.Paths = {
    Bar: _bar2['default'],
    Bezier: _bezier2['default'],
    Connector: _connector2['default'],
    CurvedRectangle: _curvedRectangle2['default'],
    Graph: _graph2['default'],
    Linear: _linear2['default'],
    Path: _path2['default'],
    Pie: _pie2['default'],
    Polygon: _polygon2['default'],
    Radar: _radar2['default'],
    Rectangle: _rectangle2['default'],
    Sankey: _sankey2['default'],
    Sector: _sector2['default'],
    SemiRegularPolygon: _semiRegularPolygon2['default'],
    SmoothLine: _smoothLine2['default'],
    Stack: _stack2['default'],
    Stock: _stock2['default'],
    Tree: _tree2['default'],
    Voronoi: _voronoi2['default'],
    Waterfall: _waterfall2['default']
  };
})();