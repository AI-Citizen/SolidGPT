import type { CSSObject } from '@ant-design/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
export interface ComponentToken {
    /**
     * @desc 预览浮层 z-index
     * @descEN z-index of preview popup
     */
    zIndexPopup: number;
    /**
     * @desc 预览操作图标大小
     * @descEN Size of preview operation icon
     */
    previewOperationSize: number;
    /**
     * @desc 预览操作图标颜色
     * @descEN Color of preview operation icon
     */
    previewOperationColor: string;
    /**
     * @desc 预览操作图标悬浮颜色
     * @descEN Color of hovered preview operation icon
     */
    previewOperationHoverColor: string;
    /**
     * @desc 预览操作图标禁用颜色
     * @descEN Disabled color of preview operation icon
     */
    previewOperationColorDisabled: string;
}
export interface ImageToken extends FullToken<'Image'> {
    previewCls: string;
    modalMaskBg: string;
    imagePreviewSwitchSize: number;
}
export type PositionType = 'static' | 'relative' | 'fixed' | 'absolute' | 'sticky' | undefined;
export declare const genBoxStyle: (position?: PositionType) => CSSObject;
export declare const genImageMaskStyle: (token: ImageToken) => CSSObject;
export declare const genPreviewOperationsStyle: (token: ImageToken) => CSSObject;
export declare const genPreviewSwitchStyle: (token: ImageToken) => CSSObject;
export declare const genImagePreviewStyle: GenerateStyle<ImageToken>;
declare const _default: (prefixCls: string) => import("../../theme/interface").UseComponentStyleResult;
export default _default;
