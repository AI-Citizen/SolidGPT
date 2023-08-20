# Builder-Webpack5

Builder implemented with `webpack5` and `webpack5`-compatible loaders/plugins/config, used by `@storybook/core-server` to build the preview iframe.

`webpack4` is the default. To configure your Storybook to run `webpack5`, install `@storybook/manager-webpack5` and `@storybook/builder-webpack5` as dev dependencies then update your `.storybook/main.js` configuration.

```js
module.exports = {
  core: {
    builder: 'webpack5',
  },
};
```
