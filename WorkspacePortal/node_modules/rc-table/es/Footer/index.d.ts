import * as React from 'react';
import type { ColumnsType, ColumnType, StickyOffsets } from '../interface';
import Summary from './Summary';
type FlattenColumns<RecordType> = readonly (ColumnType<RecordType> & {
    scrollbar?: boolean;
})[];
export interface FooterProps<RecordType> {
    children: React.ReactNode;
    stickyOffsets: StickyOffsets;
    flattenColumns: FlattenColumns<RecordType>;
    columns: ColumnsType<RecordType>;
}
declare function Footer<RecordType>(props: FooterProps<RecordType>): React.JSX.Element;
declare const _default: typeof Footer;
export default _default;
export declare const FooterComponents: typeof Summary;
