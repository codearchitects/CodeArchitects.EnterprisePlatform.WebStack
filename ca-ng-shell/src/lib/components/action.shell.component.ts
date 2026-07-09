import {
  Injector, OnInit, OnDestroy, OnChanges, DoCheck, AfterViewChecked, AfterViewInit,
  AfterContentChecked, AfterContentInit, ChangeDetectorRef, SimpleChange, Directive,
  inject
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { combineLatest, Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { INotifyPropertyChanged, PropertyChangedEventArgs } from '@ca-webstack/change-tracker';
import { INavigateArgs, ITaskSlot, IStackFrame, IActivityPayload, IActivityService, IActivityAnnotation } from '../types/index';
import { RouteHelper, BaseDelegates, TaskToClose } from '../services/index';
import { toArray } from '../utilities/index';
import { Activity, IActivityOnInit } from './activity';
import { filter } from 'rxjs/operators';
import { TaskShellComponent } from './task.shell.component';
import { ShCommandComponent } from '@ca-webstack/ng-command-dispatcher';
import { BaseShellComponent } from './base.shell.component';
import { onSignalrEvent } from '../utilities/signalr.function';
import { FormHandlerService } from '@ca-webstack/ng-components';
import { CaepEventManagerService } from '@ca-webstack/ng-event-manager';

/**
 * Action Shell component implementation. Every action controller must specialized this one.
 */
@Directive()
export abstract class ActionShellComponent<
  TPayload extends IActivityPayload, TActivity extends Activity<TPayload>, TDelegates extends BaseDelegates,
  TSignalrSubscription = any
  > extends ShCommandComponent
  implements OnInit, OnDestroy, OnChanges, DoCheck, IActivityOnInit,
  AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked {

  public static currentStack: IStackFrame[] = [];
  public activity: TActivity;
  public delegates: TDelegates;
  public router: Router;
  public activatedRoute: ActivatedRoute;
  private _yetInNgOnInit = false;
  private _formHanlder: FormHandlerService;
  // public static currentActivity: Activity<any> = undefined;

  // Object to use for validation initialization
  protected formGroup: FormGroup<any>;

  protected eventManagerService = inject(CaepEventManagerService);

  // True when form is ready to be displayed. Defaults to false
  public isReady = false;

  // Generic subscription array. Will be cleaned up during unwind of form
  public subscriptions: Subscription[] = [];

  protected abstract taskSlotFactory: () => ITaskSlot;
  protected abstract stackFrameFactory: () => IStackFrame;
  protected abstract titleService: Title;
  protected abstract hubName: string;
  _i = 0;
  _references: { cb: Function, wrapper: ((...params: any[]) => void) }[] = [];

  /**
   *
   * @param injector ng2 injector
   * @param services activity services with
   * @param applicationName  the application name this action belongs to
   * @param domainName the domain name this action belongs to
   * @param scenarioName the scenario name this action belongs to
   * @param actionName the action name
   */
  public constructor(
    private injector: Injector,
    protected services: IActivityService<TPayload, TActivity, TDelegates>,
    protected applicationName: string,
    protected domainName: string,
    protected scenarioName: string,
    protected actionName: string
  ) {
    super(injector);
    this._formHanlder = this.injector.get(FormHandlerService);
    if (services) {
      this.activity = services.activity;
      this.delegates = services.delegates;
      this.router = services.router;
      this.activatedRoute = services.activatedRoute;
    }
  }

  /**
   * searches and returns the first return stack frame from stack bottom up
   * @param stack the stack to search from
   */
  public static getReturnStackFrame(stack: IStackFrame[]) {
    const framesWithReturnPoint = stack.filter(sf => sf.isReturnPoint);
    if (!framesWithReturnPoint || framesWithReturnPoint.length === 0) {
      if (stack.length > 0) {
        return stack[stack.length - 1];
      } else {
        return null;
      }
    }
    return framesWithReturnPoint[framesWithReturnPoint.length - 1];
  }

  /**
   * subscribes a signalr event by name
   * @param name the name of the event to subscribe
   * @param callback a callback for the signalr subscription
   */
  protected subscribeEvent(name: string, callback: (...msg: any[]) => void) {
    console.error('Deprecation error: "subscribeEvent" method deprecated, use "SignalREvent" decorator or SignalRService instead');
    // const subscription = this.activity.signalr.on(this.hubName, name).subscribe(callback);
    // this.subscriptions.push(<any>subscription);
    // return subscription;
  }

  /**
   * returns current title
   */
  public getTitle() {
    return this.titleService.getTitle();
  }

  /**
   * sets current title
   * @param title sets title
   */
  public setTitle(title: string) {
    this.titleService.setTitle(title);
    if (this.payload && this.payload.stack && this.payload.stack.length > 0) {
      const frame = this.payload.stack[this.payload.stack.length - 1];
      frame.label = title;
      if (!frame.id) {
        frame.id = title;
      }
    }
  }

  /**
   * closes a task
   * @param taskToClose task to close
   */
  public closeTask(taskToClose: TaskToClose) {
    if (!taskToClose.resourceId && !taskToClose.resourceName) {
      throw new Error('Cannot close a task without providing either name or id');
    }
    this.delegates.closeTask(taskToClose);
  }

  protected setAnnotation(
    key: string, title: string, isNavigable = true,
    isDraft = false, data: { [key: string]: any }, info?: { [key: string]: any }
  ) {
    const annotation: IActivityAnnotation = {
      title: title,
      isNavigable: isNavigable,
      key: this.getAnnotationKey(key),
      isDraft: isDraft, data: data, info: info
    };
    this.activity.setAnnotation(annotation);
  }

  protected getAnnotationKey(paramsKey: string): string {
    return `${this.applicationName}/${this.domainName}/${this.scenarioName}/${this.activity.taskId}/${this.actionName}/${paramsKey}`;
  }

  protected observe(observable: INotifyPropertyChanged, propertyName: string, callback: (value: any) => void, timeout?: number) {
    this.subscriptions.push(
      observable.propertyChanged
        .subscribe((e: PropertyChangedEventArgs) => {
          if (e.propertyName === propertyName) {
            setTimeout(() => callback((<any>observable)[propertyName]), timeout);
          }
        })
    );
  }

  protected multipleObserve(
    observable: INotifyPropertyChanged,
    callback: (...value: any[]) => void, timeout?: number, ...propertyNames: string[]
  ) {
    const temp = (<Observable<PropertyChangedEventArgs>><any>observable.propertyChanged)
      .pipe(filter((e: PropertyChangedEventArgs) => propertyNames.includes(e.propertyName)))
      .subscribe((e: PropertyChangedEventArgs) => {
        const params = propertyNames.map((n) => (<any>observable)[n]);
        setTimeout(() => callback(...params), timeout);
      });
    this.subscriptions.push(
    );
  }

  /**
   * dispatches a command to route
   * @param command command to dispatch
   * @param params parameters of command
   */
  public command(command: string, ...params: Array<any>) {
    this.services.commandDispatcher.run(command, ...params);
  }

  /**
   * true if return data are available
   */
  public get hasReturnData() {
    return !!this.getReturnData() && this.getReturnData().length > 0;
  }

  /**
   * returns return data
   */
  public getReturnData(): any[] {
    if (this.payload) {
      const stack = this.payload.stack;
      if (stack && stack.length > 0) {
        return stack[stack.length - 1].output;
      }
    }
    return null;
  }

  /**
   * true if input data are available
   */
  public get hasInputData() {
    return !!this.getInputData() && this.getInputData().length > 0;
  }

  /**
   * returns input data
   */
  public getInputData(): any[] {
    if (this.payload) {
      const stack = this.payload.stack;
      if (stack && stack.length > 0) {
        return stack[stack.length - 1].input;
      }
    }
    return null;
  }

  /**
   * handles ng2 initialization
   */
  public ngOnInit() {
    BaseShellComponent.currentAction = this;
    this.subscriptions.push(
      combineLatest([this.activatedRoute.params, this.activatedRoute.queryParams]).subscribe(
        ([routeParams, queryParams]) => {
      const params = routeParams || queryParams ? { ...queryParams, ...routeParams } : null;
      // if payload ready then call onInit now
      if (this.payload != null) {
        this.onInit(params);
        this.delegates.dataContext.attach(this.payload);
      } else {
        // wait until taskcomponent loads new saved payload
        if (TaskShellComponent.currentTask && TaskShellComponent.currentTask.payloadChangedSubject) {
          this.subscriptions.push(
          TaskShellComponent.currentTask.payloadChangedSubject.subscribe(payload => {
            if (payload != null && payload.taskId) {
              this.onInit(params);
              this.refresh();
            }
          }));
        }
      }
    }));
    super.ngOnInit();
    this.eventManagerService.registerEventListeners(this);
  }

  /**
   * clones a set of navigation args
   * @param args navigation arguments to clone
   */
  protected cloneNavigationArgs(args: INavigateArgs): INavigateArgs {
    return {
      application: args.application,
      domain: args.domain,
      scenario: args.scenario,
      action: args.action,
      activity: args.activity,
      delegates: args.delegates,
      distance: args.distance,
      withReturn: args.withReturn,
      input: args.input,
      output: args.output,
      isUnwinding: args.isUnwinding,
      queryParams: args.queryParams
    };
  }

  /**
   * resets the stack
   */
  public resetStack() {
    this.activity.payload.stack = [];
  }

  /**
   * returns to originator of this flow
   * @param output output informations
   */
  public return(...output: any[]) {
    const stack = this.activity.payload.stack;
    let returnStackFrame = ActionShellComponent.getReturnStackFrame(stack);

    if (returnStackFrame) {
      stack.splice(stack.indexOf(returnStackFrame), stack.length);
      if (!returnStackFrame.isReturnPoint) {
        returnStackFrame = stack[stack.length - 1];
      }

      let args: INavigateArgs;
      args = {
        application: returnStackFrame.application,
        domain: returnStackFrame.domain,
        scenario: returnStackFrame.scenario,
        action: returnStackFrame.action,
        label: returnStackFrame.label,
        queryParams: returnStackFrame.params,
        output: output,
        isUnwinding: true,
        delegates: <any>this.delegates,
        activity: this.activity
      };

      RouteHelper.navigate(this.router, args, this.taskSlotFactory, this.stackFrameFactory);
    }
  }

  /**
   * navigates to given navigation arguments storing return point. Call return() in order to return to caller
   * @param args navigation arguments
   */
  public navigateWithReturn(args: INavigateArgs) {
    args.withReturn = true;
    return this.navigate(args);
  }

  /**
   * navigates to given navigation arguments
   * @param args navigation arguments
   */
  public navigate(args: INavigateArgs) {
    if (args.root) {
      this.router.navigateByUrl('/');
    } else {
      const clonedArgs = this.cloneNavigationArgs(args);
      clonedArgs.application = clonedArgs.application || this.applicationName;
      clonedArgs.domain = clonedArgs.domain || this.domainName;
      clonedArgs.delegates = <any>(clonedArgs.delegates || this.services.delegates);
      clonedArgs.activity = clonedArgs.activity || this.services.activity;
      clonedArgs.scenario = clonedArgs.scenario || [this.scenarioName, this.services.activity.taskId];
      clonedArgs.scenario = [...toArray(clonedArgs.scenario)];
      if (args && clonedArgs.scenario && clonedArgs.scenario.length === 1) {
        clonedArgs.scenario = [...toArray(clonedArgs.scenario), this.services.activity.taskId];
      }
      clonedArgs.action = clonedArgs.action || this.actionName;
      return RouteHelper.navigate(this.router, clonedArgs, this.taskSlotFactory, this.stackFrameFactory);
    }
  }

  /**
   * executes one garbage collection in order to free some space
   */
  public collect() {
    const currentTask = 'taskslot_' + this.activity.taskId;
    const garbageFiles = [];
    for (const i in localStorage) {
      if (i.indexOf('taskslot_') === 0 && i !== currentTask) {
        console.log('** found item: ' + i);
        garbageFiles.push(i);
      }
    }
    garbageFiles.forEach(i => {
      console.log('-- removing item: ' + i);
      localStorage.removeItem(i);
    });
  }

  public async saveState() {
    if (this.activity && this.activity.taskId) {
      if (this.activity.payload) {
        // const currentTaskKey = 'taskslot_' + this.activity.taskId;
        // const currentTaskData = this.delegates.serializer.serialize(this.activity.payload);
        // localStorage.setItem(currentTaskKey, currentTaskData);
        /**
         * try to save on host also
         */
        const taskId = this.activity.taskId;
        const success = await this.delegates.savePayload(this.activity.payload);
        if (success) {
          console.log(`Payload saved: ${taskId}`);
        } else {
          console.error(`Payload lost: ${taskId}`);
        }
      }
      // this.collect();
    }
  }

  /**
   * check if current action is to destroy
   */
  public onDestroy() {
  }

  /**
   * handles exit from action
   */
  protected handleDestroy() {
    // save the state now
    this.saveState();
    // release all subscriptions
    this.subscriptions.forEach(i => {
      try {
        i.unsubscribe();
      } catch (e) {
        // empty statement. ignore exceptions
      }
    });
    this.eventManagerService.removeEventListeners(this);
  }

  /**
   * if returns true then can activate
   * @param route ng2 route
   * @param state state of route
   */
  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    return true;
  }

  /**
   * if returns true then can deactivate
   * @param component component deactivating
   * @param route route
   */
  public canDeactivate(component: any, route: any): boolean | Observable<boolean> {
    return true;
  }

  public refresh() {
    try {
      const detector = this.injector.get(ChangeDetectorRef);
      detector.detectChanges();
    } catch (e) { }
  }

  /**
   * Gets the current payload
   */
  public get payload() {
    return <TPayload>this.activity.payload;
  }

  ngOnChanges(changes: { [key: string]: SimpleChange }) {
    this.onChanges(changes);
  }

  ngDoCheck() {
    this.onDoCheck();
  }


  smartBind(callback: Function, ...parameters: any[]) {
    let me = this;
    // search if yet present in references by id
    const idx = this._references.findIndex(j => j.cb === callback);
    if (idx < 0) {
      const slot = {
        cb: callback,
        wrapper: (e: any) => {
          if (e === 'free') {
            me = undefined; // unbind pointer to me external to closure
            callback = undefined;
            return;
          }
          return callback.apply(me, [...parameters, e]);
        }
      };
      this._references.push(slot);
      console.log(`_ref: ${this._i++} - ${this._references.length}`);
      return slot.wrapper;
    } else {
      return this._references[idx].wrapper;
    }
  }

  /**
   * handles destroy of action
   */
  ngOnDestroy() {
    try {
      super.ngOnDestroy();
      this._formHanlder.removeGroup(this);
      this.onDestroy();
      this.handleDestroy();
      for (let i = 0; i < this._references.length; i++) {
        this._references[i].wrapper('free');
        delete this._references[i];
      }
      // for (const i in this) {
      //   if (i) {
      //     try {
      //       delete this[i];
      //     } catch (e) { }
      //   }
      // }
    } finally {
      if (TaskShellComponent.currentAction === this) {
        delete TaskShellComponent.currentAction;
      }
    }
  }

  ngAfterContentInit() {
    this.onAfterContentInit();
  }
  ngAfterContentChecked() {
    this.onAfterContentChecked();
  }
  ngAfterViewInit() {
    this.onAfterViewInit();
  }
  ngAfterViewChecked() {
    this.onAfterViewChecked();
  }
  // #endregion

  public clearState() {
    if (this.activity && this.activity.taskId) {
      const key = this.activity.taskId;
      localStorage.removeItem(key);
    }
  }

  // #region Activity command component callbacks
  public onActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    // console.trace('onActivate');
    return <any>true;
  }

  /**
   * returns true or observable in order to tell if component can be deactivated or not
   * @param component component to deactivate
   * @param route router
   * @param state actual state
   */
  public onCanDeactivate(component: any, route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    // console.trace('onCanDeactivate');
    return <any>true;
  }
  /**
   * called right after the directive's data-bound properties have been checked for the first time and payload is ready,
   * and before any of its children have been checked. It is invoked only once when the directive is instantiated.
   * @param params parameters
   */
  public onInit(params: { [key: string]: any }) {
    // console.trace(`1/1. OnInit: ${JSON.stringify(params)}`);
  }

  /**
   * @param changes  is called right after the data-bound properties have been checked and
   * before view and content children are checked if at least one of them has changed. The
   * changes parameter contains the changed properties.
   */
  public onChanges(changes: { [key: string]: SimpleChange }) {
    // console.trace('3. OnChanges - propertyName = ' + changes['propertyName'].currentValue);
  }
  /**
   * gets called to check the changes in the directives in addition to the default algorithm.
   * The default change detection algorithm looks for differences by comparing bound-property
   * values by reference across change detection runs.
   */
  public onDoCheck() {
    // console.trace('2. DoCheck ...');
  }
  /**
   * contentChild is updated after the content has been checked
   */
  public onAfterContentInit() {
    // console.trace('4. AfterContentInit ...');
  }
  /**
   * called after every check of a directive's content
   */
  public onAfterContentChecked() {
    // console.trace('5. AfterContentChecked ...');
  }
  /**
   * called after a component's view has been fully initialized.
   */
  public onAfterViewInit() {
    // console.trace('6. AfterViewInit ...');
  }
  /**
   * called after every check of a component's view.
   */
  public onAfterViewChecked() {
    // console.trace('7. AfterViewChecked ...');
  }

  /**
   * Subscribes to a SignalR event by target path
   * @param target Target path (eventName or composition of hubName and eventName separated by slash)
   * @param callback Subscription callback
   * @param groupId Group to join (default: Scenario Task Id)
   */
  protected onSignalrEvent<TParams>(target: TSignalrSubscription, callback: (msg: TParams) => void, groupId = this.activity.taskId) {
    onSignalrEvent<TSignalrSubscription, TParams>(target, callback, this.activity.signalr, this.hubName, groupId)
      .then(s => this.subscriptions.push(s.subscription))
      .catch(ex => { debugger; });
  }
  // #endregion
}
