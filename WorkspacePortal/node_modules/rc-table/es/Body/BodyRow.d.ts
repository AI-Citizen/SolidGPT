import * as React from 'react';
import type { CustomizeComponent, GetComponentProps, GetRowKey, Key } from '../interface';
export interface BodyRowProps<RecordType> {
    record: RecordType;
    index: number;
    renderIndex: number;
    className?: string;
    style?: React.CSSProperties;
    expandedKeys: Set<Key>;
    rowComponent: CustomizeComponent;
    cellComponent: CustomizeComponent;
    scopeCellComponent: CustomizeComponent;
    onRow: GetComponentProps<RecordType>;
    rowExpandable: (record: RecordType) => boolean;
    indent?: number;
    rowKey: React.Key;
    getRowKey: GetRowKey<RecordType>;
    childrenColumnName: string;
}
declare function BodyRow<RecordType extends {
    children?: readonly RecordType[];
}>(props: BodyRowProps<RecordType>): React.JSX.Element;
declare namespace BodyRow {
    var displayName: string;
}
declare const _default: typeof BodyRow;
export default _default;
