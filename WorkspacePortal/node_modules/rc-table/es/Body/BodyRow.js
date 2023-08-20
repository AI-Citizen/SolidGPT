import _extends from "@babel/runtime/helpers/esm/extends";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { responseImmutable, useContext } from '@rc-component/context';
import classNames from 'classnames';
import * as React from 'react';
import Cell from "../Cell";
import TableContext from "../context/TableContext";
import devRenderTimes from "../hooks/useRenderTimes";
import { getColumnsKey } from "../utils/valueUtil";
import ExpandedRow from "./ExpandedRow";
function BodyRow(props) {
  if (process.env.NODE_ENV !== 'production') {
    devRenderTimes(props);
  }
  var className = props.className,
    style = props.style,
    record = props.record,
    index = props.index,
    renderIndex = props.renderIndex,
    rowKey = props.rowKey,
    rowExpandable = props.rowExpandable,
    expandedKeys = props.expandedKeys,
    onRow = props.onRow,
    _props$indent = props.indent,
    indent = _props$indent === void 0 ? 0 : _props$indent,
    RowComponent = props.rowComponent,
    cellComponent = props.cellComponent,
    scopeCellComponent = props.scopeCellComponent,
    childrenColumnName = props.childrenColumnName;
  var _useContext = useContext(TableContext, ['prefixCls', 'fixedInfoList', 'flattenColumns', 'expandableType', 'expandRowByClick', 'onTriggerExpand', 'rowClassName', 'expandedRowClassName', 'indentSize', 'expandIcon', 'expandedRowRender', 'expandIconColumnIndex']),
    prefixCls = _useContext.prefixCls,
    fixedInfoList = _useContext.fixedInfoList,
    flattenColumns = _useContext.flattenColumns,
    expandableType = _useContext.expandableType,
    expandRowByClick = _useContext.expandRowByClick,
    onTriggerExpand = _useContext.onTriggerExpand,
    rowClassName = _useContext.rowClassName,
    expandedRowClassName = _useContext.expandedRowClassName,
    indentSize = _useContext.indentSize,
    expandIcon = _useContext.expandIcon,
    expandedRowRender = _useContext.expandedRowRender,
    expandIconColumnIndex = _useContext.expandIconColumnIndex;
  var _React$useState = React.useState(false),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    expandRended = _React$useState2[0],
    setExpandRended = _React$useState2[1];
  if (process.env.NODE_ENV !== 'production') {
    devRenderTimes(props);
  }
  var expanded = expandedKeys && expandedKeys.has(rowKey);
  React.useEffect(function () {
    if (expanded) {
      setExpandRended(true);
    }
  }, [expanded]);
  var rowSupportExpand = expandableType === 'row' && (!rowExpandable || rowExpandable(record));
  // Only when row is not expandable and `children` exist in record
  var nestExpandable = expandableType === 'nest';
  var hasNestChildren = childrenColumnName && record && record[childrenColumnName];
  var mergedExpandable = rowSupportExpand || nestExpandable;

  // ======================== Expandable =========================
  var onExpandRef = React.useRef(onTriggerExpand);
  onExpandRef.current = onTriggerExpand;
  var onInternalTriggerExpand = function onInternalTriggerExpand() {
    onExpandRef.current.apply(onExpandRef, arguments);
  };

  // =========================== onRow ===========================
  var additionalProps = onRow === null || onRow === void 0 ? void 0 : onRow(record, index);
  var onClick = function onClick(event) {
    var _additionalProps$onCl;
    if (expandRowByClick && mergedExpandable) {
      onInternalTriggerExpand(record, event);
    }
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    additionalProps === null || additionalProps === void 0 ? void 0 : (_additionalProps$onCl = additionalProps.onClick) === null || _additionalProps$onCl === void 0 ? void 0 : _additionalProps$onCl.call.apply(_additionalProps$onCl, [additionalProps, event].concat(args));
  };

  // ======================== Base tr row ========================
  var computeRowClassName;
  if (typeof rowClassName === 'string') {
    computeRowClassName = rowClassName;
  } else if (typeof rowClassName === 'function') {
    computeRowClassName = rowClassName(record, index, indent);
  }
  var columnsKey = getColumnsKey(flattenColumns);
  var baseRowNode = /*#__PURE__*/React.createElement(RowComponent, _extends({}, additionalProps, {
    "data-row-key": rowKey,
    className: classNames(className, "".concat(prefixCls, "-row"), "".concat(prefixCls, "-row-level-").concat(indent), computeRowClassName, additionalProps && additionalProps.className),
    style: _objectSpread(_objectSpread({}, style), additionalProps ? additionalProps.style : null),
    onClick: onClick
  }), flattenColumns.map(function (column, colIndex) {
    var render = column.render,
      dataIndex = column.dataIndex,
      columnClassName = column.className;
    var key = columnsKey[colIndex];
    var fixedInfo = fixedInfoList[colIndex];

    // ============= Used for nest expandable =============
    var appendCellNode;
    if (colIndex === (expandIconColumnIndex || 0) && nestExpandable) {
      appendCellNode = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
        style: {
          paddingLeft: "".concat(indentSize * indent, "px")
        },
        className: "".concat(prefixCls, "-row-indent indent-level-").concat(indent)
      }), expandIcon({
        prefixCls: prefixCls,
        expanded: expanded,
        expandable: hasNestChildren,
        record: record,
        onExpand: onInternalTriggerExpand
      }));
    }
    var additionalCellProps;
    if (column.onCell) {
      additionalCellProps = column.onCell(record, index);
    }
    return /*#__PURE__*/React.createElement(Cell, _extends({
      className: columnClassName,
      ellipsis: column.ellipsis,
      align: column.align,
      scope: column.rowScope,
      component: column.rowScope ? scopeCellComponent : cellComponent,
      prefixCls: prefixCls,
      key: key,
      record: record,
      index: index,
      renderIndex: renderIndex,
      dataIndex: dataIndex,
      render: render,
      shouldCellUpdate: column.shouldCellUpdate,
      expanded: appendCellNode && expanded
    }, fixedInfo, {
      appendNode: appendCellNode,
      additionalProps: additionalCellProps
    }));
  }));

  // ======================== Expand Row =========================
  var expandRowNode;
  if (rowSupportExpand && (expandRended || expanded)) {
    var expandContent = expandedRowRender(record, index, indent + 1, expanded);
    var computedExpandedRowClassName = expandedRowClassName && expandedRowClassName(record, index, indent);
    expandRowNode = /*#__PURE__*/React.createElement(ExpandedRow, {
      expanded: expanded,
      className: classNames("".concat(prefixCls, "-expanded-row"), "".concat(prefixCls, "-expanded-row-level-").concat(indent + 1), computedExpandedRowClassName),
      prefixCls: prefixCls,
      component: RowComponent,
      cellComponent: cellComponent,
      colSpan: flattenColumns.length,
      isEmpty: false
    }, expandContent);
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, baseRowNode, expandRowNode);
}
BodyRow.displayName = 'BodyRow';
export default responseImmutable(BodyRow);