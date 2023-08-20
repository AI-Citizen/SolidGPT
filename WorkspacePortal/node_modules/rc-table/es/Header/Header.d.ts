import * as React from 'react';
import type { ColumnsType, ColumnType, GetComponentProps, StickyOffsets } from '../interface';
export interface HeaderProps<RecordType> {
    columns: ColumnsType<RecordType>;
    flattenColumns: readonly ColumnType<RecordType>[];
    stickyOffsets: StickyOffsets;
    onHeaderRow: GetComponentProps<readonly ColumnType<RecordType>[]>;
}
declare function Header<RecordType>(props: HeaderProps<RecordType>): React.ReactElement;
declare const _default: typeof Header;
export default _default;
