// import {
//   Injector, OnInit, OnChanges, DoCheck, AfterContentInit, AfterContentChecked,
//   AfterViewInit, AfterViewChecked, SimpleChange, OnDestroy, ChangeDetectorRef
// } from '@angular/core';
// import { Router, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// import { Observable } from 'rxjs';
// import { ShCommandComponent } from '@ca-webstack/ng-command-dispatcher';
// import { IActivityService, IActivityPayload } from '../types/index';
// import { Activity, IActivityOnInit } from '../components/activity';
// import { TaskShellComponent } from './task.shell.component';

// export class ShActivityCommandComponent<TPayload extends IActivityPayload, TActivity extends Activity<TPayload>, TDelegates>
// extends ShCommandComponent
// implements IActivityService<TPayload, TActivity, TDelegates>,
//  OnInit, OnDestroy, OnChanges, DoCheck, IActivityOnInit,
// AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked {
//   // Fields
//   public activity: TActivity;
//   public delegates: TDelegates;
//   public router: Router;
//   public activatedRoute: ActivatedRoute;
//   private _yetInNgOnInit = false;

//   constructor(
//     public injector: Injector,
//     protected services: IActivityService<TPayload, TActivity, TDelegates>
//   ) {
//     super(injector);
//     if (services) {
//       this.activity = services.activity;
//       this.delegates = services.delegates;
//       this.router = services.router;
//       this.activatedRoute = services.activatedRoute;
//     }
//   }

//   public refresh() {
//     try {
//       const detector = this.injector.get(ChangeDetectorRef);
//       detector.detectChanges();
//     } catch (e) { }
//   }

//   /**
//    * Gets the current payload
//    */
//   public get payload() {
//     return <TPayload>this.activity.payload;
//   }

//   // #region ng callbacks
//   ngOnInit() {
//     if (this._yetInNgOnInit) {
//       return;
//     }
//     try {
//       this._yetInNgOnInit = true;
//       this.activatedRoute.params.subscribe(params => {
//         // if payload ready then call onInit now
//         if (this.payload != null) {
//           this.onInit(params);
//         } else {
//           // wait until taskcomponent loads new saved payload
//           TaskShellComponent.currentTask.payloadChangedSubject.subscribe(payload => {
//             if (payload != null) {
//               this.onInit(params);
//               this.refresh();
//             }
//           });
//         }
//       });
//       super.ngOnInit();
//     } finally {
//       this._yetInNgOnInit = false;
//     }
//   }

//   ngOnChanges(changes: { [key: string]: SimpleChange }) {
//     this.onChanges(changes);
//   }

//   ngDoCheck() {
//     this.onDoCheck();
//   }

//   ngOnDestroy() {
//     super.ngOnDestroy();
//     this.onDestroy();
//   }
//   ngAfterContentInit() {
//     this.onAfterContentInit();
//   }
//   ngAfterContentChecked() {
//     this.onAfterContentChecked();
//   }
//   ngAfterViewInit() {
//     this.onAfterViewInit();
//   }
//   ngAfterViewChecked() {
//     this.onAfterViewChecked();
//   }
//   // #endregion

//   public clearState() {
//     if (this.activity && this.activity.taskId) {
//       const key = this.activity.taskId;
//       localStorage.removeItem(key);
//     }
//   }

//   // #region Activity command component callbacks
//   public onActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
//     // console.trace('onActivate');
//     return <any>true;
//   }

//   /**
//    * returns true or observable in order to tell if component can be deactivated or not
//    * @param component component to deactivate
//    * @param route router
//    * @param state actual state
//    */
//   public onCanDeactivate(component: any, route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
//     // console.trace('onCanDeactivate');
//     return <any>true;
//   }
//   /**
//    * called right after the directive's data-bound properties have been checked for the first time and payload is ready,
//    * and before any of its children have been checked. It is invoked only once when the directive is instantiated.
//    * @param params parameters
//    */
//   public onInit(params: { [key: string]: any }) {
//     // console.trace(`1/1. OnInit: ${JSON.stringify(params)}`);
//   }

//   /**
//    * @param changes  is called right after the data-bound properties have been checked and
//    * before view and content children are checked if at least one of them has changed. The
//    * changes parameter contains the changed properties.
//    */
//   public onChanges(changes: { [key: string]: SimpleChange }) {
//     // console.trace('3. OnChanges - propertyName = ' + changes['propertyName'].currentValue);
//   }
//   /**
//    * gets called to check the changes in the directives in addition to the default algorithm.
//    * The default change detection algorithm looks for differences by comparing bound-property
//    * values by reference across change detection runs.
//    */
//   public onDoCheck() {
//     // console.trace('2. DoCheck ...');
//   }
//   /**
//    * callback is typically used for any custom cleanup that needs to occur when the instance
//    * is destroyed.
//    */
//   public onDestroy() {
//     // console.trace('1. OnDestroy ...');
//   }
//   /**
//    * contentChild is updated after the content has been checked
//    */
//   public onAfterContentInit() {
//     // console.trace('4. AfterContentInit ...');
//   }
//   /**
//    * called after every check of a directive's content
//    */
//   public onAfterContentChecked() {
//     // console.trace('5. AfterContentChecked ...');
//   }
//   /**
//    * called after a component's view has been fully initialized.
//    */
//   public onAfterViewInit() {
//     // console.trace('6. AfterViewInit ...');
//   }
//   /**
//    * called after every check of a component's view.
//    */
//   public onAfterViewChecked() {
//     // console.trace('7. AfterViewChecked ...');
//   }
//   // #endregion
// }
