import { Component, Injector, Input } from '@angular/core';
import { shChangeDetectorStrategy } from '../../environments/change-detection-strategy';
import { ShBaseAuthComponent } from './../base/base-auth.component';
import { IShBaseOptions } from './../base/base.component';
import { IShBreadcrumbStackFrame } from './interface';

/**
 * Minimum contract to be respected to make
 * breadcrumb work with application activity
 */
export interface IShBreadcrumbActivity {
  /**
   * Activity payload
   */
  CurrentPayload: { stack: IShBreadcrumbStackFrame[] };
}


@Component({
    selector: 'sh-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
    changeDetection: shChangeDetectorStrategy(),
    standalone: false
})
export class ShBreadcrumbComponent extends ShBaseAuthComponent<IShBaseOptions> {
  /**
   * Application activity
   */
  @Input() public activity: IShBreadcrumbActivity;
  /**
   * Specifies whether to show action name when frame hasn't label
   * @default true
   */
  @Input() public hasFallback = true;
  /**
   * Stack Frames Interpreter
   */
  constructor(injector: Injector) {
    super(injector);
  }
  /**
   * Actualizes navigation stack
   * @param frame
   */
  /*protected*/ public actualize(frame: IShBreadcrumbStackFrame) {
    const stack = this.activity.CurrentPayload.stack;
    if (stack) {
      const index = stack.indexOf(frame);
      if (index > -1) {
        stack.splice(index + 1, stack.length - 1 - index);
      }
    }
  }

}
