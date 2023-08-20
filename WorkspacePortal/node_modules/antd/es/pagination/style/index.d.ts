export interface ComponentToken {
    /**
     * @desc 页码选项背景色
     * @descEN Background color of Pagination item
     */
    itemBg: string;
    /**
     * @desc 页码尺寸
     * @descEN Size of Pagination item
     */
    itemSize: number;
    /**
     * @desc 页码激活态背景色
     * @descEN Background color of active Pagination item
     */
    itemActiveBg: string;
    /**
     * @desc 小号页码尺寸
     * @descEN Size of small Pagination item
     */
    itemSizeSM: number;
    /**
     * @desc 页码链接背景色
     * @descEN Background color of Pagination item link
     */
    itemLinkBg: string;
    /**
     * @desc 页码激活态禁用状态背景色
     * @descEN Background color of disabled active Pagination item
     */
    itemActiveBgDisabled: string;
    /**
     * @desc 页码激活态禁用状态文字颜色
     * @descEN Text color of disabled active Pagination item
     */
    itemActiveColorDisabled: string;
    /**
     * @desc 输入框背景色
     * @descEN Background color of input
     */
    itemInputBg: string;
    /**
     * @desc 每页展示数量选择器 top
     * @descEN Top of Pagination size changer
     */
    miniOptionsSizeChangerTop: number;
}
declare const _default: (prefixCls: string) => import("../../theme/interface").UseComponentStyleResult;
export default _default;
