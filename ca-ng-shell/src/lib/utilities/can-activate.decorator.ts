import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MetadataHelpers } from '@ca-webstack/reflection';

const CanActivateKey = 'canActivate';

export function CanActivate() {
  return MetadataHelpers.defineMetadata(CanActivateKey, undefined, (target: any, targetKey: string) => target[targetKey]);
}

export function getCanActivateMetadata(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  const meta = <Function>MetadataHelpers.getMetadata(CanActivateKey, route.component, 'onCanActivate');
  return meta ? meta(route, state) : true;
}
