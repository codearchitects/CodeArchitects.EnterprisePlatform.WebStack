import { InjectionToken } from '@angular/core';
import { CaepSideMenuPreserveNavigationFlowCallback } from '../models';

/**
 * CaepSideMenu preserve navigation flow callback token.
 */
export const CAEP_SIDE_MENU_PRESERVE_NAVIGATION_FLOW = new InjectionToken<CaepSideMenuPreserveNavigationFlowCallback>(
  'CAEP_SIDE_MENU_PRESERVE_NAVIGATION_FLOW'
);

/**
 * CaepSideMenu preserve navigation flow override mode token.
 */
export const CAEP_SIDE_MENU_PRESERVE_NAVIGATION_FLOW_OVERRIDE = new InjectionToken<boolean>(
  'CAEP_SIDE_MENU_PRESERVE_NAVIGATION_FLOW_OVERRIDE'
);
