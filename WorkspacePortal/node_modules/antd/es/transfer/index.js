'use client';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import classNames from 'classnames';
import React, { useCallback, useContext } from 'react';
import { getMergedStatus, getStatusClassNames } from '../_util/statusUtils';
import { groupDisabledKeysMap, groupKeysMap } from '../_util/transKeys';
import warning from '../_util/warning';
import { ConfigContext } from '../config-provider';
import DefaultRenderEmpty from '../config-provider/defaultRenderEmpty';
import { FormItemInputContext } from '../form/context';
import { useLocale } from '../locale';
import defaultLocale from '../locale/en_US';
import useData from './hooks/useData';
import useSelection from './hooks/useSelection';
import List from './list';
import Operation from './operation';
import Search from './search';
import useStyle from './style';
const Transfer = props => {
  const {
    dataSource,
    targetKeys = [],
    selectedKeys,
    selectAllLabels = [],
    operations = [],
    style = {},
    listStyle = {},
    locale = {},
    titles,
    disabled,
    showSearch = false,
    operationStyle,
    showSelectAll,
    oneWay,
    pagination,
    status: customStatus,
    prefixCls: customizePrefixCls,
    className,
    rootClassName,
    selectionsIcon,
    filterOption,
    render,
    footer,
    children,
    rowKey,
    onScroll,
    onChange,
    onSearch,
    onSelectChange
  } = props;
  const {
    getPrefixCls,
    renderEmpty,
    direction: dir,
    transfer
  } = useContext(ConfigContext);
  const prefixCls = getPrefixCls('transfer', customizePrefixCls);
  const [wrapSSR, hashId] = useStyle(prefixCls);
  // Fill record with `key`
  const [mergedDataSource, leftDataSource, rightDataSource] = useData(dataSource, rowKey, targetKeys);
  // Get direction selected keys
  const [
  // Keys
  sourceSelectedKeys, targetSelectedKeys,
  // Setters
  setSourceSelectedKeys, setTargetSelectedKeys] = useSelection(leftDataSource, rightDataSource, selectedKeys);
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV !== "production" ? warning(!pagination || !children, 'Transfer', '`pagination` not support customize render list.') : void 0;
  }
  const setStateKeys = useCallback((direction, keys) => {
    if (direction === 'left') {
      const nextKeys = typeof keys === 'function' ? keys(sourceSelectedKeys || []) : keys;
      setSourceSelectedKeys(nextKeys);
    } else {
      const nextKeys = typeof keys === 'function' ? keys(targetSelectedKeys || []) : keys;
      setTargetSelectedKeys(nextKeys);
    }
  }, [sourceSelectedKeys, targetSelectedKeys]);
  const handleSelectChange = useCallback((direction, holder) => {
    if (direction === 'left') {
      onSelectChange === null || onSelectChange === void 0 ? void 0 : onSelectChange(holder, targetSelectedKeys);
    } else {
      onSelectChange === null || onSelectChange === void 0 ? void 0 : onSelectChange(sourceSelectedKeys, holder);
    }
  }, [sourceSelectedKeys, targetSelectedKeys]);
  const getTitles = transferLocale => {
    var _a;
    return (_a = titles !== null && titles !== void 0 ? titles : transferLocale.titles) !== null && _a !== void 0 ? _a : [];
  };
  const handleLeftScroll = e => {
    onScroll === null || onScroll === void 0 ? void 0 : onScroll('left', e);
  };
  const handleRightScroll = e => {
    onScroll === null || onScroll === void 0 ? void 0 : onScroll('right', e);
  };
  const moveTo = direction => {
    const moveKeys = direction === 'right' ? sourceSelectedKeys : targetSelectedKeys;
    const dataSourceDisabledKeysMap = groupDisabledKeysMap(mergedDataSource);
    // filter the disabled options
    const newMoveKeys = moveKeys.filter(key => !dataSourceDisabledKeysMap.has(key));
    const newMoveKeysMap = groupKeysMap(newMoveKeys);
    // move items to target box
    const newTargetKeys = direction === 'right' ? newMoveKeys.concat(targetKeys) : targetKeys.filter(targetKey => !newMoveKeysMap.has(targetKey));
    // empty checked keys
    const oppositeDirection = direction === 'right' ? 'left' : 'right';
    setStateKeys(oppositeDirection, []);
    handleSelectChange(oppositeDirection, []);
    onChange === null || onChange === void 0 ? void 0 : onChange(newTargetKeys, direction, newMoveKeys);
  };
  const moveToLeft = () => {
    moveTo('left');
  };
  const moveToRight = () => {
    moveTo('right');
  };
  const onItemSelectAll = (direction, keys, checkAll) => {
    setStateKeys(direction, prevKeys => {
      let mergedCheckedKeys = [];
      if (checkAll === 'replace') {
        mergedCheckedKeys = keys;
      } else if (checkAll) {
        // Merge current keys with origin key
        mergedCheckedKeys = Array.from(new Set([].concat(_toConsumableArray(prevKeys), _toConsumableArray(keys))));
      } else {
        const selectedKeysMap = groupKeysMap(keys);
        // Remove current keys from origin keys
        mergedCheckedKeys = prevKeys.filter(key => !selectedKeysMap.has(key));
      }
      handleSelectChange(direction, mergedCheckedKeys);
      return mergedCheckedKeys;
    });
  };
  const onLeftItemSelectAll = (keys, checkAll) => {
    onItemSelectAll('left', keys, checkAll);
  };
  const onRightItemSelectAll = (keys, checkAll) => {
    onItemSelectAll('right', keys, checkAll);
  };
  const leftFilter = e => onSearch === null || onSearch === void 0 ? void 0 : onSearch('left', e.target.value);
  const rightFilter = e => onSearch === null || onSearch === void 0 ? void 0 : onSearch('right', e.target.value);
  const handleLeftClear = () => onSearch === null || onSearch === void 0 ? void 0 : onSearch('left', '');
  const handleRightClear = () => onSearch === null || onSearch === void 0 ? void 0 : onSearch('right', '');
  const onItemSelect = (direction, selectedKey, checked) => {
    const holder = _toConsumableArray(direction === 'left' ? sourceSelectedKeys : targetSelectedKeys);
    const index = holder.indexOf(selectedKey);
    if (index > -1) {
      holder.splice(index, 1);
    }
    if (checked) {
      holder.push(selectedKey);
    }
    handleSelectChange(direction, holder);
    if (!props.selectedKeys) {
      setStateKeys(direction, holder);
    }
  };
  const onLeftItemSelect = (selectedKey, checked) => {
    onItemSelect('left', selectedKey, checked);
  };
  const onRightItemSelect = (selectedKey, checked) => {
    onItemSelect('right', selectedKey, checked);
  };
  const onRightItemRemove = keys => {
    setStateKeys('right', []);
    onChange === null || onChange === void 0 ? void 0 : onChange(targetKeys.filter(key => !keys.includes(key)), 'left', _toConsumableArray(keys));
  };
  const handleListStyle = direction => {
    if (typeof listStyle === 'function') {
      return listStyle({
        direction
      });
    }
    return listStyle || {};
  };
  const formItemContext = useContext(FormItemInputContext);
  const {
    hasFeedback,
    status
  } = formItemContext;
  const getLocale = transferLocale => Object.assign(Object.assign(Object.assign({}, transferLocale), {
    notFoundContent: (renderEmpty === null || renderEmpty === void 0 ? void 0 : renderEmpty('Transfer')) || /*#__PURE__*/React.createElement(DefaultRenderEmpty, {
      componentName: "Transfer"
    })
  }), locale);
  const mergedStatus = getMergedStatus(status, customStatus);
  const mergedPagination = !children && pagination;
  const leftActive = targetSelectedKeys.length > 0;
  const rightActive = sourceSelectedKeys.length > 0;
  const cls = classNames(prefixCls, {
    [`${prefixCls}-disabled`]: disabled,
    [`${prefixCls}-customize-list`]: !!children,
    [`${prefixCls}-rtl`]: dir === 'rtl'
  }, getStatusClassNames(prefixCls, mergedStatus, hasFeedback), transfer === null || transfer === void 0 ? void 0 : transfer.className, className, rootClassName, hashId);
  const [contextLocale] = useLocale('Transfer', defaultLocale.Transfer);
  const listLocale = getLocale(contextLocale);
  const [leftTitle, rightTitle] = getTitles(listLocale);
  return wrapSSR( /*#__PURE__*/React.createElement("div", {
    className: cls,
    style: Object.assign(Object.assign({}, transfer === null || transfer === void 0 ? void 0 : transfer.style), style)
  }, /*#__PURE__*/React.createElement(List, Object.assign({
    prefixCls: `${prefixCls}-list`,
    titleText: leftTitle,
    dataSource: leftDataSource,
    filterOption: filterOption,
    style: handleListStyle('left'),
    checkedKeys: sourceSelectedKeys,
    handleFilter: leftFilter,
    handleClear: handleLeftClear,
    onItemSelect: onLeftItemSelect,
    onItemSelectAll: onLeftItemSelectAll,
    render: render,
    showSearch: showSearch,
    renderList: children,
    footer: footer,
    onScroll: handleLeftScroll,
    disabled: disabled,
    direction: dir === 'rtl' ? 'right' : 'left',
    showSelectAll: showSelectAll,
    selectAllLabel: selectAllLabels[0],
    pagination: mergedPagination,
    selectionsIcon: selectionsIcon
  }, listLocale)), /*#__PURE__*/React.createElement(Operation, {
    className: `${prefixCls}-operation`,
    rightActive: rightActive,
    rightArrowText: operations[0],
    moveToRight: moveToRight,
    leftActive: leftActive,
    leftArrowText: operations[1],
    moveToLeft: moveToLeft,
    style: operationStyle,
    disabled: disabled,
    direction: dir,
    oneWay: oneWay
  }), /*#__PURE__*/React.createElement(List, Object.assign({
    prefixCls: `${prefixCls}-list`,
    titleText: rightTitle,
    dataSource: rightDataSource,
    filterOption: filterOption,
    style: handleListStyle('right'),
    checkedKeys: targetSelectedKeys,
    handleFilter: rightFilter,
    handleClear: handleRightClear,
    onItemSelect: onRightItemSelect,
    onItemSelectAll: onRightItemSelectAll,
    onItemRemove: onRightItemRemove,
    render: render,
    showSearch: showSearch,
    renderList: children,
    footer: footer,
    onScroll: handleRightScroll,
    disabled: disabled,
    direction: dir === 'rtl' ? 'left' : 'right',
    showSelectAll: showSelectAll,
    selectAllLabel: selectAllLabels[1],
    showRemove: oneWay,
    pagination: mergedPagination,
    selectionsIcon: selectionsIcon
  }, listLocale))));
};
if (process.env.NODE_ENV !== 'production') {
  Transfer.displayName = 'Transfer';
}
Transfer.List = List;
Transfer.Search = Search;
Transfer.Operation = Operation;
export default Transfer;