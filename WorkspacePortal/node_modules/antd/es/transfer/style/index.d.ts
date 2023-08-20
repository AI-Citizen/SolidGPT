export interface ComponentToken {
    /**
     * @desc 列表宽度
     * @descEN Width of list
     */
    listWidth: number;
    /**
     * @desc 大号列表宽度
     * @descEN Width of large list
     */
    listWidthLG: number;
    /**
     * @desc 列表高度
     * @descEN Height of list
     */
    listHeight: number;
    /**
     * @desc 列表项高度
     * @descEN Height of list item
     */
    itemHeight: number;
    /**
     * @desc 列表项纵向内边距
     * @descEN Vertical padding of list item
     */
    itemPaddingBlock: number;
    /**
     * @desc 顶部高度
     * @descEN Height of header
     */
    headerHeight: number;
}
declare const _default: (prefixCls: string) => import("../../theme/interface").UseComponentStyleResult;
export default _default;
