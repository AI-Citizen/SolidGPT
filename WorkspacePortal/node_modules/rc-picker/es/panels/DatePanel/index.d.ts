import * as React from 'react';
import type { CellRender, PanelSharedProps } from '../../interface';
import type { KeyboardConfig } from '../../utils/uiUtil';
import type { DateBodyPassProps } from './DateBody';
export type DatePanelProps<DateType> = {
    active?: boolean;
    cellRender?: CellRender<DateType>;
    panelName?: string;
    keyboardConfig?: KeyboardConfig;
} & PanelSharedProps<DateType> & DateBodyPassProps<DateType>;
declare function DatePanel<DateType>(props: DatePanelProps<DateType>): React.JSX.Element;
export default DatePanel;
