import { Subject } from 'rxjs';
import { Component, Input, SimpleChanges, OnChanges, ElementRef, Injector, OnInit } from '@angular/core';
import { takeUntil, throttleTime } from 'rxjs/operators';
import { ShBaseComponent } from '../base/index';
import { isNoU } from 'src/utilities';
import { SH_CHANGE_DETECTOR } from 'src/environments/change-detection-strategy';

/**
 * Columns available resolutions keys
 */
export type ColumnResolution = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'all';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
  changeDetection: SH_CHANGE_DETECTOR.STRATEGY
 })
/**
 * Layout grid column component
 */
export class ShColumnComponent extends ShBaseComponent<any> implements OnInit, OnChanges {
  /**
   * Extra-small resolution columns
   */
  @Input() public xs: string | number;
  /**
   * Small resolution columns
   */
  @Input() public sm: string | number;
  /**
   * Medium resolution columns
   */
  @Input() public md: string | number;
  /**
   * Large resolution columns
   */
  @Input() public lg: string | number;
  /**
   * Extra-large resolution columns
   */
  @Input() public xl: string | number;
  /**
   * Extra-small resolution offset
   */
  @Input() public offset_xs: string | number;
  /**
   * Small resolution offset
   */
  @Input() public offset_sm: string | number;
  /**
   * Medium resolution offset
   */
  @Input() public offset_md: string | number;
  /**
   * Large resolution offset
   */
  @Input() public offset_lg: string | number;
  /**
   * Extra-large resolution offset
   */
  @Input() public offset_xl: string | number;
  /**
   * Extra-small resolution order
   */
  @Input() public order_xs: string | number;
  /**
   * Small resolution order
   */
  @Input() public order_sm: string | number;
  /**
   * Medium resolution order
   */
  @Input() public order_md: string | number;
  /**
   * Large resolution order
   */
  @Input() public order_lg: string | number;
  /**
   * Extra-large resolution order
   */
  @Input() public order_xl: string | number;
  /**
   * Specifies for which resolution, column must
   * distantiates itself from bottom
   */
  @Input() public break: ColumnResolution;
  /**
   * Specifies for which resolution, column must
   * hides itself
   */
  @Input() public hide: ColumnResolution[] | ColumnResolution;
  /**
   * Computed style
   */
  protected style: string;
  /**
   * Component Element
   */
  private _column: HTMLElement;
  /**
   * Setup observable
   */
  private _setup$ = new Subject();

  /**
   * Layout grid column component
   */
  constructor(injector: Injector) {
    super(injector);
    const element = injector.get(ElementRef);
    this._column = element.nativeElement;
    this._setup$
      .pipe(throttleTime(500), takeUntil(this.destroy$))
      .subscribe(() => {
        this.setupColumns();
        this.setupOffsets();
        this.setupOrders();
        this.setupVisbility();
        if (this.break) {
          this.style = `${this.style} break-${this.break}`;
        }
        if (this._column) {
          this._column.className = this.style;
        }
      });
  }

  public ngOnInit() {
    super.ngOnInit();
    this._setup$.next();
  }

  public ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    this._setup$.next();
  }

  /**
   * Computes styles for columns
   */
  private setupColumns() {
    this.style = '';
    if (this.xs) {
      this.style = `col-${this.xs}`;
    }
    if (this.sm) {
      this.style = `${this.style} col-sm-${this.sm}`;
    }
    if (this.md) {
      this.style = `${this.style} col-md-${this.md}`;
    }
    if (this.lg) {
      this.style = `${this.style} col-lg-${this.lg}`;
    }
    if (this.xl) {
      this.style = `${this.style} col-xl-${this.xl}`;
    }
    if (!this.style.length) {
      this.style = 'col';
    }
  }

  /**
   * Computes styles for offsets
   */
  private setupOffsets() {
    if (!isNoU(this.offset_xs)) {
      this.style = `${this.style} offset-${this.offset_xs}`;
    }
    if (!isNoU(this.offset_sm)) {
      this.style = `${this.style} offset-sm-${this.offset_sm}`;
    }
    if (!isNoU(this.offset_md)) {
      this.style = `${this.style} offset-md-${this.offset_md}`;
    }
    if (!isNoU(this.offset_lg)) {
      this.style = `${this.style} offset-lg-${this.offset_lg}`;
    }
    if (!isNoU(this.offset_xl)) {
      this.style = `${this.style} offset-xl-${this.offset_xl}`;
    }
  }

  /**
   * Computes styles for column orders
   */
  private setupOrders() {
    if (!isNoU(this.order_xs)) {
      this.style = `${this.style} order-${this.order_xs}`;
    }
    if (!isNoU(this.order_sm)) {
      this.style = `${this.style} order-sm-${this.order_sm}`;
    }
    if (!isNoU(this.order_md)) {
      this.style = `${this.style} order-md-${this.order_md}`;
    }
    if (!isNoU(this.order_lg)) {
      this.style = `${this.style} order-lg-${this.order_lg}`;
    }
    if (!isNoU(this.order_xl)) {
      this.style = `${this.style} order-xl-${this.order_xl}`;
    }
  }

  /**
   * Computes styles for column visibility
   */
  private setupVisbility() {
    if (this.hide instanceof Array) {
      this.hide.forEach(h => this.style = `${this.style} hide-${h}`);
    } else if (this.hide) {
      this.style = `${this.style} hide-${this.hide}`;
    }
  }
}
