import * as React from 'react';
import type { GenerateConfig } from '../../generate';
import type { CellRender, Locale } from '../../interface';
export declare const DECADE_COL_COUNT = 3;
export type YearBodyProps<DateType> = {
    prefixCls: string;
    generateConfig: GenerateConfig<DateType>;
    viewDate: DateType;
    disabledDate?: (date: DateType) => boolean;
    onSelect: (value: DateType) => void;
    cellRender?: CellRender<DateType>;
    locale: Locale;
};
declare function DecadeBody<DateType>(props: YearBodyProps<DateType>): React.JSX.Element;
export default DecadeBody;
