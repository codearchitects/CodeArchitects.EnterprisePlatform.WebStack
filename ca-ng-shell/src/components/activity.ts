import { IActivityAnnotation, INavigationParams, IShRoute, IActivityPayload } from '../types';
import { Router } from '@angular/router';
import { Serializer } from '@ca-webstack/reflection';
import { SignalRService } from '@ca-webstack/ng-signalr';
import { Observable, Subject, Subscriber } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { signalrJoinTaskKey, signalrLeaveTaskKey } from '../utilities/signalr.function';

export interface IActivityOnInit {
  onInit(params: { [key: string]: any }): any;
}

/**
 * Represents a task, scenario or long running SAGA transaction.
 */
// @dynamic
export abstract class Activity<TPayload extends IActivityPayload> {

  private static _payload: IActivityPayload;
  private static _taskId: string = undefined;
  /**
   * Emits taskId when current task changes
   */
  public static taskChange = new Subject<string>();
  public static _currentTaskId = '0000000-0000-0000-0000-000000000000';
  public router: Router;
  public signalr: SignalRService;
  protected abstract hubName: string;
  private _currentState: string | string[] = ['/'];
  private _baseRoutePath = '/';
  private _sleep$ = new Subject<void>();

  public static fromJson<TPayload extends IActivityPayload>(json: string) {
    return <Activity<TPayload>>(new Serializer().deserialize(json));
  }

  public constructor(
    router: Router,
    signalr: SignalRService,
    taskId?: string,
    baseRoutePath = '/'
  ) {
    this.signalr = signalr;
    this.router = router;
    Activity._taskId = taskId;
    this._baseRoutePath = baseRoutePath;
  }

  public static get CurrentTaskId() {
    return Activity._taskId;
  }
  public static set CurrentTaskId(value: string) {
    Activity._taskId = value;
  }

  public toJson(): string {
    return new Serializer().serialize(this);
  }

  public getAnnotationByKey(key: string): any {
    if (!this.payload.annotations || !Array.isArray(this.payload.annotations)) {
      this.payload.annotations = [];
    }
    const result = this.payload.annotations.filter(i => i.key === key);
    return result[0];
  }

  public getAnnotationIndexByKey(key: string): any {
    if (!this.payload.annotations || !Array.isArray(this.payload.annotations)) {
      this.payload.annotations = [];
    }
    const annotation = this.getAnnotationByKey(key);
    if (annotation) {
      const index = this.payload.annotations.indexOf(annotation);
      return index;
    }
    return -1;
  }

  public setAnnotation(annotation: IActivityAnnotation): any {
    if (!this.payload.annotations || !Array.isArray(this.payload.annotations)) {
      this.payload.annotations = [];
    }
    const index = this.getAnnotationIndexByKey(annotation.key);
    if (index >= 0) {
      this.payload.annotations[index] = annotation;
    } else {
      this.payload.annotations.push(annotation);
    }
  }

  public get currentState() { return this._currentState; }
  public set currentState(value: string | string[]) { this._currentState = value; }

  public get baseRoutePath() { return this._baseRoutePath; }
  public set baseRoutePath(value: string) { this._baseRoutePath = value; }

  public get taskId() {
    return Activity._taskId;
  }

  public set taskId(value: string) {
    Activity._taskId = value;
    if (value) {
      Activity.taskChange.next(value);
    }
  }

  public get payload() { return Activity._payload as TPayload; }
  public set payload(value: TPayload) { Activity._payload = value; }

  public static get CurrentPayload() { return Activity._payload; }
  public static set CurrentPayload(value: IActivityPayload) {
    Activity._payload = value;
    Activity.CurrentTaskId = value && value.taskId;
  }

  public abstract onSavePayload(payload: TPayload): Observable<boolean>;
  public abstract onLoadPayload(isWakingUp?: boolean): Observable<TPayload>;

