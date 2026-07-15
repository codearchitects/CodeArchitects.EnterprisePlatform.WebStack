import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CaepBaseAuthComponent } from '../../../base';
import { ICaepSideMenuEntry } from '../../models';
import { CaepSideMenuService } from '../../services';

@Component({
    selector: 'caep-side-menu-entry',
    templateUrl: './side-menu-entry.component.html',
    styleUrls: ['./side-menu-entry.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CaepSideMenuEntryComponent extends CaepBaseAuthComponent implements OnInit, OnChanges {
  //#region Internals
  private _model$ = new BehaviorSubject<ICaepSideMenuEntry>(null);
  //#endregion
  //#region View
  /**
   * Whether this entry is open or not.
   */
  protected isOpen: any;
  /**
   * Whether this entry is active or not.
   * This can be active either it is the active route or one of its children is.
   */
  protected isActive = false;
  /**
   * Whether this entry has children or not.
   */
  protected hasChildren = false;
  //#region Bindings
  /**
   * Whether this entry is expandable or not.
   */
  protected isExpandable = false;
  /**
   * Whether this is the current active route.
   */
  protected isActiveRoute = false;
  /**
   * Stable id of the children container, used to wire `aria-controls` from an
   * expandable entry to the list of child entries it discloses.
   * Null when this entry has no stable id so the attribute renders nothing.
   */
  protected get childrenId(): string | null {
    return this.model?.id != null ? `caep-side-menu-children-${this.model.id}` : null;
  }
  //#endregion
  //#endregion
  //#region Inputs
  /**
   * Related menu entry.
   */
  @Input() model: ICaepSideMenuEntry;
  /**
   * Whether user is on this layer or not.
   */
  @Input() public visible: boolean = true;
  /**
   * This entry parent. Needed to show correct label while redirecting towards upper layer.
   */
  @Input() public parent: ICaepSideMenuEntry;
  //#endregion
  //#region Outputs
  /**
   * Emits when user visit inner layer.
   */
  @Output() public inward = new EventEmitter<void>();
  //#endregion
  constructor(
    private _cd: ChangeDetectorRef,
    private _menuService: CaepSideMenuService,
    private _elementRef: ElementRef<HTMLElement>,
    injector: Injector
  ) {
    super(injector);
  }
  //#region Lifecycle
  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    if (changes?.model) {
      this.hasChildren = this.model?.children?.length > 0;
      this.isExpandable = this.hasChildren || this.model?.lazy;
      this._model$.next(this.model);
    }
  }
  ngOnInit(): void {
    super.ngOnInit();
    combineLatest([this._menuService.location$, this._model$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([location, entry]) => {
        if (location && entry) {
          const activeEntry = this._menuService.getActiveEntry(location);
          this.isActive = activeEntry && this._menuService.isActive(entry, location, true, activeEntry);
          this.isActiveRoute = this.isActive && this._menuService.isActive(entry, location, false, activeEntry);
          this.isOpen =
            this.isActive &&
            entry.children?.some(child => this._menuService.isActive(child, location, true, activeEntry));
          if (this.isActiveRoute) {
            // Scrolls towards this entry, honoring the user's reduced-motion preference (WCAG 2.3.3).
            const prefersReducedMotion =
              typeof window !== 'undefined' &&
              window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
            setTimeout(
              () =>
                this._elementRef.nativeElement.scrollIntoView({
                  behavior: prefersReducedMotion ? 'auto' : 'smooth'
                }),
              100
            );
          }
        } else {
          this.isActive = this.isActiveRoute = this.isOpen = false;
        }
        this._cd.markForCheck();
      });
  }
  //#endregion
  //#region View hooks
  /**
   * Fired when user expand this entry by clicking on it.
   */
  protected onInward() {
    if (this.isExpandable) {
      this.isOpen = !this.isOpen;
    }
    // Notifies this parent user visited this layer, so then it should not be the active layer anymore.
    this.inward.emit();
  }
  /**
   * Fired when user visits a child inner layer.
   */
  protected onChildInward() {
    // Notifies parent this is not the current layer anymore.
    this.inward.emit();
  }
  /**
   * Mirrors the pointer interaction on the keyboard for expandable entries.
   * Expandable entries carry no `href` (they only toggle their children), so the
   * native anchor does not react to Enter/Space; here we replicate the click-driven
   * expand/collapse. Navigable entries keep their native anchor behavior untouched.
   */
  protected onEntryKeydown(event: Event): void {
    if (this.isExpandable) {
      event.preventDefault();
      this.onInward();
    }
  }
  //#endregion
}
