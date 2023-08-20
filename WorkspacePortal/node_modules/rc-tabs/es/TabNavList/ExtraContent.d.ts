import * as React from 'react';
import type { TabBarExtraPosition, TabBarExtraContent } from '../interface';
interface ExtraContentProps {
    position: TabBarExtraPosition;
    prefixCls: string;
    extra?: TabBarExtraContent;
}
declare const ExtraContent: React.ForwardRefExoticComponent<ExtraContentProps & React.RefAttributes<HTMLDivElement>>;
export default ExtraContent;
