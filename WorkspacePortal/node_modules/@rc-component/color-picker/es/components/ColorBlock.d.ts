import type { FC } from 'react';
import React from 'react';
export declare type ColorBlockProps = {
    color: string;
    prefixCls?: string;
    className?: string;
    style?: React.CSSProperties;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
};
declare const ColorBlock: FC<ColorBlockProps>;
export default ColorBlock;
