import * as React from 'react';
import type { CellRender, DisabledTimes, EventValue, PanelMode, PresetDate, RangeValue } from './interface';
import type { SharedTimeProps } from './panels/TimePanel';
import type { PickerBaseProps, PickerDateProps, PickerRefConfig, PickerTimeProps } from './Picker';
export type RangeType = 'start' | 'end';
export type RangeInfo = {
    range: RangeType;
};
export type RangeDateRender<DateType> = (currentDate: DateType, today: DateType, info: RangeInfo) => React.ReactNode;
export type RangePickerSharedProps<DateType> = {
    id?: string;
    value?: RangeValue<DateType>;
    defaultValue?: RangeValue<DateType>;
    defaultPickerValue?: [DateType, DateType];
    placeholder?: [string, string];
    disabled?: boolean | [boolean, boolean];
    disabledTime?: (date: EventValue<DateType>, type: RangeType) => DisabledTimes;
    presets?: PresetDate<Exclude<RangeValue<DateType>, null>>[];
    /** @deprecated Please use `presets` instead */
    ranges?: Record<string, Exclude<RangeValue<DateType>, null> | (() => Exclude<RangeValue<DateType>, null>)>;
    separator?: React.ReactNode;
    allowEmpty?: [boolean, boolean];
    mode?: [PanelMode, PanelMode];
    onChange?: (values: RangeValue<DateType>, formatString: [string, string]) => void;
    onCalendarChange?: (values: RangeValue<DateType>, formatString: [string, string], info: RangeInfo) => void;
    onPanelChange?: (values: RangeValue<DateType>, modes: [PanelMode, PanelMode]) => void;
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
    onMouseUp?: React.MouseEventHandler<HTMLDivElement>;
    onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    onOk?: (dates: RangeValue<DateType>) => void;
    direction?: 'ltr' | 'rtl';
    autoComplete?: string;
    /** @private Internal control of active picker. Do not use since it's private usage */
    activePickerIndex?: 0 | 1;
    /** @deprecated use cellRender instead of dateRender */
    dateRender?: RangeDateRender<DateType>;
    cellRender?: CellRender<DateType>;
    panelRender?: (originPanel: React.ReactNode) => React.ReactNode;
    /**
     * Trigger `onChange` event when blur.
     * If you don't want to user click `confirm` to trigger change, can use this.
     */
    changeOnBlur?: boolean;
};
type OmitPickerProps<Props> = Omit<Props, 'value' | 'defaultValue' | 'defaultPickerValue' | 'placeholder' | 'disabled' | 'disabledTime' | 'showToday' | 'showTime' | 'mode' | 'onChange' | 'onSelect' | 'onPanelChange' | 'pickerValue' | 'onPickerValueChange' | 'onOk' | 'cellRender' | 'presets'>;
type RangeShowTimeObject<DateType> = Omit<SharedTimeProps<DateType>, 'defaultValue'> & {
    defaultValue?: DateType[];
};
export type RangePickerBaseProps<DateType> = {} & RangePickerSharedProps<DateType> & OmitPickerProps<PickerBaseProps<DateType>>;
export type RangePickerDateProps<DateType> = {
    showTime?: boolean | RangeShowTimeObject<DateType>;
} & RangePickerSharedProps<DateType> & OmitPickerProps<PickerDateProps<DateType>>;
export type RangePickerTimeProps<DateType> = {
    order?: boolean;
} & RangePickerSharedProps<DateType> & OmitPickerProps<PickerTimeProps<DateType>>;
export type RangePickerProps<DateType> = RangePickerBaseProps<DateType> | RangePickerDateProps<DateType> | RangePickerTimeProps<DateType>;
declare class RangePicker<DateType> extends React.Component<RangePickerProps<DateType>> {
    pickerRef: React.RefObject<PickerRefConfig>;
    focus: () => void;
    blur: () => void;
    render(): React.JSX.Element;
}
export default RangePicker;
