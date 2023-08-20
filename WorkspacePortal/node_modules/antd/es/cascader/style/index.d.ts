export interface ComponentToken {
    /**
     * @desc 选择器宽度
     * @descEN Width of Cascader
     */
    controlWidth: number;
    /**
     * @desc 选项宽度
     * @descEN Width of item
     */
    controlItemWidth: number;
    /**
     * @desc 下拉菜单高度
     * @descEN Height of dropdown
     */
    dropdownHeight: number;
}
declare const _default: (prefixCls: string) => import("../../theme/interface").UseComponentStyleResult;
export default _default;
