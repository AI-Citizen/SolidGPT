import * as React from 'react';
/**
 * 1. Click input to show picker
 * 2. Calculate next open index
 *
 * If click `confirm`:
 * 3. Hide current picker
 * 4. Open next index picker if exist
 *
 * If not `changeOnBlur` and click outside:
 * 3. Hide picker
 *
 * If `changeOnBlur` and click outside:
 * 3. Hide current picker
 * 4. Open next index picker if exist
 */
export type SourceType = 'open' | 'blur' | 'confirm' | 'cancel' | 'clear' | 'preset';
/**
 * Auto control of open state
 */
export default function useRangeOpen(defaultOpen: boolean, open: boolean, activePickerIndex: 0 | 1 | undefined, changeOnBlur: boolean, startInputRef: React.RefObject<HTMLInputElement>, endInputRef: React.RefObject<HTMLInputElement>, startSelectedValue: any, endSelectedValue: any, disabled: [boolean, boolean], onOpenChange?: (open: boolean) => void): [
    open: boolean,
    activeIndex: 0 | 1,
    firstTimeOpen: boolean,
    triggerOpen: (open: boolean, activeIndex: 0 | 1 | false, source: SourceType) => void
];
