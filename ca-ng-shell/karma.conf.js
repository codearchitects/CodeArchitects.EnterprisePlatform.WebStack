// monorepo: headless Chromium via puppeteer
process.env.CHROME_BIN = process.env.CHROME_BIN || require("puppeteer").executablePath();

// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const argv = require('minimist')(process.argv.slice(2));
const karmaArgs = [];
let requestedUnit = argv.unit;
let requestedIntegration = argv.integration
if(!argv.unit && !argv.integration) {
  requestedUnit = true;
  requestedIntegration = true;
}
if(requestedUnit) {
  console.log('Requested unit tests');
  karmaArgs.push('unit');
}
if(requestedIntegration) {
  console.log('Requested integration tests');
  karmaArgs.push('integration');
}

module.exports = function (config) {
  config.set({
    // files: [
    //   { pattern: './tests/integration/test.ts', watched: false }
    // ],
    mime: {'text/x-typescript': ['ts', 'tsx']},
    // preprocessors: {
    //   './tests/integration/test.ts': ['@angular-devkit/build-angular']
    // },
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-spec-reporter')
    ],
    client:{
      args: karmaArgs,
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, 'coverage'), reports: ['html', 'text'],
      fixWebpackSourcePaths: true,
      skipFilesWithNoCoverage: true
    },
    port: 9884,
    colors: true,
    logLevel: config.LOG_INFO,
    browserNoActivityTimeout: 60000,
    captureTimeout: 60000,
    autoWatch: true,
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: "ChromeHeadless",
        flags: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"]
      }
    },
    browsers: ["ChromeHeadlessNoSandbox"],
    singleRun: false
  });
};
