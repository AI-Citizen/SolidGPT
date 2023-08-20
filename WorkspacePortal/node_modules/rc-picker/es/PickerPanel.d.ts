/**
 * Logic:
 *  When `mode` === `picker`,
 *  click will trigger `onSelect` (if value changed trigger `onChange` also).
 *  Panel change will not trigger `onSelect` but trigger `onPanelChange`
 */
import * as React from 'react';
import type { GenerateConfig } from './generate';
import type { CellRender, Components, DisabledTime, Locale, OnPanelChange, PanelMode, PickerMode } from './interface';
import type { DateRender } from './panels/DatePanel/DateBody';
import { type MonthCellRender } from './panels/MonthPanel/MonthBody';
import type { SharedTimeProps } from './panels/TimePanel';
export type PickerPanelSharedProps<DateType> = {
    prefixCls?: string;
    className?: string;
    style?: React.CSSProperties;
    /** @deprecated Will be removed in next big version. Please use `picker` instead */
    mode?: PanelMode;
    tabIndex?: number;
    locale: Locale;
    generateConfig: GenerateConfig<DateType>;
    value?: DateType | null;
    defaultValue?: DateType;
    /** [Legacy] Set default display picker view date */
    pickerValue?: DateType;
    /** [Legacy] Set default display picker view date */
    defaultPickerValue?: DateType;
    disabledDate?: (date: DateType) => boolean;
    /** @deprecated use cellRender instead of dateRender */
    dateRender?: DateRender<DateType>;
    /** @deprecated use cellRender instead of monthCellRender */
    monthCellRender?: MonthCellRender<DateType>;
    renderExtraFooter?: (mode: PanelMode) => React.ReactNode;
    onSelect?: (value: DateType) => void;
    onChange?: (value: DateType) => void;
    onPanelChange?: OnPanelChange<DateType>;
    onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
    onOk?: (date: DateType) => void;
    direction?: 'ltr' | 'rtl';
    /** @private This is internal usage. Do not use in your production env */
    hideHeader?: boolean;
    /** @private This is internal usage. Do not use in your production env */
    onPickerValueChange?: (date: DateType) => void;
    /** @private Internal usage. Do not use in your production env */
    components?: Components;
    cellRender?: CellRender<DateType>;
};
export type PickerPanelBaseProps<DateType> = {
    picker: Exclude<PickerMode, 'date' | 'time'>;
    cellRender?: CellRender<DateType>;
} & PickerPanelSharedProps<DateType>;
export type PickerPanelDateProps<DateType> = {
    picker?: 'date';
    showToday?: boolean;
    showNow?: boolean;
    showTime?: boolean | SharedTimeProps<DateType>;
    disabledTime?: DisabledTime<DateType>;
    cellRender?: CellRender<DateType>;
} & PickerPanelSharedProps<DateType>;
export type PickerPanelTimeProps<DateType> = {
    picker: 'time';
    cellRender?: CellRender<DateType, number>;
} & PickerPanelSharedProps<DateType> & SharedTimeProps<DateType>;
export type PickerPanelProps<DateType> = PickerPanelBaseProps<DateType> | PickerPanelDateProps<DateType> | PickerPanelTimeProps<DateType>;
declare function PickerPanel<DateType>(props: PickerPanelProps<DateType>): React.JSX.Element;
export default PickerPanel;
