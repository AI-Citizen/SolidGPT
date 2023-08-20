export interface ComponentToken {
    /**
     * @desc 滑动输入高度
     * @descEN Height of slider
     */
    controlSize: number;
    /**
     * @desc 轨道高度
     * @descEN Height of rail
     */
    railSize: number;
    /**
     * @desc 滑块尺寸
     * @descEN Size of handle
     */
    handleSize: number;
    /**
     * @desc 滑块尺寸（悬浮态）
     * @descEN Size of handle when hover
     */
    handleSizeHover: number;
    /**
     * @desc 滑块边框宽度
     * @descEN Border width of handle
     */
    handleLineWidth: number;
    /**
     * @desc 滑块边框宽度（悬浮态）
     * @descEN Border width of handle when hover
     */
    handleLineWidthHover: number;
    /**
     * @desc 滑块圆点尺寸
     * @descEN Size of dot
     */
    dotSize: number;
    railBg: string;
    railHoverBg: string;
    trackBg: string;
    trackHoverBg: string;
    handleColor: string;
    handleActiveColor: string;
    dotBorderColor: string;
    dotActiveBorderColor: string;
    trackBgDisabled: string;
}
declare const _default: (prefixCls: string) => import("../../theme/interface").UseComponentStyleResult;
export default _default;
