import * as React from 'react';
import type { CSSMotionProps } from 'rc-motion';
import type { NoticeConfig } from './Notice';
export interface OpenConfig extends NoticeConfig {
    key: React.Key;
    placement?: Placement;
    content?: React.ReactNode;
    duration?: number | null;
}
export interface NotificationsProps {
    prefixCls?: string;
    motion?: CSSMotionProps | ((placement: Placement) => CSSMotionProps);
    container?: HTMLElement | ShadowRoot;
    maxCount?: number;
    className?: (placement: Placement) => string;
    style?: (placement: Placement) => React.CSSProperties;
    onAllRemoved?: VoidFunction;
}
export type Placement = 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight';
export interface NotificationsRef {
    open: (config: OpenConfig) => void;
    close: (key: React.Key) => void;
    destroy: () => void;
}
declare const Notifications: React.ForwardRefExoticComponent<NotificationsProps & React.RefAttributes<NotificationsRef>>;
export default Notifications;
