import type { FullToken, GenerateStyle } from '../../theme/internal';
export interface ComponentToken {
}
type CollapseToken = FullToken<'Collapse'> & {
    collapseContentBg: string;
    collapseHeaderBg: string;
    collapseHeaderPadding: string;
    collapseHeaderPaddingSM: string;
    collapseHeaderPaddingLG: string;
    collapsePanelBorderRadius: number;
    collapseContentPaddingHorizontal: number;
};
export declare const genBaseStyle: GenerateStyle<CollapseToken>;
declare const _default: (prefixCls: string) => import("../../theme/interface").UseComponentStyleResult;
export default _default;
