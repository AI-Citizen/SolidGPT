const { transformSync } = require('@babel/core');
const plugin = require('./index');

expect.addSnapshotSerializer({
  print: (val) => val,
  test: () => true,
});

const transform = (input) => {
  const { code } = transformSync(input, {
    plugins: [plugin],
  });
  return code;
};

describe('named-exports-order', () => {
  it('named exports', () => {
    expect(
      transform(`
        export const a = 0;
        export const b = 1;
  `)
    ).toMatchInlineSnapshot(`
      export const a = 0;
      export const b = 1;
      export const __namedExportsOrder = ["a", "b"];
    `);
  });

  it('default export', () => {
    expect(
      transform(`
        export default { title: 'foo' };
        export const a = 0;
  `)
    ).toMatchInlineSnapshot(`
      export default {
        title: 'foo'
      };
      export const a = 0;
      export const __namedExportsOrder = ["a"];
    `);
  });

  it('no exports', () => {
    expect(
      transform(`
        const a = 0;
        const b = 1;
    `)
    ).toMatchInlineSnapshot(`
      const a = 0;
      const b = 1;
  `);
  });

  it('export specifiers', () => {
    expect(
      transform(`
        const a = 0;
        const b = 1;
        export { a, b };
    `)
    ).toMatchInlineSnapshot(`
      const a = 0;
      const b = 1;
      export { a, b };
      export const __namedExportsOrder = ["a", "b"];
    `);
  });

  it('function exports', () => {
    expect(
      transform(`
        export function b() {};
        export function c() {};
    `)
    ).toMatchInlineSnapshot(`
      export function b() {}
      ;
      export function c() {}
      ;
      export const __namedExportsOrder = ["b", "c"];
    `);
  });

  it('duplicate named exports order', () => {
    expect(
      transform(`
        export const a = 0;
        export const __namedExportsOrder = ["a", "b"];
        export const b = 1;
    `)
    ).toMatchInlineSnapshot(`
      export const a = 0;
      export const __namedExportsOrder = ["a", "b"];
      export const b = 1;
    `);
  });

  it('mixed', () => {
    expect(
      transform(`
        export const a = 0;
        export function b () {}
        export { a as c };
    `)
    ).toMatchInlineSnapshot(`
      export const a = 0;
      export function b() {}
      export { a as c };
      export const __namedExportsOrder = ["a", "b", "c"];
    `);
  });
});
