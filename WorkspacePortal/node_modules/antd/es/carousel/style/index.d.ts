export interface ComponentToken {
    /**
     * @desc 指示点宽度
     * @descEN Width of indicator
     */
    dotWidth: number;
    /**
     * @desc 指示点高度
     * @descEN Height of indicator
     */
    dotHeight: number;
    /** @deprecated Use `dotActiveWidth` instead. */
    dotWidthActive: number;
    /**
     * @desc 激活态指示点宽度
     * @descEN Width of active indicator
     */
    dotActiveWidth: number;
}
declare const _default: (prefixCls: string) => import("../../theme/interface").UseComponentStyleResult;
export default _default;
