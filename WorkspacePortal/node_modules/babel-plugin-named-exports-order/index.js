module.exports = function ({ types: t }) {
  return {
    visitor: {
      ExportNamedDeclaration: {
        enter({ node }) {
          if (node.declaration) {
            let declarations;
            if (t.isVariableDeclaration(node.declaration)) {
              declarations = node.declaration.declarations.filter((d) => t.isVariableDeclarator(d));
            } else if (t.isFunctionDeclaration(node.declaration)) {
              declarations = [node.declaration];
            }
            if (declarations) {
              // export const X = ...;
              declarations.forEach((decl) => {
                if (t.isIdentifier(decl.id)) {
                  const { name } = decl.id;
                  this.namedExports.push(name);
                }
              });
            }
          } else if (node.specifiers) {
            node.specifiers.forEach((spec) => {
              this.namedExports.push(spec.exported.name);
            });
          }
        },
      },
      Program: {
        enter({ state }) {
          this.namedExports = [];
        },
        exit(path) {
          if (this.namedExports.length > 0 && !this.namedExports.includes('__namedExportsOrder')) {
            const namedExportsOrder = t.exportNamedDeclaration(
              t.variableDeclaration('const', [
                t.variableDeclarator(
                  t.identifier('__namedExportsOrder'),
                  t.arrayExpression(this.namedExports.map((name) => t.stringLiteral(name)))
                ),
              ])
            );
            path.pushContainer('body', namedExportsOrder);
          }
        },
      },
    },
  };
};
