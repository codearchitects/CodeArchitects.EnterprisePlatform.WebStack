// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/zone';
import 'zone.js/dist/zone-testing';
import { TestBed, getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { ValidatorHelper } from '@ca-webstack/ng-aspects';

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

const originalConfigureTestingModule = TestBed.configureTestingModule;

TestBed.configureTestingModule = ((moduleDef) => {
  const definition = moduleDef || {};
  const providers = definition.providers ? [...definition.providers] : [];
  const hasValidatorHelper = providers.some((provider: any) =>
    provider === ValidatorHelper || provider && provider.provide === ValidatorHelper
  );

  if (!hasValidatorHelper) {
    providers.push(ValidatorHelper);
  }

  return originalConfigureTestingModule.call(TestBed, {
    ...definition,
    providers
  });
}) as any;

// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
