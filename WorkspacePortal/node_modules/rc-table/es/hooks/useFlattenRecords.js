import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import * as React from 'react';
// recursion (flat tree structure)
function flatRecord(record, indent, childrenColumnName, expandedKeys, getRowKey, index) {
  var arr = [];
  arr.push({
    record: record,
    indent: indent,
    index: index
  });
  var key = getRowKey(record);
  var expanded = expandedKeys === null || expandedKeys === void 0 ? void 0 : expandedKeys.has(key);
  if (record && Array.isArray(record[childrenColumnName]) && expanded) {
    // expanded state, flat record
    for (var i = 0; i < record[childrenColumnName].length; i += 1) {
      var tempArr = flatRecord(record[childrenColumnName][i], indent + 1, childrenColumnName, expandedKeys, getRowKey, i);
      arr.push.apply(arr, _toConsumableArray(tempArr));
    }
  }
  return arr;
}

/**
 * flat tree data on expanded state
 *
 * @export
 * @template T
 * @param {*} data : table data
 * @param {string} childrenColumnName : 指定树形结构的列名
 * @param {Set<Key>} expandedKeys : 展开的行对应的keys
 * @param {GetRowKey<T>} getRowKey  : 获取当前rowKey的方法
 * @returns flattened data
 */
export default function useFlattenRecords(data, childrenColumnName, expandedKeys, getRowKey) {
  var arr = React.useMemo(function () {
    if (expandedKeys !== null && expandedKeys !== void 0 && expandedKeys.size) {
      var temp = [];

      // collect flattened record
      for (var i = 0; i < (data === null || data === void 0 ? void 0 : data.length); i += 1) {
        var _temp;
        var record = data[i];

        // using array.push or spread operator may cause "Maximum call stack size exceeded" exception if array size is big enough.
        temp = (_temp = temp).concat.apply(_temp, _toConsumableArray(flatRecord(record, 0, childrenColumnName, expandedKeys, getRowKey, i)));
      }
      return temp;
    }
    return data === null || data === void 0 ? void 0 : data.map(function (item, index) {
      return {
        record: item,
        indent: 0,
        index: index
      };
    });
  }, [data, childrenColumnName, expandedKeys, getRowKey]);
  return arr;
}