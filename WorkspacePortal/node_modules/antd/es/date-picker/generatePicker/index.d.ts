import type { PickerBaseProps as RCPickerBaseProps, PickerDateProps as RCPickerDateProps, PickerTimeProps as RCPickerTimeProps } from 'rc-picker/lib/Picker';
import type { RangePickerBaseProps as RCRangePickerBaseProps, RangePickerDateProps as RCRangePickerDateProps, RangePickerTimeProps as RCRangePickerTimeProps } from 'rc-picker/lib/RangePicker';
import type { GenerateConfig } from 'rc-picker/lib/generate/index';
import type { Locale as RcPickerLocale } from 'rc-picker/lib/interface';
import type { InputStatus } from '../../_util/statusUtils';
import type { SizeType } from '../../config-provider/SizeContext';
import type { TimePickerLocale } from '../../time-picker';
declare const DataPickerPlacements: readonly ["bottomLeft", "bottomRight", "topLeft", "topRight"];
type DataPickerPlacement = typeof DataPickerPlacements[number];
type InjectDefaultProps<Props> = Omit<Props, 'locale' | 'generateConfig' | 'hideHeader' | 'components'> & {
    locale?: PickerLocale;
    size?: SizeType;
    placement?: DataPickerPlacement;
    bordered?: boolean;
    status?: InputStatus;
};
export type PickerLocale = {
    lang: RcPickerLocale & AdditionalPickerLocaleLangProps;
    timePickerLocale: TimePickerLocale;
} & AdditionalPickerLocaleProps;
export type AdditionalPickerLocaleProps = {
    dateFormat?: string;
    dateTimeFormat?: string;
    weekFormat?: string;
    monthFormat?: string;
};
export type AdditionalPickerLocaleLangProps = {
    placeholder: string;
    yearPlaceholder?: string;
    quarterPlaceholder?: string;
    monthPlaceholder?: string;
    weekPlaceholder?: string;
    rangeYearPlaceholder?: [string, string];
    rangeQuarterPlaceholder?: [string, string];
    rangeMonthPlaceholder?: [string, string];
    rangeWeekPlaceholder?: [string, string];
    rangePlaceholder?: [string, string];
};
export type PickerBaseProps<DateType> = InjectDefaultProps<RCPickerBaseProps<DateType>>;
export type PickerDateProps<DateType> = InjectDefaultProps<RCPickerDateProps<DateType>>;
export type PickerTimeProps<DateType> = InjectDefaultProps<RCPickerTimeProps<DateType>>;
export type PickerProps<DateType> = PickerBaseProps<DateType> | PickerDateProps<DateType> | PickerTimeProps<DateType>;
export type RangePickerBaseProps<DateType> = InjectDefaultProps<RCRangePickerBaseProps<DateType>>;
export type RangePickerDateProps<DateType> = InjectDefaultProps<RCRangePickerDateProps<DateType>>;
export type RangePickerTimeProps<DateType> = InjectDefaultProps<RCRangePickerTimeProps<DateType>>;
export type RangePickerProps<DateType> = RangePickerBaseProps<DateType> | RangePickerDateProps<DateType> | RangePickerTimeProps<DateType>;
declare function generatePicker<DateType>(generateConfig: GenerateConfig<DateType>): import("./interface").PickerComponentClass<PickerProps<DateType> & {
    status?: "" | "error" | "warning" | undefined;
    hashId?: string | undefined;
    popupClassName?: string | undefined;
    rootClassName?: string | undefined;
}, unknown> & {
    displayName?: string | undefined;
    WeekPicker: import("./interface").PickerComponentClass<Omit<PickerProps<DateType> & {
        status?: "" | "error" | "warning" | undefined;
        hashId?: string | undefined;
        popupClassName?: string | undefined;
        rootClassName?: string | undefined;
    }, "picker">, unknown>;
    MonthPicker: import("./interface").PickerComponentClass<Omit<PickerProps<DateType> & {
        status?: "" | "error" | "warning" | undefined;
        hashId?: string | undefined;
        popupClassName?: string | undefined;
        rootClassName?: string | undefined;
    }, "picker">, unknown>;
    YearPicker: import("./interface").PickerComponentClass<Omit<PickerProps<DateType> & {
        status?: "" | "error" | "warning" | undefined;
        hashId?: string | undefined;
        popupClassName?: string | undefined;
        rootClassName?: string | undefined;
    }, "picker">, unknown>;
    RangePicker: import("./interface").PickerComponentClass<RangePickerProps<DateType> & {
        dropdownClassName?: string | undefined;
        popupClassName?: string | undefined;
    }, unknown>;
    TimePicker: import("./interface").PickerComponentClass<Omit<Omit<RCPickerTimeProps<DateType>, "components" | "locale" | "generateConfig" | "hideHeader"> & {
        locale?: PickerLocale | undefined;
        size?: SizeType;
        placement?: "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | undefined;
        bordered?: boolean | undefined;
        status?: "" | "error" | "warning" | undefined;
    } & {
        status?: "" | "error" | "warning" | undefined;
        hashId?: string | undefined;
        popupClassName?: string | undefined;
        rootClassName?: string | undefined;
    }, "picker">, unknown>;
    QuarterPicker: import("./interface").PickerComponentClass<Omit<Omit<RCPickerTimeProps<DateType>, "components" | "locale" | "generateConfig" | "hideHeader"> & {
        locale?: PickerLocale | undefined;
        size?: SizeType;
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
export default generatePicker;
