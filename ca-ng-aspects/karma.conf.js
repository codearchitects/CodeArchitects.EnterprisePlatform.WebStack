// monorepo: headless Chromium via puppeteer
process.env.CHROME_BIN = process.env.CHROME_BIN || require("puppeteer").executablePath();

// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    mime: { 'text/x-typescript': ['ts', 'tsx'] },
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
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      reports: ['html', 'text'],
      fixWebpackSourcePaths: true,
      skipFilesWithNoCoverage: true
    },
    port: 9876,
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
