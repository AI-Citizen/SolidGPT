import type { UseComponentStyleResult } from '../../theme/internal';
export interface ComponentToken {
    /**
     * @desc 文字提示 z-index
     * @descEN z-index of tooltip
     */
    zIndexPopup: number;
    /** @deprecated */
    colorBgDefault: string;
}
declare const _default: (prefixCls: string, injectStyle: boolean) => UseComponentStyleResult;
export default _default;
