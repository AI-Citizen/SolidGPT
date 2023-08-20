import type { CSSObject } from '@ant-design/cssinjs';
export type ComponentToken = {
    /**
     * @desc 星星颜色
     * @descEN Star color
     */
    starColor: string;
    /**
     * @desc 星星大小
     * @descEN Star size
     */
    starSize: number;
    /**
     * @desc 星星悬浮时的缩放
     * @descEN Scale of star when hover
     */
    starHoverScale: CSSObject['transform'];
    /**
     * @desc 星星背景色
     * @descEN Star background color
     */
    starBg: string;
};
declare const _default: (prefixCls: string) => import("../../theme/interface").UseComponentStyleResult;
export default _default;
