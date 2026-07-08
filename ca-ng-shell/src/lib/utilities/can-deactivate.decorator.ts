import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MetadataHelpers } from '@ca-webstack/reflection';

const CanDeactivateKey = 'canDeactivate';

export function CanDeactivate() {
  return MetadataHelpers.defineMetadata(CanDeactivateKey, undefined, (target: any, targetKey: string) => target[targetKey]);
}

export function getCanDeactivateMetadata(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  const meta = <Function>MetadataHelpers.getMetadata(CanDeactivateKey, route.component, 'onCanDeactivate');
  return meta ? meta(route, state) : true;
}
