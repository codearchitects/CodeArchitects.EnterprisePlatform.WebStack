import { getCanActivateMetadata } from '../utilities/can-activate.decorator';
import { getCanDeactivateMetadata } from '../utilities/can-deactivate.decorator';
import { ActivatedRouteSnapshot, CanActivateFn, CanDeactivateFn, RouterStateSnapshot } from '@angular/router';

/**
 * Returns the CanActivate functional guard for the current action
 */
export function routeCanActivateGuard(): CanActivateFn {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => getCanActivateMetadata(route, state);
}

/**
 * Returns the CanDeactivate functional guard for the current action
 */
export function routeCanDeactivateGuard(): CanDeactivateFn<any> {
  return (component: any, route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => getCanDeactivateMetadata(route, state);
}