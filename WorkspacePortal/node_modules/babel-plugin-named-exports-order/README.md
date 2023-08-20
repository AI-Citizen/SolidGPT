# babel-plugin-named-exports-order

This is a babel plugin that adds an array of strings to any JS file for its named exports.

For example, the plugin would transform this:

```js
export const a = 0;
export const b = 1;
```

To this:

```js
export const a = 0;
export const b = 1;
export const __namedExportsOrder = ['a', 'b'];
```

Bundlers like Webpack5 are not guaranteed to preserve the original export order, but some tools need it to function properly.

It was written for [Storybook](https://storybook.js.org), which allows users to order their "stories" based on the export order in the file, and has special logic to re-sort the stories based on `__namedExportsOrder` if it's present.

## Usage

Install with:

```
yarn add babel-plugin-named-exports-order -D
```

Then add it to `plugins` in `.babelrc.js`:

```js
module.exports = {
  plugins: ['babel-plugin-named-exports-order'],
};
```
