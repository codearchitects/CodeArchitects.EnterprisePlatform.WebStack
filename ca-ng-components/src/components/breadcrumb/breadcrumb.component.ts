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

  /**
   * Whether the breadcrumb trail renders at least one visible stack frame
   * (i.e. one that is not a return point). Used to decide whether the "HOME"
   * entry is the current page (`aria-current="page"`) per the WAI-ARIA APG
   * breadcrumb pattern.
   */
  public get hasVisibleFrames(): boolean {
    const stack = this.activity?.CurrentPayload?.stack;
    return !!stack && stack.some(frame => !frame.isReturnPoint);
  }

  /**
   * Returns true for the last visible stack frame, which represents the
   * current page and is therefore marked with `aria-current="page"` (APG
   * breadcrumb pattern). Return points are skipped, mirroring the template.
   * @param frame The frame to test
   */
  public isCurrentFrame(frame: IShBreadcrumbStackFrame): boolean {
    const stack = this.activity?.CurrentPayload?.stack;
    if (!stack) {
      return false;
    }
    let last: IShBreadcrumbStackFrame | undefined;
    for (const candidate of stack) {
      if (!candidate.isReturnPoint) {
        last = candidate;
      }
    }
    return last === frame;
  }

  /**
   * Keyboard activation for the breadcrumb entries. Since the trail items are
   * `role="link"` spans (not native anchors), Enter/Space must trigger the
   * same navigation as a mouse click (WCAG 2.1.1). Re-dispatching a click
   * reuses the existing `routerLink` / `actualize` handlers unchanged.
   * @param event The keyboard event
   */
  public onActivateKey(event: KeyboardEvent): void {
    event.preventDefault();
    (event.currentTarget as HTMLElement)?.click();
  }

}
