import { Component, ElementRef, Injector, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';
import { shChangeDetectorStrategy } from '../../environments/change-detection-strategy';
import { ShBaseComponent } from '../base/index';

/**
 * Row available vertical alignments
 */
export type RowVerticalAlignment = 'start' | 'center' | 'end';
/**
 * Row available horizontal alignments
 */
export type RowHorizontalAlignment = 'start' | 'center' | 'end' | 'around' | 'between';

@Component({
    selector: 'row',
    templateUrl: './row.component.html',
    styleUrls: ['./row.component.scss'],
    changeDetection: shChangeDetectorStrategy(),
    standalone: false
})
/**
 * Layout grid row component
 */
export class ShRowComponent extends ShBaseComponent<any> implements OnInit, OnChanges {
  /**
   * Specifies columns vertical alignment
   */
  @Input() public verticalAlignment: RowVerticalAlignment;
  /**
   * Specifies columns horizontal alignment
   */
  @Input() public horizontalAlignment: RowHorizontalAlignment;
  /**
   * Specifies whether to remove negative horizontal margins
   */
  @Input() public noGutters = false;
  /**
   * Computed style
   */
  /*protected*/ public style = 'row';
  /**
   * Component Element
   */
  private _row: HTMLElement;
  /**
   * Setup observable
   */
  private _setup$ = new Subject<void>();

  /**
   * Layout grid row component
   */
  constructor(injector: Injector) {
    super(injector);
    const element = injector.get(ElementRef);
    this._row = element.nativeElement;
    this._setup$
      .pipe(throttleTime(500), takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.verticalAlignment) {
          this.style = `${this.style} align-items-${this.verticalAlignment}`;
        }
        if (this.horizontalAlignment) {
          this.style = `${this.style} justify-content-${this.horizontalAlignment}`;
        }
        if (this.noGutters) {
          this.style = `${this.style} no-gutters`;
        }
        if (this._row) {
          this._row.className = this.style;
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
}
