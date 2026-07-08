import { SignalRService } from '@ca-webstack/ng-signalr';
import { Injector, OnInit, OnDestroy, ChangeDetectorRef, OnChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, SimpleChange, Optional, Directive, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ShCommandComponent, CommandDispatcherService, Command } from '@ca-webstack/ng-command-dispatcher';
import { INavigateArgs, ITaskSlot, IStackFrame } from '../types/index';
import { BaseDelegates, RouteHelper } from '../services/index';
import { ActionShellComponent } from './action.shell.component';
import { Activity, IActivityOnInit } from './activity';
import { IShSignalrSubscription, onSignalrEvent } from '../utilities/signalr.function';
import { FormHandlerService } from '@ca-webstack/ng-components';
import { CaepEventManagerService } from '@caep/ng-event-manager';

/**
 * Base Shell component
 */
// @dynamic
@Directive()
export abstract class BaseShellComponent<TSignalrSubscription = any> extends ShCommandComponent
  implements OnInit, OnDestroy, OnChanges, DoCheck, IActivityOnInit,
  AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked {
  private static _currentAction: ActionShellComponent<any, any, any> = undefined;
  protected abstract taskSlotFactory: () => ITaskSlot;
  protected abstract stackFrameFactory: () => IStackFrame;
  protected abstract titleService: Title;
  protected signalrSubscriptions: IShSignalrSubscription[] = [];

  protected eventManagerService = inject(CaepEventManagerService);

  private _formHanlder: FormHandlerService;

  /**
   * returns current action
   */
  public static get currentAction() {
    return this._currentAction;
  }
  /**
   * sets current action
   */
  public static set currentAction(value) {
    this._currentAction = value;
  }

  /**
   * default constructor
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
    public injector: Injector,
    public router: Router,
    public commandDispatcher: CommandDispatcherService,
    public activatedRoute: ActivatedRoute,
    public delegates: BaseDelegates,
    public activity?: Activity<any>,
    public hubName?: string,
    @Optional() protected signalr?: SignalRService
  ) {
    super(injector);
    this._formHanlder = this.injector.get(FormHandlerService);
  }

  /**
   * empty virtual onInit method
   * @param params parameters to pass to onInit method
   */
  public onInit(params: any) {
    // empty statement
  }

  /**
   * dispatches to command router a command
   * @param command command name
   * @param params command paramteres
   */
  public command(command: string, ...params: Array<any>) {
    this.commandDispatcher.run(command, ...params);
  }

  /**
   * navigates to new destination
   * @param args destination description
   */
  public navigate(args: INavigateArgs): Observable<boolean> {
    const navigateObservable = RouteHelper.navigate(this.router, args, this.taskSlotFactory, this.stackFrameFactory);
    navigateObservable.subscribe();
    return navigateObservable;
  }

  /**
   * navigates to given navigation arguments storing return point. Call return() in order to return to caller
   * @param args navigation arguments
   */
  public navigateWithReturn(args: INavigateArgs) {
    return BaseShellComponent.currentAction.navigateWithReturn(args);
  }

  /**
   * Saves actual state into local storage and through business delegates on host
   */
  public saveState() {
    return BaseShellComponent.currentAction.saveState();
  }

  /**
   * returns to calling workflow
   */
  @Command({ name: 'return', label: 'return' })
  public return() {
    return BaseShellComponent.currentAction.return();
  }

  /**
   * tries to refresh component
   */
  refresh() {
    try {
      const detector = this.injector.get(ChangeDetectorRef);
      detector.detectChanges();
    } catch (e) { }
  }

  ngOnInit() {
    // call only if activity is complete
    // if (this.activity && this.activity.taskId) {
    this.onInit(undefined);
    // }
    super.ngOnInit();
    this.eventManagerService.registerEventListeners(this);
  }

  ngOnChanges(changes: { [key: string]: SimpleChange }) {
    // this.onChanges(changes);
    // console.log('ngOnChanges');
  }

  ngDoCheck() {
    // this.onDoCheck();
  }

  /**
   * handles destroy of action
   */
  ngOnDestroy() {
    super.ngOnDestroy();
    this.releaseSignalrSubscriptions();
    this._formHanlder.removeGroup(this);
    this.eventManagerService.removeEventListeners(this);
  }

  ngAfterContentInit() {
    // this.onAfterContentInit();
    // console.log('ngAfterContentInit');
  }
  ngAfterContentChecked() {
    // this.onAfterContentChecked();
    // console.log('ngAfterContentChecked');
  }
  ngAfterViewInit() {
    // this.onAfterViewInit();
    // console.log('ngAfterViewInit');
  }
  ngAfterViewChecked() {
    // this.onAfterViewChecked();
    // console.log('ngAfterViewChecked');
  }

  /**
   * Release all signalr subscriptions
   */
  public releaseSignalrSubscriptions() {
    this.signalrSubscriptions.forEach(i => {
      try {
        i.subscription.unsubscribe();
        i.closeConnection()
          .then()
          .catch(ex => console.log(ex));
      } catch (e) {
        // empty statement. ignore exceptions
      }
    });
    this.signalrSubscriptions = [];
  }

  /**
   * Subscribes to a SignalR event by target path
   * @param target Target path (eventName or composition of hubName and eventName separated by slash)
   * @param callback Subscription callback
   * @param groupId Group to join (default: Scenario Task Id)
   */
  protected onSignalrEvent<TParams>(
    target: TSignalrSubscription,
    callback: (msg: TParams) => void,
    next?: (subscription: IShSignalrSubscription, taskId: string) => void,
    error?: (error: Error) => void,
    groupId?: string) {
    let signalr: SignalRService;
    let taskId: string;
    if (this.activity) {
      signalr = this.activity.signalr;
      taskId = this.activity.taskId;
    } else {
      signalr = this.signalr;
      taskId = Activity.CurrentTaskId;
    }
    if (groupId) {
      taskId = groupId;
    }
    onSignalrEvent<TSignalrSubscription, TParams>(target, callback, signalr, this.hubName, taskId, !this.activity)
      .then(s => {
        this.signalrSubscriptions.push(s);
        if (next) {
          next(s, taskId);
        }
      })
      .catch(ex => {
        if (error) {
          error(ex);
        } else {
          console.error(ex);
        }
      });
  }
}
