export interface ComponentToken {
    /**
     * @desc 面包屑项文字颜色
     * @descEN Text color of Breadcrumb item
     */
    itemColor: string;
    /**
     * @desc 图标大小
     * @descEN Icon size
     */
    iconFontSize: number;
    /**
     * @desc 链接文字颜色
     * @descEN Text color of link
     */
    linkColor: string;
    /**
     * @desc 链接文字悬浮颜色
     * @descEN Color of hovered link
     */
    linkHoverColor: string;
    /**
     * @desc 最后一项文字颜色
     * @descEN Text color of the last item
     */
    lastItemColor: string;
    /**
     * @desc 分隔符外间距
     * @descEN Margin of separator
     */
    separatorMargin: number;
    /**
     * @desc 分隔符颜色
     * @descEN Color of separator
     */
    separatorColor: string;
}
declare const _default: (prefixCls: string) => import("../../theme/interface").UseComponentStyleResult;
export default _default;
