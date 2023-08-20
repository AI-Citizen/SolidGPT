import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _typeof from "@babel/runtime/helpers/esm/typeof";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["children"],
  _excluded2 = ["fixed"];
import toArray from "rc-util/es/Children/toArray";
import warning from "rc-util/es/warning";
import * as React from 'react';
import { EXPAND_COLUMN } from "../constant";
import { INTERNAL_COL_DEFINE } from "../utils/legacyUtil";
export function convertChildrenToColumns(children) {
  return toArray(children).filter(function (node) {
    return /*#__PURE__*/React.isValidElement(node);
  }).map(function (_ref) {
    var key = _ref.key,
      props = _ref.props;
    var nodeChildren = props.children,
      restProps = _objectWithoutProperties(props, _excluded);
    var column = _objectSpread({
      key: key
    }, restProps);
    if (nodeChildren) {
      column.children = convertChildrenToColumns(nodeChildren);
    }
    return column;
  });
}
function flatColumns(columns) {
  return columns.filter(function (column) {
    return column && _typeof(column) === 'object';
  }).reduce(function (list, column) {
    var fixed = column.fixed;
    // Convert `fixed='true'` to `fixed='left'` instead
    var parsedFixed = fixed === true ? 'left' : fixed;
    var subColumns = column.children;
    if (subColumns && subColumns.length > 0) {
      return [].concat(_toConsumableArray(list), _toConsumableArray(flatColumns(subColumns).map(function (subColum) {
        return _objectSpread({
          fixed: parsedFixed
        }, subColum);
      })));
    }
    return [].concat(_toConsumableArray(list), [_objectSpread(_objectSpread({}, column), {}, {
      fixed: parsedFixed
    })]);
  }, []);
}
function warningFixed(flattenColumns) {
  var allFixLeft = true;
  for (var i = 0; i < flattenColumns.length; i += 1) {
    var col = flattenColumns[i];
    if (allFixLeft && col.fixed !== 'left') {
      allFixLeft = false;
    } else if (!allFixLeft && col.fixed === 'left') {
      warning(false, "Index ".concat(i - 1, " of `columns` missing `fixed='left'` prop."));
      break;
    }
  }
  var allFixRight = true;
  for (var _i = flattenColumns.length - 1; _i >= 0; _i -= 1) {
    var _col = flattenColumns[_i];
    if (allFixRight && _col.fixed !== 'right') {
      allFixRight = false;
    } else if (!allFixRight && _col.fixed === 'right') {
      warning(false, "Index ".concat(_i + 1, " of `columns` missing `fixed='right'` prop."));
      break;
    }
  }
}
function revertForRtl(columns) {
  return columns.map(function (column) {
    var fixed = column.fixed,
      restProps = _objectWithoutProperties(column, _excluded2);

    // Convert `fixed='left'` to `fixed='right'` instead
    var parsedFixed = fixed;
    if (fixed === 'left') {
      parsedFixed = 'right';
    } else if (fixed === 'right') {
      parsedFixed = 'left';
    }
    return _objectSpread({
      fixed: parsedFixed
    }, restProps);
  });
}

/**
 * Parse `columns` & `children` into `columns`.
 */
