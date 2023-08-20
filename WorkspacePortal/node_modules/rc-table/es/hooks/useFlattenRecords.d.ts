import type { GetRowKey, Key } from '../interface';
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
export default function useFlattenRecords<T>(data: any, childrenColumnName: string, expandedKeys: Set<Key>, getRowKey: GetRowKey<T>): {
    record: T;
    indent: number;
    index: number;
}[];
