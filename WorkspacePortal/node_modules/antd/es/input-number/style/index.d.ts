import type { InputToken } from '../../input/style';
import type { FullToken } from '../../theme/internal';
export interface ComponentToken {
    /**
     * @desc 输入框宽度
     * @descEN Width of input
     */
    controlWidth: number;
    /**
     * @desc 操作按钮宽度
     * @descEN Width of control button
     */
    handleWidth: number;
    /**
     * @desc 操作按钮图标大小
     * @descEN Icon size of control button
     */
    handleFontSize: number;
    /**
     * Default `auto`. Set `true` will always show the handle
     * @desc 操作按钮可见性
     * @descEN Handle visible
     */
    handleVisible: 'auto' | true;
}
type InputNumberToken = InputToken<FullToken<'InputNumber'>>;
export declare const genRadiusStyle: ({ componentCls, borderRadiusSM, borderRadiusLG }: InputNumberToken, size: 'lg' | 'sm') => {
    [x: string]: {
        [x: string]: {
            borderStartEndRadius: number;
            borderEndEndRadius: number;
        } | {
            borderStartEndRadius: number;
            borderEndEndRadius?: undefined;
        } | {
            borderEndEndRadius: number;
            borderStartEndRadius?: undefined;
        };
    };
};
declare const _default: (prefixCls: string) => import("../../theme/interface").UseComponentStyleResult;
export default _default;
