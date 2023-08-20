/// <reference types="react" />
export type RenderFunc<T> = (item: T, index: number, props: {
    style?: React.CSSProperties;
}) => React.ReactNode;
export interface SharedConfig<T> {
    getKey: (item: T) => React.Key;
}
export type GetKey<T> = (item: T) => React.Key;
