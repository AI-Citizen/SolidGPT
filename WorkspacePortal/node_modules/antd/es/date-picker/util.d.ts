/// <reference types="react" />
import type { AlignType } from '@rc-component/trigger';
import type { PickerMode } from 'rc-picker/lib/interface';
import type { SharedTimeProps } from 'rc-picker/lib/panels/TimePanel';
import type { SelectCommonPlacement } from '../_util/motion';
import type { DirectionType } from '../config-provider';
import type { PickerLocale, PickerProps } from './generatePicker';
export declare function getPlaceholder(locale: PickerLocale, picker?: PickerMode, customizePlaceholder?: string): string;
export declare function getRangePlaceholder(locale: PickerLocale, picker?: PickerMode, customizePlaceholder?: [string, string]): [string, string] | undefined;
export declare function transPlacement2DropdownAlign(direction: DirectionType, placement?: SelectCommonPlacement): AlignType;
export declare function getTimeProps<DateType, DisabledTime>(props: {
    format?: string;
    picker?: PickerMode;
} & Omit<SharedTimeProps<DateType>, 'disabledTime'> & {
    disabledTime?: DisabledTime;
}): {
    format?: string | undefined;
    picker?: PickerMode | undefined;
    defaultValue?: DateType | undefined;
    showNow?: boolean | undefined;
    showHour?: boolean | undefined;
    showMinute?: boolean | undefined;
    showSecond?: boolean | undefined;
    use12Hours?: boolean | undefined;
    hourStep?: import("rc-picker/lib/interface").IntRange<1, 23> | undefined;
    minuteStep?: import("rc-picker/lib/interface").IntRange<1, 59> | undefined;
    secondStep?: import("rc-picker/lib/interface").IntRange<1, 59> | undefined;
    hideDisabledOptions?: boolean | undefined;
    disabledHours?: (() => number[]) | undefined;
    disabledMinutes?: ((hour: number) => number[]) | undefined;
    disabledSeconds?: ((hour: number, minute: number) => number[]) | undefined;
    disabledTime?: DisabledTime | undefined;
} | {
    showTime: {
        format?: string | undefined;
        picker?: PickerMode | undefined;
        defaultValue?: DateType | undefined;
        showNow?: boolean | undefined;
        showHour?: boolean | undefined;
        showMinute?: boolean | undefined;
        showSecond?: boolean | undefined;
        use12Hours?: boolean | undefined;
        hourStep?: import("rc-picker/lib/interface").IntRange<1, 23> | undefined;
        minuteStep?: import("rc-picker/lib/interface").IntRange<1, 59> | undefined;
        secondStep?: import("rc-picker/lib/interface").IntRange<1, 59> | undefined;
        hideDisabledOptions?: boolean | undefined;
        disabledHours?: (() => number[]) | undefined;
        disabledMinutes?: ((hour: number) => number[]) | undefined;
        disabledSeconds?: ((hour: number, minute: number) => number[]) | undefined;
        disabledTime?: DisabledTime | undefined;
    };
};
type AllowClear = PickerProps<unknown>['allowClear'];
type ClearIcon = PickerProps<unknown>['clearIcon'];
export declare function mergeAllowClear(allowClear: AllowClear, clearIcon: ClearIcon, defaultClearIcon: NonNullable<ClearIcon>): false | {
    clearIcon: string | number | boolean | import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>> | Iterable<import("react").ReactNode> | null;
};
export {};
