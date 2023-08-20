import * as React from 'react';
export declare type CompareProps<T extends React.ComponentType<any>> = (prevProps: Readonly<React.ComponentProps<T>>, nextProps: Readonly<React.ComponentProps<T>>) => boolean;
/**
 * Get render update mark by `makeImmutable` root.
 * Do not deps on the return value as render times
 * but only use for `useMemo` or `useCallback` deps.
 */
export declare function useImmutableMark(): number;
/**
 * Wrapped Component will be marked as Immutable.
 * When Component parent trigger render,
 * it will notice children component (use with `responseImmutable`) node that parent has updated.

 * @param Component Passed Component
 * @param triggerRender Customize trigger `responseImmutable` children re-render logic. Default will always trigger re-render when this component re-render.
 */
export declare function makeImmutable<T extends React.ComponentType<any>>(Component: T, shouldTriggerRender?: CompareProps<T>): T;
/**
 * Wrapped Component with `React.memo`.
 * But will rerender when parent with `makeImmutable` rerender.
 */
export declare function responseImmutable<T extends React.ComponentType<any>>(Component: T, propsAreEqual?: CompareProps<T>): T;
