import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { CommandDispatcherService, ICommand } from '@ca-webstack/ng-command-dispatcher';
import { BehaviorSubject, Subject, concat } from 'rxjs';
import {
  debounceTime,
  distinct,
  distinctUntilChanged,
  map,
  pairwise,
  startWith,
  take,
  takeUntil
} from 'rxjs/operators';
import { CAEP_TOPBAR_FAMILY, CaepTopbarItemPosition, ICaepTopbarItem } from '../../models';
import { CaepTopbarService } from '../../services';

@Component({
    selector: 'caep-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CaepTopbarComponent implements OnInit, OnDestroy, AfterViewChecked {
  //#region View
  protected items: ICaepTopbarItem[] = [];
  protected allItems: ICaepTopbarItem[] = [];
  protected checkItemsFit: boolean;
  @ViewChild('container', { static: true }) protected container: ElementRef<HTMLDivElement>;
  //#endregion
  //#region Internals
  private _observer: ResizeObserver;
  private _containerWidth$ = new BehaviorSubject<number>(0);
  private _destroy$ = new Subject<void>();
  //#endregion
  constructor(
    private _topbarService: CaepTopbarService,
    private _zone: NgZone,
    private _cd: ChangeDetectorRef,
    @Optional() private _commandDispatcher: CommandDispatcherService
  ) {}
  //#region Lifecycle
  ngOnInit(): void {
    this._observer = new ResizeObserver(entries => {
      this._zone.run(() => {
        this._containerWidth$.next(entries[0].contentRect.width);
      });
    });
    this._observer.observe(this.container.nativeElement);
    this._topbarService.items$.pipe(takeUntil(this._destroy$)).subscribe(items => {
      this.allItems = items;
      this.items = [...items];
      this.checkItemsFit = true;
      this._cd.markForCheck();
    });
    this._containerWidth$.pipe(debounceTime(200), distinctUntilChanged(), takeUntil(this._destroy$)).subscribe(() => {
      this.items = [...this.allItems];
      this.checkItemsFit = true;
      this._cd.markForCheck();
    });
    if (this._commandDispatcher) {
      const commands$ = this._commandDispatcher.changes.pipe(
        map(cmds => cmds.filter(cmd => cmd.family === CAEP_TOPBAR_FAMILY)),
        distinct()
      );
      // TODO: Evaluate a distinct mechanism since command dispatcher emits everytime a component is initialized, and everytime topbar service gets updated by commands
      concat(commands$.pipe(startWith([]), take(2)), commands$.pipe(debounceTime(100)))
        .pipe(startWith([]), pairwise(), takeUntil(this._destroy$))
        .subscribe(([prev, act]) => this._handleCommandsChange(prev, act));
    }
  }
  ngAfterViewChecked(): void {
    if (this.checkItemsFit) {
      this._updateDisplayedItems();
    }
  }
  ngOnDestroy(): void {
    this._destroy$.next();
    this._observer.unobserve(this.container.nativeElement);
  }
  //#endregion
  //#region Internal hooks
  /**
   * Updates displayed items to render only items which can fit the container.
   * Items are ordered by priority, or their position/order.
   */
  private _updateDisplayedItems() {
    const containerWidth = this._containerWidth$.value;
    const items: ICaepTopbarItem[] = [];
    if (containerWidth > 0) {
      const byPosition = (left: ICaepTopbarItem, right: ICaepTopbarItem) => {
        if (left.position === right.position) return 0;
        if (left.position === CaepTopbarItemPosition.Right) return -1;
        if (right.position === CaepTopbarItemPosition.Right) return 1;
        return left.position === CaepTopbarItemPosition.Left ? 1 : -1;
      };
      const byOrder = (left: ICaepTopbarItem, right: ICaepTopbarItem) => {
        if (left.order == null) return 1;
        if (right.order == null) return -1;
        return left.order - right.order;
      };
      const unsetPriority = this.allItems.filter(item => item.priority == null);
      const sorted = [
        ...this.allItems
          .filter(item => item.priority != null)
          .sort((left, right) => {
            if (left.priority === right.priority) return byPosition(left, right);
            return left.priority - right.priority;
          }),
        ...unsetPriority.filter(item => item.position === CaepTopbarItemPosition.Right).sort(byOrder),
        ...unsetPriority.filter(item => item.position === CaepTopbarItemPosition.Center).sort(byOrder),
        ...unsetPriority.filter(item => item.position === CaepTopbarItemPosition.Left).sort(byOrder)
      ];
      let widthAcc = 0;
      for (const item of sorted) {
        const element = this.container.nativeElement.querySelector<HTMLDivElement>(`#dyl-topbar-${item.id}`);
        if (!element) {
          // item is hidden somehow (e.g. policy engine)
          items.push(item);
        } else {
          // check if enough space
          if (element.offsetWidth + widthAcc <= containerWidth) {
            widthAcc += element.offsetWidth;
            items.push(item);
          } else {
            break;
          }
        }
      }
    }

    setTimeout(() => {
      // next change detection run
      this.items = items;
      this.checkItemsFit = false;
      this._cd.markForCheck();
    });
  }
  /**
   * Handles command changes, registering new commands.
   */
  private _handleCommandsChange(previous: ICommand[], actual: ICommand[]) {
    // removing unregistered commands
    const unregistered = previous
      .filter(cmd => actual.findIndex(c => c.name === cmd.name) < 0)
      .map(cmd => this._topbarService.commandToTopbarItem(cmd).id);
    this._topbarService.unregister(...unregistered);
    // registering/updating actual commands
    const items = actual.map(cmd => this._topbarService.commandToTopbarItem(cmd));
    this._topbarService.registerOrUpdate(...items);
  }
  //#endregion
}
