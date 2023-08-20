import type { FullToken } from '../../theme/internal';
export interface ComponentToken {
    /**
     * @desc 下拉菜单 z-index
     * @descEN z-index of dropdown
     */
    zIndexPopup: number;
}
export interface DropdownToken extends FullToken<'Dropdown'> {
    rootPrefixCls: string;
    dropdownArrowDistance: number;
    dropdownArrowOffset: number;
    dropdownPaddingVertical: number;
    dropdownEdgeChildPadding: number;
    menuCls: string;
}
declare const _default: (prefixCls: string) => import("../../theme/interface").UseComponentStyleResult;
export default _default;
