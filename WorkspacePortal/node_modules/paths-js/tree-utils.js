"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var maxBy = function maxBy(items, f) {
  if (items === undefined) items = [];

  return items.reduce(function (m, i) {
    return Math.max(m, f(i));
  }, 0);
};

var treeHeight = function treeHeight(root) {
  return 1 + maxBy(root.children, treeHeight);
};

var buildTree = function buildTree(data, children) {
  var level = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

  var result = {
    item: data,
    level: level
  };
  var cs = children(data);
  if (cs && cs.length) {
    result.children = cs.map(function (c) {
      return buildTree(c, children, level + 1);
    });
  }
  return result;
};

var setHeight = function setHeight(root) {
  var level = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
  var maxHeights = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

  if (maxHeights[level] != null) {
    root.height = maxHeights[level] + 1;
    maxHeights[level] += 1;
  } else {
    maxHeights[level] = 0;
    root.height = 0;
  }
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (root.children || [])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var child = _step.value;

      setHeight(child, level + 1, maxHeights);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"]) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return maxHeights;
};

// f is a function of (parent, child)
var collect = function collect(root, f) {
  var result = [];
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = (root.children || [])[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var child = _step2.value;

      result.push(f(root, child));
      result = result.concat(collect(child, f));
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return result;
};

exports.treeHeight = treeHeight;
exports.buildTree = buildTree;
exports.setHeight = setHeight;
exports.collect = collect;