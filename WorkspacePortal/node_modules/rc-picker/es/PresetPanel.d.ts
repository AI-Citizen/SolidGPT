import * as React from 'react';
import type { PresetDate } from './interface';
export interface PresetPanelProps<T> {
    prefixCls: string;
    presets: PresetDate<T>[];
    onClick: (value: T) => void;
    onHover?: (value: T) => void;
}
export default function PresetPanel<T>(props: PresetPanelProps<T>): React.JSX.Element;
