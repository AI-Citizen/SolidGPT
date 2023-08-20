import * as React from 'react';
import type { Locale } from '../../interface';
import type { GenerateConfig } from '../../generate';
export type DateHeaderProps<DateType> = {
    prefixCls: string;
    viewDate: DateType;
    value?: DateType | null;
    locale: Locale;
    generateConfig: GenerateConfig<DateType>;
    onPrevYear: () => void;
    onNextYear: () => void;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onYearClick: () => void;
    onMonthClick: () => void;
};
declare function DateHeader<DateType>(props: DateHeaderProps<DateType>): React.JSX.Element;
export default DateHeader;
