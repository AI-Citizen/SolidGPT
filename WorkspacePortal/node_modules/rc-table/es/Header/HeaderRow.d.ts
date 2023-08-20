import * as React from 'react';
import type { CellType, ColumnType, CustomizeComponent, GetComponentProps, StickyOffsets } from '../interface';
export interface RowProps<RecordType> {
    cells: readonly CellType<RecordType>[];
    stickyOffsets: StickyOffsets;
    flattenColumns: readonly ColumnType<RecordType>[];
    rowComponent: CustomizeComponent;
    cellComponent: CustomizeComponent;
    tdCellComponent: CustomizeComponent;
    onHeaderRow: GetComponentProps<readonly ColumnType<RecordType>[]>;
    index: number;
}
declare function HeaderRow<RecordType>({ cells, stickyOffsets, flattenColumns, rowComponent: RowComponent, cellComponent: CellComponent, tdCellComponent, onHeaderRow, index, }: RowProps<RecordType>): React.JSX.Element;
declare namespace HeaderRow {
    var displayName: string;
}
export default HeaderRow;
