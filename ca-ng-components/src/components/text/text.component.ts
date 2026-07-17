import { Component, Injector } from '@angular/core';
import * as _ from 'lodash';
import { FormDesignerControl } from 'src/decorators';
import { SH_CHANGE_DETECTOR } from 'src/environments/change-detection-strategy';
import { IShBaseInputOptions, ShBaseInputComponent } from '../base';

/**
 * Base Text Component options contract
 */
export interface IShTextComponentOptions extends IShBaseInputOptions<string> {
  /**
   * Input type
   */
  type?: 'text' | 'password' | 'email';
}

@FormDesignerControl({
  name: 'text',
  shortDescription: 'Text Control'
})
@Component({
  selector: 'sh-text',
  templateUrl: './text.component.html',
  styleUrls: ['text.component.scss'],
  changeDetection: SH_CHANGE_DETECTOR.STRATEGY
})
/**
 * Base Text Component
 */
export class ShTextComponent extends ShBaseInputComponent<string, IShTextComponentOptions> {
  /**
   * Base Text Component
   */
  constructor(injector: Injector) {
    super(injector);
  }

  protected getDefaultOptions(): IShTextComponentOptions {
    return _.merge(super.getDefaultOptions(), {
      type: 'text'
    });
  }

}
