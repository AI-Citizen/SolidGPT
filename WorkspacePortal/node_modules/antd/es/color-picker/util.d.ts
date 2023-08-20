import type { ColorGenInput } from '@rc-component/color-picker';
import type { Color } from './color';
export declare const customizePrefixCls = "ant-color-picker";
export declare const generateColor: (color: ColorGenInput<Color>) => Color;
export declare const getRoundNumber: (value: number) => number;
export declare const getAlphaColor: (color: Color) => number;
export declare const genAlphaColor: (color: Color, alpha?: number) => Color;
