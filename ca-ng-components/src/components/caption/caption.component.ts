import { Component, Injector, OnInit } from '@angular/core';
import { IShBaseOptions, ShBaseModelComponent } from '../base';
import { shChangeDetectorStrategy } from '../../environments/change-detection-strategy';
import { FormDesignerControl } from '../../decorators';


@FormDesignerControl({
  name: 'caption',
  shortDescription: 'Caption Control'
})
@Component({
    selector: 'sh-caption',
    templateUrl: './caption.component.html',
    styleUrls: ['./caption.component.scss'],
    changeDetection: shChangeDetectorStrategy(),
    standalone: false
})
/**
 * Base Caption component
 */
export class ShCaptionComponent<O extends IShBaseOptions>
  extends ShBaseModelComponent<string, O> implements OnInit {
  /**
  * Base Caption component
  */
  constructor(injector: Injector) {
    super(injector);
  }

  public ngOnInit(): void {
    if (!this.model) {
      this.model = {};
    }
    super.ngOnInit();
  }

}
