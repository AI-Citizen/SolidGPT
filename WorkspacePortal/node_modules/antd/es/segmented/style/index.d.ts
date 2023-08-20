export interface ComponentToken {
    /**
     * @desc 选项文本颜色
     * @descEN Text color of item
     */
    itemColor: string;
    /**
     * @desc 选项悬浮态文本颜色
     * @descEN Text color of item when hover
     */
    itemHoverColor: string;
    /**
     * @desc 选项悬浮态背景颜色
     * @descEN Background color of item when hover
     */
    itemHoverBg: string;
    /**
     * @desc 选项激活态背景颜色
     * @descEN Background color of item when active
     */
    itemActiveBg: string;
    /**
     * @desc 选项选中时背景颜色
     * @descEN Background color of item when selected
     */
    itemSelectedBg: string;
}
declare const _default: (prefixCls: string) => import("../../theme/interface").UseComponentStyleResult;
export default _default;
