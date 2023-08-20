import type { FullToken } from '../../theme/internal';
/** Component only token. Which will handle additional calculation of alias token */
export interface ComponentToken {
    /**
     * @desc 标题上间距
     * @descEN Margin top of title
     */
    titleMarginTop: number | string;
    /**
     * @desc 标题下间距
     * @descEN Margin bottom of title
     */
    titleMarginBottom: number | string;
}
export type TypographyToken = FullToken<'Typography'>;
declare const _default: (prefixCls: string) => import("../../theme/interface").UseComponentStyleResult;
export default _default;
