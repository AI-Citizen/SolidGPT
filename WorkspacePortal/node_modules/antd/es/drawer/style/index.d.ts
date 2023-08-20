import type { FullToken } from '../../theme/internal';
export interface ComponentToken {
    /**
     * @desc 弹窗 z-index
     * @descEN z-index of drawer
     */
    zIndexPopup: number;
    /**
     * @desc 底部区域纵向内间距
     * @descEN Vertical padding of footer
     */
    footerPaddingBlock: number;
    /**
     * @desc 底部区域横向内间距
     * @descEN Horizontal padding of footer
     */
    footerPaddingInline: number;
}
export interface DrawerToken extends FullToken<'Drawer'> {
}
declare const _default: (prefixCls: string) => import("../../theme/interface").UseComponentStyleResult;
export default _default;
