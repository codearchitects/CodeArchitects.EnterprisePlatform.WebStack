import './src/polyfills.ts';
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';

import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare var __karma__: any;
declare var require: any;

// Karma args
const args = (__karma__.config.args as string[]);

// Checking whether to include unit tests
const includeUnitTests = args.indexOf('unit') >= 0;

// Checking whether to include integration tests
const includeIntegrationTests = args.indexOf('integration') >= 0;

// Prevent Karma from running prematurely.
__karma__.loaded = Function.prototype;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

if (includeIntegrationTests) {
  const integrationContext = require.context('./src', true, /\.spec\.ts/);
  integrationContext.keys().map(integrationContext);
}

if (includeUnitTests) {
  const unitContext = require.context('../../src', true, /\.spec\.ts/);
  unitContext.keys().map(unitContext);
}

// Finally, start Karma to run the tests.
__karma__.start();
