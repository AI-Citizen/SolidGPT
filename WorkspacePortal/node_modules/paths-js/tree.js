'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _connector = require('./connector');

var _connector2 = _interopRequireDefault(_connector);

var _linear = require('./linear');

var _linear2 = _interopRequireDefault(_linear);

var _ops = require('./ops');

var _treeUtils = require('./tree-utils');

exports['default'] = function (_ref) {
  var data = _ref.data;
  var width = _ref.width;
  var height = _ref.height;
  var children = _ref.children;
  var tension = _ref.tension;

  if (!children) {
    children = function (x) {
      return x.children;
    };
  }
  var tree = (0, _treeUtils.buildTree)(data, children);
  var levels = (0, _treeUtils.treeHeight)(tree);
  var maxHeights = (0, _treeUtils.setHeight)(tree);
  var hspace = width / (levels - 1);
  var hscale = (0, _linear2['default'])([0, levels - 1], [0, width]);
  var vscales = (0, _ops.range)(0, levels).map(function (level) {
    var availableHeight = Math.sqrt(level / (levels - 1)) * height;
    var top = (height - availableHeight) / 2;
    var bottom = top + availableHeight;
    var maxHeight = level > 0 ? maxHeights[level] + maxHeights[level - 1] : maxHeights[level];
    if (maxHeight === 0) {
      return function (x) {
        return height / 2;
      };
    } else {
      return (0, _linear2['default'])([0, maxHeight], [top, bottom]);
    }
  });

  var position = function position(node) {
    var level = node.level;
    var vscale = vscales[level];
    return [hscale(level), vscale(node.height_)];
  };

  var i = -1;
  var connectors = (0, _treeUtils.collect)(tree, function (parent, child) {
    i += 1;
    child.height_ = child.height + parent.height;
    return {
      connector: (0, _connector2['default'])({
        start: position(parent),
        end: position(child),
        tension: tension
      }),
      index: i,
      item: {
        start: parent.item,
        end: child.item
      }
    };
  });
  var childNodes = (0, _treeUtils.collect)(tree, function (parent, child) {
    return {
      point: position(child),
      item: child.item
    };
  });
  var rootNode = {
    point: position(tree),
    item: tree.item
  };

  return {
    curves: connectors,
    nodes: [rootNode].concat(childNodes)
  };
};

module.exports = exports['default'];