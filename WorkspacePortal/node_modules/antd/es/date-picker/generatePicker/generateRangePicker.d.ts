import type { GenerateConfig } from 'rc-picker/lib/generate/index';
import type { RangePickerProps } from '.';
import type { PickerComponentClass } from './interface';
export default function generateRangePicker<DateType>(generateConfig: GenerateConfig<DateType>): PickerComponentClass<RangePickerProps<DateType> & {
    /**
     * @deprecated `dropdownClassName` is deprecated which will be removed in next major
     *   version.Please use `popupClassName` instead.
     */
    dropdownClassName?: string | undefined;
    popupClassName?: string | undefined;
}, unknown>;
