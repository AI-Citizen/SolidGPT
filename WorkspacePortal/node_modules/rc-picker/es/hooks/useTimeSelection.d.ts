import type { GenerateConfig } from '../generate';
import type { Unit } from '../panels/TimePanel/TimeUnitColumn';
export default function useTimeSelection<DateType>({ value, generateConfig, disabledMinutes, disabledSeconds, minutes, seconds, use12Hours, }: {
    value: DateType;
    generateConfig: GenerateConfig<DateType>;
    disabledMinutes: (hour: number) => number[];
    disabledSeconds: (hour: number, minute: number) => number[];
    minutes: Unit[];
    seconds: Unit[];
    use12Hours: boolean;
}): (isNewPM: boolean | undefined, newHour: number, newMinute: number, newSecond: number) => DateType;
