import type { Theme } from '@ant-design/cssinjs';
import type { AliasToken, GlobalToken, MapToken, SeedToken } from './interface';
import type { DesignTokenProviderProps } from './context';
export declare const getComputedToken: (originToken: SeedToken, overrideToken: DesignTokenProviderProps['components'] & {
    override?: Partial<AliasToken>;
}, theme: Theme<any, any>) => any;
export default function useToken(): [
    theme: Theme<SeedToken, MapToken>,
    token: GlobalToken,
    hashId: string
];
