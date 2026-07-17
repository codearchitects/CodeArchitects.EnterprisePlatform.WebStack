// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');
const fs = require('fs');
const path = require('path');

function resolveChromeDriverPath() {
  const seleniumDir = path.resolve(__dirname, '../../../node_modules/webdriver-manager/selenium');
  const file = fs
    .readdirSync(seleniumDir)
    .find(name => name.startsWith('chromedriver_') && !name.endsWith('.zip'));

  if (!file) {
    throw new Error('chromedriver binary not found. Run webdriver-manager update first.');
  }

  return path.join(seleniumDir, file);
}

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './src/**/*.e2e-spec.ts'
  ],
  capabilities: {
    'browserName': 'chrome'
  },
  chromeDriver: resolveChromeDriverPath(),
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: path.join(__dirname, './tsconfig.e2e.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
};
