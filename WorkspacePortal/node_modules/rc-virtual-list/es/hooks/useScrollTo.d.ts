import * as React from 'react';
import type { ScrollTo } from '../List';
import type { GetKey } from '../interface';
import type CacheMap from '../utils/CacheMap';
export default function useScrollTo<T>(containerRef: React.RefObject<HTMLDivElement>, data: T[], heights: CacheMap, itemHeight: number, getKey: GetKey<T>, collectHeight: () => void, syncScrollTop: (newTop: number) => void, triggerFlash: () => void): ScrollTo;
