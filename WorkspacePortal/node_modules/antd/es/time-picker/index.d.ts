import type { Dayjs } from 'dayjs';
import * as React from 'react';
import type { InputStatus } from '../_util/statusUtils';
import type { PickerTimeProps, RangePickerTimeProps } from '../date-picker/generatePicker';
export interface TimePickerLocale {
    placeholder?: string;
    rangePlaceholder?: [string, string];
}
export interface TimeRangePickerProps extends Omit<RangePickerTimeProps<Dayjs>, 'picker'> {
    popupClassName?: string;
}
declare const RangePicker: React.ForwardRefExoticComponent<TimeRangePickerProps & React.RefAttributes<any>>;
export interface TimePickerProps extends Omit<PickerTimeProps<Dayjs>, 'picker'> {
    addon?: () => React.ReactNode;
    status?: InputStatus;
    popupClassName?: string;
}
declare const TimePicker: React.ForwardRefExoticComponent<TimePickerProps & React.RefAttributes<any>>;
declare const PurePanel: (props: any) => React.JSX.Element;
type MergedTimePicker = typeof TimePicker & {
    RangePicker: typeof RangePicker;
    _InternalPanelDoNotUseOrYouWillBeFired: typeof PurePanel;
};
declare const _default: MergedTimePicker;
export default _default;
