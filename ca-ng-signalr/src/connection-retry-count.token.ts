import { InjectionToken } from '@angular/core';

/**
 * The number of times the browser will attempt to estabilish connection
 */
export const CONNECTION_RETRY_COUNT = new InjectionToken<string>('CONNECTION_RETRY_COUNT');
