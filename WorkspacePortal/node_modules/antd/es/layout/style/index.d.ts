import type { FullToken } from '../../theme/internal';
export interface ComponentToken {
    colorBgHeader: string;
    colorBgBody: string;
    colorBgTrigger: string;
}
export interface LayoutToken extends FullToken<'Layout'> {
    layoutHeaderHeight: number;
    layoutHeaderPaddingInline: number;
    layoutHeaderColor: string;
    layoutFooterPadding: string;
    layoutTriggerHeight: number;
    layoutZeroTriggerSize: number;
}
declare const _default: (prefixCls: string) => import("../../theme/interface").UseComponentStyleResult;
export default _default;
