import type { StorybookConfig as BaseConfig } from '@storybook/core-common';

/**
 * The interface for Storybook configuration in `main.ts` files.
 */
export interface StorybookConfig extends BaseConfig {
  reactOptions?: {
    fastRefresh?: boolean;
    strictMode?: boolean;
    /**
     * Use React's legacy root API to mount components
     * @description
     * React has introduced a new root API with React 18.x to enable a whole set of new features (e.g. concurrent features)
     * If this flag is true, the legacy Root API is used to mount components to make it easier to migrate step by step to React 18.
     * @default false
     */
    legacyRootApi?: boolean;
  };
}
