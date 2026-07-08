const package = require('./package.json');
const path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const GeneratePackageJsonPlugin = require('generate-package-json-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const bundleOutputLibrary = "umd";
const bundleOutput = `bundles/${package.name}.${bundleOutputLibrary}.js`;
package.main = bundleOutput;
// monorepo: harden dist package.json entry points (relative to dist root)
package.types = package.typings = "types/public_api.d.ts";
delete package.module;
delete package.exports;
delete package.scripts;
delete package.devDependencies;
delete package.jest;

module.exports = {
  entry: './public_api.ts',
  plugins: [
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      // allow import cycles that include an asyncronous import,
      // e.g. via import(/* webpackMode: "weak" */ './file.js')
      allowAsyncCycles: false,
      // set the current working directory for displaying module paths
      cwd: process.cwd(),
    }),
    new GeneratePackageJsonPlugin(package, { excludeDependencies: package.peerDependencies ? Object.keys(package.peerDependencies) : [] })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [/node_modules/]
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      fs: "empty",
    },
  },
  output: {
    library: {
      type: bundleOutputLibrary,
    },
    filename: bundleOutput,
    sourceMapFilename: `${bundleOutput}.map`,
    path: path.resolve(__dirname, 'dist'),
  },
  externalsPresets: { node: true },
  externals: [nodeExternals({
    importType: bundleOutputLibrary,
    modulesFromFile: true
  })],
};