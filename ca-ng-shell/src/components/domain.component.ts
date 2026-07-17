import { Injector, OnDestroy, Optional } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CommandDispatcherService } from '@ca-webstack/ng-command-dispatcher';
import { BaseShellComponent } from './base.shell.component';
import { INavigateArgs, IStackFrame } from '../types/index';
import { BaseDelegates } from '../services/index';
import { Activity } from './activity';
import { SignalRService } from '@ca-webstack/ng-signalr';

/**
 * Domain shell base component
 */
// @dynamic
export abstract class DomainShellComponent<TSignalrSubscription = any>
  extends BaseShellComponent<TSignalrSubscription>
  implements OnDestroy {

  /**
   * returns current stack frame
   */
  public static frame: IStackFrame;

  /**
   * default constructor
   * @param applicationName
   * @param domainName
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
    public domainName: string,
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
  }

  public navigate(args: INavigateArgs): Observable<boolean> {
    return super.navigate({
      application: args.application || this.applicationName,
      domain: args.domain || this.domainName,
      scenario: args.scenario,
      action: args.action,
      activity: this.activity,
      delegates: this.delegates
    });
  }

  public setTitle(title?: string) {
    const frame = this.stackFrameFactory();
    frame.application = [this.applicationName];
    frame.domain = [this.domainName];
    frame.label = title || this.domainName;
    DomainShellComponent.frame = frame;
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    DomainShellComponent.frame = undefined;
  }
}
