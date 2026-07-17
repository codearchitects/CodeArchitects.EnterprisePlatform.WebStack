import { Injector, Optional } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Observable, SubscriptionLike } from 'rxjs';
import { CommandDispatcherService } from '@ca-webstack/ng-command-dispatcher';
import { BaseShellComponent } from './base.shell.component';
import { INavigateArgs, IStackFrameInfo, NEXT_STACK_FRAME_STORAGE_KEY } from '../types/index';
import { BaseDelegates } from '../services/index';
import { Activity } from './activity';
import { SignalRService } from '@ca-webstack/ng-signalr';
import { Location } from '@angular/common';

/**
 * Application Shell base component
 */
export abstract class ApplicationShellComponent<TSignalrSubscription = any> extends BaseShellComponent<TSignalrSubscription>{
  /**
   * Next stack
   */
  private get _nextStack() {
    return this.delegates.serializer.deserialize(sessionStorage.getItem(NEXT_STACK_FRAME_STORAGE_KEY) || '[]');
  }
  private set _nextStack(frames: Array<IStackFrameInfo | Array<IStackFrameInfo>>) {
    sessionStorage.setItem(NEXT_STACK_FRAME_STORAGE_KEY, this.delegates.serializer.serialize(frames || []));
  }
  /**
   * History back count
   */
  private _historyCount = 0;
  /**
   * Subscription to Location Service
   */
  private _localSubscriptions: SubscriptionLike[] = [];

  /**
   * default constructor
   * @param applicationName
   * @param injector
   * @param router
   * @param commandDispatcher
   * @param activatedRoute
   * @param delegates
   * @param activity
   * @param hubName
   * @param signalr
   */
  public constructor(
    public applicationName: string,
    injector: Injector,
    router: Router,
    commandDispatcher: CommandDispatcherService,
    activatedRoute: ActivatedRoute,
    delegates: BaseDelegates,
    activity?: Activity<any>,
    hubName?: string,
    @Optional() signalr?: SignalRService
  ) {
    super(injector, router, commandDispatcher, activatedRoute, delegates, activity, hubName, signalr);
    this.handleBrowserNavigation(injector.get(Location));
  }

  private handleBrowserNavigation(location: Location) {
    this._localSubscriptions.push(location.subscribe(event => {
      if (!this._historyCount && event.pop === true && event.type === "popstate") {
        this._historyCount = 1;
        const stack = Activity.CurrentPayload.stack;
        const nextStack = this._nextStack;
        const nextStackFrameInfo = nextStack[nextStack.length - 1];
        if (Array.isArray(nextStackFrameInfo)) {
          if (nextStackFrameInfo[0].url === event.url) {
            this._historyCount = 1;
          } else {
            const frame = stack[stack.length - 1];
            const nextFrame = nextStackFrameInfo[0].frame;
            const startUrl = `${nextFrame.application}/${nextFrame.domain}/${nextFrame.scenario[0]}/start`.replace(/,/g, '/');
            if (event.url.indexOf(startUrl) > -1) {
              nextStack.push({ frame, url: `/${frame.application}/${frame.domain}/${frame.scenario}/${frame.action}`.replace(/,/g, '/') })
            } else {
              stack.pop();
              nextStack.push({ frame, url: `/${frame.application}/${frame.domain}/${frame.scenario}/${frame.action}`.replace(/,/g, '/') })
            }
          }
        } else if (nextStackFrameInfo && nextStackFrameInfo.url.lastIndexOf('/start') > -1) {
          // nothing
        } else if (nextStackFrameInfo && nextStackFrameInfo.url === event.url) {
          stack.push(nextStackFrameInfo.frame);
          nextStack.pop();
        } else {
          const frame = stack[stack.length - 1];
          const startUrl = `${frame.application}/${frame.domain}/${frame.scenario}/start`.replace(/,/g, '/');
          nextStack.push({ url: this.router.url, frame });
          if (event.url.indexOf(startUrl) > -1) {
            this._historyCount = 3;
            history.go(-2);
            nextStack.pop();
            nextStack.push([{ url: this.router.url, frame, start: true }]);
          } else {
            stack.pop();
          }
        }
        /**
         * Saves next stack in the session
         */
        this._nextStack = nextStack;
      }
    }));
  }

  public ngAfterViewInit() {
    super.ngAfterViewInit();
    this._localSubscriptions.push(
      this.router.events.subscribe(e => {
        if (e instanceof NavigationEnd) {
          if (!this._historyCount) {
            this._nextStack = [];
          }
          if (this._historyCount) {
            this._historyCount--;
          }
        }
      })
    );
  }

  public ngOnDestroy() {
    super.ngOnDestroy();
    this._localSubscriptions && this._localSubscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this._localSubscriptions = [];
  }

  /**
   * navigates to new destination
   * @param args navigation arguments
   */
  public navigate(args: INavigateArgs): Observable<boolean> {
    return super.navigate({
      application: args.application || this.applicationName,
      domain: args.domain,
      scenario: args.scenario,
      action: args.action
    });
  }
}
