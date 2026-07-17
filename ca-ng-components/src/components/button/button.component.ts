import { Component, Injector, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { IShBaseOptions, ShBaseAuthComponent } from '../base';
import { SH_CHANGE_DETECTOR } from 'src/environments/change-detection-strategy';
import { FormDesignerControl } from 'src/decorators';

/**
 * Base Button Component options contract
 */
export interface IShButtonOptions
  extends IShBaseOptions {
  type?: string;
  translateParams?: string[];
}


@FormDesignerControl({
  name: 'button',
  shortDescription: 'Button Control'
})
@Component({
  selector: 'sh-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: SH_CHANGE_DETECTOR.STRATEGY
 })
/**
 * Base Button Component
 */
export class ShButtonComponent
  extends ShBaseAuthComponent<IShButtonOptions> {
  /**
   * Specifies if button must adopt primary style
   */
  @Input() public primary = false;
  /**
   * Specifies if button must adopt transparent style
   */
  @Input() public transparent = false;
  /**
   * Specifies if button must adopt white-transparent style
   */
  @Input() public negative = false;
  /**
   * Specifies if button must adopt outline style
   */
  @Input() public outline = false;
  /**
   * If specified, the button is flanked by an icon
   */
  @Input() public icon: string;
  /**
   * Click event
   */
  @Output() public click = new EventEmitter<MouseEvent>();
  /**
   * Clicked event
   */
  @Output() public clicked = new EventEmitter<MouseEvent>();

  /**
   * Base Button Component
   */
  constructor(injector: Injector) {
    super(injector);
  }

  /**
   * Event fired on click
   */
  protected onClick(event: MouseEvent) {
    event.stopPropagation();
    if (this.enable) {
      this.click.emit(event);
      this.clicked.emit(event);
    } else {
      event.preventDefault();
    }
  }

  protected getDefaultOptions(): IShButtonOptions {
    return _.merge(super.getDefaultOptions(), {
      type: 'button'
    });
  }

}
