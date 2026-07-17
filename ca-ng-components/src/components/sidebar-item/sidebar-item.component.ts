import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { SH_CHANGE_DETECTOR } from 'src/environments/change-detection-strategy';
import { SidebarCommand } from '../../models/sidebar';
import { IShBaseOptions, ShBaseAuthComponent } from '../base/index';

@Component({
  selector: 'sh-sidebar-item',
  templateUrl: './sidebar-item.component.html',
  styleUrls: ['./sidebar-item.component.scss'],
  changeDetection: SH_CHANGE_DETECTOR.STRATEGY
})
export class ShSidebarItemComponent
  extends ShBaseAuthComponent<IShBaseOptions> {
  /**
   * Command binded with component
   */
  @Input() public model: SidebarCommand;
  /**
   * Specifies if command is in expanded mode
   */
  @Input() public isExpanded = false;
  /**
   * Specifies if command children are shown
   */
  @Input() public areChildrenShown = false;
  /**
   * Event fired (just in expanded mode) when
   * command toggle sub-menu to show/hide children
   */
  @Output() public toggleChildren = new EventEmitter();

  /**
   * Sidebar item component
   */
  constructor(injector: Injector) {
    super(injector);
  }

}
