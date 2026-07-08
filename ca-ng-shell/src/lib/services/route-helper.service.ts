import { Router } from '@angular/router';
import { Observable, Subscriber } from 'rxjs';
import { IStackFrame, ITaskSlot, INavigateArgs, INavigationArgs } from '../types/index';
import { toArray } from '../utilities/index';
import { toQueryParams } from '../utilities';

export class RouteHelper {

  /**
   * navigates to a given route
   * @param router angular2 router
   * @param args navigation arguments
   * @param taskSlotFactory taskslot factory method
   * @param stackFrameFactory stackframe factory method
   */
  public static navigate<TTaskSlot extends ITaskSlot, TStackFrame extends IStackFrame>(
    router: Router,
    args: INavigateArgs,
    taskSlotFactory: () => TTaskSlot,
    stackFrameFactory: () => TStackFrame
  ) {
    let retry = 0;
    let yetExecuted = false;
    const delayMilliSeconds = 50;
    let navigateObservable: Observable<boolean>;
    let replaceUrl = false;

    if (args.activity && args.activity.payload) {
      if (!args.activity.payload.stack) {
        args.activity.payload.stack = [];
      }

      const stack = args.activity.payload.stack;

      // insert return stack frame
      if (args.withReturn) {
        const tailStackFrame = stack.length > 0 ? stack[stack.length - 1] : null;
        const returnStackFrame = RouteHelper.createStackFrame({
          application: tailStackFrame.application,
          domain: tailStackFrame.domain,
          scenario: tailStackFrame.scenario,
          action: tailStackFrame.action,
          params: tailStackFrame.params,
          stackFrameFactory: stackFrameFactory
        });
        returnStackFrame.isReturnPoint = true;
        stack.push(returnStackFrame);
      }

      //
      const stackFrame = RouteHelper.createStackFrame({
        stackFrame: !args.isUnwinding ? stackFrameFactory() : stack[stack.length - 1],
        application: args.application,
        domain: args.domain,
        scenario: args.scenario,
        action: args.action,
        params: args.queryParams,
        stackFrameFactory: stackFrameFactory
      });

      if (!args.isUnwinding) {
        stackFrame.input = args.input;
        stack.push(stackFrame);
      }
      stackFrame.output = args.output;
    }

    const _navigate = (url: string) => {
      console.log(`*** lasturl = ${url}`);
      localStorage.setItem('lasturl', url);
      const handle = setTimeout(() => {
        if (localStorage.getItem('lasturl') !== url) {
          localStorage.setItem('lasturl', url);
        } else {
          clearTimeout(handle);
        }
      }, 250);
      return new Observable<boolean>((observer: Subscriber<boolean>) => {
        const _tryNavigate = (error: any) => {
          if (++retry <= 3) {
            _navigate(url).subscribe({ next: result => {
              observer.next(result);
            }
              , error: navigationError => {
                observer.error(navigationError);
              }});
          } else {
            // setTimeout(() => window.location.reload(true), 2000);
            console.error(error);
            /* eslint-disable */
            console.trace(error);
            /* eslint-enable */
            observer.error(error);
          }
        };
        if (router.url !== url) {
          router.navigateByUrl(url, { replaceUrl: replaceUrl })
            .then(fulfilled => {
              if (fulfilled) {
                observer.next(fulfilled);
                observer.complete();
              } else {
                setTimeout(() => _tryNavigate(`navigation failed for url: ${url}`), retry * delayMilliSeconds);
              }
            }).catch(error => {
              setTimeout(() => _tryNavigate(`navigation failed for url: ${url} with error ${error}`), retry * delayMilliSeconds);
            });
        } else {
          observer.next(true);
          observer.complete();
        }
      });
    };
    navigateObservable = new Observable<boolean>((navigateObserver: Subscriber<boolean>) => {
      if (yetExecuted) {
        return;
      }
      yetExecuted = true;
      const taskSlot = taskSlotFactory();
      taskSlot.taskId = args.activity ? args.activity.taskId : null;
      taskSlot.payload = args.activity ? args.activity.payload : null;

      const navigationArgs: INavigationArgs = {
        application: Array.isArray(args.application) ? args.application : [args.application],
        domain: Array.isArray(args.domain) ? args.domain : [args.domain],
        scenario: Array.isArray(args.scenario) ? args.scenario : [args.scenario],
        action: Array.isArray(args.action) ? args.action : [args.action]
      };

      if (!args.activity || args.activity.checkGuard(navigationArgs.action[0])) {
        if (args.activity) {
          for (const i in taskSlot.payload) {
            // avoid stack
            if (i === 'stack') {
              continue;
            } else {
              args.delegates.dataContext.attach(taskSlot.payload[i]);
            }
          }
        }

        if (taskSlot.payload) {
          (args.activity.payload as any)['processInfo'] = taskSlot.payload.processInfo;
        }
        args.application = navigationArgs.application;
        args.domain = navigationArgs.domain;

        args.scenario = navigationArgs.scenario;
        args.action = navigationArgs.action;

        if (!args.scenario[1] && args.scenario[0]) {
          // retrieve new taskId only if scenario is valid
          if (args.scenario[0]) {
            args.delegates.getUniqueIdentifier(1).subscribe(id => {
              replaceUrl = false;
              (<any>args.scenario)[1] = <string>id;
              const url = RouteHelper.constructPath(args);
              _navigate(url).subscribe({ next: result => { console.log(result); }, error: error => navigateObserver.error(error)});
            });
          }
        } else {
          const url = RouteHelper.constructPath(args);
          _navigate(url).subscribe({ next: result => {
            console.log(result);
          }, error: error => navigateObserver.error(error)});
        }
      }
    });
    setTimeout(() => navigateObservable.subscribe(), 10); // at least one subscription
    return navigateObservable;
  }

