import { InjectionToken } from '@angular/core';

/**
 * Disables remote entry handling in multi-application architecture
 */
export const CAEP_MICROFRONTEND_DISABLE_REMOTE_ENTRY_TOKEN = new InjectionToken<boolean>('Disable remote entry');