'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _rectangle = require('./rectangle');

var _rectangle2 = _interopRequireDefault(_rectangle);

var _curvedRectangle = require('./curved-rectangle');

var _curvedRectangle2 = _interopRequireDefault(_curvedRectangle);

var _ops = require('./ops');

exports['default'] = function (_ref) {
  var data = _ref.data;
  var nodeaccessor = _ref.nodeaccessor;
  var linkaccessor = _ref.linkaccessor;
  var width = _ref.width;
  var height = _ref.height;
  var gutter = _ref.gutter;
  var rectWidth = _ref.rectWidth;
  var compute = _ref.compute;

  var id = function id(x) {
    return x;
  };
  if (!nodeaccessor) {
    nodeaccessor = id;
  }
  if (!linkaccessor) {
    linkaccessor = id;
  }
  gutter = gutter || 10;
  rectWidth = rectWidth || 10;

  var links_ = data.links.map(linkaccessor);
  var nodes_ = data.nodes.map(function (level) {
    return level.map(nodeaccessor);
  });

  // Compute the spacing between groups of rectangles;
  // takes care of rects width
  var spacingGroups = (width - rectWidth) / (data.nodes.length - 1);
  var nameValues = {};

  // Initialize the information about nodes
  nodes_.reduce(function (a, b) {
    return a.concat(b);
  }).forEach(function (name) {
    nameValues[name] = {
      value: 0,
      currentlyUsedIn: 0,
      currentlyUsedOut: 0
    };
  });

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function () {
      var _step$value = _slicedToArray(_step.value, 2);

      var name = _step$value[0];
      var val = _step$value[1];

      var valsIn = (0, _ops.sumBy)(links_.filter(function (x) {
        return x.end === name;
      }), function (x) {
        return x.weight;
      });
      var valsOut = (0, _ops.sumBy)(links_.filter(function (x) {
        return x.start === name;
      }), function (x) {
        return x.weight;
      });
      val.value = Math.max(valsIn, valsOut);
    };

    for (var _iterator = (0, _ops.pairs)(nameValues)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      _loop();
    }

    // Find a suitable scale: it should take care of the maximum height
    // of stacked rectangles and gutters between them.
    // I did as follows: take the initial height and, for each group of
    // rectangles, compute how much space you have available, that is,
    // height - gutters; there are lengthOfGroup - 1 gutters.
    // Consider the ratios spaceForEachGroup / heightOfStackedRectangles
    // and take the minimum. Use this as scale factor.

    // Compute height of staked rectangles in a group
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

  var heightOfGroups = nodes_.map(function (group) {
    return (0, _ops.sumBy)(group, function (name) {
      return nameValues[name].value;
    });
  });

  // Compute the available height for each group (height - gutters)
  var spaceForEachGroup = nodes_.map(function (group) {
    return height - (group.length - 1) * gutter;
  });

  // Compute minimum ratio
  var scale = (0, _ops.min)(heightOfGroups.map(function (heightOfGroup, idx) {
    return spaceForEachGroup[idx] / heightOfGroup;
  }));

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = (0, _ops.pairs)(nameValues)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _step2$value = _slicedToArray(_step2.value, 2);

      var _name = _step2$value[0];
      var val = _step2$value[1];

      val.scaledValue = scale * val.value;
    }

    // Fill rectangles information: each rectangle
    // is stack on the previous one, with a gutter
    // The group of rectangles is centered in their own column
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

  var rectangles = [];
  var nodeIdx = -1;

  nodes_.forEach(function (group, idg) {
    var hGroup = (0, _ops.sumBy)(group, function (y) {
      return nameValues[y].scaledValue;
    }) + (group.length - 1) * gutter;
    var firstTop = (height - hGroup) / 2;
    // Fake previous bottom
    var previousBottom = firstTop - gutter;
    group.forEach(function (name, idn) {
      var top = previousBottom + gutter;
      var bottom = top + nameValues[name].scaledValue;
      previousBottom = bottom;
      var att = {
        top: top,
        bottom: bottom,
        left: rectWidth / 2 + idg * spacingGroups - rectWidth / 2,
        right: rectWidth / 2 + idg * spacingGroups + rectWidth / 2
      };
      nameValues[name].rectangleCoords = att;
      nodeIdx += 1;
      rectangles.push((0, _ops.enhance)(compute, {
        curve: (0, _rectangle2['default'])(att),
        item: data.nodes[idg][idn],
        index: nodeIdx,
        group: idg
      }));
    });
  });

  var curvedRectangles = links_.map(function (link, i) {
    var s = nameValues[link.start];
    var t = nameValues[link.end];
    var rectSource = s.rectangleCoords;
    var rectTarget = t.rectangleCoords;
    var scaledWeight = link.weight * scale;
    var a = rectSource.top + s.currentlyUsedOut;
    var b = rectTarget.top + t.currentlyUsedIn;
    var curvedRect = {
      topleft: [rectSource.right, a],
      topright: [rectTarget.left, b],
      bottomleft: [rectSource.right, a + scaledWeight],
      bottomright: [rectTarget.left, b + scaledWeight]
    };
    s.currentlyUsedOut += scaledWeight;
    t.currentlyUsedIn += scaledWeight;

    return (0, _ops.enhance)(compute, {
      curve: (0, _curvedRectangle2['default'])(curvedRect),
      item: data.links[i],
      index: i
    });
  });

  return {
    curvedRectangles: curvedRectangles,
    rectangles: rectangles
  };
};

module.exports = exports['default'];