  /**
   * constructs a path by all arguments
   * @param args navigation arguments
   */
  public static constructPath(args: INavigateArgs): string {
    let path = RouteHelper.constructSegment(args.application);
    if (args.domain) {
      path = path.replace('__childSegment__', RouteHelper.constructSegment(args.domain));
    }
    if (args.scenario) {
      path = path.replace('__childSegment__', RouteHelper.constructSegment(args.scenario));
    }
    if (args.action) {
      path = path.replace('__childSegment__', RouteHelper.constructSegment(args.action));
    }
    if (args.queryParams) {
      const queryParams = Array.isArray(args.queryParams)
        ? args.queryParams
        : Object.keys(args.queryParams).length
          ? [args.queryParams]
          : null;
      const encodedParams = queryParams?.length ? `?${queryParams.map(toQueryParams).join('&')}` : '';
      path = path.replace('__childSegment__', `${encodedParams}__childSegment__`);
    }
    path = path.replace('__childSegment__', '');
    return path;
  }

  public static compareSegment(first: string | any[], second: string | any[]): number {
    return RouteHelper.constructSegment(first).localeCompare(RouteHelper.constructSegment(second));
  }

  public static constructSegment(segment: string | any[]): string {
    if (segment instanceof Array) {
      return `/${segment.join('/')}__childSegment__`;
    } else {
      return `/${segment}__childSegment__`;
    }
  }

  /**
   * creates a new stack frame
   * @param options new stack frame options
   */
  private static createStackFrame<T extends IStackFrame>(
    options: {
      stackFrame?: IStackFrame,
      application: string | any[],
      domain: string | any[],
      scenario: string | any[],
      action: string | any[],
      params?: { [key: string]: any };
      stackFrameFactory: () => T
    }
  ) {
    const stackFrame = options.stackFrame || options.stackFrameFactory();
    stackFrame.application = toArray(options.application);
    stackFrame.domain = toArray(options.domain);
    stackFrame.scenario = toArray(options.scenario);
    stackFrame.action = toArray(options.action);
    stackFrame.params = options.params;
    return stackFrame;
  }
}