  public onNavigating(params: INavigationParams<TPayload>): Observable<boolean> {
    return new Observable<boolean>((observer: Subscriber<boolean>) => {
      setTimeout(() => {
        observer.next(true);
        observer.complete();
      }, 0);
    });
  }

  public onNavigated(payload: INavigationParams<TPayload>): Observable<boolean> {
    return new Observable<boolean>((observer: Subscriber<boolean>) => {
      setTimeout(() => {
        observer.next(true);
        observer.complete();
      }, 0);
    });
  }

  public tryNavigateTo(precondition: Array<string>, action: string, newState: string, ...params: any[]): Observable<boolean> {
    if (this.currentState === '/') {
      this.currentState = 'start';
    }
    this.preActionHook(action);
    const currentState = this.currentState;

    return new Observable<boolean>((observer: Subscriber<boolean>) => {
      this.onNavigating({ payload: this.payload, currentState: currentState, newState: newState }).subscribe(resultNavigating => {
        if (resultNavigating) {
          try {
            if (!this.checkGuard(newState, params)) {
              console.log('Safe guard test failed');
              observer.next(false);
            }
            setTimeout(() => {
              this.onSavePayload(<any>this.payload).subscribe(result => {
                this.onNavigated({ payload: this.payload, currentState: currentState, newState: newState });
                this.navigate({ name: newState, params: params }, observer);
              });
            }, 100);
          } catch (e) {
            observer.next(false);
            observer.complete();
          }
        }
      });
    });
  }

  /**
   * Stop a running workflow.
   */
  public sleep() {
    try {
      if (this.signalr) {
        this.signalr.invoke(this.hubName, signalrLeaveTaskKey, this.taskId);
      }
      this._sleep$.next();
    } catch (e) { console.log(e); }
    return;
  }

  /**
  * Wakes up a stopped workflow.
  */
  public wakeUp() {
    // this.onLoadPayload(true).subscribe(r => {
    if (this.signalr) {
      this.signalr.invoke(this.hubName, signalrJoinTaskKey, this.taskId);
      (<Observable<void>><any>this.signalr.start$)
        .pipe(takeUntil(<Observable<void>><any>this._sleep$))
        .subscribe(() => {
          this.signalr.invoke(this.hubName, signalrLeaveTaskKey, this.taskId);
          this.signalr.invoke(this.hubName, signalrJoinTaskKey, this.taskId);
        });
    }
    // });
  }

  /**
   * Navigates to new state component.
   */
  protected navigate({ name, params }: IShRoute, observer?: Subscriber<boolean>) {
    let deferred: Promise<boolean>;
    this.onLoadPayload()
      .subscribe(payload => {
        this.payload = payload;
        if (params && params.length) {
          deferred = this.router.navigate([this._baseRoutePath + name, ...params], { replaceUrl: false });
        } else {
          deferred = this.router.navigate([this._baseRoutePath + name], { replaceUrl: false });
        }
        deferred
          .then(fullFilled => {
            if (fullFilled) {
              this._currentState = name;
              if (observer) {
                observer.next(fullFilled);
                observer.complete();
              }
            } else {
              if (observer) {
                observer.next(fullFilled);
                observer.complete();
              }
            }
          });
      });
  }

  /**
   * Check safe guard condition if present.
   */
  public checkGuard(newState: string, params?: any) {
    return !(<any>this).onCheckGuard || (<any>this).onCheckGuard(newState, params);
  }

  /**
   * Call pre action hook if present.
   */
  private preActionHook(action: string) {
    const preAction = this.normalizeMethodName(action);
    if ((<any>this)[preAction] && (<any>this)[preAction] instanceof Function) {
      (<any>this)[preAction]();
    }
  }

  /**
   * Adds on prefix to a method name capitalizing first letter.
   */
  private normalizeMethodName(name: string): string {
    return 'on' + name[0].toUpperCase() + name.substr(1);
  }
}
