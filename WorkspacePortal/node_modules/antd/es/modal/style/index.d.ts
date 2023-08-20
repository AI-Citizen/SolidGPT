import type { AliasToken, FullToken, GenerateStyle } from '../../theme/internal';
import type { TokenWithCommonCls } from '../../theme/util/genComponentStyleHook';
/** Component only token. Which will handle additional calculation of alias token */
export interface ComponentToken {
    /**
     * @desc 顶部背景色
     * @descEN Background color of header
     */
    headerBg: string;
    /**
     * @desc 标题行高
     * @descEN Line height of title
     */
    titleLineHeight: number;
    /**
     * @desc 标题字体大小
     * @descEN Font size of title
     */
    titleFontSize: number;
    /**
     * @desc 标题字体颜色
     * @descEN Font color of title
     */
    titleColor: string;
    /**
     * @desc 内容区域背景色
     * @descEN Background color of content
     */
    contentBg: string;
    /**
     * @desc 底部区域背景色
     * @descEN Background color of footer
     */
    footerBg: string;
}
export interface ModalToken extends FullToken<'Modal'> {
    modalHeaderHeight: number;
    modalBodyPadding: number;
    modalHeaderPadding: string;
    modalHeaderBorderWidth: number;
    modalHeaderBorderStyle: string;
    modalHeaderBorderColorSplit: string;
    modalFooterBorderColorSplit: string;
    modalFooterBorderStyle: string;
    modalFooterPaddingVertical: number;
    modalFooterPaddingHorizontal: number;
    modalFooterBorderWidth: number;
    modalIconHoverColor: string;
    modalCloseIconColor: string;
    modalCloseBtnSize: number;
    modalConfirmIconSize: number;
}
export declare const genModalMaskStyle: GenerateStyle<TokenWithCommonCls<AliasToken>>;
declare const _default: (prefixCls: string) => import("../../theme/interface").UseComponentStyleResult;
export default _default;
