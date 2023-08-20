import type { FullToken } from '../../theme/internal';
export interface ComponentToken {
    /**
     * @desc 确认框 z-index
     * @descEN z-index of Popconfirm
     */
    zIndexPopup: number;
}
export interface PopconfirmToken extends FullToken<'Popconfirm'> {
}
declare const _default: (prefixCls: string) => import("../../theme/interface").UseComponentStyleResult;
export default _default;
