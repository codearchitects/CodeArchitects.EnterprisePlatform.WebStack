import { Injector, OnInit, OnDestroy, Optional, Directive } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommandDispatcherService } from '@ca-webstack/ng-command-dispatcher';
import { BaseShellComponent } from './base.shell.component';
import { INavigateArgs, IActivityPayload } from '../types/index';
import { BaseDelegates } from '../services/index';
import { Activity } from './activity';
import { combineLatest, Observable, Subject } from 'rxjs';
import { SignalRService } from '@ca-webstack/ng-signalr';
import { takeUntil } from 'rxjs/operators';

/**
 * Task shell base component
 */
// @dynamic
@Directive()
export abstract class TaskShellComponent<TSignalrSubscription = any> extends BaseShellComponent<TSignalrSubscription>
  implements OnInit, OnDestroy {
  static currentTask: TaskShellComponent;
  private _payloadChangedSubject: Subject<IActivityPayload> = new Subject();
  private _destroy$ = new Subject<void>();

  public constructor(
    public applicationName: string,
    public domainName: string,
    public taskName: string,
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
    TaskShellComponent.currentTask = this;
  }

  /**
   * creates a new payload object
   * @param taskId task identifier
   * @param params parameters
   */
  public static createPayload<TActivityPayload extends IActivityPayload>(taskId: string, params?: any) {
    const payload: TActivityPayload = <any>{};
    payload.version = 1.0;
    // payload.params = params;
    payload.annotations = [];
    payload.stack = [];
    payload['taskId'] = taskId;
    return payload;
  }

  /**
   * payload changed subject observable
   */
  public get payloadChangedSubject() {
    return this._payloadChangedSubject;
  }

  /**
   * handles ng2 on init
   */
  public async ngOnInit() {
    combineLatest([this.activatedRoute.params, this.activatedRoute.queryParams])
      .pipe(takeUntil(this._destroy$))
      .subscribe(([routeParams, queryParams]) => {
        const taskId: string = routeParams['taskId'];

      // save current payload if necessary
      if (Activity.CurrentPayload && Activity.CurrentPayload.taskId !== taskId) {
        this.delegates.savePayload(Activity.CurrentPayload).subscribe();
        this.setPayload(undefined);
      } else {
        this.setPayload(undefined);
      }

      if (!Activity.CurrentPayload) {
        if (taskId) {
          //     this.delegates.getUniqueIdentifier(1).subscribe(id => {
          //       taskId = id;
          this.delegates.getPayloadByTaskId(taskId).subscribe(payload => {
            if (!payload) {
              payload = TaskShellComponent.createPayload(taskId, routeParams);
            }
            this.setPayload(payload);
            super.ngOnInit();
            this.wakeUp();
            // this.onInit(params);
          });
          // });
        } else {
          this.delegates.getUniqueIdentifier(1).subscribe(id => {
            // const payload = TaskShellComponent.createPayload(id, params);
            // this.setPayload(payload);
            // setTimeout(() => {
            this.navigate({ scenario: [this.taskName, id], action: 'start', queryParams });
            // });
          });
        } // else {
        //   this.delegates.getPayloadByTaskId(params.taskId).subscribe(payload => {
        //     if (!payload) {
        //       payload = TaskShellComponent.createPayload(taskId, params);
        //     }
        //     this.setPayload(payload);
        //     this.onInit(params);
        //   });
      } else {
        super.ngOnInit();
        this.wakeUp();
        // }
      }
    });
  }

  /**
   * wakes up event notification system
   */
  wakeUp() {
    if (Activity.CurrentTaskId) {
      this.activity.wakeUp();
    } else {
      this.delegates.getUniqueIdentifier(1).subscribe(id => {
        Activity.CurrentTaskId = id;
        this.activity.wakeUp();
      });
    }
  }

  /**
   * called when current task is destroyed
   */
  public ngOnDestroy() {
    super.ngOnDestroy();
    this.activity.sleep();
    if (this._payloadChangedSubject) {
      this._payloadChangedSubject.complete();
      if (TaskShellComponent.currentTask === this) {
        delete TaskShellComponent.currentTask;
      }
      delete Activity.CurrentPayload;
    }
    this._destroy$.next();
  }

  /**
   * navigates to new destination
   * @param args navigation arguments
   */
  public navigate(args: INavigateArgs): Observable<boolean> {
    const temp = {
      activity: args.activity || this.activity,
      delegates: args.delegates || this.delegates,
      application: args.application || this.applicationName,
      domain: args.domain === '' ? undefined : args.domain || this.domainName,
      scenario: args.scenario === '' ? undefined : args.scenario || this.taskName,
      action: args.action === '' ? undefined : args.action,
      queryParams: args.queryParams
    };

    if (args.action === '') {
      args.action = undefined;
    }
    const observable = super.navigate(temp as any);
    observable.subscribe();
    return observable;
  }

  /**
   * sets new payload and signals all subscribers
   * @param value new payload to set
   */
  private setPayload(value: IActivityPayload) {
    Activity.CurrentPayload = value;
    this.activity.payload = value;
    if (value != null) {
      this.activity.taskId = value.taskId;
      this._payloadChangedSubject.next(value);
    }
  }
}
