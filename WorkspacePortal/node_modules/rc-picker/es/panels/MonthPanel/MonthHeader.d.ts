import * as React from 'react';
import type { Locale } from '../../interface';
import type { GenerateConfig } from '../../generate';
export type MonthHeaderProps<DateType> = {
    prefixCls: string;
    viewDate: DateType;
    locale: Locale;
    generateConfig: GenerateConfig<DateType>;
    onPrevYear: () => void;
    onNextYear: () => void;
    onYearClick: () => void;
};
declare function MonthHeader<DateType>(props: MonthHeaderProps<DateType>): React.JSX.Element;
export default MonthHeader;
