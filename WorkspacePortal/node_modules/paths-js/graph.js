'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _polygon = require('./polygon');

var _polygon2 = _interopRequireDefault(_polygon);

var _ops = require('./ops');

var _barnesHut = require('./barnes-hut');

var _barnesHut2 = _interopRequireDefault(_barnesHut);

var randomPosition = function randomPosition(w, h) {
  return [Math.random() * w, Math.random() * h];
};

var cap = function cap(bound, x) {
  return Math.min(Math.max(x, 0), bound);
};

var inside = function inside(w, h) {
  return function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2);

    var x = _ref2[0];
    var y = _ref2[1];
    return [cap(w, x), cap(h, y)];
  };
};

var attractiveForces = function attractiveForces(links, positions, attraction) {
  var forces = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.keys(links)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var id = _step.value;
      var _links$id = links[id];
      var start = _links$id.start;
      var end = _links$id.end;
      var weight = _links$id.weight;

      var pos1 = positions[start];
      var pos2 = positions[end];
      var force = (0, _ops.times)(attraction * weight, (0, _ops.minus)(pos1, pos2));
      if (!forces[start]) {
        forces[start] = [0, 0];
      }
      if (!forces[end]) {
        forces[end] = [0, 0];
      }
      forces[start] = (0, _ops.minus)(forces[start], force);
      forces[end] = (0, _ops.plus)(forces[end], force);
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

  return forces;
};

exports['default'] = function (_ref3) {
  var data = _ref3.data;
  var nodeaccessor = _ref3.nodeaccessor;
  var linkaccessor = _ref3.linkaccessor;
  var width = _ref3.width;
  var height = _ref3.height;
  var attraction = _ref3.attraction;
  var repulsion = _ref3.repulsion;
  var threshold = _ref3.threshold;

  var identity = function identity(x) {
    return x;
  };
  if (!nodeaccessor) {
    nodeaccessor = identity;
  }
  if (!linkaccessor) {
    linkaccessor = identity;
  }
  attraction = attraction || 1;
  repulsion = repulsion || 1;
  threshold = threshold || 0.5;
  var bound = inside(width, height);

  var nodes = data.nodes;
  var links = data.links;
  var constraints = data.constraints;

  if (!constraints) {
    constraints = {};
  }
  var nodesPositions = {};
  var nodes_ = {};
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = nodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var node = _step2.value;

      var id = nodeaccessor(node);
      nodesPositions[id] = constraints[id] || randomPosition(width, height);
      nodes_[id] = node;
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

  var links_ = {};

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = links[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var link = _step3.value;

      var _linkaccessor = linkaccessor(link);

      var start = _linkaccessor.start;
      var end = _linkaccessor.end;
      var weight = _linkaccessor.weight;

      links_[start + '|' + end] = { weight: weight, start: start, end: end, link: link };
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

  var tick = function tick() {
    var bodies = _barnesHut2['default'].bodies(nodesPositions);
    var root = _barnesHut2['default'].root(width, height);
    var tree = _barnesHut2['default'].tree(bodies, root);
    var attractions = attractiveForces(links_, nodesPositions, attraction / 1000);
    var repulsions = _barnesHut2['default'].forces(tree, repulsion * 1000, threshold);
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = Object.keys(nodesPositions)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var id = _step4.value;

        var position = nodesPositions[id];
        if (constraints[id]) {
          nodesPositions[id] = constraints[id];
        } else {
          var f1 = attractions[id] || [0, 0];
          var f2 = repulsions[id] || [0, 0];
          var f = (0, _ops.plus)(f1, f2);
          nodesPositions[id] = bound((0, _ops.plus)(position, f));
        }
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4['return']) {
          _iterator4['return']();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }

    return recompute();
  };

  var constrain = function constrain(id, position) {
    constraints[id] = position;
  };

  var unconstrain = function unconstrain(id) {
    delete constraints[id];
  };

  var graph = { tick: tick, constrain: constrain, unconstrain: unconstrain };

  var recompute = function recompute() {
    var i = -1;
    graph.curves = (0, _ops.mapObject)(links_, function (id, _ref4) {
      var start = _ref4.start;
      var end = _ref4.end;
      var link = _ref4.link;

      i += 1;
      var p = nodesPositions[start];
      var q = nodesPositions[end];

      return {
        link: (0, _polygon2['default'])({ points: [p, q], closed: false }),
        item: link,
        index: i
      };
    });

    graph.nodes = (0, _ops.mapObject)(nodes_, function (id, node) {
      return {
        point: nodesPositions[id],
        item: node
      };
    });

    return graph;
  };

  return recompute();
};

module.exports = exports['default'];