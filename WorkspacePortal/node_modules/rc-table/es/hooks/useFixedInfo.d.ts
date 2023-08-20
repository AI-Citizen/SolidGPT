import type { ColumnsType, ColumnType, Direction, StickyOffsets } from '../interface';
export default function useFixedInfo<RecordType>(flattenColumns: readonly ColumnType<RecordType>[], stickyOffsets: StickyOffsets, direction: Direction, columns: ColumnsType<RecordType>): import("../utils/fixUtil").FixedInfo[];
