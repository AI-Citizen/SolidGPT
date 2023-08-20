/**
 * This function will do as `Object.assign` in production. But will use Object.defineProperty:get to
 * pass all value access in development. To support statistic field usage with alias token.
 */
export declare function merge<T extends object>(...objs: Partial<T>[]): T;
/** Statistic token usage case. Should use `merge` function if you do not want spread record. */
export default function statisticToken<T extends object>(token: T): {
    token: T;
    keys: Set<string> | undefined;
    flush: (componentName: string, componentToken: Record<string, string | number>) => void;
};
