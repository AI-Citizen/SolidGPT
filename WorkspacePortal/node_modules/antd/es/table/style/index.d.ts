import type { FullToken } from '../../theme/internal';
export interface ComponentToken {
}
export interface TableToken extends FullToken<'Table'> {
    tableFontSize: number;
    tableBg: string;
    tableRadius: number;
    tablePaddingHorizontal: number;
    tablePaddingVertical: number;
    tablePaddingHorizontalMiddle: number;
    tablePaddingVerticalMiddle: number;
    tablePaddingHorizontalSmall: number;
    tablePaddingVerticalSmall: number;
    tableBorderColor: string;
    tableHeaderTextColor: string;
    tableHeaderBg: string;
    tableFooterTextColor: string;
    tableFooterBg: string;
    tableHeaderCellSplitColor: string;
    tableHeaderSortBg: string;
    tableHeaderSortHoverBg: string;
    tableHeaderIconColor: string;
    tableHeaderIconColorHover: string;
    tableBodySortBg: string;
    tableFixedHeaderSortActiveBg: string;
    tableHeaderFilterActiveBg: string;
    tableFilterDropdownBg: string;
    tableFilterDropdownHeight: number;
    tableRowHoverBg: string;
    tableSelectedRowBg: string;
    tableSelectedRowHoverBg: string;
    tableFontSizeMiddle: number;
    tableFontSizeSmall: number;
    tableSelectionColumnWidth: number;
    tableExpandIconBg: string;
    tableExpandColumnWidth: number;
    tableExpandedRowBg: string;
    tableFilterDropdownWidth: number;
    tableFilterDropdownSearchWidth: number;
    zIndexTableFixed: number;
    zIndexTableSticky: number;
    tableScrollThumbSize: number;
    tableScrollThumbBg: string;
    tableScrollThumbBgHover: string;
    tableScrollBg: string;
}
declare const _default: (prefixCls: string) => import("../../theme/interface").UseComponentStyleResult;
export default _default;
