import { Component, Injector, OnInit } from '@angular/core';
import { FormDesignerControl } from '../../decorators';
import { shChangeDetectorStrategy } from '../../environments/change-detection-strategy';
import { ShDateComponent, ShDateFormat } from '../date/date.component';


@FormDesignerControl({
  name: 'datetime',
  shortDescription: 'Date-Time Control'
})
@Component({
    selector: 'sh-date-time',
    templateUrl: '../date/date.component.html',
    styleUrls: ['../date/date.component.scss'],
    changeDetection: shChangeDetectorStrategy(),
    standalone: false
})
/**
 * Base Time Component
 */
export class ShDateTimeComponent extends ShDateComponent implements OnInit {

  /**
   * Base Time Component
   */
  constructor(injector: Injector) {
    super(injector);
  }

  /*protected*/ public setupFormat() {
    const lang = this.translateService.currentLang;
    if (!(this.internalOptions.format && this.internalOptions.format.length)) {
      switch (lang) {
        case 'it':
          this.format = ['day', 'month', 'year', 'hour', 'minutes', 'seconds'];
          break;
        case 'en':
          this.format = ['month', 'day', 'year', 'hour', 'minutes', 'seconds'];
          break;
        default:
          this.format = ['year', 'month', 'day', 'hour', 'minutes', 'seconds'];
          break;
      }
    } else {
      this.format = [...this.internalOptions.format] as ShDateFormat;
    }
    const index = this.format.findIndex(f => f === 'hour');
    if (index > -1) {
      this.format[index] = lang.includes('en') ? 'hh' : 'HH';
    }
  }

}
