import type { TriggerProps } from '@rc-component/trigger';
import type { ActionType, AlignType, AnimationType } from '@rc-component/trigger/lib/interface';
import * as React from 'react';
export interface TooltipProps extends Pick<TriggerProps, 'onPopupAlign' | 'builtinPlacements'> {
    trigger?: ActionType | ActionType[];
    defaultVisible?: boolean;
    visible?: boolean;
    placement?: string;
    /** @deprecated Use `motion` instead */
    transitionName?: string;
    /** @deprecated Use `motion` instead */
    animation?: AnimationType;
    /** Config popup motion */
    motion?: TriggerProps['popupMotion'];
    onVisibleChange?: (visible: boolean) => void;
    afterVisibleChange?: (visible: boolean) => void;
    overlay: (() => React.ReactNode) | React.ReactNode;
    overlayStyle?: React.CSSProperties;
    overlayClassName?: string;
    prefixCls?: string;
    mouseEnterDelay?: number;
    mouseLeaveDelay?: number;
    getTooltipContainer?: (node: HTMLElement) => HTMLElement;
    destroyTooltipOnHide?: boolean;
    align?: AlignType;
    showArrow?: boolean;
    arrowContent?: React.ReactNode;
    id?: string;
    children?: React.ReactElement;
    popupVisible?: boolean;
    overlayInnerStyle?: React.CSSProperties;
    zIndex?: number;
}
export interface TooltipRef {
    forceAlign: VoidFunction;
}
declare const _default: React.ForwardRefExoticComponent<TooltipProps & React.RefAttributes<TooltipRef>>;
export default _default;
