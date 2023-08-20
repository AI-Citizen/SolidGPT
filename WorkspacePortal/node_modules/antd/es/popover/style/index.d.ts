import type { FullToken } from '../../theme/internal';
export interface ComponentToken {
    /**
     * @desc 气泡卡片宽度
     * @descEN Width of Popover
     */
    width: number;
    /**
     * @desc 气泡卡片最小宽度
     * @descEN Min width of Popover
     */
    minWidth: number;
    /**
     * @desc 气泡卡片 z-index
     * @descEN z-index of Popover
     */
    zIndexPopup: number;
}
export type PopoverToken = FullToken<'Popover'> & {
    popoverBg: string;
    popoverColor: string;
    popoverPadding: number | string;
};
declare const _default: (prefixCls: string) => import("../../theme/interface").UseComponentStyleResult;
export default _default;
