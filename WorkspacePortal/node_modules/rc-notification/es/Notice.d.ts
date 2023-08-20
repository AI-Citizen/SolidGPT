import * as React from 'react';
export interface NoticeConfig {
    content?: React.ReactNode;
    duration?: number | null;
    closeIcon?: React.ReactNode;
    closable?: boolean;
    className?: string;
    style?: React.CSSProperties;
    /** @private Internal usage. Do not override in your code */
    props?: React.HTMLAttributes<HTMLDivElement> & Record<string, any>;
    onClose?: VoidFunction;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}
export interface NoticeProps extends Omit<NoticeConfig, 'onClose'> {
    prefixCls: string;
    className?: string;
    style?: React.CSSProperties;
    eventKey: React.Key;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    onNoticeClose?: (key: React.Key) => void;
}
declare const Notify: React.ForwardRefExoticComponent<NoticeProps & {
    times?: number;
} & React.RefAttributes<HTMLDivElement>>;
export default Notify;
