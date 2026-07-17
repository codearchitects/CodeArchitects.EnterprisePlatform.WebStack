import { RouteGuard } from './../services/route.guard';
import { Route } from '@angular/router';
import { MetadataHelpers } from '@ca-webstack/reflection';
import {
  IApplicationComponentArgs, IDomainComponentArgs, ITaskComponentArgs, IActivityComponentArgs
} from './../types/component-args.interface';

const ActivityComponentMetadataKey = 'custom:activityComponent';

/* types */
interface TaskRouteItems { [task: string]: { [path: string]: Route }; }

/* statics */
const __taskRouteItems: TaskRouteItems = {};

/**
 * Used for decorating application wide components
 */
export function ApplicationComponent(args?: IApplicationComponentArgs) {
  return MetadataHelpers.defineMetadata(ActivityComponentMetadataKey, args, (target, targetKey) => {
    const actual = <IApplicationComponentArgs>MetadataHelpers.getMetadata(
      ActivityComponentMetadataKey, args ? args.extends || target : target, targetKey, { inheritParentMetadata: true }
    );
    return actual;
  });
}

/**
 * Used for decorating domain wide components
 */
export function DomainComponent(args?: IDomainComponentArgs) {
  return MetadataHelpers.defineMetadata(ActivityComponentMetadataKey, args, (target, targetKey) => {
    const actual = <IDomainComponentArgs>MetadataHelpers.getMetadata(
      ActivityComponentMetadataKey, args ? args.extends || target : target, targetKey, { inheritParentMetadata: true });
    return actual;
  });
}

/**
 * Used for decorating task wide components
 */
export function TaskComponent(args?: ITaskComponentArgs) {
  return MetadataHelpers.defineMetadata(ActivityComponentMetadataKey, args, (target, targetKey) => {
    const actual = <ITaskComponentArgs>MetadataHelpers.getMetadata(
      ActivityComponentMetadataKey, args ? args.extends || target : target, targetKey, { inheritParentMetadata: true });
    return actual;
  });
}

/**
 * Used for decorating activity components
 */
export function ActivityComponent(args?: IActivityComponentArgs) {
  return MetadataHelpers.defineMetadata(ActivityComponentMetadataKey, args, (target, targetKey) => {
    const actual = <IActivityComponentArgs>MetadataHelpers.getMetadata(
      ActivityComponentMetadataKey, args ? args.extends || target : target, targetKey, { inheritParentMetadata: true });
    if (actual) {
      if (args && actual.path && args.path) {
        actual.path = args.path;
      }
      if (args.shortDescription) {
        actual.shortDescription = args.shortDescription;
      }
      const _path = actual.path;
      if (_path instanceof Array) {
        _path.forEach(p => __taskRouteItems[actual.task][p] = {
          path: p,
          component: target,
          canActivate: (args.canActivate || actual.canActivate) && [RouteGuard],
          canDeactivate: (args.canDeactivate || actual.canDeactivate) && [RouteGuard]
        });
      } else if (typeof _path === 'string') {
        __taskRouteItems[actual.task][_path] = {
          path: _path,
          component: target,
          canActivate: (args.canActivate || actual.canActivate) && [RouteGuard],
          canDeactivate: (args.canDeactivate || actual.canDeactivate) && [RouteGuard]
        };
      }
      return actual;
    }
    if (args && !__taskRouteItems[args.task]) {
      __taskRouteItems[args.task] = {};
    }
    const path = args.path;
    if (path instanceof Array) {
      path.forEach(p => __taskRouteItems[args.task][p] = {
        path: p,
        component: target,
        canActivate: args.canActivate && [RouteGuard],
        canDeactivate: args.canDeactivate && [RouteGuard]
      });
    } else if (typeof path === 'string') {
      __taskRouteItems[args.task][path] = {
        path: path,
        component: target,
        canActivate: args.canActivate && [RouteGuard],
        canDeactivate: args.canDeactivate && [RouteGuard]
      };
    }
    return args;
  });
}

/**
 * Returns path and redirect path array from ActivityComponent decorators reflected from source code by given task
 * @returns
 * { path: string, redirectTo: string }[]
 */
export function getRoutesByTask(task: string, canActivate: any[] = [], canDeactivate: any[] = []) {
  const routerConfig = new Array<Route>();
  // tslint:disable
  for (const path in __taskRouteItems[task]) {
    const route = __taskRouteItems[task][path];
    if (canActivate) {
      route.canActivate = canActivate;
    }
    if (canDeactivate) {
      route.canDeactivate = canDeactivate;
    }
    routerConfig.push(route);
  }
  const startRoute: Route = { path: '', redirectTo: 'start', pathMatch: 'full' };
  if (canActivate) {
    startRoute.canActivate = canActivate;
  }
  if (canDeactivate) {
    startRoute.canDeactivate = canDeactivate;
  }
  // tslint:enable
  routerConfig.push(startRoute);

  return routerConfig;
}
