import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { shChangeDetectorStrategy } from '../../environments/change-detection-strategy';
import { SidebarCommand } from '../../models/sidebar';
import { IShBaseOptions, ShBaseAuthComponent } from '../base/index';

@Component({
    selector: 'sh-sidebar-item',
    templateUrl: './sidebar-item.component.html',
    styleUrls: ['./sidebar-item.component.scss'],
    changeDetection: shChangeDetectorStrategy(),
    standalone: false
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

  /**
   * Keyboard activation for the navigational (routerLink) item.
   * Mirrors the mouse click so Enter triggers navigation.
   * No-op when the item is disabled, to keep behavior consistent with
   * the asserted aria-disabled state (WCAG 4.1.2).
   */
  public onLinkKeydown(event: Event): void {
    if (!this.enable) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    (event.currentTarget as HTMLElement)?.click();
  }

  /**
   * Keyboard activation for the expandable (parent) item.
   * Mirrors the overlay click so Enter/Space toggle the children.
   * No-op when the item is disabled, to keep behavior consistent with
   * the asserted aria-disabled state (WCAG 4.1.2).
   */
  public onToggleKeydown(event: Event): void {
    event.preventDefault();
    if (!this.enable) {
      return;
    }
    this.toggleChildren.emit();
  }

  /**
   * Mouse activation for the expandable (parent) item.
   * Guards the toggle so a disabled item does not react, matching the
   * asserted aria-disabled state (WCAG 4.1.2).
   */
  public onToggleClick(): void {
    if (!this.enable) {
      return;
    }
    this.toggleChildren.emit();
  }

}
