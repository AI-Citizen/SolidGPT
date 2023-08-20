const shell = require('shelljs');
const fs = require('fs');
const path = require('path');

const colors = ['purple', 'pink', 'orange', 'green', 'blue', 'red'];

const generateRow = (package, index) => `
  <a href="${path.join(package.name, 'index.html')}" class="package-row">
    <span class="title is-${colors[index % colors.length]}">
      ${package.name}
    </span>
    <span class="description">${package.description}</span>
  </a>
`;

const generateHTML = packages => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Storybooks</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="monorepo-index.css">
  </head>
  <body>
    <img class="banner" src="storybook.svg" alt="Storybook"/>
    <div class="content">
      ${packages.map(generateRow).join('')}
    </div>
  </body>
  </html>
`;

module.exports = function buildMonorepoIndex(
  packages,
  customHTMLGenerate,
  outputDir
) {
  let index;

  console.log('=> Building index.html for monorepo');

  if (customHTMLGenerate) {
    const fn = require(path.join(process.cwd(), customHTMLGenerate));

    if (typeof fn === 'function') {
      index = fn(packages, outputDir);
    }
  } else {
    index = generateHTML(packages);

    shell.cp(
      path.join(__dirname, 'storybook.svg'),
      path.join(outputDir, 'storybook.svg')
    );
    shell.cp(
      path.join(__dirname, 'monorepo-index.css'),
      path.join(outputDir, 'monorepo-index.css')
    );
  }

  fs.writeFileSync(path.join(outputDir, 'index.html'), index);
};
