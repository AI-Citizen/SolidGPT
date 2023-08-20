import type { TourProps } from './interface';
interface Props {
    defaultType?: string;
    steps?: TourProps['steps'];
    current?: number;
    defaultCurrent?: number;
}
/**
 * returns the merged type of a step or the default type.
 */
declare const useMergedType: ({ defaultType, steps, current, defaultCurrent }: Props) => {
    currentMergedType: string | undefined;
    updateInnerCurrent: (updater: number | ((origin: number | undefined) => number | undefined) | undefined, ignoreDestroy?: boolean | undefined) => void;
};
export default useMergedType;
