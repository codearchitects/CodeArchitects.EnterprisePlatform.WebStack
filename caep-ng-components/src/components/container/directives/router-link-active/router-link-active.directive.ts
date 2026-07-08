import {
  Directive,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewContainerRef
} from '@angular/core';
import { BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ICaepSideMenuEntry } from '../../models';
import { CaepSideMenuService } from '../../services';

@Directive({
    selector: 'a[caepRouterLinkActive]',
    standalone: false
})
export class CaepRouterLinkActiveDirective implements OnInit, OnDestroy, OnChanges {
  //#region Internals
  private _destroy$ = new Subject<void>();
  private _entry$ = new BehaviorSubject<ICaepSideMenuEntry>(null);
  private _classes$ = new BehaviorSubject<string[]>(null);
  private _isActive = false;
  //#endregion
  //#region Inputs
  @Input() public caepRouterLinkActive: string | string[];
  @Input() public caepRouterLink: ICaepSideMenuEntry;
  //#endregion
  //#region Outputs
  @Output() public activeChanges = new EventEmitter<boolean>();
  //#endregion
  constructor(private _menuService: CaepSideMenuService, private _viewContainerRef: ViewContainerRef) {}
  //#region Lifecycle
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.caepRouterLinkActive) {
      this._classes$.next(
        Array.isArray(this.caepRouterLinkActive) ? this.caepRouterLinkActive : [this.caepRouterLinkActive]
      );
    }
    if (changes.caepRouterLink) {
      this._entry$.next(this.caepRouterLink);
    }
  }
  ngOnInit(): void {
    const nativeElement: Element = this._viewContainerRef.element.nativeElement;
    combineLatest([this._menuService.location$, this._entry$, this._classes$])
      .pipe(takeUntil(this._destroy$))
      .subscribe(([location, entry, classes]) => {
        const isActive = entry && location && this._menuService.isActive(entry, location);
        if (isActive) {
          nativeElement.classList.add(...classes);
        } else {
          nativeElement.classList.remove(...classes);
        }
        if (isActive !== this._isActive) {
          this._isActive = isActive;
          this.activeChanges.emit(isActive);
        }
      });
  }
  ngOnDestroy(): void {
    this._destroy$.next();
  }
  //#endregion
}
