import React from 'react';
export interface WatermarkProps {
    zIndex?: number;
    rotate?: number;
    width?: number;
    height?: number;
    image?: string;
    content?: string | string[];
    font?: {
        color?: string;
        fontSize?: number | string;
        fontWeight?: 'normal' | 'light' | 'weight' | number;
        fontStyle?: 'none' | 'normal' | 'italic' | 'oblique';
        fontFamily?: string;
    };
    style?: React.CSSProperties;
    className?: string;
    rootClassName?: string;
    gap?: [number, number];
    offset?: [number, number];
    children?: React.ReactNode;
}
declare const Watermark: React.FC<WatermarkProps>;
export default Watermark;
