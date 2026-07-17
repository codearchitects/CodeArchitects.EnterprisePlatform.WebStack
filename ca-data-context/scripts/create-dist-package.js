const fs = require('fs');
const path = require('path');

const rootPkgPath = path.join(process.cwd(), 'package.json');
const distDir = path.join(process.cwd(), 'dist');
const distPkgPath = path.join(distDir, 'package.json');
const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));

const distPkg = {
  name: rootPkg.name,
  version: rootPkg.version,
  description: rootPkg.description,
  author: rootPkg.author,
  license: rootPkg.license,
  repository: rootPkg.repository,
  dependencies: rootPkg.dependencies,
  peerDependencies: rootPkg.peerDependencies,
  main: 'types/public_api.js',
  typings: 'types/public_api.d.ts'
};

fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(distPkgPath, JSON.stringify(distPkg));
