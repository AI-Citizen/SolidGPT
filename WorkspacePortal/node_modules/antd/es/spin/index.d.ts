import * as React from 'react';
declare const SpinSizes: readonly ["small", "default", "large"];
export type SpinSize = typeof SpinSizes[number];
export type SpinIndicator = React.ReactElement<HTMLElement>;
export interface SpinProps {
    prefixCls?: string;
    className?: string;
    rootClassName?: string;
    spinning?: boolean;
    style?: React.CSSProperties;
    size?: SpinSize;
    tip?: React.ReactNode;
    delay?: number;
    wrapperClassName?: string;
    indicator?: SpinIndicator;
    children?: React.ReactNode;
}
export interface SpinClassProps extends SpinProps {
    hashId: string;
    spinPrefixCls: string;
}
export type SpinFCType = React.FC<SpinProps> & {
    setDefaultIndicator: (indicator: React.ReactNode) => void;
};
declare const SpinFC: SpinFCType;
export default SpinFC;
