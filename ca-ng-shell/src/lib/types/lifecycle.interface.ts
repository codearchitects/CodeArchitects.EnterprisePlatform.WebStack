import { SimpleChange } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

export interface IOnChanges {
  onChanges(changes: { [key: string]: SimpleChange }): void;
}

/**
 * Implement this interface to execute custom initialization logic after your directive's
 * data-bound properties have been initialized.
 *
 * `onInit` is called right after the directive's data-bound properties have been checked for the
 * first time, and before any of its children have been checked. It is invoked only once when the
 * directive is instantiated.
 */
export interface IOnInit {
  onInit(params?: { [key: string]: any }): void;
}

/**
 * Implement this interface to get notified when your component is destroyed.
 *
 * `onDestroy` callback is typically used for any custom cleanup that needs to occur when the
 * instance is destroyed
 *
 */
export interface IOnDestroy {
  onDestroy(): void;
}

export interface IOnDoCheck {
  onDoCheck(): void;
}

export interface IOnAfterContentInit {
  onAfterContentInit(): void;
}

export interface IOnAfterContentChecked {
  onAfterContentChecked(): void;
}

export interface IOnAfterViewInit {
  onAfterViewInit(): void;
}

export interface IOnAfterViewChecked {
  onAfterViewChecked(): void;
}

export interface IOnCanActivate {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean;
}

export interface IOnCanDeactivate {
  canDeactivate(component: any, route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean;
}

export interface IOnCheckGuard {
  onCheckGuard(newState: string, params?: any): boolean;
}
