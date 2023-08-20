import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import Cell from "../Cell";
import TableContext from "../context/TableContext";
import { useContext } from '@rc-component/context';
import { getCellFixedInfo } from "../utils/fixUtil";
import { getColumnsKey } from "../utils/valueUtil";
function HeaderRow(_ref) {
  var cells = _ref.cells,
    stickyOffsets = _ref.stickyOffsets,
    flattenColumns = _ref.flattenColumns,
    RowComponent = _ref.rowComponent,
    CellComponent = _ref.cellComponent,
    tdCellComponent = _ref.tdCellComponent,
    onHeaderRow = _ref.onHeaderRow,
    index = _ref.index;
  var _useContext = useContext(TableContext, ['prefixCls', 'direction']),
    prefixCls = _useContext.prefixCls,
    direction = _useContext.direction;
  var rowProps;
  if (onHeaderRow) {
    rowProps = onHeaderRow(cells.map(function (cell) {
      return cell.column;
    }), index);
  }
  var columnsKey = getColumnsKey(cells.map(function (cell) {
    return cell.column;
  }));
  return /*#__PURE__*/React.createElement(RowComponent, rowProps, cells.map(function (cell, cellIndex) {
    var column = cell.column;
    var fixedInfo = getCellFixedInfo(cell.colStart, cell.colEnd, flattenColumns, stickyOffsets, direction, column);
    var additionalProps;
    if (column && column.onHeaderCell) {
      additionalProps = cell.column.onHeaderCell(column);
    }
    return /*#__PURE__*/React.createElement(Cell, _extends({}, cell, {
      scope: column.title ? cell.colSpan > 1 ? 'colgroup' : 'col' : null,
      ellipsis: column.ellipsis,
      align: column.align,
      component: column.title ? CellComponent : tdCellComponent,
      prefixCls: prefixCls,
      key: columnsKey[cellIndex]
    }, fixedInfo, {
      additionalProps: additionalProps,
      rowType: "header"
    }));
  }));
}
HeaderRow.displayName = 'HeaderRow';
export default HeaderRow;