function useColumns(_ref2, transformColumns) {
  var prefixCls = _ref2.prefixCls,
    columns = _ref2.columns,
    children = _ref2.children,
    expandable = _ref2.expandable,
    expandedKeys = _ref2.expandedKeys,
    columnTitle = _ref2.columnTitle,
    getRowKey = _ref2.getRowKey,
    onTriggerExpand = _ref2.onTriggerExpand,
    expandIcon = _ref2.expandIcon,
    rowExpandable = _ref2.rowExpandable,
    expandIconColumnIndex = _ref2.expandIconColumnIndex,
    direction = _ref2.direction,
    expandRowByClick = _ref2.expandRowByClick,
    columnWidth = _ref2.columnWidth,
    fixed = _ref2.fixed;
  var baseColumns = React.useMemo(function () {
    return columns || convertChildrenToColumns(children);
  }, [columns, children]);

  // ========================== Expand ==========================
  var withExpandColumns = React.useMemo(function () {
    if (expandable) {
      var _expandColumn;
      var cloneColumns = baseColumns.slice();

      // >>> Warning if use `expandIconColumnIndex`
      if (process.env.NODE_ENV !== 'production' && expandIconColumnIndex >= 0) {
        warning(false, '`expandIconColumnIndex` is deprecated. Please use `Table.EXPAND_COLUMN` in `columns` instead.');
      }

      // >>> Insert expand column if not exist
      if (!cloneColumns.includes(EXPAND_COLUMN)) {
        var expandColIndex = expandIconColumnIndex || 0;
        if (expandColIndex >= 0) {
          cloneColumns.splice(expandColIndex, 0, EXPAND_COLUMN);
        }
      }

      // >>> Deduplicate additional expand column
      if (process.env.NODE_ENV !== 'production' && cloneColumns.filter(function (c) {
        return c === EXPAND_COLUMN;
      }).length > 1) {
        warning(false, 'There exist more than one `EXPAND_COLUMN` in `columns`.');
      }
      var expandColumnIndex = cloneColumns.indexOf(EXPAND_COLUMN);
      cloneColumns = cloneColumns.filter(function (column, index) {
        return column !== EXPAND_COLUMN || index === expandColumnIndex;
      });

      // >>> Check if expand column need to fixed
      var prevColumn = baseColumns[expandColumnIndex];
      var fixedColumn;
      if ((fixed === 'left' || fixed) && !expandIconColumnIndex) {
        fixedColumn = 'left';
      } else if ((fixed === 'right' || fixed) && expandIconColumnIndex === baseColumns.length) {
        fixedColumn = 'right';
      } else {
        fixedColumn = prevColumn ? prevColumn.fixed : null;
      }

      // >>> Create expandable column
      var expandColumn = (_expandColumn = {}, _defineProperty(_expandColumn, INTERNAL_COL_DEFINE, {
        className: "".concat(prefixCls, "-expand-icon-col"),
        columnType: 'EXPAND_COLUMN'
      }), _defineProperty(_expandColumn, "title", columnTitle), _defineProperty(_expandColumn, "fixed", fixedColumn), _defineProperty(_expandColumn, "className", "".concat(prefixCls, "-row-expand-icon-cell")), _defineProperty(_expandColumn, "width", columnWidth), _defineProperty(_expandColumn, "render", function render(_, record, index) {
        var rowKey = getRowKey(record, index);
        var expanded = expandedKeys.has(rowKey);
        var recordExpandable = rowExpandable ? rowExpandable(record) : true;
        var icon = expandIcon({
          prefixCls: prefixCls,
          expanded: expanded,
          expandable: recordExpandable,
          record: record,
          onExpand: onTriggerExpand
        });
        if (expandRowByClick) {
          return /*#__PURE__*/React.createElement("span", {
            onClick: function onClick(e) {
              return e.stopPropagation();
            }
          }, icon);
        }
        return icon;
      }), _expandColumn);
      return cloneColumns.map(function (col) {
        return col === EXPAND_COLUMN ? expandColumn : col;
      });
    }
    if (process.env.NODE_ENV !== 'production' && baseColumns.includes(EXPAND_COLUMN)) {
      warning(false, '`expandable` is not config but there exist `EXPAND_COLUMN` in `columns`.');
    }
    return baseColumns.filter(function (col) {
      return col !== EXPAND_COLUMN;
    });
  }, [expandable, baseColumns, getRowKey, expandedKeys, expandIcon, direction]);

  // ========================= Transform ========================
  var mergedColumns = React.useMemo(function () {
    var finalColumns = withExpandColumns;
    if (transformColumns) {
      finalColumns = transformColumns(finalColumns);
    }

    // Always provides at least one column for table display
    if (!finalColumns.length) {
      finalColumns = [{
        render: function render() {
          return null;
        }
      }];
    }
    return finalColumns;
  }, [transformColumns, withExpandColumns, direction]);

  // ========================== Flatten =========================
  var flattenColumns = React.useMemo(function () {
    if (direction === 'rtl') {
      return revertForRtl(flatColumns(mergedColumns));
    }
    return flatColumns(mergedColumns);
  }, [mergedColumns, direction]);
  // Only check out of production since it's waste for each render
  if (process.env.NODE_ENV !== 'production') {
    warningFixed(direction === 'rtl' ? flattenColumns.slice().reverse() : flattenColumns);
  }
  return [mergedColumns, flattenColumns];
}
export default useColumns;