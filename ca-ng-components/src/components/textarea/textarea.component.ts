import { AfterViewInit, Component, Injector, OnChanges, SimpleChanges } from '@angular/core';
import 'jquery';
import * as _ from 'lodash-es';
import { FormDesignerControl } from '../../decorators';
import { shChangeDetectorStrategy } from '../../environments/change-detection-strategy';
import { IShBaseInputOptions, ShBaseInputComponent } from '../base/index';

/**
 * Base Textarea Component options contract
 */
export interface IShTextAreaOptions
  extends IShBaseInputOptions<string> {
  /**
   * Textarea rows
   * @default undefined
   */
  rows?: number;
  /**
   * Textarea columns
   * @default undefined
   */
  cols?: number;
  /**
   * Specifies if textarea can autoresize itself
   * @default false
   */
  autoresize?: boolean;
  /**
   * Maximum number of visible rows before scroll
   * @default undefined
   */
  maxRows?: number;
}

@FormDesignerControl({
  name: 'textarea',
  shortDescription: 'Textarea Control'
})
@Component({
    selector: 'sh-textarea',
    templateUrl: './textarea.component.html',
    styleUrls: ['./textarea.component.scss'],
    changeDetection: shChangeDetectorStrategy(),
    standalone: false
})
/**
 * Base Textarea Component
 */
export class ShTextareaComponent
  extends ShBaseInputComponent<string, IShTextAreaOptions> implements AfterViewInit, OnChanges {
  /**
   * References to component JQElement
   */
  private _element: JQuery;

  /**
   * Base Textarea Component
   */
  constructor(injector: Injector) {
    super(injector);
    this.onModelValueChanges = () => {
      if (this.internalOptions.autoresize) {
        this.autoresize();
      }
    };
  }

  public ngAfterViewInit() {
    if (this.internalOptions.autoresize) {
      setTimeout(this.setupAutoResizing.bind(this));
    }
  }

  public ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (this.internalOptions.autoresize && changes['model'] && !this.isChangeEqual(changes['model'])) {
      this.autoresize();
    }
  }

  /*protected*/ public getDefaultOptions(): IShTextAreaOptions {
    return _.merge(super.getDefaultOptions(), {
      autoresize: false
    });
  }

  public onControlValueChanges(): void {
    super.onControlValueChanges();
    if (this.internalOptions.autoresize) {
      this.autoresize();
    }
  }

  /**
   * Setups the autoresize feature
   */
  private setupAutoResizing() {
    if ($) {
      this._element = $('#' + this.internalOptions.id);
      if (this.internalOptions.maxRows) {
        this.setMaxRows();
      }
      if (this.getControlValue()) {
        this.autoresize();
      }
    }
  }

  /**
   * Sets a maximum number of visible rows before scroll
   */
  private setMaxRows() {
    const lineHeight = parseInt(this._element.css('line-height'));
    this._element.css('max-height', this.internalOptions.maxRows * lineHeight);
  }

  /**
   * Performs autoresize onto text-area
   */
  private autoresize() {
    if (this._element) {
      setTimeout(() => this._element.height(0).height(this._element[0].scrollHeight));
    }
  }
}
