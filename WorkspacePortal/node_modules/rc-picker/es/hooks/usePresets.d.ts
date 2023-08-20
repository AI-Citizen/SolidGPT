import type { PresetDate } from '../interface';
export default function usePresets<T>(presets?: PresetDate<T>[], legacyRanges?: Record<string, T | (() => T)>): PresetDate<T>[];
