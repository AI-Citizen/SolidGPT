import type { CSSMotionProps } from 'rc-motion';
import * as React from 'react';
import { DrawerPanelEvents } from './DrawerPanel';
export type Placement = 'left' | 'right' | 'top' | 'bottom';
export interface PushConfig {
    distance?: number | string;
}
export interface DrawerPopupProps extends DrawerPanelEvents {
    prefixCls: string;
    open?: boolean;
    inline?: boolean;
    push?: boolean | PushConfig;
    forceRender?: boolean;
    autoFocus?: boolean;
    keyboard?: boolean;
    rootClassName?: string;
    rootStyle?: React.CSSProperties;
    zIndex?: number;
    placement?: Placement;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    width?: number | string;
    height?: number | string;
    contentWrapperStyle?: React.CSSProperties;
    mask?: boolean;
    maskClosable?: boolean;
    maskClassName?: string;
    maskStyle?: React.CSSProperties;
    motion?: CSSMotionProps | ((placement: Placement) => CSSMotionProps);
    maskMotion?: CSSMotionProps;
    afterOpenChange?: (open: boolean) => void;
    onClose?: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
}
declare const RefDrawerPopup: React.ForwardRefExoticComponent<DrawerPopupProps & React.RefAttributes<HTMLDivElement>>;
export default RefDrawerPopup;
