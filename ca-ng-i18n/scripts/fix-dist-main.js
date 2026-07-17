const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const distDir = path.resolve(__dirname, '..', 'dist');
const distPkgPath = path.join(distDir, 'package.json');
const umdPath = path.join(distDir, 'bundles', '@ca-webstack', 'ng-i18n.umd.js');
const ngcMainPath = path.join(distDir, 'types', 'ng-i18n.js');

if (!fs.existsSync(distPkgPath)) {
  process.exit(0);
}

if (fs.existsSync(umdPath)) {
  process.exit(0);
}

if (!fs.existsSync(ngcMainPath)) {
  process.exit(0);
}

// The legacy bundler may delete JS files under dist/types/src during its cleanup step.
// Regenerate CommonJS runtime files so types/ng-i18n.js can resolve ./src/index.
execSync(
  'tsc -p tsconfig.json --outDir dist/types --module commonjs --target es5 --declaration false --removeComments false --sourceMap false',
  { stdio: 'inherit' }
);

const raw = fs.readFileSync(distPkgPath, 'utf8');
const pkg = JSON.parse(raw);

pkg.main = 'types/ng-i18n.js';

fs.writeFileSync(distPkgPath, JSON.stringify(pkg));
console.log('[fix-dist-main] UMD bundle missing, dist main set to types/ng-i18n.js');
