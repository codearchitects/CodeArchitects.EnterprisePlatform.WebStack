import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IShBreadcrumbActivity } from '../index';
import { yieldFunc, isNoU, CAEP_SIDEBAR_SEARCH_DEFAULT_ICON, CAEP_SIDEBAR_DEFAULT_TOGGLER_ICON } from '../../utilities';
import { SidebarCommand } from '../../models/sidebar';
import { shChangeDetectorStrategy } from '../../environments/change-detection-strategy';

@Component({
    selector: 'sh-container',
    templateUrl: './container.component.html',
    styleUrls: ['./container.component.scss'],
    changeDetection: shChangeDetectorStrategy(),
    standalone: false
})
/**
 * Master Page Component
 */
export class ShContainerComponent {
  /**
   * Sidebar logo assets path (e.g.: "logo_company.png")
   * The image must be 130x45px to fit content correctly
   */
  @Input() public companyLogo: string;
  /**
   * Toolbar logo assets path (e.g.: "logo_app.png")
   * The image must have a height of 30px to fit content correctly
   */
  @Input() public appLogo: string;
  /**
   * Specifies whether toolbar can show back button
   * @default true
   */
  @Input() public showBackButton = true;
  /**
   * Specifies whether toolbar can show breadcrumb
   * @default true
   */
  @Input() public showBreadcrumb = true;
  /**
   * Specifies whether header can show searchbar (sidebar based)
   * @default true
   */
  @Input() public showSearchbar = true;
  /**
   * Search bar's icon name
   * @default 'search'
   */
  @Input() public searchBarIcon: string = CAEP_SIDEBAR_SEARCH_DEFAULT_ICON;
  /**
   * Specifies whether toolbar can show languages control
   * @default true
   */
  @Input() public showLangControl = true;
  /**
   * The application name
   */
  @Input() public applicationName: string;
  /**
   * Application activity
   */
  @Input() public activity: IShBreadcrumbActivity;
  /**
   * Sidebar's toggler icon name
   * @default 'hamburger'
   */
  @Input() public togglerIcon: string = CAEP_SIDEBAR_DEFAULT_TOGGLER_ICON;
  /**
   * Promise which must return sidebar commands.
   * If not specified, sidebar commands are retrieved from sidebar.json (assets)
   * @default undefined
   */
  @Input() public onGetSidebarCommands: () => Promise<SidebarCommand[]>;
  /**
   * Event fired on back button clicked
   */
  @Output() public return = new EventEmitter();
  /**
   * Specifies if sidebar is expanded
   */
  /*protected*/ public isSidebarExpanded = false;

  /**
   * Scroll the container context to the specified element
   * @param element The element for which scroll. It must be contained directly
   * into the container (not in a sub-element). The element can be the
   * reference to/the jquery reference to/the class-id of the html element
   */
  public static scrollTo(element: HTMLElement | JQuery | string) {
    yieldFunc(() => {
      if (element instanceof HTMLElement || typeof element === 'string') {
        element = $(element as any);
      }
      let offset: JQuery.Coordinates;
      const target = element && element[0];
      if (target) {
        offset = { top: target.offsetTop, left: target.offsetLeft };
      }
      if (!isNoU(offset)) {
        $('#container').animate({
          scrollTop: offset.top
        }, 'slow');
      }
    });
  }
}
