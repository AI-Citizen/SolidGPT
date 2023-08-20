import type { DrawerProps as RCDrawerProps } from 'rc-drawer';
import * as React from 'react';
export interface DrawerPanelProps {
    prefixCls: string;
    title?: React.ReactNode;
    footer?: React.ReactNode;
    extra?: React.ReactNode;
    /**
     * Recommend to use closeIcon instead
     *
     * e.g.
     *
     * `<Drawer closeIcon={false} />`
     */
    closable?: boolean;
    closeIcon?: boolean | React.ReactNode;
    onClose?: RCDrawerProps['onClose'];
    /** Wrapper dom node style of header and body */
    drawerStyle?: React.CSSProperties;
    headerStyle?: React.CSSProperties;
    bodyStyle?: React.CSSProperties;
    footerStyle?: React.CSSProperties;
    children?: React.ReactNode;
}
declare const DrawerPanel: React.FC<DrawerPanelProps>;
export default DrawerPanel;
