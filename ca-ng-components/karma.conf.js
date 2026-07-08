// monorepo: headless Chromium via puppeteer
process.env.CHROME_BIN = process.env.CHROME_BIN || require("puppeteer").executablePath();

// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
    config.set({
      basePath: '',
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
      plugins: [
        require('karma-jasmine'),
        require('karma-chrome-launcher'),
        require('karma-jasmine-html-reporter'),
        require('karma-coverage-istanbul-reporter'),
        require('@angular-devkit/build-angular/plugins/karma')
      ],
      client: {
        clearContext: false, // leave Jasmine Spec Runner output visible in browser
        jasmine : {
          random: false
        }
      },
      coverageIstanbulReporter: {
        dir: require('path').join(__dirname, '../../coverage/my-lib'),
        reports: ['html', 'lcovonly', 'text-summary'],
        fixWebpackSourcePaths: true
      },
      reporters: ['progress', 'kjhtml'],
      port: 9878,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: true,
      customLaunchers: {
        ChromeHeadlessNoSandbox: {
          base: "ChromeHeadless",
          flags: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"]
        }
      },
      browsers: ["ChromeHeadlessNoSandbox"],
      singleRun: false,
      restartOnFileChange: true
    });
  };
  