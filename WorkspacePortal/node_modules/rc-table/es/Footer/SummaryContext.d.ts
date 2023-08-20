import * as React from 'react';
import type { ColumnsType, ColumnType, StickyOffsets } from '../interface';
type FlattenColumns<RecordType> = readonly (ColumnType<RecordType> & {
    scrollbar?: boolean;
})[];
declare const SummaryContext: React.Context<{
    stickyOffsets?: StickyOffsets;
    scrollColumnIndex?: number;
    flattenColumns?: FlattenColumns<any>;
    columns?: ColumnsType<any>;
}>;
export default SummaryContext;
