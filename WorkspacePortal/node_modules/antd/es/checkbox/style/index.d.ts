import type { FullToken, GenerateStyle } from '../../theme/internal';
export interface ComponentToken {
}
interface CheckboxToken extends FullToken<'Checkbox'> {
    checkboxCls: string;
    checkboxSize: number;
}
export declare const genCheckboxStyle: GenerateStyle<CheckboxToken>;
export declare function getStyle(prefixCls: string, token: FullToken<'Checkbox'>): import("@ant-design/cssinjs").CSSInterpolation[];
declare const _default: (prefixCls: string) => import("../../theme/interface").UseComponentStyleResult;
export default _default;
