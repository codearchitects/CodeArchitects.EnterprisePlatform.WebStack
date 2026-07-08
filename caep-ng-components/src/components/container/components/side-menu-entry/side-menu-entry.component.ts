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
            // Scrolls towards this entry.
            setTimeout(() => this._elementRef.nativeElement.scrollIntoView({ behavior: 'smooth' }), 100);
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
  //#endregion
}
