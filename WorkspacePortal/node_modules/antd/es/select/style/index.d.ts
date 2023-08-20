import type { FullToken } from '../../theme/internal';
export interface ComponentToken {
    /**
     * @desc 下拉菜单 z-index
     * @descEN z-index of dropdown
     */
    zIndexPopup: number;
}
export interface SelectToken extends FullToken<'Select'> {
    rootPrefixCls: string;
    inputPaddingHorizontalBase: number;
}
declare const _default: (prefixCls: string) => import("../../theme/interface").UseComponentStyleResult;
export default _default;
