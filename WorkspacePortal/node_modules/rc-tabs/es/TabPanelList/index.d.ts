import * as React from 'react';
import type { TabPosition, AnimatedConfig } from '../interface';
export interface TabPanelListProps {
    activeKey: string;
    id: string;
    animated?: AnimatedConfig;
    tabPosition?: TabPosition;
    destroyInactiveTabPane?: boolean;
}
export default function TabPanelList({ id, activeKey, animated, tabPosition, destroyInactiveTabPane, }: TabPanelListProps): React.JSX.Element;
