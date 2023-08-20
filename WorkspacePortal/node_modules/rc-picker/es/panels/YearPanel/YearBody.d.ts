import * as React from 'react';
import type { GenerateConfig } from '../../generate';
import type { CellRender, Locale, NullableDateType } from '../../interface';
export declare const YEAR_COL_COUNT = 3;
export type YearBodyProps<DateType> = {
    prefixCls: string;
    locale: Locale;
    generateConfig: GenerateConfig<DateType>;
    value?: NullableDateType<DateType>;
    viewDate: DateType;
    disabledDate?: (date: DateType) => boolean;
    onSelect: (value: DateType) => void;
    cellRender?: CellRender<DateType>;
};
declare function YearBody<DateType>(props: YearBodyProps<DateType>): React.JSX.Element;
export default YearBody;
