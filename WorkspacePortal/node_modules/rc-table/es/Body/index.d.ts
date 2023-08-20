import * as React from 'react';
import type { GetComponentProps, GetRowKey, Key } from '../interface';
export interface BodyProps<RecordType> {
    data: readonly RecordType[];
    getRowKey: GetRowKey<RecordType>;
    measureColumnWidth: boolean;
    expandedKeys: Set<Key>;
    onRow: GetComponentProps<RecordType>;
    rowExpandable: (record: RecordType) => boolean;
    emptyNode: React.ReactNode;
    childrenColumnName: string;
}
declare function Body<RecordType>(props: BodyProps<RecordType>): React.JSX.Element;
declare namespace Body {
    var displayName: string;
}
declare const _default: typeof Body;
export default _default;
