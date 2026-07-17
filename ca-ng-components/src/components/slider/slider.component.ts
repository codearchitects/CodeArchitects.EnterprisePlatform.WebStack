import { Component, Injector } from '@angular/core';
import { FormDesignerControl } from 'src/decorators';
import { SH_CHANGE_DETECTOR } from 'src/environments/change-detection-strategy';
import { IShBaseInputOptions, ShBaseInputComponent } from '../base';

export interface ISliderOptions extends IShBaseInputOptions<number> {
  /**
   * Specifies whether to show slider value
   */
  showValue?: boolean;
}

@FormDesignerControl({
  name: 'slider',
  shortDescription: 'Slider Control'
})
@Component({
  selector: 'sh-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  changeDetection: SH_CHANGE_DETECTOR.STRATEGY
})
/**
 * Slider base component
 */
export class ShSliderComponent extends ShBaseInputComponent<number, ISliderOptions> {

  /**
   * Slider base component
   */
  constructor(injector: Injector) {
    super(injector);
  }

}
