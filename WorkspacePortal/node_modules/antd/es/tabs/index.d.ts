import type { TabsProps as RcTabsProps } from 'rc-tabs';
import * as React from 'react';
import type { SizeType } from '../config-provider/SizeContext';
import TabPane, { type TabPaneProps } from './TabPane';
export type TabsType = 'line' | 'card' | 'editable-card';
export type TabsPosition = 'top' | 'right' | 'bottom' | 'left';
export type { TabPaneProps };
export interface TabsProps extends Omit<RcTabsProps, 'editable'> {
    rootClassName?: string;
    type?: TabsType;
    size?: SizeType;
    hideAdd?: boolean;
    centered?: boolean;
    addIcon?: React.ReactNode;
    onEdit?: (e: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => void;
    children?: React.ReactNode;
}
declare const Tabs: React.FC<TabsProps> & {
    TabPane: typeof TabPane;
};
export default Tabs;
