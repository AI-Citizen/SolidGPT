import * as React from 'react';
import type { DisabledTime } from '../../interface';
import type { DatePanelProps } from '../DatePanel';
import type { SharedTimeProps } from '../TimePanel';
export type DatetimePanelProps<DateType> = {
    disabledTime?: DisabledTime<DateType>;
    showTime?: boolean | SharedTimeProps<DateType>;
    defaultValue?: DateType;
} & Omit<DatePanelProps<DateType>, 'disabledHours' | 'disabledMinutes' | 'disabledSeconds'>;
declare function DatetimePanel<DateType>(props: DatetimePanelProps<DateType>): React.JSX.Element;
export default DatetimePanel;
