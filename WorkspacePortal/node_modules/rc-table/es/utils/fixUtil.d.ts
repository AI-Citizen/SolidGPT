import type { ColumnGroupType, ColumnType, Direction, FixedType, StickyOffsets } from '../interface';
export interface FixedInfo {
    fixLeft: number | false;
    fixRight: number | false;
    lastFixLeft: boolean;
    firstFixRight: boolean;
    lastFixRight: boolean;
    firstFixLeft: boolean;
    isSticky: boolean;
}
export declare function getCellFixedInfo<RecordType = any>(colStart: number, colEnd: number, columns: readonly {
    fixed?: FixedType;
}[], stickyOffsets: StickyOffsets, direction: Direction, curColumns?: ColumnType<RecordType> | ColumnGroupType<RecordType>): FixedInfo;
