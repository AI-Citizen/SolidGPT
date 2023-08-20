import * as React from 'react';
import type { GenerateConfig } from '../../generate';
export type YearHeaderProps<DateType> = {
    prefixCls: string;
    viewDate: DateType;
    generateConfig: GenerateConfig<DateType>;
    onPrevDecades: () => void;
    onNextDecades: () => void;
};
declare function DecadeHeader<DateType>(props: YearHeaderProps<DateType>): React.JSX.Element;
export default DecadeHeader;
