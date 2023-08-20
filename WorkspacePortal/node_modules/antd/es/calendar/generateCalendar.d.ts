import type { PickerPanelBaseProps as RCPickerPanelBaseProps, PickerPanelDateProps as RCPickerPanelDateProps, PickerPanelTimeProps as RCPickerPanelTimeProps } from 'rc-picker/lib/PickerPanel';
import type { GenerateConfig } from 'rc-picker/lib/generate';
import type { CellRenderInfo } from 'rc-picker/lib/interface';
import * as React from 'react';
import enUS from './locale/en_US';
type InjectDefaultProps<Props> = Omit<Props, 'locale' | 'generateConfig' | 'prevIcon' | 'nextIcon' | 'superPrevIcon' | 'superNextIcon'> & {
    locale?: typeof enUS;
    size?: 'large' | 'default' | 'small';
};
export type PickerPanelBaseProps<DateType> = InjectDefaultProps<RCPickerPanelBaseProps<DateType>>;
export type PickerPanelDateProps<DateType> = InjectDefaultProps<RCPickerPanelDateProps<DateType>>;
export type PickerPanelTimeProps<DateType> = InjectDefaultProps<RCPickerPanelTimeProps<DateType>>;
export type PickerProps<DateType> = PickerPanelBaseProps<DateType> | PickerPanelDateProps<DateType> | PickerPanelTimeProps<DateType>;
export type CalendarMode = 'year' | 'month';
export type HeaderRender<DateType> = (config: {
    value: DateType;
    type: CalendarMode;
    onChange: (date: DateType) => void;
    onTypeChange: (type: CalendarMode) => void;
}) => React.ReactNode;
export interface SelectInfo {
    source: 'year' | 'month' | 'date' | 'customize';
}
export interface CalendarProps<DateType> {
    prefixCls?: string;
    className?: string;
    rootClassName?: string;
    style?: React.CSSProperties;
    locale?: typeof enUS;
    validRange?: [DateType, DateType];
    disabledDate?: (date: DateType) => boolean;
    /** @deprecated Please use fullCellRender instead. */
    dateFullCellRender?: (date: DateType) => React.ReactNode;
    /** @deprecated Please use cellRender instead. */
    dateCellRender?: (date: DateType) => React.ReactNode;
    /** @deprecated Please use fullCellRender instead. */
    monthFullCellRender?: (date: DateType) => React.ReactNode;
    /** @deprecated Please use cellRender instead. */
    monthCellRender?: (date: DateType) => React.ReactNode;
    cellRender?: (date: DateType, info: CellRenderInfo<DateType>) => React.ReactNode;
    fullCellRender?: (date: DateType, info: CellRenderInfo<DateType>) => React.ReactNode;
    headerRender?: HeaderRender<DateType>;
    value?: DateType;
    defaultValue?: DateType;
    mode?: CalendarMode;
    fullscreen?: boolean;
    onChange?: (date: DateType) => void;
    onPanelChange?: (date: DateType, mode: CalendarMode) => void;
    onSelect?: (date: DateType, selectInfo: SelectInfo) => void;
}
declare function generateCalendar<DateType>(generateConfig: GenerateConfig<DateType>): {
    (props: CalendarProps<DateType>): React.ReactElement<any, string | React.JSXElementConstructor<any>>;
    displayName: string;
};
export default generateCalendar;
