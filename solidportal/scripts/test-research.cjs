// Render the real Home, Settings and Markdown components. Only VS Code's browser
// shell, the UI toolkit and the HTTP boundary are fixtures; no model runs here.
const esbuild = require('esbuild');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'solidgpt-research-'));
const outfile = path.join(directory, 'test.cjs');

try {
  esbuild.buildSync({
    entryPoints: ['src/test/research.test.tsx'], bundle: true, platform: 'node',
    outfile, loader: {'.css': 'empty', '.svg': 'text', '.png': 'text'},
    // Toolkit mocks are imported by the test before Home via this alias.
    alias: {
      antd: path.resolve('src/test/research-ui.tsx'),
      '@ant-design/icons': path.resolve('src/test/research-icons.tsx'),
      axios: path.resolve('src/test/research-http.ts'),
    },
  });
  const result = spawnSync(process.execPath, ['--test', '--test-force-exit', outfile], {stdio: 'inherit'});
  process.exitCode = result.status ?? 1;
} finally {
  fs.rmSync(directory, {recursive: true, force: true});
}
