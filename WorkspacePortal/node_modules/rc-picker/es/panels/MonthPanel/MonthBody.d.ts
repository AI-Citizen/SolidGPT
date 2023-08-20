import * as React from 'react';
import type { GenerateConfig } from '../../generate';
import type { CellRender, Locale } from '../../interface';
export declare const MONTH_COL_COUNT = 3;
export type MonthCellRender<DateType> = (currentDate: DateType, locale: Locale) => React.ReactNode;
export type MonthBodyProps<DateType> = {
    prefixCls: string;
    locale: Locale;
    generateConfig: GenerateConfig<DateType>;
    value?: DateType | null;
    viewDate: DateType;
    disabledDate?: (date: DateType) => boolean;
    cellRender?: CellRender<DateType>;
    onSelect: (value: DateType) => void;
};
declare function MonthBody<DateType>(props: MonthBodyProps<DateType>): React.JSX.Element;
export default MonthBody;
