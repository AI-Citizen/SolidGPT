import type { GenerateConfig } from '../generate';
import type { Locale, PickerMode, RangeValue } from '../interface';
export default function useRangeDisabled<DateType>({ picker, locale, selectedValue, disabledDate, disabled, generateConfig, }: {
    picker: PickerMode;
    selectedValue: RangeValue<DateType>;
    disabledDate?: (date: DateType) => boolean;
    disabled: [boolean, boolean];
    locale: Locale;
    generateConfig: GenerateConfig<DateType>;
}, firstTimeOpen: boolean): ((date: DateType) => boolean)[];
