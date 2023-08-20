import * as React from 'react';
import type { GenerateConfig } from '../../generate';
import type { CellRender, Locale } from '../../interface';
export declare const QUARTER_COL_COUNT = 4;
export type QuarterBodyProps<DateType> = {
    prefixCls: string;
    locale: Locale;
    generateConfig: GenerateConfig<DateType>;
    value?: DateType | null;
    viewDate: DateType;
    disabledDate?: (date: DateType) => boolean;
    onSelect: (value: DateType) => void;
    cellRender?: CellRender<DateType>;
};
declare function QuarterBody<DateType>(props: QuarterBodyProps<DateType>): React.JSX.Element;
export default QuarterBody;
