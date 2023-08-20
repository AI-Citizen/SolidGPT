export interface ComponentToken {
    /**
     * @desc 头像背景色
     * @descEN Background color of Avatar
     */
    containerSize: number;
    /**
     * @desc 大号头像尺寸
     * @descEN Size of large Avatar
     */
    containerSizeLG: number;
    /**
     * @desc 小号头像尺寸
     * @descEN Size of small Avatar
     */
    containerSizeSM: number;
    /**
     * @desc 头像文字大小
     * @descEN Font size of Avatar
     */
    textFontSize: number;
    /**
     * @desc 大号头像文字大小
     * @descEN Font size of large Avatar
     */
    textFontSizeLG: number;
    /**
     * @desc 小号头像文字大小
     * @descEN Font size of small Avatar
     */
    textFontSizeSM: number;
    /**
     * @desc 头像组间距
     * @descEN Spacing between avatars in a group
     */
    groupSpace: number;
    /**
     * @desc 头像组重叠宽度
     * @descEN Overlapping of avatars in a group
     */
    groupOverlapping: number;
    /**
     * @desc 头像组边框颜色
     * @descEN Border color of avatars in a group
     */
    groupBorderColor: string;
}
declare const _default: (prefixCls: string) => import("../../theme/interface").UseComponentStyleResult;
export default _default;
