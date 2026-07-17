import { IShBaseOptions } from './../base/base.component';
import { ShBaseAuthComponent } from './../base/base-auth.component';
import { Component, Injector, Input } from '@angular/core';
import { SH_CHANGE_DETECTOR } from 'src/environments/change-detection-strategy';

/**
 * Breadcrumb stack frame contract
 */
export interface IShBreadcrumbStackFrame {
  /**
   * Specifies whether stack frame is a return point
   */
  isReturnPoint?: boolean;
  /**
   * Stack frame label to be shown into breadcrumb
   */
  label?: string;
  /**
   * Action name and optional parameters array
   */
  action?: string[];
  /**
   * Scenario name and optional parameters array
   */
  scenario?: string[];
  /**
   * Domain name and optional parameters array
   */
  domain?: string[];
}

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
  changeDetection: SH_CHANGE_DETECTOR.STRATEGY
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
  protected actualize(frame: IShBreadcrumbStackFrame) {
    const stack = this.activity.CurrentPayload.stack;
    if (stack) {
      const index = stack.indexOf(frame);
      if (index > -1) {
        stack.splice(index + 1, stack.length - 1 - index);
      }
    }
  }

}
