import type { Theme } from '@ant-design/cssinjs';
import React from 'react';
import type { AliasToken, MapToken, OverrideToken, SeedToken } from './interface';
export declare const defaultTheme: Theme<any, any>;
export declare const defaultConfig: {
    token: SeedToken;
    hashed: boolean;
};
export interface DesignTokenProviderProps {
    token: Partial<AliasToken>;
    theme?: Theme<SeedToken, MapToken>;
    components?: {
        [key in keyof OverrideToken]?: OverrideToken[key] & {
            theme?: Theme<SeedToken, MapToken>;
        };
    };
    hashed?: string | boolean;
}
export declare const DesignTokenContext: React.Context<DesignTokenProviderProps>;
