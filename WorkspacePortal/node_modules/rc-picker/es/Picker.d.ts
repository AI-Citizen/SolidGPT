/**
 * Removed:
 *  - getCalendarContainer: use `getPopupContainer` instead
 *  - onOk
 *
 * New Feature:
 *  - picker
 *  - allowEmpty
 *  - selectable
 *
 * Tips: Should add faq about `datetime` mode with `defaultValue`
 */
import type { AlignType } from '@rc-component/trigger/lib/interface';
import * as React from 'react';
import type { CustomFormat, PresetDate } from './interface';
import type { PickerPanelBaseProps, PickerPanelDateProps, PickerPanelTimeProps } from './PickerPanel';
export type PickerRefConfig = {
    focus: () => void;
    blur: () => void;
};
export type PickerSharedProps<DateType> = {
    dropdownClassName?: string;
    dropdownAlign?: AlignType;
    popupStyle?: React.CSSProperties;
    transitionName?: string;
    placeholder?: string;
    allowClear?: boolean | {
        clearIcon?: React.ReactNode;
    };
    autoFocus?: boolean;
    disabled?: boolean;
    tabIndex?: number;
    open?: boolean;
    defaultOpen?: boolean;
    /** Make input readOnly to avoid popup keyboard in mobile */
    inputReadOnly?: boolean;
    id?: string;
    presets?: PresetDate<DateType>[];
    format?: string | CustomFormat<DateType> | (string | CustomFormat<DateType>)[];
    suffixIcon?: React.ReactNode;
    /**
     * Clear all icon
     * @deprecated Please use `allowClear` instead
     **/
    clearIcon?: React.ReactNode;
    prevIcon?: React.ReactNode;
    nextIcon?: React.ReactNode;
    superPrevIcon?: React.ReactNode;
    superNextIcon?: React.ReactNode;
    getPopupContainer?: (node: HTMLElement) => HTMLElement;
    panelRender?: (originPanel: React.ReactNode) => React.ReactNode;
    inputRender?: (props: React.InputHTMLAttributes<HTMLInputElement>) => React.ReactNode;
    onChange?: (value: DateType | null, dateString: string) => void;
    onOpenChange?: (open: boolean) => void;
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
    onMouseUp?: React.MouseEventHandler<HTMLDivElement>;
    onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>, preventDefault: () => void) => void;
    /**
     * Trigger `onChange` event when blur.
     * If you don't want to user click `confirm` to trigger change, can use this.
     */
    changeOnBlur?: boolean;
    /** @private Internal usage, do not use in production mode!!! */
    pickerRef?: React.MutableRefObject<PickerRefConfig>;
    role?: string;
    name?: string;
    autoComplete?: string;
    direction?: 'ltr' | 'rtl';
} & React.AriaAttributes;
type OmitPanelProps<Props> = Omit<Props, 'onChange' | 'hideHeader' | 'pickerValue' | 'onPickerValueChange'>;
export type PickerBaseProps<DateType> = {} & PickerSharedProps<DateType> & OmitPanelProps<PickerPanelBaseProps<DateType>>;
export type PickerDateProps<DateType> = {} & PickerSharedProps<DateType> & OmitPanelProps<PickerPanelDateProps<DateType>>;
export type PickerTimeProps<DateType> = {
    picker: 'time';
    /**
     * @deprecated Please use `defaultValue` directly instead
     * since `defaultOpenValue` will confuse user of current value status
     */
    defaultOpenValue?: DateType;
} & PickerSharedProps<DateType> & Omit<OmitPanelProps<PickerPanelTimeProps<DateType>>, 'format'>;
export type PickerProps<DateType> = PickerBaseProps<DateType> | PickerDateProps<DateType> | PickerTimeProps<DateType>;
declare class Picker<DateType> extends React.Component<PickerProps<DateType>> {
    pickerRef: React.RefObject<PickerRefConfig>;
    focus: () => void;
    blur: () => void;
    render(): React.JSX.Element;
}
export default Picker;
