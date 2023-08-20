import type { FullToken, GenerateStyle } from '../../theme/internal';
export interface ComponentToken {
}
type AlertToken = FullToken<'Alert'> & {
    alertIconSizeLG: number;
    alertPaddingHorizontal: number;
};
export declare const genBaseStyle: GenerateStyle<AlertToken>;
export declare const genTypeStyle: GenerateStyle<AlertToken>;
export declare const genActionStyle: GenerateStyle<AlertToken>;
export declare const genAlertStyle: GenerateStyle<AlertToken>;
declare const _default: (prefixCls: string) => import("../../theme/interface").UseComponentStyleResult;
export default _default;
