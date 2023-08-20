import * as React from 'react';
import type { GenerateConfig } from '../../generate';
import type { CellRender, Locale } from '../../interface';
export type DateRender<DateType> = (currentDate: DateType, today: DateType) => React.ReactNode;
export type DateBodyPassProps<DateType> = {
    cellRender?: CellRender<DateType>;
    disabledDate?: (date: DateType) => boolean;
    prefixColumn?: (date: DateType) => React.ReactNode;
    rowClassName?: (date: DateType) => string;
    isSameCell?: (current: DateType, target: DateType) => boolean;
};
export type DateBodyProps<DateType> = {
    prefixCls: string;
    generateConfig: GenerateConfig<DateType>;
    value?: DateType | null;
    viewDate: DateType;
    locale: Locale;
    rowCount: number;
    onSelect: (value: DateType) => void;
} & DateBodyPassProps<DateType>;
declare function DateBody<DateType>(props: DateBodyProps<DateType>): React.JSX.Element;
export default DateBody;
