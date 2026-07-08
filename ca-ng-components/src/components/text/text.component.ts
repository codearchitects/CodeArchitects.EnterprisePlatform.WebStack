import { Component, Injector } from '@angular/core';
import * as _ from 'lodash-es';
import { FormDesignerControl } from '../../decorators';
import { shChangeDetectorStrategy } from '../../environments/change-detection-strategy';
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
    changeDetection: shChangeDetectorStrategy(),
    standalone: false
})
/**
 * Base Text Component
 */
export class ShTextComponent<O extends IShTextComponentOptions = IShTextComponentOptions> extends ShBaseInputComponent<string, O> {
  /**
   * Base Text Component
   */
  constructor(injector: Injector) {
    super(injector);
  }

  /*protected*/ public getDefaultOptions(): IShTextComponentOptions {
    return _.merge(super.getDefaultOptions(), {
      type: 'text' as 'text' | 'password' | 'email'
    });
  }

}
