import * as React from 'react';
import type { PortalProps } from '@rc-component/portal';
import type { DrawerPopupProps } from './DrawerPopup';
import type { DrawerPanelEvents } from './DrawerPanel';
export type Placement = 'left' | 'top' | 'right' | 'bottom';
export interface DrawerProps extends Omit<DrawerPopupProps, 'prefixCls' | 'inline' | 'scrollLocker'>, DrawerPanelEvents {
    prefixCls?: string;
    open?: boolean;
    onClose?: (e: React.MouseEvent | React.KeyboardEvent) => void;
    destroyOnClose?: boolean;
    getContainer?: PortalProps['getContainer'];
}
declare const Drawer: React.FC<DrawerProps>;
export default Drawer;
