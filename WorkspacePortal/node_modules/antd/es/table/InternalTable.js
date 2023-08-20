import classNames from 'classnames';
import { INTERNAL_HOOKS } from 'rc-table';
import { convertChildrenToColumns } from "rc-table/es/hooks/useColumns";
import omit from "rc-util/es/omit";
import * as React from 'react';
import scrollTo from '../_util/scrollTo';
import warning from '../_util/warning';
import { ConfigContext } from '../config-provider/context';
import DefaultRenderEmpty from '../config-provider/defaultRenderEmpty';
import useSize from '../config-provider/hooks/useSize';
import useBreakpoint from '../grid/hooks/useBreakpoint';
import defaultLocale from '../locale/en_US';
import Pagination from '../pagination';
import Spin from '../spin';
import renderExpandIcon from './ExpandIcon';
import RcTable from './RcTable';
import useFilter, { getFilterData } from './hooks/useFilter';
import useLazyKVMap from './hooks/useLazyKVMap';
import usePagination, { DEFAULT_PAGE_SIZE, getPaginationParam } from './hooks/usePagination';
import useSelection from './hooks/useSelection';
import useSorter, { getSortData } from './hooks/useSorter';
import useTitleColumns from './hooks/useTitleColumns';
import useStyle from './style';
const EMPTY_LIST = [];
const InternalTable = (props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    rootClassName,
    style,
    size: customizeSize,
    bordered,
    dropdownPrefixCls: customizeDropdownPrefixCls,
    dataSource,
    pagination,
    rowSelection,
    rowKey = 'key',
    rowClassName,
    columns,
    children,
    childrenColumnName: legacyChildrenColumnName,
    onChange,
    getPopupContainer,
    loading,
    expandIcon,
    expandable,
    expandedRowRender,
    expandIconColumnIndex,
    indentSize,
    scroll,
    sortDirections,
    locale,
    showSorterTooltip = true
  } = props;
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV !== "production" ? warning(!(typeof rowKey === 'function' && rowKey.length > 1), 'Table', '`index` parameter of `rowKey` function is deprecated. There is no guarantee that it will work as expected.') : void 0;
  }
  const baseColumns = React.useMemo(() => columns || convertChildrenToColumns(children), [columns, children]);
  const needResponsive = React.useMemo(() => baseColumns.some(col => col.responsive), [baseColumns]);
  const screens = useBreakpoint(needResponsive);
  const mergedColumns = React.useMemo(() => {
    const matched = new Set(Object.keys(screens).filter(m => screens[m]));
    return baseColumns.filter(c => !c.responsive || c.responsive.some(r => matched.has(r)));
  }, [baseColumns, screens]);
  const tableProps = omit(props, ['className', 'style', 'columns']);
  const {
    locale: contextLocale = defaultLocale,
    direction,
    table,
    renderEmpty,
    getPrefixCls,
    getPopupContainer: getContextPopupContainer
  } = React.useContext(ConfigContext);
  const mergedSize = useSize(customizeSize);
  const tableLocale = Object.assign(Object.assign({}, contextLocale.Table), locale);
  const rawData = dataSource || EMPTY_LIST;
  const prefixCls = getPrefixCls('table', customizePrefixCls);
  const dropdownPrefixCls = getPrefixCls('dropdown', customizeDropdownPrefixCls);
  const mergedExpandable = Object.assign({
    childrenColumnName: legacyChildrenColumnName,
    expandIconColumnIndex
  }, expandable);
  const {
    childrenColumnName = 'children'
  } = mergedExpandable;
  const expandType = React.useMemo(() => {
    if (rawData.some(item => item === null || item === void 0 ? void 0 : item[childrenColumnName])) {
      return 'nest';
    }
    if (expandedRowRender || expandable && expandable.expandedRowRender) {
      return 'row';
    }
    return null;
  }, [rawData]);
  const internalRefs = {
    body: React.useRef()
  };
  // ============================ RowKey ============================
  const getRowKey = React.useMemo(() => {
    if (typeof rowKey === 'function') {
      return rowKey;
    }
    return record => record === null || record === void 0 ? void 0 : record[rowKey];
  }, [rowKey]);
  const [getRecordByKey] = useLazyKVMap(rawData, childrenColumnName, getRowKey);
  // ============================ Events =============================
  const changeEventInfo = {};
  const triggerOnChange = function (info, action) {
    let reset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var _a, _b, _c;
    const changeInfo = Object.assign(Object.assign({}, changeEventInfo), info);
    if (reset) {
      (_a = changeEventInfo.resetPagination) === null || _a === void 0 ? void 0 : _a.call(changeEventInfo);
      // Reset event param
      if ((_b = changeInfo.pagination) === null || _b === void 0 ? void 0 : _b.current) {
        changeInfo.pagination.current = 1;
      }
      // Trigger pagination events
      if (pagination && pagination.onChange) {
        pagination.onChange(1, (_c = changeInfo.pagination) === null || _c === void 0 ? void 0 : _c.pageSize);
      }
    }
    if (scroll && scroll.scrollToFirstRowOnChange !== false && internalRefs.body.current) {
      scrollTo(0, {
        getContainer: () => internalRefs.body.current
      });
    }
    onChange === null || onChange === void 0 ? void 0 : onChange(changeInfo.pagination, changeInfo.filters, changeInfo.sorter, {
      currentDataSource: getFilterData(getSortData(rawData, changeInfo.sorterStates, childrenColumnName), changeInfo.filterStates),
      action
    });
  };
  /**
   * Controlled state in `columns` is not a good idea that makes too many code (1000+ line?) to read
   * state out and then put it back to title render. Move these code into `hooks` but still too
   * complex. We should provides Table props like `sorter` & `filter` to handle control in next big
   * version.
   */
  // ============================ Sorter =============================
  const onSorterChange = (sorter, sorterStates) => {
    triggerOnChange({
      sorter,
      sorterStates
    }, 'sort', false);
  };
  const [transformSorterColumns, sortStates, sorterTitleProps, getSorters] = useSorter({
    prefixCls,
    mergedColumns,
    onSorterChange,
    sortDirections: sortDirections || ['ascend', 'descend'],
    tableLocale,
    showSorterTooltip
  });
  const sortedData = React.useMemo(() => getSortData(rawData, sortStates, childrenColumnName), [rawData, sortStates]);
  changeEventInfo.sorter = getSorters();
  changeEventInfo.sorterStates = sortStates;
  // ============================ Filter ============================
  const onFilterChange = (filters, filterStates) => {
    triggerOnChange({
      filters,
      filterStates
    }, 'filter', true);
  };
  const [transformFilterColumns, filterStates, filters] = useFilter({
    prefixCls,
    locale: tableLocale,
    dropdownPrefixCls,
    mergedColumns,
    onFilterChange,
    getPopupContainer: getPopupContainer || getContextPopupContainer
  });
  const mergedData = getFilterData(sortedData, filterStates);
  changeEventInfo.filters = filters;
  changeEventInfo.filterStates = filterStates;
  // ============================ Column ============================
  const columnTitleProps = React.useMemo(() => {
    const mergedFilters = {};
    Object.keys(filters).forEach(filterKey => {
      if (filters[filterKey] !== null) {
        mergedFilters[filterKey] = filters[filterKey];
      }
    });
    return Object.assign(Object.assign({}, sorterTitleProps), {
      filters: mergedFilters
    });
  }, [sorterTitleProps, filters]);
  const [transformTitleColumns] = useTitleColumns(columnTitleProps);
  // ========================== Pagination ==========================
  const onPaginationChange = (current, pageSize) => {
    triggerOnChange({
      pagination: Object.assign(Object.assign({}, changeEventInfo.pagination), {
        current,
        pageSize
      })
    }, 'paginate');
  };
  const [mergedPagination, resetPagination] = usePagination(mergedData.length, onPaginationChange, pagination);
  changeEventInfo.pagination = pagination === false ? {} : getPaginationParam(mergedPagination, pagination);
  changeEventInfo.resetPagination = resetPagination;
  // ============================= Data =============================
  const pageData = React.useMemo(() => {
    if (pagination === false || !mergedPagination.pageSize) {
      return mergedData;
    }
    const {
      current = 1,
      total,
      pageSize = DEFAULT_PAGE_SIZE
    } = mergedPagination;
    process.env.NODE_ENV !== "production" ? warning(current > 0, 'Table', '`current` should be positive number.') : void 0;
    // Dynamic table data
    if (mergedData.length < total) {
      if (mergedData.length > pageSize) {
        process.env.NODE_ENV !== "production" ? warning(false, 'Table', '`dataSource` length is less than `pagination.total` but large than `pagination.pageSize`. Please make sure your config correct data with async mode.') : void 0;
        return mergedData.slice((current - 1) * pageSize, current * pageSize);
      }
      return mergedData;
    }
    return mergedData.slice((current - 1) * pageSize, current * pageSize);
  }, [!!pagination, mergedData, mergedPagination && mergedPagination.current, mergedPagination && mergedPagination.pageSize, mergedPagination && mergedPagination.total]);
  // ========================== Selections ==========================
  const [transformSelectionColumns, selectedKeySet] = useSelection({
    prefixCls,
    data: mergedData,
    pageData,
    getRowKey,
    getRecordByKey,
    expandType,
    childrenColumnName,
    locale: tableLocale,
    getPopupContainer: getPopupContainer || getContextPopupContainer
  }, rowSelection);
  const internalRowClassName = (record, index, indent) => {
    let mergedRowClassName;
    if (typeof rowClassName === 'function') {
      mergedRowClassName = classNames(rowClassName(record, index, indent));
    } else {
      mergedRowClassName = classNames(rowClassName);
    }
    return classNames({
      [`${prefixCls}-row-selected`]: selectedKeySet.has(getRowKey(record, index))
    }, mergedRowClassName);
  };
  // ========================== Expandable ==========================
  // Pass origin render status into `rc-table`, this can be removed when refactor with `rc-table`
  mergedExpandable.__PARENT_RENDER_ICON__ = mergedExpandable.expandIcon;
  // Customize expandable icon
  mergedExpandable.expandIcon = mergedExpandable.expandIcon || expandIcon || renderExpandIcon(tableLocale);
  // Adjust expand icon index, no overwrite expandIconColumnIndex if set.
  if (expandType === 'nest' && mergedExpandable.expandIconColumnIndex === undefined) {
    mergedExpandable.expandIconColumnIndex = rowSelection ? 1 : 0;
  } else if (mergedExpandable.expandIconColumnIndex > 0 && rowSelection) {
    mergedExpandable.expandIconColumnIndex -= 1;
  }
  // Indent size
  if (typeof mergedExpandable.indentSize !== 'number') {
    mergedExpandable.indentSize = typeof indentSize === 'number' ? indentSize : 15;
  }
  // ============================ Render ============================
  const transformColumns = React.useCallback(innerColumns => transformTitleColumns(transformSelectionColumns(transformFilterColumns(transformSorterColumns(innerColumns)))), [transformSorterColumns, transformFilterColumns, transformSelectionColumns]);
  let topPaginationNode;
  let bottomPaginationNode;
  if (pagination !== false && (mergedPagination === null || mergedPagination === void 0 ? void 0 : mergedPagination.total)) {
    let paginationSize;
    if (mergedPagination.size) {
      paginationSize = mergedPagination.size;
    } else {
      paginationSize = mergedSize === 'small' || mergedSize === 'middle' ? 'small' : undefined;
    }
    const renderPagination = position => /*#__PURE__*/React.createElement(Pagination, Object.assign({}, mergedPagination, {
      className: classNames(`${prefixCls}-pagination ${prefixCls}-pagination-${position}`, mergedPagination.className),
      size: paginationSize
    }));
    const defaultPosition = direction === 'rtl' ? 'left' : 'right';
    const {
      position
    } = mergedPagination;
    if (position !== null && Array.isArray(position)) {
      const topPos = position.find(p => p.includes('top'));
      const bottomPos = position.find(p => p.includes('bottom'));
      const isDisable = position.every(p => `${p}` === 'none');
      if (!topPos && !bottomPos && !isDisable) {
        bottomPaginationNode = renderPagination(defaultPosition);
      }
      if (topPos) {
        topPaginationNode = renderPagination(topPos.toLowerCase().replace('top', ''));
      }
      if (bottomPos) {
        bottomPaginationNode = renderPagination(bottomPos.toLowerCase().replace('bottom', ''));
      }
    } else {
      bottomPaginationNode = renderPagination(defaultPosition);
    }
  }
  // >>>>>>>>> Spinning
  let spinProps;
  if (typeof loading === 'boolean') {
    spinProps = {
      spinning: loading
    };
  } else if (typeof loading === 'object') {
    spinProps = Object.assign({
      spinning: true
    }, loading);
  }
  // Style
  const [wrapSSR, hashId] = useStyle(prefixCls);
  const wrapperClassNames = classNames(`${prefixCls}-wrapper`, table === null || table === void 0 ? void 0 : table.className, {
    [`${prefixCls}-wrapper-rtl`]: direction === 'rtl'
  }, className, rootClassName, hashId);
  const mergedStyle = Object.assign(Object.assign({}, table === null || table === void 0 ? void 0 : table.style), style);
  const emptyText = locale && locale.emptyText || (renderEmpty === null || renderEmpty === void 0 ? void 0 : renderEmpty('Table')) || /*#__PURE__*/React.createElement(DefaultRenderEmpty, {
    componentName: "Table"
  });
  return wrapSSR( /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: wrapperClassNames,
    style: mergedStyle
  }, /*#__PURE__*/React.createElement(Spin, Object.assign({
    spinning: false
  }, spinProps), topPaginationNode, /*#__PURE__*/React.createElement(RcTable, Object.assign({}, tableProps, {
    columns: mergedColumns,
    direction: direction,
    expandable: mergedExpandable,
    prefixCls: prefixCls,
    className: classNames({
      [`${prefixCls}-middle`]: mergedSize === 'middle',
      [`${prefixCls}-small`]: mergedSize === 'small',
      [`${prefixCls}-bordered`]: bordered,
      [`${prefixCls}-empty`]: rawData.length === 0
    }),
    data: pageData,
    rowKey: getRowKey,
    rowClassName: internalRowClassName,
    emptyText: emptyText,
    // Internal
    internalHooks: INTERNAL_HOOKS,
    internalRefs: internalRefs,
    transformColumns: transformColumns
  })), bottomPaginationNode)));
};
export default /*#__PURE__*/React.forwardRef(InternalTable);