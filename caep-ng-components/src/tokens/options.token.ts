import { InjectionToken } from '@angular/core';

/**
 * Token for providing option's construction function via component providers
 */
export const CAEP_OPTIONS_TOKEN = new InjectionToken<Function>('Options constructor');
