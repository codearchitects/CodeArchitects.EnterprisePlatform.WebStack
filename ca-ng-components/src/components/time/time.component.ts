import { Component, Injector, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { FormDesignerControl } from 'src/decorators';
import { SH_CHANGE_DETECTOR } from 'src/environments/change-detection-strategy';
import { IShDateOptions, ShDateComponent } from '../date/date.component';

@FormDesignerControl({
  name: 'time',
  shortDescription: 'Time Control'
})
@Component({
  selector: 'sh-time',
  templateUrl: '../date/date.component.html',
  styleUrls: ['../date/date.component.scss'],
  changeDetection: SH_CHANGE_DETECTOR.STRATEGY
 })
/**
 * Base Time Component
 */
export class ShTimeComponent extends ShDateComponent implements OnInit {

  /**
   * Base Time Component
   */
  constructor(injector: Injector) {
    super(injector);
  }

  protected getDefaultOptions(): IShDateOptions {
    return _.merge(super.getDefaultOptions(), {
      format: ['hour', 'minutes']
    });
  }

}
