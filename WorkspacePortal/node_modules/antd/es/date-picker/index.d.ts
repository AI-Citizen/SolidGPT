/// <reference types="react" />
import type { Dayjs } from 'dayjs';
import type { RangePickerProps as BaseRangePickerProps, PickerDateProps, PickerProps } from './generatePicker';
import generatePicker from './generatePicker';
export type DatePickerProps = PickerProps<Dayjs>;
export type MonthPickerProps = Omit<PickerDateProps<Dayjs>, 'picker'>;
export type WeekPickerProps = Omit<PickerDateProps<Dayjs>, 'picker'>;
export type RangePickerProps = BaseRangePickerProps<Dayjs>;
declare const DatePicker: import("./generatePicker/interface").PickerComponentClass<PickerProps<Dayjs> & {
    status?: "" | "error" | "warning" | undefined;
    hashId?: string | undefined;
    popupClassName?: string | undefined;
    rootClassName?: string | undefined;
}, unknown> & {
    displayName?: string | undefined;
    WeekPicker: import("./generatePicker/interface").PickerComponentClass<Omit<PickerProps<Dayjs> & {
        status?: "" | "error" | "warning" | undefined;
        hashId?: string | undefined;
        popupClassName?: string | undefined;
        rootClassName?: string | undefined;
    }, "picker">, unknown>;
    MonthPicker: import("./generatePicker/interface").PickerComponentClass<Omit<PickerProps<Dayjs> & {
        status?: "" | "error" | "warning" | undefined;
        hashId?: string | undefined;
        popupClassName?: string | undefined;
        rootClassName?: string | undefined;
    }, "picker">, unknown>;
    YearPicker: import("./generatePicker/interface").PickerComponentClass<Omit<PickerProps<Dayjs> & {
        status?: "" | "error" | "warning" | undefined;
        hashId?: string | undefined;
        popupClassName?: string | undefined;
        rootClassName?: string | undefined;
    }, "picker">, unknown>;
    RangePicker: import("./generatePicker/interface").PickerComponentClass<BaseRangePickerProps<Dayjs> & {
        dropdownClassName?: string | undefined;
        popupClassName?: string | undefined;
    }, unknown>;
    TimePicker: import("./generatePicker/interface").PickerComponentClass<Omit<Omit<import("rc-picker/lib/Picker").PickerTimeProps<Dayjs>, "components" | "locale" | "generateConfig" | "hideHeader"> & {
        locale?: import("./generatePicker").PickerLocale | undefined;
        size?: import("../button").ButtonSize;
        placement?: "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | undefined;
        bordered?: boolean | undefined;
        status?: "" | "error" | "warning" | undefined;
    } & {
        status?: "" | "error" | "warning" | undefined;
        hashId?: string | undefined;
        popupClassName?: string | undefined;
        rootClassName?: string | undefined;
    }, "picker">, unknown>;
    QuarterPicker: import("./generatePicker/interface").PickerComponentClass<Omit<Omit<import("rc-picker/lib/Picker").PickerTimeProps<Dayjs>, "components" | "locale" | "generateConfig" | "hideHeader"> & {
        locale?: import("./generatePicker").PickerLocale | undefined;
        size?: import("../button").ButtonSize;
        placement?: "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | undefined;
        bordered?: boolean | undefined;
        status?: "" | "error" | "warning" | undefined;
    } & {
        status?: "" | "error" | "warning" | undefined;
        hashId?: string | undefined;
        popupClassName?: string | undefined;
        rootClassName?: string | undefined;
    }, "picker">, unknown>;
};
export type DatePickerType = typeof DatePicker & {
    _InternalPanelDoNotUseOrYouWillBeFired: typeof PurePanel;
    _InternalRangePanelDoNotUseOrYouWillBeFired: typeof PureRangePanel;
    generatePicker: typeof generatePicker;
};
declare const PurePanel: (props: any) => import("react").JSX.Element;
declare const PureRangePanel: (props: any) => import("react").JSX.Element;
declare const _default: DatePickerType;
export default _default;
