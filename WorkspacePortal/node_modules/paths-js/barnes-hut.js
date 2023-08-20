'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _ops = require('./ops');

var average = function average(body1, body2) {
  var mass = body1.mass + body2.mass;
  var point = (0, _ops.times)(1 / mass, (0, _ops.plus)((0, _ops.times)(body1.mass, body1.point), (0, _ops.times)(body2.mass, body2.point)));
  return [point, mass];
};

var locate = function locate(_ref, quadrants) {
  var _ref2 = _slicedToArray(_ref, 2);

  var x = _ref2[0];
  var y = _ref2[1];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = quadrants[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var q = _step.value;
      var _q$box = q.box;
      var _top = _q$box.top;
      var bottom = _q$box.bottom;
      var left = _q$box.left;
      var right = _q$box.right;

      if (left <= x && x <= right && bottom <= y && y <= _top) {
        return q;
      }
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
};

var makeQuadrant = function makeQuadrant(_ref3, _ref4) {
  var top = _ref3.top;
  var bottom = _ref3.bottom;
  var left = _ref3.left;
  var right = _ref3.right;

  var _ref42 = _slicedToArray(_ref4, 2);

  var a = _ref42[0];
  var b = _ref42[1];

  var halfwayV = (left + right) / 2;
  var halfwayH = (top + bottom) / 2;

  return {
    box: {
      top: b ? halfwayH : top,
      bottom: b ? bottom : halfwayH,
      left: a ? halfwayV : left,
      right: a ? right : halfwayV
    }
  };
};

var subdivide = function subdivide(_ref5) {
  var box = _ref5.box;
  return [makeQuadrant(box, [0, 0]), makeQuadrant(box, [1, 0]), makeQuadrant(box, [0, 1]), makeQuadrant(box, [1, 1])];
};

var addBody = function addBody(root, body) {
  if (root.body) {
    var oldBody = root.body;
    delete root.body;
    root.children = subdivide(root);
    addBody(root, oldBody);
    addBody(root, body);
  } else {
    if (root.children) {
      var child = locate(body.point, root.children);

      var _ref6 = root.point ? average(root, body) : [body.point, body.mass];

      var _ref62 = _slicedToArray(_ref6, 2);

      var p = _ref62[0];
      var m = _ref62[1];

      root.point = p;
      root.mass = m;
      addBody(child, body);
    } else {
      root.body = body;
    }
  }
};

var makeTree = function makeTree(_x, _x2) {
  var _again = true;

  _function: while (_again) {
    var bodies = _x,
        root = _x2;
    _again = false;

    if (bodies.length === 0) {
      return root;
    } else {
      var body = bodies.shift();
      addBody(root, body);
      _x = bodies;
      _x2 = root;
      _again = true;
      body = undefined;
      continue _function;
    }
  }
};

var makeBodies = function makeBodies(positions) {
  return (0, _ops.mapObject)(positions, function (id, position) {
    return { id: id, point: position, mass: 1 };
  });
};

var makeRoot = function makeRoot(width, height) {
  return {
    box: {
      top: height,
      bottom: 0,
      left: 0,
      right: width
    }
  };
};

var walkLeaves = function walkLeaves(tree, f) {
  if (tree.body) {
    f(tree);
  } else {
    if (tree.children) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = tree.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var child = _step2.value;

          walkLeaves(child, f);
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
    }
  }
};

var bodyForceOn = function bodyForceOn(b1, b2, repulsion) {
  var segment = (0, _ops.minus)(b1.point, b2.point);
  var d = (0, _ops.length)(segment);
  return (0, _ops.times)(repulsion * b1.mass * b2.mass / (d * d * d), segment);
};

var boxWidth = function boxWidth(_ref7) {
  var top = _ref7.top;
  var bottom = _ref7.bottom;
  var left = _ref7.left;
  var right = _ref7.right;
  return (0, _ops.length)([top - bottom, right - left]);
};

var forceOn = function forceOn(leaf, tree, repulsion, threshold) {
  if (tree === leaf) {
    return [0, 0];
  } else if (tree.body) {
    return bodyForceOn(leaf.body, tree.body, repulsion);
  } else if (tree.point) {
    var s = boxWidth(tree.box);
    var d = (0, _ops.length)((0, _ops.minus)(leaf.body.point, tree.point));

    if (s / d < threshold) {
      return bodyForceOn(leaf.body, tree, repulsion);
    } else return (0, _ops.sumVectors)(tree.children.map(function (c) {
      return forceOn(leaf, c, repulsion, threshold);
    }));
  } else return [0, 0];
};

var repulsiveForces = function repulsiveForces(tree, repulsion, threshold) {
  var forces = {};
  walkLeaves(tree, function (leaf) {
    forces[leaf.body.id] = forceOn(leaf, tree, repulsion, threshold);
  });
  return forces;
};

exports.tree = makeTree;
exports.bodies = makeBodies;
exports.root = makeRoot;
exports.forces = repulsiveForces;
exports['default'] = {
  tree: makeTree,
  bodies: makeBodies,
  root: makeRoot,
  forces: repulsiveForces
};