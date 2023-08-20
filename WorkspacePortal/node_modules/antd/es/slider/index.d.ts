import type { SliderProps as RcSliderProps } from 'rc-slider';
import type { SliderRef } from 'rc-slider/lib/Slider';
import React from 'react';
import type { TooltipPlacement } from '../tooltip';
export type SliderMarks = RcSliderProps['marks'];
interface HandleGeneratorInfo {
    value?: number;
    dragging?: boolean;
    index: number;
}
export type HandleGeneratorFn = (config: {
    tooltipPrefixCls?: string;
    prefixCls?: string;
    info: HandleGeneratorInfo;
}) => React.ReactElement;
export type Formatter = (value?: number) => React.ReactNode;
export interface SliderTooltipProps {
    prefixCls?: string;
    open?: boolean;
    placement?: TooltipPlacement;
    getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
    formatter?: null | Formatter;
    autoAdjustOverflow?: boolean;
}
export interface SliderBaseProps {
    prefixCls?: string;
    reverse?: boolean;
    min?: number;
    max?: number;
    step?: null | number;
    marks?: SliderMarks;
    dots?: boolean;
    included?: boolean;
    disabled?: boolean;
    keyboard?: boolean;
    vertical?: boolean;
    className?: string;
    rootClassName?: string;
    id?: string;
    style?: React.CSSProperties;
    tooltip?: SliderTooltipProps;
    autoFocus?: boolean;
    /** @deprecated `tooltipPrefixCls` is deprecated. Please use `tooltip.prefixCls` instead. */
    tooltipPrefixCls?: string;
    /** @deprecated `tipFormatter` is deprecated. Please use `tooltip.formatter` instead. */
    tipFormatter?: null | ((value?: number) => React.ReactNode);
    /** @deprecated `tooltipVisible` is deprecated. Please use `tooltip.open` instead. */
    tooltipVisible?: boolean;
    /**
     * @deprecated `getTooltipPopupContainer` is deprecated. Please use `tooltip.getPopupContainer`
     *   instead.
     */
    getTooltipPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
    /** @deprecated `tooltipPlacement` is deprecated. Please use `tooltip.placement` instead. */
    tooltipPlacement?: TooltipPlacement;
}
export interface SliderSingleProps extends SliderBaseProps {
    range?: false;
    value?: number;
    defaultValue?: number;
    onChange?: (value: number) => void;
    onAfterChange?: (value: number) => void;
    handleStyle?: React.CSSProperties;
    trackStyle?: React.CSSProperties;
    railStyle?: React.CSSProperties;
}
export interface SliderRangeProps extends SliderBaseProps {
    range: true | SliderRange;
    value?: [number, number];
    defaultValue?: [number, number];
    onChange?: (value: [number, number]) => void;
    onAfterChange?: (value: [number, number]) => void;
    handleStyle?: React.CSSProperties[];
    trackStyle?: React.CSSProperties[];
    railStyle?: React.CSSProperties;
}
interface SliderRange {
    draggableTrack?: boolean;
}
export type Opens = {
    [index: number]: boolean;
};
declare const Slider: React.ForwardRefExoticComponent<(SliderSingleProps | SliderRangeProps) & React.RefAttributes<SliderRef>>;
export default Slider;
