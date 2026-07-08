const package = require('./package.json');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const GeneratePackageJsonPlugin = require('generate-package-json-webpack-plugin');

const bundleOutputLibrary = 'umd';
const bundleOutput = `bundles/${package.name}.${bundleOutputLibrary}.js`;
package.main = bundleOutput;
// monorepo: harden dist package.json entry points (relative to dist root)
package.typings = "types/public_api.d.ts";
delete package.types;
delete package.module;
delete package.exports;
delete package.scripts;
delete package.devDependencies;
delete package.jest;

module.exports = {
  entry: './public_api.ts',
  devtool: 'source-map',
  plugins: [
    new GeneratePackageJsonPlugin(package, { excludeDependencies: package.peerDependencies ? Object.keys(package.peerDependencies) : [] })
  ],
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    library: {
      type: bundleOutputLibrary
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