import { Component, Injector } from '@angular/core';
import * as _ from 'lodash-es';
import { FormDesignerControl } from '../../decorators';
import { shChangeDetectorStrategy } from '../../environments/change-detection-strategy';
import { IShNumberOptions, ShNumberComponent } from './../number/number.component';

@FormDesignerControl({
  name: 'currency',
  shortDescription: 'Currency Control'
})
@Component({
    selector: 'sh-currency',
    templateUrl: '../number/number.component.html',
    styleUrls: ['../number/number.component.scss'],
    changeDetection: shChangeDetectorStrategy(),
    standalone: false
})
/**
 * Base Currency Component
 */
export class ShCurrencyComponent
  extends ShNumberComponent<IShNumberOptions> {

  /**
   * Base Currency Component
   */
  constructor(injector: Injector) {
    super(injector);
  }

  /*protected*/ public getDefaultOptions(): IShNumberOptions {
    return _.merge(super.getDefaultOptions(), {
      format: '0,0.00 $'
    });
  }

  /*protected*/ public getEditFormat() {
    return super.getEditFormat().replace(/\s*\$\s*/g, '');
  }

}
