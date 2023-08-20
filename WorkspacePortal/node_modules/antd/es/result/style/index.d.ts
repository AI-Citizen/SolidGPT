import type { CSSProperties } from 'react';
export interface ComponentToken {
    /**
     * @desc 标题字体大小
     * @descEN Title font size
     */
    titleFontSize: number;
    /**
     * @desc 副标题字体大小
     * @descEN Subtitle font size
     */
    subtitleFontSize: number;
    /**
     * @desc 图标大小
     * @descEN Icon size
     */
    iconFontSize: number;
    /**
     * @desc 额外区域外间距
     * @descEN Margin of extra area
     */
    extraMargin: CSSProperties['margin'];
}
declare const _default: (prefixCls: string) => import("../../theme/interface").UseComponentStyleResult;
export default _default;
