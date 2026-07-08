import { InjectionToken } from '@angular/core';

/**
 * Whether to use query params while navigating.
 * By default params will be threated as routing params.
 * @default false
 */
export const CA_ROUTING_QUERY_PARAMS = new InjectionToken<boolean>('CA_ROUTING_QUERY_PARAMS');
