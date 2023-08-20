import * as React from 'react';
import type { GenerateConfig } from '../../generate';
export type YearHeaderProps<DateType> = {
    prefixCls: string;
    viewDate: DateType;
    value?: DateType | null;
    generateConfig: GenerateConfig<DateType>;
    onPrevDecade: () => void;
    onNextDecade: () => void;
    onDecadeClick: () => void;
};
declare function YearHeader<DateType>(props: YearHeaderProps<DateType>): React.JSX.Element;
export default YearHeader;
