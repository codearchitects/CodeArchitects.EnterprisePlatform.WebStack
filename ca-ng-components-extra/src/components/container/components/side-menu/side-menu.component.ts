import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ICaepSideMenuEntry } from '../../models';
import { CaepSideMenuService } from '../../services';

@Component({
    selector: 'caep-side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CaepSideMenuComponent implements OnInit, OnDestroy {
  //#region Internals
  protected _destroy$ = new Subject<void>();
  /** Monotonic counter to generate unique landmark ids across instances. */
  private static _nextId = 0;
  //#endregion
  //#region Bindings
  @HostBinding('class') protected _hostClass = 'caep-side-menu';
  /**
   * Menu placeholder icon binding.
   */
  @HostBinding('style.--menu-placeholder-icon') protected get _placeholderIcon() {
    return this.placeholderIcon && `url("${this.placeholderIcon}")`;
  }
  /**
   * Menu back icon binding.
   */
  @HostBinding('style.--menu-back-icon') protected get _backIcon() {
    return this.backIcon && `url("${this.backIcon}")`;
  }
  /**
   * Menu placeholder icon binding.
   */
  @HostBinding('style.--menu-chevron-right-icon') protected get _chevronRightIcon() {
    return this.chevronRightIcon && `url("${this.chevronRightIcon}")`;
  }
  //#endregion
  //#region Inputs
  /**
   * Menu placeholder icon path.
   */
  @Input() public placeholderIcon = 'assets/menu/placeholder.svg';
  /**
   * Menu back icon path.
   */
  @Input() public backIcon = 'assets/menu/back.svg';
  /**
   * Menu chevron right icon path.
   */
  @Input() public chevronRightIcon = 'assets/menu/chevron_right.svg';
  /**
   * Logo path.
   */
  @Input() public logo: string = 'assets/menu/placeholder.svg';
  /**
   * Logo collapsed path.
   */
  @Input() public logoCollapsed: string = 'assets/menu/placeholder.svg';
  /**
   * Menu expand icon path.
   */
  @Input() public expandIcon = 'assets/menu/expand.svg';
  /**
   * Menu collapse icon path.
   */
  @Input() public collapseIcon = 'assets/menu/collapse.svg';
  /**
   * Accessible name (translation key or literal) for the collapse/expand toggle button.
   * The button has no visible text, so this provides its programmatic name.
   */
  @Input() public toggleAriaLabel = 'collapser';
  /**
   * Accessible name (translation key or literal) for the navigation landmark.
   */
  @Input() public navAriaLabel = 'menu';
  //#endregion
  //#region View
  protected entries: ICaepSideMenuEntry[];
  /**
   * Unique id for the navigation landmark, used to associate the toggle button
   * (aria-controls) with the region it expands/collapses.
   */
  protected readonly navId = `caep-side-menu-nav-${CaepSideMenuComponent._nextId++}`;
  /**
   * Whether menu is collapsed or not.
   */
  @HostBinding('class.collapsed') protected collapsed = false;
  //#endregion
  constructor(protected _cd: ChangeDetectorRef, protected _menuService: CaepSideMenuService) {}
  //#region Lifecycle
  ngOnInit(): void {
    this._menuService.entries$.pipe(takeUntil(this._destroy$)).subscribe(entries => {
      this.entries = entries;
      this._cd.markForCheck();
    });
  }
  ngOnDestroy(): void {
    this._destroy$.next();
  }
  //#endregion
  //#region View hooks
  /**
   * User collapsed/expanded menu.
   */
  protected onToggle() {
    this.collapsed = !this.collapsed;
  }
  //#endregion
}
