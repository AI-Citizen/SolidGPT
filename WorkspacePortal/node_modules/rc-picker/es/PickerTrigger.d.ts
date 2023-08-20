import * as React from 'react';
import type { AlignType } from '@rc-component/trigger/lib/interface';
type Placement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';
export type PickerTriggerProps = {
    prefixCls: string;
    visible: boolean;
    popupElement: React.ReactElement;
    popupStyle?: React.CSSProperties;
    children: React.ReactElement;
    dropdownClassName?: string;
    transitionName?: string;
    getPopupContainer?: (node: HTMLElement) => HTMLElement;
    dropdownAlign?: AlignType;
    range?: boolean;
    popupPlacement?: Placement;
    direction?: 'ltr' | 'rtl';
};
declare function PickerTrigger({ prefixCls, popupElement, popupStyle, visible, dropdownClassName, dropdownAlign, transitionName, getPopupContainer, children, range, popupPlacement, direction, }: PickerTriggerProps): React.JSX.Element;
export default PickerTrigger;
