import { getCanActivateMetadata } from '../utilities/can-activate.decorator';
import { getCanDeactivateMetadata } from '../utilities/can-deactivate.decorator';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot } from '@angular/router';

/**
 * Route gard injectable component
 */
@Injectable()
export class RouteGuard
  implements CanActivate, CanDeactivate<any> {

  /**
   * return true if new action can be activated
   * @param route angular.io ActivatedRouteSnapshot
   * @param state angular.io RouterStateSnapshot
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return getCanActivateMetadata(route, state);
  }

  /**
   * return true if current action can be deActivated
   * @param component component
   * @param route angular.io ActivatedRouteSnapshot
   * @param state angular.io RouterStateSnapshot
   */
  canDeactivate(component: any, route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return getCanDeactivateMetadata(route, state);
  }
}
