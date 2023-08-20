import * as React from 'react';
import type { PanelSharedProps, DisabledTimes, IntRange } from '../../interface';
export type SharedTimeProps<DateType> = {
    format?: string;
    showNow?: boolean;
    showHour?: boolean;
    showMinute?: boolean;
    showSecond?: boolean;
    use12Hours?: boolean;
    hourStep?: IntRange<1, 23>;
    minuteStep?: IntRange<1, 59>;
    secondStep?: IntRange<1, 59>;
    hideDisabledOptions?: boolean;
    defaultValue?: DateType;
    /** @deprecated Please use `disabledTime` instead. */
    disabledHours?: DisabledTimes['disabledHours'];
    /** @deprecated Please use `disabledTime` instead. */
    disabledMinutes?: DisabledTimes['disabledMinutes'];
    /** @deprecated Please use `disabledTime` instead. */
    disabledSeconds?: DisabledTimes['disabledSeconds'];
    disabledTime?: (date: DateType) => DisabledTimes;
};
export type TimePanelProps<DateType> = {
    format?: string;
    active?: boolean;
} & PanelSharedProps<DateType> & SharedTimeProps<DateType>;
declare function TimePanel<DateType>(props: TimePanelProps<DateType>): React.JSX.Element;
export default TimePanel;
