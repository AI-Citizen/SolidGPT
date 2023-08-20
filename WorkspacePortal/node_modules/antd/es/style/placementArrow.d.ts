import type { CSSInterpolation } from '@ant-design/cssinjs';
import type { AliasToken } from '../theme/internal';
import type { TokenWithCommonCls } from '../theme/util/genComponentStyleHook';
export declare const MAX_VERTICAL_CONTENT_RADIUS = 8;
export declare function getArrowOffset(options: {
    contentRadius: number;
    limitVerticalRadius?: boolean;
}): {
    dropdownArrowOffset: number;
    dropdownArrowOffsetVertical: number;
};
export default function getArrowStyle<Token extends TokenWithCommonCls<AliasToken>>(token: Token, options: {
    colorBg: string;
    showArrowCls?: string;
    contentRadius?: number;
    limitVerticalRadius?: boolean;
    arrowDistance?: number;
    arrowPlacement?: {
        left?: boolean;
        right?: boolean;
        top?: boolean;
        bottom?: boolean;
    };
}): CSSInterpolation;
