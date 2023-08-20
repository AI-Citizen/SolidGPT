import type { GenerateConfig } from 'rc-picker/lib/generate/index';
import type { PickerProps } from '.';
import type { PickerComponentClass } from './interface';
export default function generatePicker<DateType>(generateConfig: GenerateConfig<DateType>): {
    DatePicker: PickerComponentClass<PickerProps<DateType> & {
        status?: "" | "error" | "warning" | undefined;
        hashId?: string | undefined;
        popupClassName?: string | undefined;
        rootClassName?: string | undefined;
    }, unknown>;
    WeekPicker: PickerComponentClass<Omit<PickerProps<DateType> & {
        status?: "" | "error" | "warning" | undefined;
        hashId?: string | undefined;
        popupClassName?: string | undefined;
        rootClassName?: string | undefined;
    }, "picker">, unknown>;
    MonthPicker: PickerComponentClass<Omit<PickerProps<DateType> & {
        status?: "" | "error" | "warning" | undefined;
        hashId?: string | undefined;
        popupClassName?: string | undefined;
        rootClassName?: string | undefined;
    }, "picker">, unknown>;
    YearPicker: PickerComponentClass<Omit<PickerProps<DateType> & {
        status?: "" | "error" | "warning" | undefined;
        hashId?: string | undefined;
        popupClassName?: string | undefined;
        rootClassName?: string | undefined;
    }, "picker">, unknown>;
    TimePicker: PickerComponentClass<Omit<Omit<import("rc-picker/lib/Picker").PickerTimeProps<DateType>, "components" | "locale" | "generateConfig" | "hideHeader"> & {
        locale?: import(".").PickerLocale | undefined;
        size?: import("../../button").ButtonSize;
        placement?: "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | undefined;
        bordered?: boolean | undefined;
        status?: "" | "error" | "warning" | undefined;
    } & {
        status?: "" | "error" | "warning" | undefined;
        hashId?: string | undefined;
        popupClassName?: string | undefined;
        rootClassName?: string | undefined;
    }, "picker">, unknown>;
    QuarterPicker: PickerComponentClass<Omit<Omit<import("rc-picker/lib/Picker").PickerTimeProps<DateType>, "components" | "locale" | "generateConfig" | "hideHeader"> & {
        locale?: import(".").PickerLocale | undefined;
        size?: import("../../button").ButtonSize;
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
