import { responseImmutable, useContext } from '@rc-component/context';
import * as React from 'react';
import PerfContext from "../context/PerfContext";
import TableContext from "../context/TableContext";
import useFlattenRecords from "../hooks/useFlattenRecords";
import devRenderTimes from "../hooks/useRenderTimes";
import { getColumnsKey } from "../utils/valueUtil";
import BodyRow from "./BodyRow";
import ExpandedRow from "./ExpandedRow";
import MeasureRow from "./MeasureRow";
function Body(props) {
  if (process.env.NODE_ENV !== 'production') {
    devRenderTimes(props);
  }
  var data = props.data,
    getRowKey = props.getRowKey,
    measureColumnWidth = props.measureColumnWidth,
    expandedKeys = props.expandedKeys,
    onRow = props.onRow,
    rowExpandable = props.rowExpandable,
    emptyNode = props.emptyNode,
    childrenColumnName = props.childrenColumnName;
  var _useContext = useContext(TableContext, ['prefixCls', 'getComponent', 'onColumnResize', 'flattenColumns']),
    prefixCls = _useContext.prefixCls,
    getComponent = _useContext.getComponent,
    onColumnResize = _useContext.onColumnResize,
    flattenColumns = _useContext.flattenColumns;
  var flattenData = useFlattenRecords(data, childrenColumnName, expandedKeys, getRowKey);

  // =================== Performance ====================
  var perfRef = React.useRef({
    renderWithProps: false
  });

  // ====================== Render ======================
  var WrapperComponent = getComponent(['body', 'wrapper'], 'tbody');
  var trComponent = getComponent(['body', 'row'], 'tr');
  var tdComponent = getComponent(['body', 'cell'], 'td');
  var thComponent = getComponent(['body', 'cell'], 'th');
  var rows;
  if (data.length) {
    rows = flattenData.map(function (item, idx) {
      var record = item.record,
        indent = item.indent,
        renderIndex = item.index;
      var key = getRowKey(record, idx);
      return /*#__PURE__*/React.createElement(BodyRow, {
        key: key,
        rowKey: key,
        record: record,
        index: idx,
        renderIndex: renderIndex,
        rowComponent: trComponent,
        cellComponent: tdComponent,
        scopeCellComponent: thComponent,
        expandedKeys: expandedKeys,
        onRow: onRow,
        getRowKey: getRowKey,
        rowExpandable: rowExpandable,
        childrenColumnName: childrenColumnName,
        indent: indent
      });
    });
  } else {
    rows = /*#__PURE__*/React.createElement(ExpandedRow, {
      expanded: true,
      className: "".concat(prefixCls, "-placeholder"),
      prefixCls: prefixCls,
      component: trComponent,
      cellComponent: tdComponent,
      colSpan: flattenColumns.length,
      isEmpty: true
    }, emptyNode);
  }
  var columnsKey = getColumnsKey(flattenColumns);
  return /*#__PURE__*/React.createElement(PerfContext.Provider, {
    value: perfRef.current
  }, /*#__PURE__*/React.createElement(WrapperComponent, {
    className: "".concat(prefixCls, "-tbody")
  }, measureColumnWidth && /*#__PURE__*/React.createElement(MeasureRow, {
    prefixCls: prefixCls,
    columnsKey: columnsKey,
    onColumnResize: onColumnResize
  }), rows));
}
Body.displayName = 'Body';
export default responseImmutable(Body);