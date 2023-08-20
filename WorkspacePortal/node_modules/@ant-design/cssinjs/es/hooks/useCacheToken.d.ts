import type Theme from '../theme/Theme';
export interface Option<DerivativeToken, DesignToken> {
    /**
     * Generate token with salt.
     * This is used to generate different hashId even same derivative token for different version.
     */
    salt?: string;
    override?: object;
    /**
     * Format token as you need. Such as:
     *
     * - rename token
     * - merge token
     * - delete token
     *
     * This should always be the same since it's one time process.
     * It's ok to useMemo outside but this has better cache strategy.
     */
    formatToken?: (mergedToken: any) => DerivativeToken;
    /**
     * Get final token with origin token, override token and theme.
     * The parameters do not contain formatToken since it's passed by user.
     * @param origin The original token.
     * @param override Extra tokens to override.
     * @param theme Theme instance. Could get derivative token by `theme.getDerivativeToken`
     */
    getComputedToken?: (origin: DesignToken, override: object, theme: Theme<any, any>) => DerivativeToken;
}
export declare const getComputedToken: <DerivativeToken = object, DesignToken = DerivativeToken>(originToken: DesignToken, overrideToken: object, theme: Theme<any, any>, format?: ((token: DesignToken) => DerivativeToken) | undefined) => any;
/**
 * Cache theme derivative token as global shared one
 * @param theme Theme entity
 * @param tokens List of tokens, used for cache. Please do not dynamic generate object directly
 * @param option Additional config
 * @returns Call Theme.getDerivativeToken(tokenObject) to get token
 */
export default function useCacheToken<DerivativeToken = object, DesignToken = DerivativeToken>(theme: Theme<any, any>, tokens: Partial<DesignToken>[], option?: Option<DerivativeToken, DesignToken>): [DerivativeToken & {
    _tokenKey: string;
}, string];
