import type { SegmentedLabeledOption as RcSegmentedLabeledOption, SegmentedProps as RCSegmentedProps, SegmentedRawOption } from 'rc-segmented';
import * as React from 'react';
import type { SizeType } from '../config-provider/SizeContext';
export type { SegmentedValue } from 'rc-segmented';
interface SegmentedLabeledOptionWithoutIcon extends RcSegmentedLabeledOption {
    label: RcSegmentedLabeledOption['label'];
}
interface SegmentedLabeledOptionWithIcon extends Omit<RcSegmentedLabeledOption, 'label'> {
    label?: RcSegmentedLabeledOption['label'];
    /** Set icon for Segmented item */
    icon: React.ReactNode;
}
export type SegmentedLabeledOption = SegmentedLabeledOptionWithIcon | SegmentedLabeledOptionWithoutIcon;
export interface SegmentedProps extends Omit<RCSegmentedProps, 'size' | 'options'> {
    rootClassName?: string;
    options: (SegmentedRawOption | SegmentedLabeledOption)[];
    /** Option to fit width to its parent's width */
    block?: boolean;
    /** Option to control the display size */
    size?: SizeType;
}
declare const Segmented: React.ForwardRefExoticComponent<Omit<SegmentedProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
export default Segmented;
